import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { dailySchedule, DailyBlock } from "@/data/sampleData";
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";
import { Clock, Zap, Users, Coffee, Briefcase, Heart, BookOpen, Moon, X, Flag, Check } from "lucide-react";

// Color-coded icons
const typeConfig: Record<DailyBlock["type"], { icon: typeof Zap; blockClass: string; label: string }> = {
  "deep-work": { icon: Zap, blockClass: "time-block-deep-work", label: "Deep Work" },
  meeting: { icon: Users, blockClass: "time-block-meeting", label: "Meeting" },
  break: { icon: Coffee, blockClass: "time-block-break", label: "Break" },
  admin: { icon: Briefcase, blockClass: "time-block-admin", label: "Admin" },
  personal: { icon: Heart, blockClass: "time-block-personal", label: "Personal" },
};

const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];

type BlockAssignment = Record<string, string[]>;
type MicroWorkout = Record<string, boolean>;
type EatNotes = Record<string, string>;


function TimeBlock({
  block,
  blockIndex,
  day,
  allBoardTasks,
  assignments,
  onAssign,
  onRemoveAssignment,
  microWorkouts,
  onToggleMicroWorkout,
  eatNotes,
  onSaveEatNote,
}: {
  block: DailyBlock;
  blockIndex: number;
  day: string;
  allBoardTasks: ReturnType<typeof useApp>["tasks"];
  assignments: BlockAssignment;
  onAssign: (key: string, taskId: string) => void;
  onRemoveAssignment: (key: string, taskId: string) => void;
  microWorkouts: MicroWorkout;
  onToggleMicroWorkout: (key: string) => void;
  eatNotes: EatNotes;
  onSaveEatNote: (key: string, note: string) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [eatDraft, setEatDraft] = useState("");

  const config = typeConfig[block.type];
  const Icon = config.icon;
  const isDeepWork = block.type === "deep-work";
  const isMessenger = block.activity === "Messenger";
  const isEat = block.activity === "Eat";
  const isWorkout = block.type === "personal";
  const isAdmin = block.type === "admin" && !isMessenger;
  const blockKey = `${day}-${blockIndex}`;
  const assignedTaskIds = assignments[blockKey] || [];
  const assignedTasks = assignedTaskIds.map(id => allBoardTasks.find(t => t.id === id)).filter(Boolean);
  const isMicroDone = microWorkouts[blockKey];
  const eatNote = eatNotes[blockKey] || "";

  // Deep work and admin (non-messenger) are assignable; Eat is note-able
  const isAssignable = isDeepWork || isAdmin;
  const isClickable = isAssignable || isEat;

  const close = () => setIsExpanded(false);

  // Filter out already-assigned tasks
  const availableTasks = allBoardTasks.filter(t => !assignedTaskIds.includes(t.id));

  const openExpanded = () => {
    if (isEat) setEatDraft(eatNote);
    setIsExpanded(true);
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
            className={cn(
              "flex-1 p-3 flex flex-col justify-center transition-colors",
              isClickable && "cursor-pointer hover:bg-white/5"
            )}
            onClick={() => isClickable && openExpanded()}
          >
            {isEat && eatNote ? (
              <p className="text-base font-medium leading-tight">{eatNote}</p>
            ) : assignedTasks.length > 0 ? (
              <div className="space-y-1.5">
                {assignedTasks.map((task) => task && (
                  <div key={task.id}>
                    <p className="text-base font-bold leading-tight line-clamp-1">{task.title}</p>
                    <div className="flex items-center gap-2 opacity-70">
                      <span className={cn("w-1.5 h-1.5 rounded-full", task.priority === 'critical' ? 'bg-destructive' : 'bg-primary')} />
                      <span className="text-xs font-medium uppercase">{task.initiative}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-base font-medium opacity-50 italic">
                {isEat ? "Click to add plans..." : isClickable ? "Click to assign focus..." : block.activity}
              </p>
            )}
          </div>

          {/* Right: Micro Workout checkboxes */}
          {!isWorkout && (
          <div className="w-14 flex flex-col items-center justify-center border-l border-current/10 bg-black/5 gap-1">
              <button
                onClick={() => onToggleMicroWorkout(blockKey)}
                className={cn(
                  "w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all",
                  isMicroDone
                    ? "bg-current border-transparent text-background"
                    : "border-current/30 hover:border-current/60"
                )}
                title="Do Reps"
              >
                {isMicroDone && <Check className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Pop-Out Modal ─────────────────────────────────────────── */}
      {isExpanded && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={close}
        >
          <div
            className="bg-card w-full max-w-2xl rounded-3xl shadow-2xl border border-border flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-border bg-secondary/20 flex items-start justify-between flex-shrink-0">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 rounded-full bg-background border border-border font-mono text-sm font-bold flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-muted-foreground" /> {block.time}
                  </span>
                  <span className={cn("px-3 py-1 rounded-full text-sm font-bold border", config.blockClass)}>
                    {block.activity}
                  </span>
                </div>
                <h2 className="text-2xl font-bold leading-tight">
                  {isEat
                    ? "Meal Plans"
                    : assignedTasks.length > 0
                      ? `${assignedTasks.length} task${assignedTasks.length > 1 ? 's' : ''} assigned`
                      : "Select Focus Task"}
                </h2>
              </div>
              <button onClick={close} className="p-2 rounded-full hover:bg-secondary text-muted-foreground transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto flex-1">

              {/* ── EAT block: free-text note ── */}
              {isEat && (
                <div className="flex flex-col gap-3">
                  <label className="text-xs uppercase tracking-widest text-muted-foreground font-bold">
                    What are your plans?
                  </label>
                  <textarea
                    className="w-full rounded-xl bg-secondary/30 border border-border px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
                    rows={4}
                    placeholder="e.g. Lunch with James at Nero, 12:30pm..."
                    value={eatDraft}
                    onChange={(e) => setEatDraft(e.target.value)}
                    autoFocus
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={close}
                      className="px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:bg-secondary transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => { onSaveEatNote(blockKey, eatDraft); close(); }}
                      className="px-5 py-2 rounded-xl text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                      Save
                    </button>
                  </div>
                </div>
              )}

              {/* ── ASSIGNABLE block: task picker ── */}
              {isAssignable && (
                <>
                  {/* Currently assigned tasks */}
                  {assignedTasks.length > 0 && (
                    <div className="mb-6">
                      <label className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-3 block">
                        Assigned Tasks
                      </label>
                      <div className="space-y-2">
                        {assignedTasks.map((task) => task && (
                          <div key={task.id} className="flex items-center justify-between px-4 py-3 rounded-xl bg-secondary/30 border border-border">
                            <div>
                              <span className="text-sm font-medium text-foreground">{task.title}</span>
                              <span className="text-xs text-muted-foreground ml-2">{task.estimate}</span>
                            </div>
                            <button
                              onClick={() => onRemoveAssignment(blockKey, task.id)}
                              className="p-1 rounded-lg hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Inline task list (no dropdown) */}
                  <div>
                    <label className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-3 block">
                      {availableTasks.length === 0 ? "All tasks assigned" : "Add a Task"}
                    </label>
                    <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
                      {availableTasks.length === 0 ? (
                        <p className="text-sm text-muted-foreground italic px-1 py-2">No more tasks available.</p>
                      ) : (
                        availableTasks.map((t) => (
                          <button
                            key={t.id}
                            onClick={() => onAssign(blockKey, t.id)}
                            className="w-full text-left px-4 py-3.5 rounded-xl bg-secondary/30 hover:bg-secondary/60 border border-border transition-colors flex items-center justify-between gap-3"
                          >
                            <div className="flex flex-col gap-0.5 min-w-0">
                              <span className="text-sm font-semibold text-foreground leading-snug">{t.title}</span>
                              <span className="text-xs text-muted-foreground">
                                <span className={cn("font-semibold capitalize mr-1.5", t.priority === "critical" ? "text-destructive" : "text-primary")}>{t.priority}</span>
                                · {t.estimate} · {t.initiative}
                              </span>
                            </div>
                            <div className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-border flex items-center justify-center">
                              <span className="text-xs text-muted-foreground font-bold">+</span>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function DailyPlanPage() {
  const { tasks, assignments, setAssignments, microWorkouts, setMicroWorkouts, eatNotes, setEatNotes } = useApp();
  const todayName = days[new Date().getDay() - 1] || "Mon";

  // All board tasks (every column) available for assignment
  const allBoardTasks = tasks.filter(t => t.column !== "done");
  const sprintTasks = tasks.filter((t) => t.column === "sprint");
  const inProgressTasks = tasks.filter((t) => t.column === "in-progress");

  const blocks = dailySchedule[todayName] || [];

  const handleAssign = (key: string, taskId: string) => {
    setAssignments((prev) => ({
      ...prev,
      [key]: [...(prev[key] || []), taskId],
    }));
  };

  const handleRemoveAssignment = (key: string, taskId: string) => {
    setAssignments((prev) => ({
      ...prev,
      [key]: (prev[key] || []).filter(id => id !== taskId),
    }));
  };

  const handleToggleMicro = (key: string) => {
    setMicroWorkouts((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveEatNote = (key: string, note: string) => {
    setEatNotes((prev) => ({ ...prev, [key]: note }));
  };

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

              {/* Do Reps Label */}
              <div className="flex items-center mb-1 pr-0">
                <div className="flex-1" /> {/* spacer matching left+center width */}
                <div className="w-14 text-center">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Do Reps</span>
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
                    allBoardTasks={allBoardTasks}
                    assignments={assignments}
                    onAssign={handleAssign}
                    onRemoveAssignment={handleRemoveAssignment}
                    microWorkouts={microWorkouts}
                    onToggleMicroWorkout={handleToggleMicro}
                    eatNotes={eatNotes}
                    onSaveEatNote={handleSaveEatNote}
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

              {/* ── Sprint ─────────────────────────────────────────── */}
              <div className="rounded-2xl border border-primary/20 overflow-hidden">
                <div className="px-4 py-3 bg-primary/8 border-b border-primary/20 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-xs font-bold uppercase tracking-widest text-primary">Sprint</span>
                  <span className="ml-auto text-xs font-mono text-primary/60">{sprintTasks.length}</span>
                </div>
                <div className="p-3 space-y-2">
                  {sprintTasks.length === 0 ? (
                    <p className="text-muted-foreground text-sm italic px-1 py-2">No tasks in sprint.</p>
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
