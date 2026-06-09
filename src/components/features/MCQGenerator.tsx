import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, CheckCircle2, XCircle, Sparkles } from "lucide-react";

import { generateMCQs } from "@/lib/exam.functions";
import { saveMCQSet } from "@/lib/history.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface Q {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

const EXAMS = ["UPSC", "SSC", "RRB", "MPSC", "RBI Grade B", "IBPS PO", "SBI PO"];
const SUBJECTS = [
  "General Studies",
  "Polity",
  "History",
  "Geography",
  "Economy",
  "Quantitative Aptitude",
  "Reasoning",
  "English",
  "Current Affairs",
  "Banking Awareness",
];

export function MCQGenerator() {
  const run = useServerFn(generateMCQs);
  const save = useServerFn(saveMCQSet);
  const [exam, setExam] = useState("UPSC");
  const [subject, setSubject] = useState("Polity");
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium");
  const [count, setCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Q[]>([]);
  const [selected, setSelected] = useState<Record<number, number>>({});
  const [revealed, setRevealed] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    setQuestions([]);
    setSelected({});
    setRevealed(false);
    try {
      const res = await run({ data: { exam, subject, difficulty, count } });
      const qs = res.questions ?? [];
      setQuestions(qs);
      if (qs.length) {
        save({ data: { exam, subject, difficulty, questions: qs } }).catch(() => {});
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to generate questions.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)] sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <Label>Exam</Label>
            <Select value={exam} onValueChange={setExam}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {EXAMS.map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Subject</Label>
            <Select value={subject} onValueChange={setSubject}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {SUBJECTS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Difficulty</Label>
            <Select value={difficulty} onValueChange={(v) => setDifficulty(v as "Easy" | "Medium" | "Hard")}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Easy">Easy</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Number of Questions</Label>
            <Input
              type="number"
              min={1}
              max={15}
              value={count}
              onChange={(e) => setCount(Math.max(1, Math.min(15, Number(e.target.value) || 1)))}
            />
          </div>
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Button onClick={handleGenerate} disabled={loading} size="lg" className="gap-2">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            Generate MCQs
          </Button>
          {questions.length > 0 && (
            <Button variant="outline" onClick={() => setRevealed((r) => !r)}>
              {revealed ? "Hide answers" : "Reveal all answers"}
            </Button>
          )}
        </div>
        {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
      </div>

      {questions.length > 0 && (
        <div className="space-y-4">
          {questions.map((q, qi) => {
            const userChoice = selected[qi];
            return (
              <div
                key={qi}
                className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]"
              >
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {qi + 1}
                  </div>
                  <p className="flex-1 font-medium text-foreground">{q.question}</p>
                </div>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {q.options.map((opt, oi) => {
                    const isCorrect = oi === q.answerIndex;
                    const isPicked = userChoice === oi;
                    const show = revealed || userChoice !== undefined;
                    return (
                      <button
                        key={oi}
                        onClick={() =>
                          setSelected((s) => ({ ...s, [qi]: s[qi] === undefined ? oi : s[qi] }))
                        }
                        disabled={userChoice !== undefined}
                        className={cn(
                          "flex items-start gap-3 rounded-xl border p-3 text-left text-sm transition-all",
                          !show && "border-border bg-background hover:border-primary/40 hover:bg-accent",
                          show && isCorrect && "border-success/50 bg-success/10 text-foreground",
                          show && !isCorrect && isPicked && "border-destructive/50 bg-destructive/10 text-foreground",
                          show && !isCorrect && !isPicked && "border-border bg-background opacity-70",
                        )}
                      >
                        <span className="font-semibold text-primary">
                          {String.fromCharCode(65 + oi)}.
                        </span>
                        <span className="flex-1">{opt}</span>
                        {show && isCorrect && <CheckCircle2 className="h-4 w-4 text-success" />}
                        {show && !isCorrect && isPicked && (
                          <XCircle className="h-4 w-4 text-destructive" />
                        )}
                      </button>
                    );
                  })}
                </div>
                {(revealed || userChoice !== undefined) && (
                  <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-3 text-sm text-foreground">
                    <span className="font-semibold text-primary">Explanation: </span>
                    {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
