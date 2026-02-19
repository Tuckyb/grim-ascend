import { useState, useRef, useEffect } from "react";
import { AppLayout } from "@/components/AppLayout";
import { useApp } from "@/context/AppContext";
import { Target, ChevronLeft, ChevronRight, Pencil, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";

// ─── Mini Monthly Calendar ────────────────────────────────────────────────────
function MiniCalendar() {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const monthName = viewDate.toLocaleDateString("en-AU", { month: "long", year: "numeric" });

  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Pad to start on Monday (shift Sunday to end)
  const startPad = (firstDay + 6) % 7; // Mon=0

  const cells: (number | null)[] = [
    ...Array(startPad).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const isToday = (d: number) =>
    d === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  return (
    <div>
      {/* Month nav */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setViewDate(new Date(year, month - 1, 1))}
          className="w-7 h-7 rounded-lg bg-secondary hover:bg-muted flex items-center justify-center transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-muted-foreground" />
        </button>
        <span className="text-sm font-semibold text-foreground">{monthName}</span>
        <button
          onClick={() => setViewDate(new Date(year, month + 1, 1))}
          className="w-7 h-7 rounded-lg bg-secondary hover:bg-muted flex items-center justify-center transition-colors"
        >
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 mb-1">
        {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
          <div key={d} className="text-center text-[10px] text-muted-foreground font-medium py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day, i) => (
          <div key={i} className="flex items-center justify-center">
            {day !== null ? (
              <span
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center text-xs transition-colors",
                  isToday(day)
                    ? "bg-foreground text-background font-bold" // Black/White style
                    : "text-foreground hover:bg-secondary cursor-pointer"
                )}
              >
                {day}
              </span>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const navigate = useNavigate();
  const { goals } = useApp();
  const { user } = useAuth();
  const { displayName, saveName } = useProfile(user?.id ?? null);

  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState("");
  const nameInputRef = useRef<HTMLInputElement>(null);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening";
  const shownName = displayName || "there";

  const startEdit = () => {
    setNameDraft(displayName || "");
    setEditingName(true);
    setTimeout(() => nameInputRef.current?.focus(), 50);
  };

  const confirmEdit = async () => {
    await saveName(nameDraft);
    setEditingName(false);
  };

  const cancelEdit = () => setEditingName(false);

  return (
    <AppLayout>
      <div className="p-6">

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground mb-2 font-mono tracking-wide">
            {new Date().toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long" })}
          </p>
          <h1 className="text-5xl font-bold text-foreground leading-tight mb-3 flex items-center gap-3 flex-wrap">
            Good {greeting},{" "}
            {editingName ? (
              <span className="flex items-center gap-2">
                <input
                  ref={nameInputRef}
                  value={nameDraft}
                  onChange={(e) => setNameDraft(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") confirmEdit(); if (e.key === "Escape") cancelEdit(); }}
                  className="bg-secondary border border-border rounded-xl px-3 py-1 text-4xl font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 w-48"
                  placeholder="Your name"
                />
                <button onClick={confirmEdit} className="p-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                  <Check className="w-5 h-5" />
                </button>
                <button onClick={cancelEdit} className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </span>
            ) : (
              <span className="flex items-center gap-2 group cursor-pointer" onClick={startEdit}>
                {shownName}.
                <Pencil className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-60 transition-opacity" />
              </span>
            )}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Honor will come. Every rep counts. Every hour matters. Show up.
          </p>
        </div>

        {/* ── Content ──────────────────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-10 items-start max-w-6xl mx-auto">

          {/* Left: Goals grouped by horizon */}
          <div className="col-span-2">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <Target className="w-6 h-6 text-foreground" />
                <h2 className="text-2xl font-bold text-foreground">Goals</h2>
              </div>
              <button
                onClick={() => navigate("/goals")}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Manage all →
              </button>
            </div>

            {goals.length === 0 ? (
              <div className="p-8 border border-dashed border-border rounded-2xl text-center">
                <p className="text-lg text-muted-foreground">No goals set yet.</p>
                <button
                  onClick={() => navigate("/goals")}
                  className="mt-2 text-foreground underline font-medium"
                >
                  Set a goal
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Weekly Goals */}
                {goals.filter(g => g.horizon === "weekly").length > 0 && (
                  <div className="rounded-2xl p-5 bg-emerald-950/30 border border-emerald-900/30">
                    <h3 className="text-xs uppercase tracking-widest text-emerald-400 font-semibold mb-3">Weekly Goals</h3>
                    {goals.filter(g => g.horizon === "weekly").map((goal) => (
                      <div key={goal.id} className="py-2.5 border-b border-emerald-900/20 last:border-0">
                        <span className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground/70">{goal.category}</span>
                        <p className="text-lg font-bold text-foreground leading-tight">{goal.title}</p>
                        {goal.reason && <p className="text-sm text-muted-foreground mt-1">{goal.reason}</p>}
                      </div>
                    ))}
                  </div>
                )}

                {/* Monthly Goals */}
                {goals.filter(g => g.horizon === "monthly").length > 0 && (
                  <div className="rounded-2xl p-5 bg-amber-950/25 border border-amber-900/30">
                    <h3 className="text-xs uppercase tracking-widest text-amber-400 font-semibold mb-3">Monthly Goals</h3>
                    {goals.filter(g => g.horizon === "monthly").map((goal) => (
                      <div key={goal.id} className="py-2.5 border-b border-amber-900/20 last:border-0">
                        <span className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground/70">{goal.category}</span>
                        <p className="text-lg font-bold text-foreground leading-tight">{goal.title}</p>
                        {goal.reason && <p className="text-sm text-muted-foreground mt-1">{goal.reason}</p>}
                      </div>
                    ))}
                  </div>
                )}

                {/* Yearly Goals */}
                {goals.filter(g => g.horizon === "yearly").length > 0 && (
                  <div className="rounded-2xl p-5 bg-sky-950/25 border border-sky-900/30">
                    <h3 className="text-xs uppercase tracking-widest text-sky-400 font-semibold mb-3">Yearly Goals</h3>
                    {goals.filter(g => g.horizon === "yearly").map((goal) => (
                      <div key={goal.id} className="py-2.5 border-b border-sky-900/20 last:border-0">
                        <span className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground/70">{goal.category}</span>
                        <p className="text-lg font-bold text-foreground leading-tight">{goal.title}</p>
                        {goal.reason && <p className="text-sm text-muted-foreground mt-1">{goal.reason}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right: Calendar */}
          <div className="col-span-1">
            <h2 className="text-lg font-bold text-foreground mb-4">Calendar</h2>
            <div className="rounded-2xl border border-border/50 p-6 bg-card/30">
              <MiniCalendar />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
