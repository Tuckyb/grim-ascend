import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { dailySchedule, DailyBlock } from "@/data/sampleData";
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";
import { Clock, Zap, Users, Coffee, Briefcase, Heart, Check } from "lucide-react";

// Re-use color config
const typeConfig: Record<DailyBlock["type"], { icon: typeof Zap; blockClass: string; label: string }> = {
    "deep-work": { icon: Zap, blockClass: "time-block-deep-work", label: "Deep Work" },
    meeting: { icon: Users, blockClass: "time-block-meeting", label: "Meeting" },
    break: { icon: Coffee, blockClass: "time-block-break", label: "Break" },
    admin: { icon: Briefcase, blockClass: "time-block-admin", label: "Admin" },
    personal: { icon: Heart, blockClass: "time-block-personal", label: "Personal" },
};

const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];

function WeeklyBlock({
    block,
    assignments,
    blockKey,
    taskTitle,
}: {
    block: DailyBlock;
    assignments: Record<string, string>;
    blockKey: string;
    taskTitle?: string;
}) {
    const config = typeConfig[block.type];
    const Icon = config.icon;
    const isAssigned = !!assignments[blockKey];

    return (
        <div className={cn(
            "p-3 rounded-lg border flex flex-col justify-between min-h-[80px]",
            config.blockClass
        )}>
            <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-bold opacity-80">{block.time}</span>
                <Icon className="w-3 h-3 opacity-60" />
            </div>
            <div>
                <p className="text-xs font-bold leading-tight line-clamp-2">
                    {taskTitle || block.activity}
                </p>
                {!taskTitle && (
                    <p className="text-[10px] uppercase opacity-60 mt-0.5">{config.label}</p>
                )}
            </div>
        </div>
    );
}

export default function WeeklyPlanPage() {
    const { tasks } = useApp();
    // For weekly view, we might not assign ID directly, but let's assume shared assignments for now?
    // Or just view the template. User said "Add a weekly plan that resembles more what the daily planner is at the moment".
    // This implies the grid layout showing the structure for the week.

    // Since we don't have per-day unique persistence for weekly (it's a template effectively in this mock), 
    // I'll render the template grid. 

    return (
        <AppLayout>
            <div className="p-8 h-screen overflow-hidden flex flex-col">
                <div className="mb-8 flex-shrink-0">
                    <h1 className="text-6xl font-black text-foreground mb-2 uppercase tracking-tight">Weekly Framework</h1>
                    <p className="text-xl text-muted-foreground font-medium">
                        3 Phases. Prepare the Week. Master the Schedule.
                    </p>
                </div>

                <div className="flex-1 overflow-y-auto pb-10 pr-2 scrollbar-thin">
                    <div className="grid grid-cols-5 gap-4 h-full">
                        {days.map((day) => (
                            <div key={day} className="flex flex-col gap-3">
                                <h2 className="text-2xl font-bold text-center py-2 border-b border-border/50 uppercase tracking-widest text-muted-foreground">
                                    {day}
                                </h2>
                                <div className="space-y-2">
                                    {(dailySchedule[day] || []).map((block, i) => (
                                        <WeeklyBlock
                                            key={i}
                                            block={block}
                                            assignments={{}} // No interactive assignment here for now, just view
                                            blockKey={`${day}-${i}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
