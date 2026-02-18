import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { dailySchedule, DailyBlock } from "@/data/sampleData";
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";
import { Clock, Zap, Users, Coffee, Briefcase, Heart, ChevronDown, BookOpen, Moon, X, Flag, Dumbbell, Check } from "lucide-react";

// Color-coded icons
const typeConfig: Record<DailyBlock["type"], { icon: typeof Zap; blockClass: string; label: string }> = {
  "deep-work": { icon: Zap, blockClass: "time-block-deep-work", label: "Deep Work" },
  meeting: { icon: Users, blockClass: "time-block-meeting", label: "Meeting" },
  break: { icon: Coffee, blockClass: "time-block-break", label: "Break" },
  admin: { icon: Briefcase, blockClass: "time-block-admin", label: "Admin" },
  personal: { icon: Heart, blockClass: "time-block-personal", label: "Personal" },
};

const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];

type BlockAssignment = Record<string, string>; // key = `${day}-${blockIndex}`, value = task id
type MicroWorkout = Record<string, boolean>;

function TimeBlock({
  block,
  blockIndex,
  day,
  deepWorkTasks,
  todoTasks,
  assignments,
  onAssign,
  microWorkouts,
  onToggleMicroWorkout,
}: {
  block: DailyBlock;
  blockIndex: number;
  day: string;
  deepWorkTasks: ReturnType<typeof useApp>["tasks"];
  todoTasks: ReturnType<typeof useApp>["tasks"];
  assignments: BlockAssignment;
  onAssign: (key: string, taskId: string) => void;
  microWorkouts: MicroWorkout;
  onToggleMicroWorkout: (key: string) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAssignMenu, setShowAssignMenu] = useState(false);

  const config = typeConfig[block.type];
  const Icon = config.icon;
  const isDeepWork = block.type === "deep-work";
  const isTodo = block.type === "admin";
  const isWorkout = block.type === "personal";
  const blockKey = `${day}-${blockIndex}`;
  const assignedTaskId = assignments[blockKey];
  const assignedTask = deepWorkTasks.find((t) => t.id === assignedTaskId) || todoTasks.find((t) => t.id === assignedTaskId);
  const isMicroDone = microWorkouts[blockKey];

  const hasContent = isDeepWork || isTodo;

  const close = () => {
    setIsExpanded(false);
    setShowAssignMenu(false);
  };

  return (
    <>
      {/* ── Compact Block ───────────────────────────────────────────────────── */}
      <div className={cn(
        "relative w-full rounded-2xl border transition-all duration-200 overflow-hidden",
        config.blockClass
      )}>
        <div className="flex h-full min-h-[100px]">
          {/* Left: Time & Type */}
          <div className="w-24 flex flex-col justify-between p-3 border-r border-current/10 bg-black/10">
            <div className="flex items-center gap-1.5 opacity-80">
              <Icon className="w-4 h-4" />
              <span className="font-mono text-sm font-bold">{block.time}</span>
            </div>
            <span className="text-xs font-bold uppercase tracking-wider opacity-60">
              {config.label}
            </span>
          </div>

          {/* Center: Content / Assignment */}
          <div
            className="flex-1 p-3 flex flex-col justify-center cursor-pointer hover:bg-white/5 transition-colors"
            onClick={() => hasContent && setIsExpanded(true)}
          >
            {assignedTask ? (
              <div>
                <p className="text-lg font-bold leading-tight line-clamp-2">{assignedTask.title}</p>
                <div className="flex items-center gap-2 mt-1 opacity-70">
                  <span className={cn("w-2 h-2 rounded-full", assignedTask.priority === 'critical' ? 'bg-destructive' : 'bg-primary')} />
                  <span className="text-xs font-medium uppercase">{assignedTask.initiative}</span>
                </div>
              </div>
            ) : (
              <p className="text-base font-medium opacity-50 italic">
                {hasContent ? "Click to assign focus..." : block.activity}
              </p>
            )}
          </div>

          {/* Right: Micro Workout (hidden on personal/workout blocks) */}
          {!isWorkout && (
            <div className="w-14 flex flex-col items-center justify-center border-l border-current/10 bg-black/5">
              <button
                onClick={() => onToggleMicroWorkout(blockKey)}
                className={cn(
                  "w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all",
                  isMicroDone
                    ? "bg-current border-transparent text-background"
                    : "border-current/30 hover:border-current/60"
                )}
                title="Micro-workout (10 reps)"
              >
                {isMicroDone
                  ? <Check className="w-3.5 h-3.5" />
                  : <Dumbbell className="w-3.5 h-3.5 opacity-40" />
                }
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Pop-Out (Detail Modal) ─────────────────────────────────────────── */}
      {isExpanded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="bg-card w-full max-w-xl rounded-3xl shadow-2xl border border-border flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-border bg-secondary/20 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 rounded-full bg-background border border-border font-mono text-sm font-bold flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-muted-foreground" /> {block.time}
                  </span>
                  <span className={cn("px-3 py-1 rounded-full text-sm font-bold border", config.blockClass)}>
                    {block.activity}
                  </span>
                </div>
                <h2 className="text-2xl font-bold leading-tight max-w-md">
                  {assignedTask ? assignedTask.title : "Select Focus Task"}
                </h2>
              </div>
              <button onClick={close} className="p-2 rounded-full hover:bg-secondary text-muted-foreground transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Selection Body */}
            <div className="p-6 overflow-y-auto flex-1">
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-3 block">
                  Assign Task
                </label>
                <div className="relative">
                  <button
                    onClick={() => setShowAssignMenu((v) => !v)}
                    className="w-full flex items-center justify-between px-4 py-4 rounded-xl bg-secondary/30 border border-border text-left hover:bg-secondary/50 transition-colors"
                  >
                    <span className={cn("text-base font-medium", !assignedTask && "text-muted-foreground")}>
                      {assignedTask ? assignedTask.title : "Choose a task..."}
                    </span>
                    <ChevronDown className="w-5 h-5 text-muted-foreground ml-2" />
                  </button>

                  {showAssignMenu && (
                    <div className="absolute left-0 right-0 top-full mt-2 bg-popover border border-border rounded-xl shadow-xl z-20 py-2 max-h-60 overflow-y-auto">
                      <button
                        onClick={() => { onAssign(blockKey, ""); setShowAssignMenu(false); }}
                        className="w-full text-left px-4 py-3 text-sm text-muted-foreground hover:bg-secondary/50 border-b border-border/50"
                      >
                        — Clear assignment —
                      </button>
                      {(isDeepWork ? deepWorkTasks : todoTasks).map((t) => (
                        <button
                          key={t.id}
                          onClick={() => { onAssign(blockKey, t.id); setShowAssignMenu(false); }}
                          className="w-full text-left px-4 py-3 hover:bg-secondary/50 transition-colors flex flex-col gap-0.5"
                        >
                          <span className="text-sm font-medium text-foreground">{t.title}</span>
                          <span className="text-xs text-muted-foreground">
                            {t.priority} · {t.estimate}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function DailyPlanPage() {
  const { tasks } = useApp();
  const todayName = days[new Date().getDay() - 1] || "Mon";
  const [assignments, setAssignments] = useState<BlockAssignment>({});
  const [microWorkouts, setMicroWorkouts] = useState<MicroWorkout>({});

  const todoTasks = tasks.filter((t) => t.column === "sprint" || t.column === "in-progress");
  const deepWorkTasks = tasks.filter((t) =>
    (t.column === "sprint" || t.column === "in-progress") && (t.priority === "critical" || t.priority === "high")
  );

  const blocks = dailySchedule[todayName] || [];

  const handleAssign = (key: string, taskId: string) => {
    setAssignments((prev) => ({ ...prev, [key]: taskId }));
  };

  const handleToggleMicro = (key: string) => {
    setMicroWorkouts((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const sprintTasks = todoTasks.filter((t) => t.column === "sprint");
  const inProgressTasks = todoTasks.filter((t) => t.column === "in-progress");

  return (
    <AppLayout>
      <div className="p-8 h-screen overflow-hidden flex flex-col">
        <div className="mb-8 flex-shrink-0">
          <h1 className="text-5xl font-bold mb-2">Today's Protocol</h1>
          <p className="text-xl text-muted-foreground font-medium">
            {todayName} · Execute with Honor.
          </p>
        </div>

        {/* ── Split Layout ─────────────────────────────────────────────────── */}
        <div className="flex-1 overflow-hidden grid grid-cols-2 gap-8">

          {/* Left: Schedule (Scrollable) */}
          <div className="relative h-full overflow-hidden flex flex-col">
            <div className="absolute inset-0 overflow-y-auto pr-4 scrollbar-thin pb-20">

              {/* Morning Habit */}
              <div className="mb-4 p-4 rounded-xl bg-secondary/20 border border-border flex items-center gap-4">
                <div className="p-3 bg-secondary rounded-full flex-shrink-0">
                  <BookOpen className="w-5 h-5 text-foreground" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-0.5">Morning Habit</p>
                  <h3 className="font-bold text-lg leading-tight">Read 10–30 Minutes</h3>
                  <p className="text-sm text-muted-foreground">Before the chaos starts. Feed your mind.</p>
                </div>
              </div>

              {/* Time Blocks */}
              <div className="flex flex-col gap-3">
                {blocks.map((block, i) => (
                  <TimeBlock
                    key={i}
                    block={block}
                    blockIndex={i}
                    day={todayName}
                    deepWorkTasks={deepWorkTasks}
                    todoTasks={todoTasks}
                    assignments={assignments}
                    onAssign={handleAssign}
                    microWorkouts={microWorkouts}
                    onToggleMicroWorkout={handleToggleMicro}
                  />
                ))}
              </div>

              {/* Night time Habit */}
              <div className="mt-4 p-4 rounded-xl bg-secondary/20 border border-border flex items-center gap-4">
                <div className="p-3 bg-secondary rounded-full flex-shrink-0">
                  <Moon className="w-5 h-5 text-foreground" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-0.5">Night Time Habit</p>
                  <h3 className="font-bold text-lg leading-tight">Wind Down Protocol</h3>
                  <p className="text-sm text-muted-foreground">Reflect, prepare tomorrow, sleep with intention.</p>
                </div>
              </div>

            </div>
          </div>

          {/* Right: Execution Board */}
          <div className="h-full flex flex-col overflow-hidden">
            <h2 className="text-xl font-bold mb-5 flex items-center gap-2.5 flex-shrink-0">
              <Flag className="w-5 h-5 text-foreground" />
              Execution Board
            </h2>

            <div className="flex-1 overflow-y-auto scrollbar-thin space-y-6 pr-1">

              {/* ── Sprint Backlog ─────────────────────────────────────────── */}
              <div className="rounded-2xl border border-primary/20 overflow-hidden">
                <div className="px-4 py-3 bg-primary/8 border-b border-primary/20 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-xs font-bold uppercase tracking-widest text-primary">Sprint Backlog</span>
                  <span className="ml-auto text-xs font-mono text-primary/60">{sprintTasks.length}</span>
                </div>
                <div className="p-3 space-y-2">
                  {sprintTasks.length === 0 ? (
                    <p className="text-muted-foreground text-sm italic px-1 py-2">No tasks in sprint backlog.</p>
                  ) : (
                    sprintTasks.map((task) => (
                      <div key={task.id} className="p-3 rounded-xl bg-card border border-border/60">
                        <p className="font-semibold text-sm text-foreground mb-1.5 leading-snug">{task.title}</p>
                        <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                          <span className={cn("font-semibold capitalize", task.priority === "critical" ? "text-destructive" : "text-primary")}>
                            {task.priority}
                          </span>
                          <span className="text-muted-foreground/40">·</span>
                          <span>{task.estimate}</span>
                          <span className="text-muted-foreground/40">·</span>
                          <span className="truncate">{task.initiative}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* ── In Progress ────────────────────────────────────────────── */}
              <div className="rounded-2xl border border-amber-500/20 overflow-hidden">
                <div className="px-4 py-3 bg-amber-500/8 border-b border-amber-500/20 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="text-xs font-bold uppercase tracking-widest text-amber-400">In Progress</span>
                  <span className="ml-auto text-xs font-mono text-amber-500/60">{inProgressTasks.length}</span>
                </div>
                <div className="p-3 space-y-2">
                  {inProgressTasks.length === 0 ? (
                    <p className="text-muted-foreground text-sm italic px-1 py-2">Nothing in progress right now.</p>
                  ) : (
                    inProgressTasks.map((task) => (
                      <div key={task.id} className="p-3 rounded-xl bg-card border border-amber-500/20 relative overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-amber-500" />
                        <p className="font-semibold text-sm text-foreground mb-1.5 leading-snug">{task.title}</p>
                        <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                          <span className={cn("font-semibold capitalize", task.priority === "critical" ? "text-destructive" : "text-primary")}>
                            {task.priority}
                          </span>
                          <span className="text-muted-foreground/40">·</span>
                          <span>{task.estimate}</span>
                          <span className="text-muted-foreground/40">·</span>
                          <span className="truncate">{task.initiative}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </AppLayout>
  );
}
