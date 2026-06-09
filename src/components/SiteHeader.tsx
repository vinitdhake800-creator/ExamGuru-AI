import { Link } from "@tanstack/react-router";
import { GraduationCap } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-soft)]">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <div className="text-base font-bold text-foreground">
              ExamGuru <span className="text-primary">AI</span>
            </div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
              UPSC · SSC · RRB · Banking
            </div>
          </div>
        </Link>
        <nav className="hidden gap-6 text-sm font-medium text-muted-foreground sm:flex">
          <a href="#features" className="transition-colors hover:text-foreground">
            Features
          </a>
          <a href="#workspace" className="transition-colors hover:text-foreground">
            Workspace
          </a>
        </nav>
      </div>
    </header>
  );
}
