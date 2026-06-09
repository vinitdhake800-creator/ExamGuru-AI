import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { callLovableAI, type ChatMessage } from "./ai-gateway.server";

const SYSTEM_TUTOR = `You are ExamGuru AI, an expert tutor for Indian competitive exams: UPSC, SSC, RRB, MPSC, RBI, and Banking exams (IBPS, SBI). 
Give accurate, exam-focused answers. Use clear structure, short paragraphs, and bullet points. 
When a question is conceptual, briefly explain the concept then connect it to the exam. Cite key facts confidently. Use markdown.`;

// ---------- Chat ----------
export const chatWithTutor = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      messages: z
        .array(
          z.object({
            role: z.enum(["user", "assistant"]),
            content: z.string().min(1).max(8000),
          }),
        )
        .min(1)
        .max(40),
    }),
  )
  .handler(async ({ data }) => {
    const messages: ChatMessage[] = [
      { role: "system", content: SYSTEM_TUTOR },
      ...data.messages,
    ];
    const content = await callLovableAI(messages);
    return { content };
  });

// ---------- MCQ Generator ----------
export const generateMCQs = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      exam: z.string().min(1).max(50),
      subject: z.string().min(1).max(80),
      difficulty: z.enum(["Easy", "Medium", "Hard"]),
      count: z.number().int().min(1).max(15),
    }),
  )
  .handler(async ({ data }) => {
    const prompt = `Generate ${data.count} multiple-choice questions for the ${data.exam} exam.
Subject: ${data.subject}
Difficulty: ${data.difficulty}

Return STRICT JSON with this shape:
{
  "questions": [
    {
      "question": "string",
      "options": ["A ...", "B ...", "C ...", "D ..."],
      "answerIndex": 0,
      "explanation": "string"
    }
  ]
}
Rules: exactly 4 options each, answerIndex is 0-3, concise but complete explanation, no markdown, no extra commentary.`;

    const content = await callLovableAI(
      [
        { role: "system", content: SYSTEM_TUTOR },
        { role: "user", content: prompt },
      ],
      { jsonMode: true },
    );

    let parsed: {
      questions: {
        question: string;
        options: string[];
        answerIndex: number;
        explanation: string;
      }[];
    };
    try {
      parsed = JSON.parse(content);
    } catch {
      // Best-effort: extract JSON block
      const match = content.match(/\{[\s\S]*\}/);
      if (!match) throw new Error("AI did not return valid JSON.");
      parsed = JSON.parse(match[0]);
    }
    return parsed;
  });

// ---------- Study Planner ----------
export const generateStudyPlan = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      exam: z.string().min(1).max(80),
      hoursPerDay: z.number().min(1).max(16),
      durationWeeks: z.number().int().min(1).max(52).default(4),
    }),
  )
  .handler(async ({ data }) => {
    const prompt = `Create a detailed ${data.durationWeeks}-week study plan for the ${data.exam} exam.
Daily study time: ${data.hoursPerDay} hours.

Format in markdown with:
- A short strategy overview (2-3 lines)
- A weekly breakdown (Week 1, Week 2, ...) listing subjects/topics
- A sample daily schedule with time blocks
- Revision and mock-test guidance
- Resource recommendations (books, official sources)

Be specific to the ${data.exam} syllabus.`;

    const content = await callLovableAI([
      { role: "system", content: SYSTEM_TUTOR },
      { role: "user", content: prompt },
    ]);
    return { content };
  });

// ---------- Question Solver ----------
export const solveQuestion = createServerFn({ method: "POST" })
  .inputValidator(z.object({ question: z.string().min(3).max(4000) }))
  .handler(async ({ data }) => {
    const prompt = `Solve the following exam question with a clear, step-by-step explanation. 
If it is an MCQ, state the correct option and why each wrong option is wrong. 
End with a short "Key takeaway" line. Use markdown.

Question:
${data.question}`;

    const content = await callLovableAI([
      { role: "system", content: SYSTEM_TUTOR },
      { role: "user", content: prompt },
    ]);
    return { content };
  });
