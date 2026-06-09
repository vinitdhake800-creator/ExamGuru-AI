import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, MessageSquare, ListChecks, CalendarRange, BrainCircuit } from "lucide-react";

import {
  listChatSessions,
  listMCQSets,
  listStudyPlans,
  listSolvedQuestions,
  getChatMessages,
} from "@/lib/history.functions";
import { Markdown } from "@/components/Markdown";
import { cn } from "@/lib/utils";

type Section = "chats" | "plans" | "mcqs" | "solved";

const SECTIONS: { id: Section; label: string; icon: typeof MessageSquare }[] = [
  { id: "chats", label: "Chats", icon: MessageSquare },
  { id: "plans", label: "Study Plans", icon: CalendarRange },
  { id: "mcqs", label: "MCQ Sets", icon: ListChecks },
  { id: "solved", label: "Solved Questions", icon: BrainCircuit },
];

export function HistoryPanel() {
  const [section, setSection] = useState<Section>("plans");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {SECTIONS.map((s) => {
          const Icon = s.icon;
          const active = section === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setSection(s.id)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all",
                active
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-card text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {s.label}
            </button>
          );
        })}
      </div>

      {section === "chats" && <ChatsList />}
      {section === "plans" && <PlansList />}
      {section === "mcqs" && <MCQList />}
      {section === "solved" && <SolvedList />}
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
      No {label} saved yet. Generate one and it'll appear here.
    </div>
  );
}

function useFetch<T>(fn: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let alive = true;
    fn()
      .then((d) => alive && setData(d))
      .catch((e) => alive && setError(e instanceof Error ? e.message : "Failed"))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return { data, loading, error };
}

function Spinner() {
  return (
    <div className="flex justify-center py-10">
      <Loader2 className="h-5 w-5 animate-spin text-primary" />
    </div>
  );
}

