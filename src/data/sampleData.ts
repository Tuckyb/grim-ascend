export type TaskPriority = "critical" | "high" | "medium" | "low";
export type TaskCategory = "professional" | "private";
export type TaskInitiative =
  | "Member Automations"
  | "Retain Customers"
  | "THE GRIM Podcast"
  | "Campaign Writing"
  | "GRIM Week"
  | "Affiliate Setup"
  | "New Features"
  | "Videos"
  | "Bug Fixes"
  | "General";

export type KanbanColumn = "backlog" | "sprint" | "in-progress" | "review" | "done";

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  category: TaskCategory;
  initiative: TaskInitiative;
  estimate: string;
  column: KanbanColumn;
  dueDate?: string;
  tags?: string[];
}

export interface DailyBlock {
  time: string;
  activity: string;
  type: "deep-work" | "meeting" | "break" | "admin" | "personal";
}

export interface Goal {
  id: string;
  title: string;
  horizon: "yearly" | "monthly" | "weekly";
  category: TaskCategory;
  progress: number;
}

export const initialTasks: Task[] = [
  // Backlog
  { id: "t1", title: "Set up automated onboarding email sequence", priority: "high", category: "professional", initiative: "Member Automations", estimate: "60 min", column: "backlog", tags: ["automation", "email"] },
  { id: "t2", title: "Fix login redirect bug on mobile", priority: "critical", category: "professional", initiative: "Bug Fixes", estimate: "30 min", column: "backlog", tags: ["bug", "mobile"] },
  { id: "t3", title: "Write campaign copy for Q1 launch", priority: "high", category: "professional", initiative: "Campaign Writing", estimate: "60 min", column: "backlog", tags: ["copy", "marketing"] },
  { id: "t4", title: "Record podcast episode #12", priority: "medium", category: "professional", initiative: "THE GRIM Podcast", estimate: "60 min", column: "backlog", tags: ["content", "podcast"] },
  { id: "t5", title: "Design affiliate landing page", priority: "medium", category: "professional", initiative: "Affiliate Setup", estimate: "60 min", column: "backlog", tags: ["design", "affiliate"] },
  { id: "t6", title: "Implement customer retention dashboard", priority: "high", category: "professional", initiative: "Retain Customers", estimate: "60 min", column: "backlog", tags: ["dashboard", "retention"] },
  { id: "t7", title: "Create GRIM Week promo video script", priority: "medium", category: "professional", initiative: "GRIM Week", estimate: "45 min", column: "backlog", tags: ["video", "event"] },
  { id: "t8", title: "Set up churn prediction alerts", priority: "high", category: "professional", initiative: "Retain Customers", estimate: "60 min", column: "backlog", tags: ["analytics", "retention"] },
  { id: "t9", title: "Build member activity tracking", priority: "medium", category: "professional", initiative: "New Features", estimate: "60 min", column: "backlog", tags: ["feature", "tracking"] },
  { id: "t10", title: "Edit and publish tutorial video", priority: "low", category: "professional", initiative: "Videos", estimate: "60 min", column: "backlog", tags: ["video", "content"] },

  // Sprint
  { id: "t11", title: "Automate welcome message flow", priority: "high", category: "professional", initiative: "Member Automations", estimate: "45 min", column: "sprint", tags: ["automation"] },
  { id: "t12", title: "Fix payment processing edge case", priority: "critical", category: "professional", initiative: "Bug Fixes", estimate: "30 min", column: "sprint", tags: ["bug", "payments"] },
  { id: "t13", title: "Draft newsletter for this week", priority: "medium", category: "professional", initiative: "Campaign Writing", estimate: "30 min", column: "sprint", tags: ["content"] },
  { id: "t14", title: "Plan GRIM Week speaker lineup", priority: "high", category: "professional", initiative: "GRIM Week", estimate: "60 min", column: "sprint", tags: ["event", "planning"] },

  // In Progress
  { id: "t15", title: "Build customer health score API", priority: "high", category: "professional", initiative: "Retain Customers", estimate: "60 min", column: "in-progress", tags: ["api", "retention"] },
  { id: "t16", title: "Record podcast intro segment", priority: "medium", category: "professional", initiative: "THE GRIM Podcast", estimate: "30 min", column: "in-progress", tags: ["podcast"] },

  // Review
  { id: "t17", title: "Review affiliate agreement terms", priority: "medium", category: "professional", initiative: "Affiliate Setup", estimate: "30 min", column: "review", tags: ["legal", "affiliate"] },

  // Done
  { id: "t18", title: "Set up CI/CD pipeline", priority: "high", category: "professional", initiative: "General", estimate: "60 min", column: "done", tags: ["devops"] },
  { id: "t19", title: "Launch member survey", priority: "medium", category: "professional", initiative: "Retain Customers", estimate: "30 min", column: "done", tags: ["survey"] },
];

