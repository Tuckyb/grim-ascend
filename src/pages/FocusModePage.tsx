import { useEffect, useMemo, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { cn } from "@/lib/utils";
import { Flame, Check, Play, Pause, RotateCcw, Plus, Trash2, Copy } from "lucide-react";

const todayKey = () => new Date().toISOString().slice(0, 10);
const weekKey = () => {
  const d = new Date();
  const day = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - day);
  return d.toISOString().slice(0, 10);
};

function useStored<T>(key: string, initial: T) {
  const [val, setVal] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      setVal(raw ? (JSON.parse(raw) as T) : initial);
    } catch { /* ignore */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(val));
  }, [key, val]);
  return [val, setVal] as const;
}

const environment = [
  "Phone on airplane mode, in another room",
  "Irrelevant tabs closed — work apps only",
  "Curtains closed",
  "Clean desk, earplugs/headphones, no music or podcasts",
  "Blocker on (streaming, YouTube, social media)",
];
const antiRoutine = [
  "Working within 5 minutes of waking",
  "No email inbox",
  "No phone notifications or DMs (except scheduled times)",
  "No YouTube, X, TikTok, Netflix or shiny new tools",
  "No calls, meetings or unscheduled social time",
  "Said NO to anything that isn't my #1 constraint",
];
const evening = [
  "Community check-in (20 min, 1 hr max)",
  "Journal and reflect",
  "Planned tomorrow hour by hour",
  "No doom scrolling, alcohol or Netflix",
  "Sleep early",
];

const noScript =
  "Sorry I'm super busy but feel free to send me any details about it. I'll be 100% honest: Right now I'm just really focused on my current projects for the next 90 days. I know what I need to do and just focusing on that really. Thank you for understanding :)";

type LogItem = { id: string; text: string; minutes: number };

