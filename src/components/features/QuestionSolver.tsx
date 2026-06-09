import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, BrainCircuit } from "lucide-react";

import { solveQuestion } from "@/lib/exam.functions";
import { saveSolvedQuestion } from "@/lib/history.functions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Markdown } from "@/components/Markdown";

export function QuestionSolver() {
  const run = useServerFn(solveQuestion);
  const save = useServerFn(saveSolvedQuestion);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [answer, setAnswer] = useState<string | null>(null);

  async function handleSolve() {
    if (!question.trim()) return;
    setLoading(true);
    setError(null);
    setAnswer(null);
    try {
      const q = question.trim();
      const res = await run({ data: { question: q } });
      setAnswer(res.content);
      save({ data: { question: q, answer: res.content } }).catch(() => {});
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to solve question.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)] sm:p-6">
        <div className="space-y-2">
          <Label>Paste your question</Label>
          <Textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Paste any exam question (MCQ, descriptive, reasoning, quant…)"
            className="min-h-[160px]"
          />
        </div>
        <div className="mt-4 flex justify-end">
          <Button onClick={handleSolve} disabled={loading || !question.trim()} size="lg" className="gap-2">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <BrainCircuit className="h-4 w-4" />}
            Solve Step-by-Step
          </Button>
        </div>
        {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
      </div>

      {answer && (
        <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)] sm:p-8">
          <Markdown content={answer} />
        </div>
      )}
    </div>
  );
}
