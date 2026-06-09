import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  MessageSquare,
  ListChecks,
  CalendarRange,
  BrainCircuit,
  Sparkles,
  GraduationCap,
} from "lucide-react";

import { SiteHeader } from "@/components/SiteHeader";
import { ChatAssistant } from "@/components/features/ChatAssistant";
import { MCQGenerator } from "@/components/features/MCQGenerator";
import { StudyPlanner } from "@/components/features/StudyPlanner";
import { QuestionSolver } from "@/components/features/QuestionSolver";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ExamGuru AI — AI Tutor for UPSC, SSC, RRB, MPSC, RBI & Banking" },
      {
        name: "description",
        content:
          "ExamGuru AI helps you crack UPSC, SSC, RRB, MPSC, RBI & Banking exams with an AI chat tutor, MCQ generator, study planner, and step-by-step question solver.",
      },
      { property: "og:title", content: "ExamGuru AI — AI Tutor for Indian Exams" },
      {
        property: "og:description",
        content:
          "AI chat tutor, MCQ generator, personalised study planner, and instant question solver for Indian competitive exams.",
      },
    ],
  }),
  component: Home,
});

type TabId = "chat" | "mcq" | "planner" | "solver";

const TABS: { id: TabId; label: string; icon: typeof MessageSquare; description: string }[] = [
  { id: "chat", label: "AI Chat", icon: MessageSquare, description: "Ask any exam question" },
  { id: "mcq", label: "MCQ Generator", icon: ListChecks, description: "Practice with custom MCQs" },
  { id: "planner", label: "Study Planner", icon: CalendarRange, description: "Personalised plan" },
  { id: "solver", label: "Question Solver", icon: BrainCircuit, description: "Step-by-step answers" },
];

function Home() {
  const [tab, setTab] = useState<TabId>("chat");

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[image:var(--gradient-hero)] opacity-95" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,white_0%,transparent_50%)] opacity-20" />
        <div className="container relative mx-auto px-4 py-16 sm:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium text-white backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" />
              Powered by Lovable AI
            </div>
            <h1 className="text-balance text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
              Crack any Indian exam with your AI tutor
            </h1>
            <p className="mt-5 text-balance text-base text-white/85 sm:text-lg">
              Personalised guidance for UPSC, SSC, RRB, MPSC, RBI Grade B & Banking exams.
              Chat, practice MCQs, plan your prep, and solve doubts — all in one place.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                href="#workspace"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-primary shadow-[var(--shadow-glow)] transition-transform hover:scale-105"
              >
                <GraduationCap className="h-4 w-4" />
                Start learning free
              </a>
              <a
                href="#features"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/20"
              >
                See features
              </a>
            </div>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium uppercase tracking-wider text-white/70">
              <span>UPSC</span><span>·</span>
              <span>SSC</span><span>·</span>
              <span>RRB</span><span>·</span>
              <span>MPSC</span><span>·</span>
              <span>RBI</span><span>·</span>
              <span>Banking</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section id="features" className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything you need to prepare smarter
          </h2>
          <p className="mt-3 text-muted-foreground">
            Four AI-powered tools designed around how aspirants actually study.
          </p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TABS.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => {
                  setTab(t.id);
                  document
                    .getElementById("workspace")
                    ?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="group rounded-2xl border border-border bg-card p-6 text-left transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-[var(--shadow-glow)]"
              >
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-soft)]">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold text-foreground">{t.label}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{t.description}</p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Workspace */}
      <section id="workspace" className="container mx-auto px-4 pb-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Your study workspace
          </h2>
          <p className="mt-3 text-muted-foreground">
            Switch between tools as your study session evolves.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-2 rounded-2xl border border-border bg-card p-2 shadow-[var(--shadow-soft)] sm:mx-auto sm:max-w-3xl">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  "flex flex-1 min-w-[140px] items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                  active
                    ? "bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-soft)]"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {t.label}
              </button>
            );
          })}
        </div>

        <div className="mt-8">
          {tab === "chat" && <ChatAssistant />}
          {tab === "mcq" && <MCQGenerator />}
          {tab === "planner" && <StudyPlanner />}
          {tab === "solver" && <QuestionSolver />}
        </div>
      </section>

      <footer className="border-t border-border bg-card/50">
        <div className="container mx-auto flex flex-col items-center justify-between gap-2 px-4 py-6 text-sm text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} ExamGuru AI — Built for Indian aspirants.</p>
          <p className="text-xs">Powered by Lovable AI</p>
        </div>
      </footer>
    </div>
  );
}
