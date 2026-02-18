import { useState } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { KanbanColumn } from "@/components/KanbanColumn";
import { initialTasks, KanbanColumn as KanbanColumnType, Task } from "@/data/sampleData";
import { AppLayout } from "@/components/AppLayout";
import { Plus, Filter, Search } from "lucide-react";

const columns: KanbanColumnType[] = ["backlog", "sprint", "in-progress", "review", "done"];

export default function BoardPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [searchQuery, setSearchQuery] = useState("");

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

      // Insert at correct position
      const destTasks = updated.filter((t) => t.column === destination.droppableId);
      const otherTasks = updated.filter((t) => t.column !== destination.droppableId);
      destTasks.splice(destination.index, 0, moved);

      return [...otherTasks, ...destTasks];
    });
  };

  const filteredTasks = tasks.filter((t) =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.initiative.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sprintTasks = filteredTasks.filter((t) => t.column === "sprint" || t.column === "in-progress");
  const doneTasks = filteredTasks.filter((t) => t.column === "done");

  return (
    <AppLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Execution Board</h1>
            <p className="text-sm text-muted-foreground font-mono mt-1">
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
                className="bg-secondary border border-border rounded-md pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary w-64"
              />
            </div>
            <button className="flex items-center gap-2 px-3 py-2 rounded-md bg-secondary text-secondary-foreground text-sm hover:bg-muted transition-colors">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-md grim-gradient text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
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
              />
            ))}
          </div>
        </DragDropContext>
      </div>
    </AppLayout>
  );
}
