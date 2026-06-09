import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  MessageSquare,
  ListChecks,
  CalendarRange,
  BrainCircuit,
  History as HistoryIcon,
} from "lucide-react";

import { SiteHeader } from "@/components/SiteHeader";
import { ChatAssistant } from "@/components/features/ChatAssistant";
import { MCQGenerator } from "@/components/features/MCQGenerator";
import { StudyPlanner } from "@/components/features/StudyPlanner";
import { QuestionSolver } from "@/components/features/QuestionSolver";
import { HistoryPanel } from "@/components/features/HistoryPanel";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/app")({
  head: () => ({
    meta: [{ title: "Workspace · ExamGuru AI" }],
  }),
  component: WorkspacePage,
});

type TabId = "chat" | "mcq" | "planner" | "solver" | "history";

const TABS: { id: TabId; label: string; icon: typeof MessageSquare }[] = [
  { id: "chat", label: "AI Chat", icon: MessageSquare },
  { id: "mcq", label: "MCQ Generator", icon: ListChecks },
  { id: "planner", label: "Study Planner", icon: CalendarRange },
  { id: "solver", label: "Question Solver", icon: BrainCircuit },
  { id: "history", label: "My History", icon: HistoryIcon },
];

function WorkspacePage() {
  const [tab, setTab] = useState<TabId>("chat");
  const { user } = useAuth();
  const name = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Aspirant";

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            Welcome back, {name} 👋
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your study tools — everything you do here is saved to your account.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-2 rounded-2xl border border-border bg-card p-2 shadow-[var(--shadow-soft)] sm:mx-auto sm:max-w-4xl">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  "flex flex-1 min-w-[120px] items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
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
          {tab === "history" && <HistoryPanel />}
        </div>
      </section>
    </div>
  );
}
