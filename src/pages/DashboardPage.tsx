import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { useApp } from "@/context/AppContext";
import { Target, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

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

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening";

  return (
    <AppLayout>
      <div className="p-6">

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <div className="mb-12">
          <p className="text-sm text-muted-foreground mb-2 font-mono tracking-wide">
            {new Date().toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long" })}
          </p>
          <h1 className="text-5xl font-bold text-foreground leading-tight mb-8">
            Good {greeting}, Thomas.
          </h1>

          {/* Slogan */}
          <div className="py-6">
            <p className="text-5xl font-bold text-foreground tracking-tight leading-tight">
              Grim. <br /> Honor will come.
            </p>
            <p className="text-lg text-muted-foreground mt-4 max-w-2xl leading-relaxed">
              Every rep counts. Every hour matters. Show up.
            </p>
          </div>
        </div>

        {/* ── Content ──────────────────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-12">

          {/* Left: Goals Only (No "Needs Attention") */}
          <div className="col-span-2">
            <div className="flex items-center justify-between mb-6">
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
              <div className="space-y-6">
                {goals.slice(0, 6).map((goal) => (
                  <div key={goal.id} className="py-4 border-b border-border/50 last:border-0">
                    <p className="text-xl font-bold text-foreground leading-tight">{goal.title}</p>
                    {goal.reason && (
                      <p className="text-base text-muted-foreground mt-1.5 leading-relaxed">{goal.reason}</p>
                    )}
                    <span className="text-xs text-muted-foreground/60 uppercase tracking-widest mt-2 block font-semibold">
                      {goal.horizon}
                    </span>
                  </div>
                ))}
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