function PlansList() {
  const fn = useServerFn(listStudyPlans);
  const { data, loading, error } = useFetch(() => fn());
  const [open, setOpen] = useState<string | null>(null);
  if (loading) return <Spinner />;
  if (error) return <p className="text-sm text-destructive">{error}</p>;
  if (!data?.length) return <EmptyState label="study plans" />;
  return (
    <div className="space-y-3">
      {data.map((p) => (
        <div key={p.id} className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
          <button onClick={() => setOpen(open === p.id ? null : p.id)} className="flex w-full items-start justify-between gap-4 text-left">
            <div>
              <h4 className="font-semibold text-foreground">{p.exam}</h4>
              <p className="mt-1 text-xs text-muted-foreground">
                {p.duration_weeks} weeks · {p.hours_per_day}h/day · {new Date(p.created_at).toLocaleDateString()}
              </p>
            </div>
            <span className="text-xs text-primary">{open === p.id ? "Hide" : "View"}</span>
          </button>
          {open === p.id && (
            <div className="mt-4 border-t border-border pt-4">
              <Markdown content={p.content} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function MCQList() {
  const fn = useServerFn(listMCQSets);
  const { data, loading, error } = useFetch(() => fn());
  const [open, setOpen] = useState<string | null>(null);
  if (loading) return <Spinner />;
  if (error) return <p className="text-sm text-destructive">{error}</p>;
  if (!data?.length) return <EmptyState label="MCQ sets" />;
  return (
    <div className="space-y-3">
      {data.map((s) => {
        const questions = (s.questions as unknown as { question: string; options: string[]; answerIndex: number; explanation: string }[]) ?? [];
        return (
          <div key={s.id} className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
            <button onClick={() => setOpen(open === s.id ? null : s.id)} className="flex w-full items-start justify-between gap-4 text-left">
              <div>
                <h4 className="font-semibold text-foreground">{s.exam} · {s.subject}</h4>
                <p className="mt-1 text-xs text-muted-foreground">
                  {s.difficulty} · {s.question_count} questions · {new Date(s.created_at).toLocaleDateString()}
                </p>
              </div>
              <span className="text-xs text-primary">{open === s.id ? "Hide" : "View"}</span>
            </button>
            {open === s.id && (
              <div className="mt-4 space-y-3 border-t border-border pt-4">
                {questions.map((q, qi) => (
                  <div key={qi} className="rounded-xl bg-muted/40 p-3">
                    <p className="text-sm font-medium text-foreground">{qi + 1}. {q.question}</p>
                    <ul className="mt-2 space-y-1 text-sm">
                      {q.options.map((o, oi) => (
                        <li key={oi} className={cn(oi === q.answerIndex ? "text-success font-medium" : "text-muted-foreground")}>
                          {String.fromCharCode(65 + oi)}. {o}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-2 text-xs text-muted-foreground"><span className="font-semibold text-primary">Explanation: </span>{q.explanation}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function SolvedList() {
  const fn = useServerFn(listSolvedQuestions);
  const { data, loading, error } = useFetch(() => fn());
  const [open, setOpen] = useState<string | null>(null);
  if (loading) return <Spinner />;
  if (error) return <p className="text-sm text-destructive">{error}</p>;
  if (!data?.length) return <EmptyState label="solved questions" />;
  return (
    <div className="space-y-3">
      {data.map((q) => (
        <div key={q.id} className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
          <button onClick={() => setOpen(open === q.id ? null : q.id)} className="flex w-full items-start justify-between gap-4 text-left">
            <p className="line-clamp-2 flex-1 text-sm font-medium text-foreground">{q.question}</p>
            <span className="shrink-0 text-xs text-primary">{open === q.id ? "Hide" : "View"}</span>
          </button>
          <p className="mt-1 text-xs text-muted-foreground">{new Date(q.created_at).toLocaleString()}</p>
          {open === q.id && (
            <div className="mt-4 border-t border-border pt-4">
              <p className="mb-3 whitespace-pre-wrap text-sm text-foreground"><span className="font-semibold">Q: </span>{q.question}</p>
              <Markdown content={q.answer} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function ChatsList() {
  const fn = useServerFn(listChatSessions);
  const getMsgs = useServerFn(getChatMessages);
  const { data, loading, error } = useFetch(() => fn());
  const [open, setOpen] = useState<string | null>(null);
  const [msgs, setMsgs] = useState<{ role: string; content: string }[]>([]);
  const [loadingMsgs, setLoadingMsgs] = useState(false);

  async function toggle(id: string) {
    if (open === id) {
      setOpen(null);
      return;
    }
    setOpen(id);
    setLoadingMsgs(true);
    try {
      const m = await getMsgs({ data: { sessionId: id } });
      setMsgs(m);
    } finally {
      setLoadingMsgs(false);
    }
  }

  if (loading) return <Spinner />;
  if (error) return <p className="text-sm text-destructive">{error}</p>;
  if (!data?.length) return <EmptyState label="chats" />;
  return (
    <div className="space-y-3">
      {data.map((s) => (
        <div key={s.id} className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
          <button onClick={() => toggle(s.id)} className="flex w-full items-start justify-between gap-4 text-left">
            <div>
              <h4 className="font-semibold text-foreground">{s.title}</h4>
              <p className="mt-1 text-xs text-muted-foreground">{new Date(s.updated_at).toLocaleString()}</p>
            </div>
            <span className="text-xs text-primary">{open === s.id ? "Hide" : "View"}</span>
          </button>
          {open === s.id && (
            <div className="mt-4 space-y-3 border-t border-border pt-4">
              {loadingMsgs ? (
                <Spinner />
              ) : (
                msgs.map((m, i) => (
                  <div key={i} className={cn("rounded-xl p-3 text-sm", m.role === "user" ? "bg-primary/10 text-foreground" : "bg-muted text-foreground")}>
                    <p className="mb-1 text-xs font-semibold uppercase text-muted-foreground">{m.role}</p>
                    {m.role === "assistant" ? <Markdown content={m.content} /> : <p className="whitespace-pre-wrap">{m.content}</p>}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
