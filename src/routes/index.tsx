import { createFileRoute, Link } from "@tanstack/react-router";
import {
  MessageSquare,
  ListChecks,
  CalendarRange,
  BrainCircuit,
  Sparkles,
  GraduationCap,
  CheckCircle2,
} from "lucide-react";

import { SiteHeader } from "@/components/SiteHeader";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ExamGuru AI — AI Tutor for UPSC, SSC, RRB, MPSC, RBI & Banking" },
      {
        name: "description",
        content:
          "ExamGuru AI helps you crack UPSC, SSC, RRB, MPSC, RBI & Banking exams with an AI chat tutor, MCQ generator, study planner, and step-by-step question solver. Sign up free.",
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

const FEATURES = [
  { icon: MessageSquare, label: "AI Chat Tutor", description: "Ask any UPSC, SSC, RRB, MPSC, RBI or Banking question." },
  { icon: ListChecks, label: "MCQ Generator", description: "Practice with exam-specific MCQs and instant explanations." },
  { icon: CalendarRange, label: "Study Planner", description: "Get a personalised week-by-week prep schedule." },
  { icon: BrainCircuit, label: "Question Solver", description: "Paste any question, get a step-by-step solution." },
];

const BENEFITS = [
  "Save every chat, plan and MCQ set to your account",
  "Pick up your prep on any device",
  "Track which exams and subjects you focus on",
];

function Home() {
  const { user } = useAuth();
  const ctaHref = user ? "/app" : "/auth";

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
              Personalised AI tutor for Indian exams
            </div>
            <h1 className="text-balance text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
              Crack any Indian exam with your AI tutor
            </h1>
            <p className="mt-5 text-balance text-base text-white/85 sm:text-lg">
              Personalised guidance for UPSC, SSC, RRB, MPSC, RBI Grade B & Banking exams.
              Chat, practice MCQs, plan your prep, and solve doubts — all saved to your account.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                to={ctaHref}
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-primary shadow-[var(--shadow-glow)] transition-transform hover:scale-105"
              >
                <GraduationCap className="h-4 w-4" />
                {user ? "Open workspace" : "Start learning free"}
              </Link>
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

      {/* Features */}
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
          {FEATURES.map((t) => {
            const Icon = t.icon;
            return (
              <Link
                key={t.label}
                to={ctaHref}
                className="group rounded-2xl border border-border bg-card p-6 text-left transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-[var(--shadow-glow)]"
              >
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-soft)]">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold text-foreground">{t.label}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{t.description}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Personalised section */}
      <section className="container mx-auto px-4 pb-20">
        <div className="mx-auto max-w-4xl rounded-3xl border border-border bg-card p-8 shadow-[var(--shadow-soft)] sm:p-12">
          <div className="grid items-center gap-8 sm:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
                Your prep, saved and personalised
              </h2>
              <p className="mt-3 text-muted-foreground">
                Create a free account to keep every chat, study plan and MCQ set in one place — across all your devices.
              </p>
              <ul className="mt-6 space-y-3">
                {BENEFITS.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm text-foreground">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {b}
                  </li>
                ))}
              </ul>
              <div className="mt-7">
                <Link
                  to={ctaHref}
                  className="inline-flex items-center gap-2 rounded-full bg-[image:var(--gradient-primary)] px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:scale-105"
                >
                  {user ? "Open my workspace" : "Create free account"}
                </Link>
              </div>
            </div>
            <div className="rounded-2xl bg-[image:var(--gradient-hero)] p-6 text-white">
              <div className="text-xs uppercase tracking-wider text-white/70">Sample weekly plan</div>
              <h3 className="mt-1 text-lg font-semibold">UPSC Prelims · 4h / day</h3>
              <ul className="mt-4 space-y-3 text-sm">
                <li className="rounded-xl bg-white/10 p-3 backdrop-blur">📘 Mon–Wed: Polity (Laxmikanth Ch 1–8)</li>
                <li className="rounded-xl bg-white/10 p-3 backdrop-blur">🗺️ Thu–Fri: Indian Geography fundamentals</li>
                <li className="rounded-xl bg-white/10 p-3 backdrop-blur">📰 Daily: 45 min Current Affairs + MCQ revision</li>
                <li className="rounded-xl bg-white/10 p-3 backdrop-blur">🧪 Sun: Full-length sectional mock test</li>
              </ul>
            </div>
          </div>
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