export const dailySchedule: Record<string, DailyBlock[]> = {
  Mon: [
    { time: "08:00", activity: "Plan Day", type: "admin" },
    { time: "09:00", activity: "Deep Work", type: "deep-work" },
    { time: "10:00", activity: "Deep Work", type: "deep-work" },
    { time: "11:00", activity: "Deep Work", type: "deep-work" },
    { time: "12:00", activity: "Eat", type: "break" },
    { time: "13:00", activity: "To Do List", type: "admin" },
    { time: "14:00", activity: "Meetings", type: "meeting" },
    { time: "15:00", activity: "Workout", type: "personal" },
    { time: "16:00", activity: "Eat", type: "break" },
    { time: "17:00", activity: "Messenger", type: "admin" },
  ],
  Tue: [
    { time: "08:00", activity: "Plan Day", type: "admin" },
    { time: "09:00", activity: "Deep Work", type: "deep-work" },
    { time: "10:00", activity: "Deep Work", type: "deep-work" },
    { time: "11:00", activity: "Deep Work", type: "deep-work" },
    { time: "12:00", activity: "Eat", type: "break" },
    { time: "13:00", activity: "To Do List", type: "admin" },
    { time: "14:00", activity: "Meetings", type: "meeting" },
    { time: "15:00", activity: "Workout", type: "personal" },
    { time: "16:00", activity: "Eat", type: "break" },
    { time: "17:00", activity: "Messenger", type: "admin" },
  ],
  Wed: [
    { time: "08:00", activity: "Plan Day", type: "admin" },
    { time: "09:00", activity: "Deep Work", type: "deep-work" },
    { time: "10:00", activity: "Deep Work", type: "deep-work" },
    { time: "11:00", activity: "Deep Work", type: "deep-work" },
    { time: "12:00", activity: "Eat", type: "break" },
    { time: "13:00", activity: "To Do List", type: "admin" },
    { time: "14:00", activity: "Meetings", type: "meeting" },
    { time: "15:00", activity: "Workout", type: "personal" },
    { time: "16:00", activity: "Eat", type: "break" },
    { time: "17:00", activity: "Messenger", type: "admin" },
  ],
  Thu: [
    { time: "08:00", activity: "Plan Day", type: "admin" },
    { time: "09:00", activity: "Deep Work", type: "deep-work" },
    { time: "10:00", activity: "Deep Work", type: "deep-work" },
    { time: "11:00", activity: "Deep Work", type: "deep-work" },
    { time: "12:00", activity: "Eat", type: "break" },
    { time: "13:00", activity: "To Do List", type: "admin" },
    { time: "14:00", activity: "Meetings", type: "meeting" },
    { time: "15:00", activity: "Workout", type: "personal" },
    { time: "16:00", activity: "Eat", type: "break" },
    { time: "17:00", activity: "Messenger", type: "admin" },
  ],
  Fri: [
    { time: "08:00", activity: "Plan Day", type: "admin" },
    { time: "09:00", activity: "Deep Work", type: "deep-work" },
    { time: "10:00", activity: "Deep Work", type: "deep-work" },
    { time: "11:00", activity: "Deep Work", type: "deep-work" },
    { time: "12:00", activity: "Eat", type: "break" },
    { time: "13:00", activity: "To Do List", type: "admin" },
    { time: "14:00", activity: "Meetings", type: "meeting" },
    { time: "15:00", activity: "Workout", type: "personal" },
    { time: "16:00", activity: "Eat", type: "break" },
    { time: "17:00", activity: "Messenger", type: "admin" },
  ],
};

export const goals: Goal[] = [
  { id: "g1", title: "Scale Member Automations to 1000 users", horizon: "yearly", category: "professional", progress: 35 },
  { id: "g2", title: "Launch THE GRIM Podcast (50 episodes)", horizon: "yearly", category: "professional", progress: 24 },
  { id: "g3", title: "Achieve < 5% monthly churn rate", horizon: "yearly", category: "professional", progress: 60 },
  { id: "g4", title: "Complete GRIM Week event", horizon: "yearly", category: "professional", progress: 15 },
  { id: "g5", title: "Establish daily deep work habit", horizon: "yearly", category: "private", progress: 72 },
  { id: "g6", title: "Close 3 new affiliate partnerships", horizon: "monthly", category: "professional", progress: 33 },
  { id: "g7", title: "Ship customer health score feature", horizon: "monthly", category: "professional", progress: 55 },
  { id: "g8", title: "Record 4 podcast episodes", horizon: "monthly", category: "professional", progress: 25 },
  { id: "g9", title: "Complete sprint backlog (12 tasks)", horizon: "weekly", category: "professional", progress: 42 },
  { id: "g10", title: "5 deep work sessions", horizon: "weekly", category: "private", progress: 60 },
  { id: "g11", title: "Morning & evening habit streak", horizon: "weekly", category: "private", progress: 85 },
];

export const columnConfig: Record<KanbanColumn, { title: string; color: string }> = {
  backlog: { title: "Backlog", color: "var(--muted-foreground)" },
  sprint: { title: "Sprint", color: "hsl(var(--grim-gold))" },
  "in-progress": { title: "In Progress", color: "hsl(var(--grim-emerald))" },
  review: { title: "Review", color: "hsl(210, 80%, 60%)" },
  done: { title: "Done", color: "hsl(var(--grim-emerald-dim))" },
};
