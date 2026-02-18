import { Task, KanbanColumn as KanbanColumnType, columnConfig } from "@/data/sampleData";
import { Droppable } from "@hello-pangea/dnd";
import { TaskCard } from "./TaskCard";
import { cn } from "@/lib/utils";

interface KanbanColumnProps {
  columnId: KanbanColumnType;
  tasks: Task[];
}

export function KanbanColumn({ columnId, tasks }: KanbanColumnProps) {
  const config = columnConfig[columnId];

  return (
    <div className="flex-1 min-w-[260px] max-w-[320px]">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: config.color }}
          />
          <h3 className="text-sm font-semibold text-foreground">
            {config.title}
          </h3>
          <span className="text-xs font-mono text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">
            {tasks.length}
          </span>
        </div>
      </div>

      {/* Droppable Area */}
      <Droppable droppableId={columnId}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(
              "min-h-[200px] p-2 rounded-lg transition-colors scrollbar-thin overflow-y-auto max-h-[calc(100vh-200px)]",
              snapshot.isDraggingOver
                ? "bg-primary/5 border border-primary/20"
                : "bg-secondary/30 border border-transparent"
            )}
          >
            {tasks.map((task, index) => (
              <TaskCard key={task.id} task={task} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