function Checklist({ title, items, state, toggle }: {
  title: string; items: string[]; state: Record<string, boolean>; toggle: (i: string) => void;
}) {
  const done = items.filter((i) => state[i]).length;
  return (
    <section className="grim-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-foreground">{title}</h2>
        <span className="font-mono text-sm text-muted-foreground">{done}/{items.length}</span>
      </div>
      <div className="space-y-2">
        {items.map((i) => (
          <button key={i} onClick={() => toggle(i)}
            className={cn("w-full flex items-center gap-3 p-3 rounded-xl text-left transition-colors",
              state[i] ? "bg-primary/10 text-foreground" : "bg-secondary/50 text-muted-foreground hover:bg-secondary")}>
            <span className={cn("w-6 h-6 rounded-md border flex items-center justify-center flex-shrink-0",
              state[i] ? "bg-primary border-primary text-primary-foreground" : "border-border")}>
              {state[i] && <Check className="w-4 h-4" />}
            </span>
            <span className="text-base">{i}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

export default function FocusModePage() {
  const day = todayKey();
  const week = weekKey();
  const [constraint, setConstraint] = useStored(`focus:constraint:${week}`, "");
  const [checks, setChecks] = useStored<Record<string, boolean>>(`focus:checks:${day}`, {});
  const [log, setLog] = useStored<LogItem[]>(`focus:log:${day}`, []);
  const [sprints, setSprints] = useStored(`focus:sprints:${day}`, 0);
  const [review, setReview] = useStored(`focus:review:${week}`, { reached: "", next: "" });
  const [sprintLen, setSprintLen] = useState(90);
  const [remaining, setRemaining] = useState(90 * 60);
  const [running, setRunning] = useState(false);
  const [onBreak, setOnBreak] = useState(false);
  const [newText, setNewText] = useState("");
  const [newMin, setNewMin] = useState("");

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setRemaining((r) => {
      if (r <= 1) {
        setRunning(false);
        if (!onBreak) { setSprints((s) => s + 1); setOnBreak(true); return 15 * 60; }
        setOnBreak(false); return sprintLen * 60;
      }
      return r - 1;
    }), 1000);
    return () => clearInterval(t);
  }, [running, onBreak, sprintLen, setSprints]);

  const toggle = (i: string) => setChecks((c) => ({ ...c, [i]: !c[i] }));
  const totalMin = useMemo(() => log.reduce((a, l) => a + l.minutes, 0), [log]);
  const allItems = [...environment, ...antiRoutine, ...evening];
  const score = Math.round((allItems.filter((i) => checks[i]).length / allItems.length) * 100);
  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");

  const addLog = () => {
    if (!newText.trim()) return;
    setLog((l) => [...l, { id: crypto.randomUUID(), text: newText.trim(), minutes: Number(newMin) || 0 }]);
    setNewText(""); setNewMin("");
  };

  return (
    <AppLayout>
      <div className="p-8 max-w-6xl mx-auto space-y-6">
        <header className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-5xl font-black text-foreground flex items-center gap-3">
              <Flame className="w-10 h-10 text-primary" /> Goldie Focus Mode
            </h1>
            <p className="text-lg text-muted-foreground mt-2">One constraint. Zero distractions. Resets daily and weekly.</p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            {[["Discipline", `${score}%`], ["Sprints", sprints], ["Logged", `${Math.floor(totalMin / 60)}h ${totalMin % 60}m`]].map(([l, v]) => (
              <div key={l as string} className="grim-card px-5 py-3">
                <p className="font-mono text-2xl font-bold text-foreground">{v}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">{l}</p>
              </div>
            ))}
          </div>
        </header>

        <section className="grim-card p-6">
          <p className="text-sm uppercase tracking-widest text-primary font-mono mb-2">Step 1 · #1 constraint this week</p>
          <input value={constraint} onChange={(e) => setConstraint(e.target.value)}
            placeholder="The ONE thing that moves the needle most this week…"
            className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-4 text-2xl font-bold text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary" />
          <p className="text-sm text-muted-foreground mt-2">Only pick ONE. Everything else is eliminated, optional or deleted.</p>
        </section>

        <div className="grid md:grid-cols-2 gap-6">
          <section className="grim-card p-6 flex flex-col items-center">
            <p className="text-sm uppercase tracking-widest text-primary font-mono mb-2 self-start">Step 3 · Deep work sprint</p>
            <p className="text-sm text-muted-foreground mb-2">{onBreak ? "Break — walk, stretch, water" : "No interruptions. No multitasking."}</p>
            <p className="font-mono text-7xl font-bold text-foreground my-4">{mm}:{ss}</p>
            <div className="flex gap-2 mb-4">
              {[90, 120].map((n) => (
                <button key={n} disabled={running}
                  onClick={() => { setSprintLen(n); setOnBreak(false); setRemaining(n * 60); }}
                  className={cn("px-4 py-2 rounded-xl text-sm", sprintLen === n && !onBreak ? "bg-primary/15 text-primary" : "bg-secondary text-muted-foreground")}>
                  {n} min
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setRunning(!running)} className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold flex items-center gap-2">
                {running ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}{running ? "Pause" : "Start"}
              </button>
              <button onClick={() => { setRunning(false); setOnBreak(false); setRemaining(sprintLen * 60); }} className="px-4 py-3 rounded-xl bg-secondary text-foreground">
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          </section>

          <section className="grim-card p-6">
            <p className="text-sm uppercase tracking-widest text-primary font-mono mb-3">Step 6 · Today's work log</p>
            <div className="flex gap-2 mb-3">
              <input value={newText} onChange={(e) => setNewText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addLog()}
                placeholder="What did you do?" className="flex-1 bg-secondary/50 border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none" />
              <input value={newMin} onChange={(e) => setNewMin(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addLog()}
                placeholder="min" type="number" className="w-20 bg-secondary/50 border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none" />
              <button onClick={addLog} className="px-3 rounded-xl bg-primary text-primary-foreground"><Plus className="w-5 h-5" /></button>
            </div>
            <ul className="space-y-2 max-h-64 overflow-y-auto">
              {log.length === 0 && <li className="text-muted-foreground text-sm">Nothing logged yet. Track and time everything.</li>}
              {log.map((l) => (
                <li key={l.id} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50">
                  <span className="flex-1 text-foreground">{l.text}</span>
                  <span className="font-mono text-sm text-muted-foreground">{l.minutes}m</span>
                  <button onClick={() => setLog((x) => x.filter((y) => y.id !== l.id))} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Checklist title="Step 2 · Environment" items={environment} state={checks} toggle={toggle} />
          <Checklist title="Step 5 · Anti-routine" items={antiRoutine} state={checks} toggle={toggle} />
          <Checklist title="Step 4 & Evening" items={evening} state={checks} toggle={toggle} />
        </div>

        <section className="grim-card p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm uppercase tracking-widest text-primary font-mono">How to say NO</p>
            <button onClick={() => navigator.clipboard.writeText(noScript)} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
              <Copy className="w-4 h-4" /> Copy
            </button>
          </div>
          <p className="text-base text-foreground/90 italic">"{noScript}"</p>
        </section>

        <section className="grim-card p-6 space-y-4">
          <p className="text-sm uppercase tracking-widest text-primary font-mono">Step 7 · Weekly commitment review</p>
          <div>
            <p className="text-foreground font-medium mb-2">Did you reach your goal this week?</p>
            <div className="flex gap-2">
              {["Yes", "Partly", "No"].map((o) => (
                <button key={o} onClick={() => setReview({ ...review, reached: o })}
                  className={cn("px-5 py-2 rounded-xl", review.reached === o ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground")}>{o}</button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-foreground font-medium mb-2">What's your constraint to solve for next week?</p>
            <textarea value={review.next} onChange={(e) => setReview({ ...review, next: e.target.value })} rows={2}
              className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none" />
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
