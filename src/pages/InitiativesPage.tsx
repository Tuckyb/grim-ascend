import { AppLayout } from "@/components/AppLayout";
import { initialTasks } from "@/data/sampleData";
import { Rocket } from "lucide-react";
import { cn } from "@/lib/utils";

const initiatives = [
  "Member Automations",
  "Retain Customers",
  "THE GRIM Podcast",
  "Campaign Writing",
  "GRIM Week",
  "Affiliate Setup",
  "New Features",
  "Videos",
  "Bug Fixes",
  "General",
] as const;

const initiativeColors: Record<string, string> = {
  "Member Automations": "border-primary/40",
  "Retain Customers": "border-grim-gold/40",
  "THE GRIM Podcast": "border-purple-500/40",
  "Campaign Writing": "border-blue-500/40",
  "GRIM Week": "border-rose-500/40",
  "Affiliate Setup": "border-orange-500/40",
  "New Features": "border-cyan-500/40",
  Videos: "border-pink-500/40",
  "Bug Fixes": "border-destructive/40",
  General: "border-muted",
};

export default function InitiativesPage() {
  return (
    <AppLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Initiatives</h1>
          <p className="text-sm text-muted-foreground font-mono mt-1">
            High-level business projects and their task breakdown
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {initiatives.map((initiative) => {
            const tasks = initialTasks.filter((t) => t.initiative === initiative);
            const done = tasks.filter((t) => t.column === "done").length;
            const progress = tasks.length > 0 ? Math.round((done / tasks.length) * 100) : 0;

            return (
              <div
                key={initiative}
                className={cn(
                  "grim-card p-5 border-l-2",
                  initiativeColors[initiative]
                )}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Rocket className="w-4 h-4 text-primary" />
                  <h3 className="font-semibold text-foreground">{initiative}</h3>
                </div>

                <div className="flex items-center gap-4 mb-3 text-xs text-muted-foreground font-mono">
                  <span>{tasks.length} tasks</span>
                  <span>{done} done</span>
                  <span>{tasks.filter((t) => t.column === "in-progress").length} active</span>
                </div>

                <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full rounded-full grim-gradient transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs font-mono text-muted-foreground text-right">{progress}%</p>
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
