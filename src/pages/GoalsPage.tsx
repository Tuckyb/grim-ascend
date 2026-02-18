import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Goal } from "@/data/sampleData";
import { Star, TrendingUp, X, ChevronDown, Calendar, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/context/AppContext";

function GoalSlot({
  goal,
  category,
  horizon,
  onDelete,
  onAdd,
}: {
  goal: Goal | undefined;
  category: Goal["category"];
  horizon: Goal["horizon"];
  onDelete: (id: string) => void;
  onAdd: (category: Goal["category"], horizon: Goal["horizon"]) => void;
}) {
  const label = category === "professional" ? "Professional" : "Private";

  return (
    <div className={cn(
      "flex-1 rounded-2xl border p-5 min-h-[140px] flex flex-col",
      goal
        ? "bg-card border-border/60"
        : "border-border/30 border-dashed bg-transparent"
    )}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold tracking-wide text-muted-foreground/60 uppercase">
          {label}
        </span>
        {goal && (
          <button
            onClick={() => onDelete(goal.id)}
            className="text-muted-foreground/40 hover:text-destructive transition-colors p-0.5"
            title="Remove goal"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {goal ? (
        <div className="flex-1">
          <p className="text-lg font-semibold text-foreground leading-snug">{goal.title}</p>
          {goal.reason ? (
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{goal.reason}</p>
          ) : (
            <p className="text-sm text-muted-foreground/30 mt-2 italic">No reason set.</p>
          )}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-2">
          <button
            onClick={() => onAdd(category, horizon)}
            className="flex items-center gap-1.5 text-sm text-muted-foreground/50 hover:text-foreground transition-colors group"
          >
            <Plus className="w-4 h-4 group-hover:text-primary transition-colors" />
            Set {label.toLowerCase()} goal
          </button>
        </div>
      )}
    </div>
  );
}

function AddGoalForm({
  horizon,
  category,
  onAdd,
  onCancel,
}: {
  horizon: Goal["horizon"];
  category: Goal["category"];
  onAdd: (goal: Omit<Goal, "id">) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState("");
  const [reason, setReason] = useState("");
  const label = category === "professional" ? "Professional" : "Private";

  return (
    <div className="p-5 bg-secondary/10 border border-border rounded-2xl mb-6">
      <p className="text-xs font-semibold tracking-wide text-muted-foreground/60 uppercase mb-4">
        New {label} {horizon} Goal
      </p>
      <div className="space-y-4">
        <input
          autoFocus
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What do you want to achieve?"
          className="w-full bg-transparent border-b border-border px-0 py-2 text-lg font-semibold text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-foreground transition-colors"
          onKeyDown={(e) => {
            if (e.key === "Escape") onCancel();
            if (e.key === "Enter" && title.trim()) onAdd({ title, horizon, category, progress: 0, reason });
          }}
        />
        <input
          type="text"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Why does this matter?"
          className="w-full bg-transparent border-b border-border px-0 py-2 text-base text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-foreground transition-colors"
        />
        <div className="flex items-center justify-end gap-4 pt-1">
          <button
            onClick={onCancel}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => title.trim() && onAdd({ title, horizon, category, progress: 0, reason })}
            disabled={!title.trim()}
            className="text-sm font-semibold text-foreground hover:opacity-70 disabled:opacity-30 transition-opacity"
          >
            Confirm Goal
          </button>
        </div>
      </div>
    </div>
  );
}

export default function GoalsPage() {
  const { goals, addGoal, deleteGoal } = useApp();
  const [addingFor, setAddingFor] = useState<{ horizon: Goal["horizon"]; category: Goal["category"] } | null>(null);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const yearly = goals.filter((g) => g.horizon === "yearly");
  const monthly = goals.filter((g) => g.horizon === "monthly");
  const weekly = goals.filter((g) => g.horizon === "weekly");

  const sections: { title: string; icon: typeof Star; data: Goal[]; horizon: Goal["horizon"] }[] = [
    { title: "Yearly Goals", icon: Star, data: yearly, horizon: "yearly" },
    { title: "Monthly Goals", icon: Calendar, data: monthly, horizon: "monthly" },
    { title: "Weekly Goals", icon: TrendingUp, data: weekly, horizon: "weekly" },
  ];

  const handleAddGoal = (g: Omit<Goal, "id">) => {
    const exists = goals.some(
      (existing) => existing.horizon === g.horizon && existing.category === g.category
    );
    if (exists) return; // slot already filled — shouldn't reach here in normal flow
    addGoal(g);
    setAddingFor(null);
  };

  return (
    <AppLayout>
      <div className="p-8 max-w-4xl mx-auto">
        <div className="mb-14">
          <h1 className="text-5xl font-bold text-foreground mb-3">My Why.</h1>
          <p className="text-base text-muted-foreground">
            One professional goal. One private goal. Per horizon. No distractions.
          </p>
        </div>

        <div className="space-y-16">
          {sections.map(({ title, icon: Icon, data, horizon }) => {
            const isCollapsed = collapsed[horizon];
            const proGoal = data.find((g) => g.category === "professional");
            const privateGoal = data.find((g) => g.category === "private");

            return (
              <div key={horizon}>
                {/* Section header */}
                <div className="flex items-center justify-between mb-6 pb-5 border-b border-foreground/10">
                  <button
                    onClick={() => setCollapsed((c) => ({ ...c, [horizon]: !c[horizon] }))}
                    className="flex items-center gap-3 group"
                  >
                    <Icon className="w-6 h-6 text-foreground opacity-70" />
                    <h2 className="text-3xl font-semibold text-foreground group-hover:opacity-70 transition-opacity">
                      {title}
                    </h2>
                    <ChevronDown
                      className={cn(
                        "w-5 h-5 text-muted-foreground transition-transform",
                        isCollapsed && "-rotate-90"
                      )}
                    />
                  </button>
                </div>

                {!isCollapsed && (
                  <div>
                    {/* Add form */}
                    {addingFor?.horizon === horizon && (
                      <AddGoalForm
                        horizon={horizon}
                        category={addingFor.category}
                        onAdd={handleAddGoal}
                        onCancel={() => setAddingFor(null)}
                      />
                    )}

                    {/* 2-slot grid */}
                    <div className="grid grid-cols-2 gap-5">
                      <GoalSlot
                        goal={proGoal}
                        category="professional"
                        horizon={horizon}
                        onDelete={deleteGoal}
                        onAdd={(cat, hor) => setAddingFor({ horizon: hor, category: cat })}
                      />
                      <GoalSlot
                        goal={privateGoal}
                        category="private"
                        horizon={horizon}
                        onDelete={deleteGoal}
                        onAdd={(cat, hor) => setAddingFor({ horizon: hor, category: cat })}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
