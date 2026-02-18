import { Task, TaskPriority } from "@/data/sampleData";
import { Draggable } from "@hello-pangea/dnd";
import { Clock, X } from "lucide-react";
import { cn } from "@/lib/utils";

const priorityConfig: Record<TaskPriority, { dot: string; label: string; labelClass: string }> = {
  critical: { dot: "bg-destructive", label: "Critical", labelClass: "text-destructive" },
  high: { dot: "bg-amber-400", label: "High", labelClass: "text-amber-400" },
  medium: { dot: "bg-primary", label: "Medium", labelClass: "text-primary" },
  low: { dot: "bg-muted-foreground", label: "Low", labelClass: "text-muted-foreground" },
};

const initiativeColors: Record<string, string> = {
  "Member Automations": "text-primary",
  "Retain Customers": "text-amber-400",
  "THE GRIM Podcast": "text-purple-400",
  "Campaign Writing": "text-blue-400",
  "GRIM Week": "text-rose-400",
  "Affiliate Setup": "text-orange-400",
  "New Features": "text-cyan-400",
  Videos: "text-pink-400",
  "Bug Fixes": "text-destructive",
  General: "text-muted-foreground",
};

interface TaskCardProps {
  task: Task;
  index: number;
  onDelete: (id: string) => void;
}

export function TaskCard({ task, index, onDelete }: TaskCardProps) {
  const priority = priorityConfig[task.priority];

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={cn(
            // Lighter, airier card — transparent bg, just a border
            "group relative mb-2 px-4 py-3 rounded-2xl border border-border/60 bg-card/40",
            "cursor-grab active:cursor-grabbing transition-all duration-150",
            "hover:border-border hover:bg-card/70",
            snapshot.isDragging && "shadow-lg rotate-1 opacity-90 border-primary/30 bg-card"
          )}
        >
          {/* Delete button — hover reveal */}
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task.id);
            }}
            className="absolute top-2.5 right-2.5 w-5 h-5 rounded-lg bg-secondary text-muted-foreground hover:bg-destructive/20 hover:text-destructive flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-150 z-10"
            title="Delete task"
          >
            <X className="w-3 h-3" />
          </button>

          {/* Priority dot + label */}
          <div className="flex items-center gap-2 mb-2 pr-6">
            <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", priority.dot)} />
            <span className={cn("text-[11px] font-medium", priority.labelClass)}>
              {priority.label}
            </span>
            <span className="ml-auto flex items-center gap-1 text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span className="text-[11px] font-mono">{task.estimate}</span>
            </span>
          </div>

          {/* Title */}
          <h4 className="text-sm font-medium text-foreground leading-snug mb-2">
            {task.title}
          </h4>

          {/* Initiative */}
          <p className={cn("text-[11px]", initiativeColors[task.initiative] || "text-muted-foreground")}>
            {task.initiative}
          </p>
        </div>
      )}
    </Draggable>
  );
}
