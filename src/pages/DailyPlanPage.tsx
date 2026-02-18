import { AppLayout } from "@/components/AppLayout";
import { dailySchedule, DailyBlock } from "@/data/sampleData";
import { cn } from "@/lib/utils";
import { Clock, Zap, Users, Coffee, Briefcase, Heart } from "lucide-react";

const typeConfig: Record<DailyBlock["type"], { icon: typeof Zap; className: string }> = {
  "deep-work": { icon: Zap, className: "bg-primary/15 border-primary/30 text-primary" },
  meeting: { icon: Users, className: "bg-blue-500/15 border-blue-500/30 text-blue-400" },
  break: { icon: Coffee, className: "bg-grim-gold/15 border-grim-gold/30 text-grim-gold" },
  admin: { icon: Briefcase, className: "bg-muted border-border text-muted-foreground" },
  personal: { icon: Heart, className: "bg-rose-500/15 border-rose-500/30 text-rose-400" },
};

const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];

export default function DailyPlanPage() {
  const today = days[new Date().getDay() - 1] || "Mon";

  return (
    <AppLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Daily Execution</h1>
          <p className="text-sm text-muted-foreground font-mono mt-1">
            Time-blocked schedule · Deep work first
          </p>
        </div>

        <div className="grid grid-cols-5 gap-4">
          {days.map((day) => (
            <div key={day}>
              <div
                className={cn(
                  "text-sm font-semibold mb-3 px-3 py-2 rounded-md text-center",
                  day === today
                    ? "grim-gradient text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                )}
              >
                {day}
                {day === today && (
                  <span className="ml-2 text-[10px] uppercase tracking-wider opacity-80">Today</span>
                )}
              </div>

              <div className="space-y-1.5">
                {dailySchedule[day]?.map((block, i) => {
                  const config = typeConfig[block.type];
                  const Icon = config.icon;

                  return (
                    <div
                      key={i}
                      className={cn(
                        "p-2.5 rounded-md border text-xs transition-all hover:scale-[1.02]",
                        config.className
                      )}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <Clock className="w-3 h-3 opacity-60" />
                        <span className="font-mono text-[10px] opacity-70">{block.time}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Icon className="w-3 h-3" />
                        <span className="font-medium">{block.activity}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
