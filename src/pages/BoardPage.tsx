import { useState } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { KanbanColumn } from "@/components/KanbanColumn";
import { KanbanColumn as KanbanColumnType, Task, TaskPriority, TaskInitiative } from "@/data/sampleData";
import { AppLayout } from "@/components/AppLayout";
import { Plus, Filter, Search, X, ChevronDown } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";

const columns: KanbanColumnType[] = ["backlog", "sprint", "in-progress", "review", "done"];
const priorities: TaskPriority[] = ["critical", "high", "medium", "low"];
const initiatives: TaskInitiative[] = [
  "Member Automations", "Retain Customers", "THE GRIM Podcast", "Campaign Writing",
  "GRIM Week", "Affiliate Setup", "New Features", "Videos", "Bug Fixes", "General",
];

const plannerSlots = [
  "Morning Deep Work (6–9am)",
  "Mid-Morning Deep Work (9–12pm)",
  "Afternoon Focus (1–3pm)",
  "Admin Block (3–5pm)",
  "Evening Review (5–7pm)",
];

const defaultForm = {
  title: "",
  priority: "medium" as TaskPriority,
  column: "backlog" as KanbanColumnType,
  estimate: "30 min",
  initiative: "General" as TaskInitiative,
  category: "professional" as Task["category"],
  plannerSlot: "",
  tags: [] as string[],
};

