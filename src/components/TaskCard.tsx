import { Task, TaskPriority } from "@/data/sampleData";
import { Draggable } from "@hello-pangea/dnd";
import { Clock, X } from "lucide-react";
import { cn } from "@/lib/utils";

const priorityConfig: Record<TaskPriority, { dot: string; label: string; labelClass: string; cardClass: string }> = {
  critical: {
    dot: "bg-grim-crimson",
    label: "Critical",
    labelClass: "text-grim-crimson",
    cardClass: "task-card-critical",
  },
  high: {
    dot: "bg-grim-amber",
    label: "High",
    labelClass: "text-grim-amber",
    cardClass: "task-card-high",
  },
  medium: {
    dot: "bg-primary",
    label: "Medium",
    labelClass: "text-primary",
    cardClass: "task-card-medium",
  },
  low: {
    dot: "bg-muted-foreground",
    label: "Low",
    labelClass: "text-muted-foreground",
    cardClass: "task-card-low",
  },
};

const initiativeColors: Record<string, string> = {
  "Member Automations": "text-primary",
  "Retain Customers": "text-grim-amber",
  "THE GRIM Podcast": "text-grim-rose",
  "Campaign Writing": "text-grim-sky",
  "GRIM Week": "text-grim-rose",
  "Affiliate Setup": "text-grim-amber",
  "New Features": "text-grim-sky",
  Videos: "text-grim-rose",
  "Bug Fixes": "text-grim-crimson",
  General: "text-muted-foreground",
};

interface TaskCardProps {
  task: Task;
  index: number;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

export function TaskCard({ task, index, onDelete, onEdit }: TaskCardProps) {
  const priority = priorityConfig[task.priority];

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onDoubleClick={() => onEdit(task)}
          className={cn(
            // Priority tint + colored left rail comes from .task-card-* utility
            priority.cardClass,
            "group relative mb-3 px-5 py-4 rounded-xl border border-border/70",
            "cursor-grab active:cursor-grabbing transition-all duration-150",
            "hover:border-border",
            snapshot.isDragging && "shadow-lg rotate-1 opacity-90 border-primary/40"
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
          <div className="flex items-center gap-2 mb-3 pr-6">
            <span className={cn("w-2 h-2 rounded-full flex-shrink-0", priority.dot)} />
            <span className={cn("text-xs font-bold uppercase tracking-wider", priority.labelClass)}>
              {priority.label}
            </span>
            <span className="ml-auto flex items-center gap-1 text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              <span className="text-xs font-mono">{task.estimate}</span>
            </span>
          </div>

          {/* Title */}
          <h4 className="text-base font-bold text-foreground leading-snug mb-2.5">
            {task.title}
          </h4>

          {/* Initiative */}
          <p className={cn("text-xs font-medium", initiativeColors[task.initiative] || "text-muted-foreground")}>
            {task.initiative}
          </p>

          {/* Double-click hint */}
          <span className="absolute bottom-2 right-3 text-[10px] text-muted-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity select-none">
            double-click to edit
          </span>
        </div>
      )}
    </Draggable>
  );
}
