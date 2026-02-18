import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
    initialTasks,
    goals as initialGoals,
    Task,
    Goal,
    KanbanColumn,
    TaskPriority,
    TaskCategory,
    TaskInitiative,
} from "@/data/sampleData";

interface AppContextType {
    tasks: Task[];
    goals: Goal[];
    addTask: (task: Omit<Task, "id">) => void;
    deleteTask: (id: string) => void;
    moveTask: (id: string, column: KanbanColumn) => void;
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
    addGoal: (goal: Omit<Goal, "id">) => void;
    deleteGoal: (id: string) => void;
    updateGoalProgress: (id: string, progress: number) => void;
    loading: boolean;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [goals, setGoals] = useState<Goal[]>([]);
    const [userId, setUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Get user ID
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUserId(session?.user?.id ?? null);
        });
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUserId(session?.user?.id ?? null);
        });
        return () => subscription.unsubscribe();
    }, []);

    // Load data when user is available
    useEffect(() => {
        if (!userId) {
            setTasks([]);
            setGoals([]);
            setLoading(false);
            return;
        }

        const loadData = async () => {
            setLoading(true);
            const [tasksRes, goalsRes] = await Promise.all([
                supabase.from("tasks").select("*").eq("user_id", userId),
                supabase.from("goals").select("*").eq("user_id", userId),
            ]);

            if (tasksRes.data) {
                setTasks(tasksRes.data.map((t: any) => ({
                    id: t.id,
                    title: t.title,
                    description: t.description || undefined,
                    priority: t.priority as TaskPriority,
                    category: t.category as TaskCategory,
                    initiative: t.initiative as TaskInitiative,
                    estimate: t.estimate,
                    column: t.column_name as KanbanColumn,
                    dueDate: t.due_date || undefined,
                    tags: t.tags || undefined,
                })));
            }

            if (goalsRes.data) {
                setGoals(goalsRes.data.map((g: any) => ({
                    id: g.id,
                    title: g.title,
                    horizon: g.horizon as Goal["horizon"],
                    category: g.category as TaskCategory,
                    progress: g.progress,
                    reason: g.reason || undefined,
                })));
            }

            setLoading(false);
        };

        loadData();
    }, [userId]);

    const addTask = useCallback(async (task: Omit<Task, "id">) => {
        if (!userId) return;
        const { data, error } = await supabase.from("tasks").insert({
            user_id: userId,
            title: task.title,
            description: task.description || null,
            priority: task.priority,
            category: task.category,
            initiative: task.initiative,
            estimate: task.estimate,
            column_name: task.column,
            due_date: task.dueDate || null,
            tags: task.tags || null,
        }).select().single();

        if (data && !error) {
            setTasks((prev) => [...prev, {
                id: data.id,
                title: data.title,
                description: data.description || undefined,
                priority: data.priority as TaskPriority,
                category: data.category as TaskCategory,
                initiative: data.initiative as TaskInitiative,
                estimate: data.estimate,
                column: data.column_name as KanbanColumn,
                dueDate: data.due_date || undefined,
                tags: data.tags || undefined,
            }]);
        }
    }, [userId]);

    const deleteTask = useCallback(async (id: string) => {
        setTasks((prev) => prev.filter((t) => t.id !== id));
        await supabase.from("tasks").delete().eq("id", id);
    }, []);

    const moveTask = useCallback(async (id: string, column: KanbanColumn) => {
        setTasks((prev) =>
            prev.map((t) => (t.id === id ? { ...t, column } : t))
        );
        await supabase.from("tasks").update({ column_name: column }).eq("id", id);
    }, []);

    const addGoal = useCallback(async (goal: Omit<Goal, "id">) => {
        if (!userId) return;
        const { data, error } = await supabase.from("goals").insert({
            user_id: userId,
            title: goal.title,
            horizon: goal.horizon,
            category: goal.category,
            progress: goal.progress,
            reason: goal.reason || null,
        }).select().single();

        if (data && !error) {
            setGoals((prev) => [...prev, {
                id: data.id,
                title: data.title,
                horizon: data.horizon as Goal["horizon"],
                category: data.category as TaskCategory,
                progress: data.progress,
                reason: data.reason || undefined,
            }]);
        }
    }, [userId]);

    const deleteGoal = useCallback(async (id: string) => {
        setGoals((prev) => prev.filter((g) => g.id !== id));
        await supabase.from("goals").delete().eq("id", id);
    }, []);

    const updateGoalProgress = useCallback(async (id: string, progress: number) => {
        setGoals((prev) =>
            prev.map((g) => (g.id === id ? { ...g, progress } : g))
        );
        await supabase.from("goals").update({ progress }).eq("id", id);
    }, []);

    return (
        <AppContext.Provider
            value={{
                tasks,
                goals,
                addTask,
                deleteTask,
                moveTask,
                setTasks,
                addGoal,
                deleteGoal,
                updateGoalProgress,
                loading,
            }}
        >
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error("useApp must be used within AppProvider");
    return ctx;
}
