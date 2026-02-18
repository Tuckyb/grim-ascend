import { AppLayout } from "@/components/AppLayout";
import { goals, Goal } from "@/data/sampleData";
import { Target, TrendingUp, Calendar, Star } from "lucide-react";
import { cn } from "@/lib/utils";

function GoalCard({ goal }: { goal: Goal }) {
  return (
    <div className="grim-card p-4 animate-slide-in">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "text-[10px] px-2 py-0.5 rounded-full font-medium uppercase tracking-wider",
              goal.category === "professional"
                ? "bg-primary/15 text-primary"
                : "bg-rose-500/15 text-rose-400"
            )}
          >
            {goal.category}
          </span>
        </div>
        <span className="text-sm font-mono font-bold text-foreground">{goal.progress}%</span>
      </div>
      <h4 className="text-sm font-medium text-foreground mb-3">{goal.title}</h4>
      <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
        <div
          className="h-full rounded-full grim-gradient transition-all duration-500"
          style={{ width: `${goal.progress}%` }}
        />
      </div>
    </div>
  );
}

export default function GoalsPage() {
  const yearly = goals.filter((g) => g.horizon === "yearly");
  const monthly = goals.filter((g) => g.horizon === "monthly");
  const weekly = goals.filter((g) => g.horizon === "weekly");

  return (
    <AppLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Goals Hub</h1>
          <p className="text-sm text-muted-foreground font-mono mt-1">
            Yearly → Monthly → Weekly · Track every horizon
          </p>
        </div>

        <div className="space-y-8">
          {[
            { title: "Yearly Goals", icon: Star, data: yearly },
            { title: "Monthly Goals", icon: Calendar, data: monthly },
            { title: "Weekly Goals", icon: TrendingUp, data: weekly },
          ].map(({ title, icon: Icon, data }) => (
            <div key={title}>
              <div className="flex items-center gap-2 mb-4">
                <Icon className="w-4 h-4 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">{title}</h2>
                <span className="text-xs font-mono text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                  {data.length}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {data.map((goal) => (
                  <GoalCard key={goal.id} goal={goal} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
