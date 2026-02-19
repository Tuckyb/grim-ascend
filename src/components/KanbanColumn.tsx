import { Task, KanbanColumn as KanbanColumnType, columnConfig } from "@/data/sampleData";
import { Droppable } from "@hello-pangea/dnd";
import { TaskCard } from "./TaskCard";
import { cn } from "@/lib/utils";

interface KanbanColumnProps {
  columnId: KanbanColumnType;
  tasks: Task[];
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

export function KanbanColumn({ columnId, tasks, onDelete, onEdit }: KanbanColumnProps) {
  const config = columnConfig[columnId];

  return (
    <div
      className="flex-1 min-w-[260px] max-w-[320px] rounded-2xl border border-border/30 flex flex-col overflow-hidden"
      style={{ backgroundColor: config.bg }}
    >
      {/* Column Header */}
      <div className="flex items-center justify-center gap-2.5 px-4 py-4 border-b border-border/30">
        <div
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ backgroundColor: config.color }}
        />
        <h3 className="text-lg font-bold text-foreground">
          {config.title}
        </h3>
        <span
          className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full"
          style={{ backgroundColor: config.color + "22", color: config.color }}
        >
          {tasks.length}
        </span>
      </div>

      {/* Droppable Area */}
      <Droppable droppableId={columnId}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(
              "flex-1 min-h-[200px] p-3 transition-colors scrollbar-thin overflow-y-auto max-h-[calc(100vh-220px)]",
              snapshot.isDraggingOver && "bg-white/5"
            )}
          >
            {tasks.map((task, index) => (
              <TaskCard key={task.id} task={task} index={index} onDelete={onDelete} onEdit={onEdit} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