export default function BoardPage() {
  const { tasks, setTasks, addTask, deleteTask, updateTask } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState<TaskPriority | "all">("all");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState(defaultForm);

  // Edit modal state
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [editForm, setEditForm] = useState<Partial<Task>>({});

  const openEdit = (task: Task) => {
    setEditTask(task);
    setEditForm({ ...task });
  };

  const handleSaveEdit = async () => {
    if (!editTask || !editForm.title?.trim()) return;
    await updateTask(editTask.id, {
      title: editForm.title,
      priority: editForm.priority,
      column: editForm.column,
      estimate: editForm.estimate,
      initiative: editForm.initiative,
      category: editForm.category,
      description: editForm.description,
    });
    setEditTask(null);
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const { source, destination, draggableId } = result;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    setTasks((prev) => {
      const updated = [...prev];
      const taskIndex = updated.findIndex((t) => t.id === draggableId);
      if (taskIndex === -1) return prev;
      const [moved] = updated.splice(taskIndex, 1);
      moved.column = destination.droppableId as KanbanColumnType;
      const destTasks = updated.filter((t) => t.column === destination.droppableId);
      const otherTasks = updated.filter((t) => t.column !== destination.droppableId);
      destTasks.splice(destination.index, 0, moved);
      return [...otherTasks, ...destTasks];
    });
  };

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.initiative.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = filterPriority === "all" || t.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

  const sprintTasks = filteredTasks.filter((t) => t.column === "sprint" || t.column === "in-progress");
  const doneTasks = filteredTasks.filter((t) => t.column === "done");

  const handleAddTask = () => {
    if (!form.title.trim()) return;
    addTask({ ...form, description: "" });
    setForm(defaultForm);
    setShowAddModal(false);
  };

  return (
    <AppLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Execution Board</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Sprint 7 · {sprintTasks.length} active · {doneTasks.length} completed
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-secondary border border-border rounded-xl pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary w-56"
              />
            </div>

            {/* Filter */}
            <div className="relative">
              <button
                onClick={() => setShowFilterMenu((v) => !v)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-xl bg-secondary text-secondary-foreground text-sm hover:bg-muted transition-colors",
                  filterPriority !== "all" && "ring-1 ring-primary text-primary"
                )}
              >
                <Filter className="w-4 h-4" />
                {filterPriority === "all" ? "Filter" : filterPriority}
                <ChevronDown className="w-3 h-3" />
              </button>
              {showFilterMenu && (
                <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-xl shadow-lg z-20 py-1 min-w-[160px]">
                  <button
                    onClick={() => { setFilterPriority("all"); setShowFilterMenu(false); }}
                    className={cn("w-full text-left px-4 py-2.5 text-sm hover:bg-secondary transition-colors", filterPriority === "all" && "text-primary")}
                  >
                    All priorities
                  </button>
                  {priorities.map((p) => (
                    <button
                      key={p}
                      onClick={() => { setFilterPriority(p); setShowFilterMenu(false); }}
                      className={cn("w-full text-left px-4 py-2.5 text-sm capitalize hover:bg-secondary transition-colors", filterPriority === p && "text-primary")}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl grim-gradient text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4" />
              Add Task
            </button>
          </div>
        </div>

        {/* Board */}
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {columns.map((col) => (
              <KanbanColumn
                key={col}
                columnId={col}
                tasks={filteredTasks.filter((t) => t.column === col)}
                onDelete={deleteTask}
                onEdit={openEdit}
              />
            ))}
          </div>
        </DragDropContext>
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-2xl p-7 w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">New Task</h2>
              <button onClick={() => setShowAddModal(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Task title</label>
                <input
                  autoFocus
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="What needs to be done?"
                  className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Priority</label>
                  <select
                    value={form.priority}
                    onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value as TaskPriority }))}
                    className="w-full bg-secondary border border-border rounded-xl px-3 py-3 text-base text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    {priorities.map((p) => (
                      <option key={p} value={p} className="capitalize">{p}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Column</label>
                  <select
                    value={form.column}
                    onChange={(e) => setForm((f) => ({ ...f, column: e.target.value as KanbanColumnType }))}
                    className="w-full bg-secondary border border-border rounded-xl px-3 py-3 text-base text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    {columns.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Estimate</label>
                <input
                  type="text"
                  value={form.estimate}
                  onChange={(e) => setForm((f) => ({ ...f, estimate: e.target.value }))}
                  placeholder="e.g. 1 hour"
                  className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Add to Daily Execution
                  <span className="ml-1 text-xs opacity-60">(optional)</span>
                </label>
                <select
                  value={form.plannerSlot}
                  onChange={(e) => setForm((f) => ({ ...f, plannerSlot: e.target.value }))}
                  className="w-full bg-secondary border border-border rounded-xl px-3 py-3 text-base text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="">— Don't add to planner —</option>
                  {plannerSlots.map((slot) => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-7">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-3 rounded-xl bg-secondary text-secondary-foreground text-base hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTask}
                disabled={!form.title.trim()}
                className="flex-1 px-4 py-3 rounded-xl grim-gradient text-primary-foreground text-base font-medium hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {editTask && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setEditTask(null)}
        >
          <div
            className="bg-card border border-border rounded-2xl p-7 w-full max-w-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Edit Task</h2>
              <button onClick={() => setEditTask(null)} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Task title</label>
                <input
                  autoFocus
                  type="text"
                  value={editForm.title ?? ""}
                  onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))}
                  className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Description <span className="opacity-60 text-xs">(optional)</span></label>
                <textarea
                  value={editForm.description ?? ""}
                  onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                  rows={2}
                  placeholder="Add more detail..."
                  className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Priority</label>
                  <select
                    value={editForm.priority ?? "medium"}
                    onChange={(e) => setEditForm((f) => ({ ...f, priority: e.target.value as TaskPriority }))}
                    className="w-full bg-secondary border border-border rounded-xl px-3 py-3 text-base text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    {priorities.map((p) => (
                      <option key={p} value={p} className="capitalize">{p}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Column</label>
                  <select
                    value={editForm.column ?? "backlog"}
                    onChange={(e) => setEditForm((f) => ({ ...f, column: e.target.value as KanbanColumnType }))}
                    className="w-full bg-secondary border border-border rounded-xl px-3 py-3 text-base text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    {columns.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Estimate</label>
                  <input
                    type="text"
                    value={editForm.estimate ?? ""}
                    onChange={(e) => setEditForm((f) => ({ ...f, estimate: e.target.value }))}
                    placeholder="e.g. 1 hour"
                    className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Initiative</label>
                  <select
                    value={editForm.initiative ?? "General"}
                    onChange={(e) => setEditForm((f) => ({ ...f, initiative: e.target.value as TaskInitiative }))}
                    className="w-full bg-secondary border border-border rounded-xl px-3 py-3 text-base text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    {initiatives.map((i) => (
                      <option key={i} value={i}>{i}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-7">
              <button
                onClick={() => setEditTask(null)}
                className="flex-1 px-4 py-3 rounded-xl bg-secondary text-secondary-foreground text-base hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={!editForm.title?.trim()}
                className="flex-1 px-4 py-3 rounded-xl grim-gradient text-primary-foreground text-base font-medium hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}

