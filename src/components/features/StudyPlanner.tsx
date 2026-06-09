import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, CalendarRange } from "lucide-react";

import { generateStudyPlan } from "@/lib/exam.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Markdown } from "@/components/Markdown";

export function StudyPlanner() {
  const run = useServerFn(generateStudyPlan);
  const [exam, setExam] = useState("UPSC Prelims");
  const [hours, setHours] = useState(4);
  const [weeks, setWeeks] = useState(8);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plan, setPlan] = useState<string | null>(null);

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    setPlan(null);
    try {
      const res = await run({
        data: { exam, hoursPerDay: hours, durationWeeks: weeks },
      });
      setPlan(res.content);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to generate plan.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)] sm:p-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2 sm:col-span-3">
            <Label>Exam name</Label>
            <Input
              value={exam}
              onChange={(e) => setExam(e.target.value)}
              placeholder="e.g. UPSC Prelims, SBI PO, RRB NTPC"
            />
          </div>
          <div className="space-y-2">
            <Label>Study hours / day</Label>
            <Input
              type="number"
              min={1}
              max={16}
              value={hours}
              onChange={(e) => setHours(Math.max(1, Math.min(16, Number(e.target.value) || 1)))}
            />
          </div>
          <div className="space-y-2">
            <Label>Duration (weeks)</Label>
            <Input
              type="number"
              min={1}
              max={52}
              value={weeks}
              onChange={(e) => setWeeks(Math.max(1, Math.min(52, Number(e.target.value) || 1)))}
            />
          </div>
          <div className="flex items-end">
            <Button onClick={handleGenerate} disabled={loading} size="lg" className="w-full gap-2">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CalendarRange className="h-4 w-4" />}
              Create Plan
            </Button>
          </div>
        </div>
        {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
      </div>

      {plan && (
        <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)] sm:p-8">
          <Markdown content={plan} />
        </div>
      )}
    </div>
  );
}
