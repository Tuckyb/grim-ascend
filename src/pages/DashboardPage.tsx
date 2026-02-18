import { AppLayout } from "@/components/AppLayout";
import { initialTasks, goals, dailySchedule } from "@/data/sampleData";
import {
  Kanban,
  Target,
  Zap,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Flame,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const navigate = useNavigate();

  const totalTasks = initialTasks.length;
  const doneTasks = initialTasks.filter((t) => t.column === "done").length;
  const inProgress = initialTasks.filter((t) => t.column === "in-progress").length;
  const sprintTasks = initialTasks.filter((t) => t.column === "sprint").length;
  const criticalTasks = initialTasks.filter((t) => t.priority === "critical").length;

  const today = ["Mon", "Tue", "Wed", "Thu", "Fri"][new Date().getDay() - 1] || "Mon";
  const todayBlocks = dailySchedule[today] || [];
  const deepWorkBlocks = todayBlocks.filter((b) => b.type === "deep-work").length;

  const avgGoalProgress = Math.round(
    goals.reduce((sum, g) => sum + g.progress, 0) / goals.length
  );

  const stats = [
    { label: "Sprint Tasks", value: sprintTasks, icon: Kanban, color: "text-grim-gold" },
    { label: "In Progress", value: inProgress, icon: Zap, color: "text-primary" },
    { label: "Completed", value: doneTasks, icon: CheckCircle2, color: "text-primary" },
    { label: "Critical", value: criticalTasks, icon: AlertTriangle, color: "text-destructive" },
  ];

  return (
    <AppLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Good {new Date().getHours() < 12 ? "morning" : "afternoon"}, Jack.
          </h1>
          <p className="text-muted-foreground mt-1 font-mono text-sm">
            <span className="grim-gradient-text font-semibold">GRIM.</span> Honor will come.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="grim-card p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">{label}</span>
                <Icon className={cn("w-4 h-4", color)} />
              </div>
              <p className="text-2xl font-bold font-mono text-foreground">{value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Today's Schedule */}
          <div className="col-span-1">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">Today</h2>
              </div>
              <button
                onClick={() => navigate("/daily")}
                className="text-xs text-primary hover:underline"
              >
                View all
              </button>
            </div>
            <div className="space-y-1.5">
              {todayBlocks.slice(0, 6).map((block, i) => (
                <div
                  key={i}
                  className={cn(
                    "grim-card p-3 flex items-center gap-3",
                    block.type === "deep-work" && "border-primary/20"
                  )}
                >
                  <span className="text-xs font-mono text-muted-foreground w-10">{block.time}</span>
                  <span className="text-sm text-foreground">{block.activity}</span>
                  {block.type === "deep-work" && <Flame className="w-3 h-3 text-primary ml-auto" />}
                </div>
              ))}
            </div>
          </div>

          {/* Goal Progress */}
          <div className="col-span-1">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">Goals</h2>
              </div>
              <button
                onClick={() => navigate("/goals")}
                className="text-xs text-primary hover:underline"
              >
                View all
              </button>
            </div>
            <div className="grim-card p-4 mb-4">
              <div className="text-center mb-3">
                <p className="text-3xl font-bold font-mono grim-gradient-text">{avgGoalProgress}%</p>
                <p className="text-xs text-muted-foreground mt-1">Average Progress</p>
              </div>
              <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full grim-gradient transition-all duration-700"
                  style={{ width: `${avgGoalProgress}%` }}
                />
              </div>
            </div>
            <div className="space-y-2">
              {goals.slice(0, 4).map((goal) => (
                <div key={goal.id} className="grim-card p-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-foreground truncate pr-2">{goal.title}</span>
                    <span className="text-xs font-mono text-primary">{goal.progress}%</span>
                  </div>
                  <div className="w-full h-1 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full grim-gradient"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Execution Metrics */}
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Metrics</h2>
            </div>
            <div className="space-y-3">
              <div className="grim-card p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Sprint Velocity</p>
                <p className="text-2xl font-bold font-mono text-foreground">
                  {doneTasks}/{totalTasks}
                </p>
                <p className="text-xs text-muted-foreground mt-1">tasks completed this sprint</p>
              </div>
              <div className="grim-card p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Deep Work Today</p>
                <p className="text-2xl font-bold font-mono text-primary">{deepWorkBlocks}h</p>
                <p className="text-xs text-muted-foreground mt-1">focused blocks scheduled</p>
              </div>
              <div className="grim-card p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Completion Rate</p>
                <p className="text-2xl font-bold font-mono text-foreground">
                  {totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0}%
                </p>
                <p className="text-xs text-muted-foreground mt-1">of all tasks done</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
