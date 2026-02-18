import React, { createContext, useContext, useState, useCallback } from "react";
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
}

const AppContext = createContext<AppContextType | null>(null);

let taskCounter = Math.max(...initialTasks.map(t => parseInt(t.id.replace('t', '')) || 0)) + 1;
let goalCounter = Math.max(...initialGoals.map(g => parseInt(g.id.replace('g', '')) || 0)) + 1;

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [tasks, setTasks] = useState<Task[]>(initialTasks);
    const [goals, setGoals] = useState<Goal[]>(initialGoals);

    const addTask = useCallback((task: Omit<Task, "id">) => {
        const id = `t${taskCounter++}`;
        setTasks((prev) => [...prev, { ...task, id }]);
    }, []);

    const deleteTask = useCallback((id: string) => {
        setTasks((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const moveTask = useCallback((id: string, column: KanbanColumn) => {
        setTasks((prev) =>
            prev.map((t) => (t.id === id ? { ...t, column } : t))
        );
    }, []);

    const addGoal = useCallback((goal: Omit<Goal, "id">) => {
        const id = `g${goalCounter++}`;
        setGoals((prev) => [...prev, { ...goal, id }]);
    }, []);

    const deleteGoal = useCallback((id: string) => {
        setGoals((prev) => prev.filter((g) => g.id !== id));
    }, []);

    const updateGoalProgress = useCallback((id: string, progress: number) => {
        setGoals((prev) =>
            prev.map((g) => (g.id === id ? { ...g, progress } : g))
        );
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
