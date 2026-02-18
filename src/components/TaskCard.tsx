import { Task, TaskPriority } from "@/data/sampleData";
import { Draggable } from "@hello-pangea/dnd";
import { Clock, AlertTriangle, Flag, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

const priorityConfig: Record<TaskPriority, { icon: typeof AlertTriangle; className: string; label: string }> = {
  critical: { icon: AlertTriangle, className: "text-destructive", label: "Critical" },
  high: { icon: Flag, className: "text-grim-gold", label: "High" },
  medium: { icon: Flag, className: "text-primary", label: "Medium" },
  low: { icon: Minus, className: "text-muted-foreground", label: "Low" },
};

const initiativeColors: Record<string, string> = {
  "Member Automations": "bg-primary/20 text-primary",
  "Retain Customers": "bg-grim-gold/20 text-grim-gold",
  "THE GRIM Podcast": "bg-purple-500/20 text-purple-400",
  "Campaign Writing": "bg-blue-500/20 text-blue-400",
  "GRIM Week": "bg-rose-500/20 text-rose-400",
  "Affiliate Setup": "bg-orange-500/20 text-orange-400",
  "New Features": "bg-cyan-500/20 text-cyan-400",
  Videos: "bg-pink-500/20 text-pink-400",
  "Bug Fixes": "bg-destructive/20 text-destructive",
  General: "bg-muted text-muted-foreground",
};

interface TaskCardProps {
  task: Task;
  index: number;
}

export function TaskCard({ task, index }: TaskCardProps) {
  const priority = priorityConfig[task.priority];
  const PriorityIcon = priority.icon;

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={cn(
            "grim-card p-3 mb-2 cursor-grab active:cursor-grabbing animate-slide-in",
            snapshot.isDragging && "grim-glow rotate-1 opacity-90"
          )}
        >
          {/* Priority & Estimate */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <PriorityIcon className={cn("w-3 h-3", priority.className)} />
              <span className={cn("text-[10px] font-medium uppercase tracking-wider", priority.className)}>
                {priority.label}
              </span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span className="text-[10px] font-mono">{task.estimate}</span>
            </div>
          </div>

          {/* Title */}
          <h4 className="text-sm font-medium text-foreground leading-snug mb-2">
            {task.title}
          </h4>

          {/* Initiative Tag */}
          <div className="flex flex-wrap gap-1">
            <span
              className={cn(
                "text-[10px] px-2 py-0.5 rounded-full font-medium",
                initiativeColors[task.initiative] || initiativeColors.General
              )}
            >
              {task.initiative}
            </span>
            {task.tags?.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </Draggable>
  );
}
