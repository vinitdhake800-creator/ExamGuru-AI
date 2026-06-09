import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// ---- Chat persistence ----
export const ensureChatSession = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ sessionId: z.string().uuid().optional(), title: z.string().max(120).optional() }))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    if (data.sessionId) {
      const { data: existing } = await supabase
        .from("chat_sessions")
        .select("id")
        .eq("id", data.sessionId)
        .eq("user_id", userId)
        .maybeSingle();
      if (existing) return { id: existing.id as string };
    }
    const { data: created, error } = await supabase
      .from("chat_sessions")
      .insert({ user_id: userId, title: data.title ?? "New chat" })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: created.id as string };
  });

export const saveChatMessages = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    z.object({
      sessionId: z.string().uuid(),
      messages: z
        .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().min(1).max(20000) }))
        .min(1)
        .max(10),
    }),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const rows = data.messages.map((m) => ({
      session_id: data.sessionId,
      user_id: userId,
      role: m.role,
      content: m.content,
    }));
    const { error } = await supabase.from("chat_messages").insert(rows);
    if (error) throw new Error(error.message);
    await supabase.from("chat_sessions").update({ updated_at: new Date().toISOString() }).eq("id", data.sessionId);
    return { ok: true };
  });

export const listChatSessions = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data, error } = await supabase
      .from("chat_sessions")
      .select("id, title, updated_at")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })
      .limit(30);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const getChatMessages = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ sessionId: z.string().uuid() }))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: rows, error } = await supabase
      .from("chat_messages")
      .select("role, content, created_at")
      .eq("session_id", data.sessionId)
      .eq("user_id", userId)
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

// ---- MCQ sets ----
const mcqQuestion = z.object({
  question: z.string(),
  options: z.array(z.string()),
  answerIndex: z.number().int(),
  explanation: z.string(),
});

export const saveMCQSet = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    z.object({
      exam: z.string().max(80),
      subject: z.string().max(120),
      difficulty: z.string().max(20),
      questions: z.array(mcqQuestion).min(1).max(50),
    }),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: row, error } = await supabase
      .from("mcq_sets")
      .insert({
        user_id: userId,
        exam: data.exam,
        subject: data.subject,
        difficulty: data.difficulty,
        question_count: data.questions.length,
        questions: data.questions,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: row.id as string };
  });

export const listMCQSets = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data, error } = await supabase
      .from("mcq_sets")
      .select("id, exam, subject, difficulty, question_count, questions, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(30);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

// ---- Study plans ----
export const saveStudyPlan = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    z.object({
      exam: z.string().max(120),
      hoursPerDay: z.number(),
      durationWeeks: z.number().int(),
      content: z.string().min(1).max(50000),
    }),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: row, error } = await supabase
      .from("study_plans")
      .insert({
        user_id: userId,
        exam: data.exam,
        hours_per_day: data.hoursPerDay,
        duration_weeks: data.durationWeeks,
        content: data.content,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: row.id as string };
  });

export const listStudyPlans = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data, error } = await supabase
      .from("study_plans")
      .select("id, exam, hours_per_day, duration_weeks, content, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(30);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

// ---- Solved questions ----
export const saveSolvedQuestion = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ question: z.string().max(4000), answer: z.string().max(20000) }))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: row, error } = await supabase
      .from("solved_questions")
      .insert({ user_id: userId, question: data.question, answer: data.answer })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: row.id as string };
  });

export const listSolvedQuestions = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data, error } = await supabase
      .from("solved_questions")
      .select("id, question, answer, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(30);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

// ---- Profile ----
export const getMyProfile = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data, error } = await supabase
      .from("profiles")
      .select("id, display_name, target_exam, avatar_url")
      .eq("id", userId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data;
  });

export const updateMyProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    z.object({
      display_name: z.string().max(80).optional(),
      target_exam: z.string().max(80).optional(),
    }),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { error } = await supabase.from("profiles").update(data).eq("id", userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
