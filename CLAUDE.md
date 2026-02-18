# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

**GRIM Ascend** — a personal productivity dashboard for "THE GRIM" brand. It's a Vite + React + TypeScript SPA (not Next.js) with a dark, minimalist aesthetic.

## Commands

```bash
npm run dev          # Start Vite dev server
npm run build        # Production build
npm run lint         # ESLint
npm run test         # Run Vitest tests (single pass)
npm run test:watch   # Watch mode tests
```

No typecheck script exists — TypeScript errors surface during build or via IDE.

## Architecture

**State management**: Single React Context (`AppContext`) wraps the entire app. All tasks and goals live here. Pages read/write via the `useApp()` hook. State is in-memory only — no persistence, no backend.

**Routing**: `react-router-dom` v6 with `BrowserRouter`. Routes defined in [src/App.tsx](src/App.tsx):
- `/` → Dashboard
- `/board` → Kanban board
- `/daily` → Daily planner
- `/weekly` → Weekly planner
- `/goals` → Goals tracker
- `/chat` → Chat page

**Layout**: Every page wraps its content in `<AppLayout>`, which renders `<AppSidebar>` (fixed 224px left) + a `<main>` with `ml-56`. The sidebar collapses to 64px.

**Data model** (defined in [src/data/sampleData.ts](src/data/sampleData.ts)):
- `Task` — has `id`, `title`, `priority` (critical/high/medium/low), `category` (professional/private), `initiative` (typed union), `estimate`, `column` (kanban column), optional `dueDate`/`tags`
- `Goal` — has `id`, `title`, `horizon` (yearly/monthly/weekly), `category`, `progress` (0–100)
- `KanbanColumn` — `"backlog" | "sprint" | "in-progress" | "review" | "done"`
- `TaskInitiative` — a fixed union of brand-specific strings (Member Automations, THE GRIM Podcast, etc.)

**Drag-and-drop**: Board page uses `@hello-pangea/dnd` for Kanban card dragging between columns.

## Styling System

Dark-only theme. CSS vars defined in [src/index.css](src/index.css):
- `--grim-sage` (150 28% 42%) — primary accent color, muted sage green
- `--grim-amber` (38 52% 50%) — secondary accent
- `--grim-cream` (40 20% 94%) — foreground/text

Custom utility classes: `.grim-gradient`, `.grim-gradient-text`, `.grim-card`, `.time-block-*` (for daily planner color coding).

Fonts: **Atkinson Hyperlegible** (body/headings) + **JetBrains Mono** (`font-mono`). Loaded from Google Fonts in CSS.

Standard shadcn/ui tokens (`bg-background`, `text-foreground`, etc.) are used throughout. The `--radius` is `0.875rem` (generous, Apple-like rounding).

## Key Patterns

- All pages import `AppLayout` and `useApp()` — check existing pages before building new ones
- Custom `<select>` and `<input>` elements are styled manually (dark bg, rounded-xl) rather than using shadcn form components — match this pattern when adding form fields
- Modals are built inline with `fixed inset-0 bg-black/60 backdrop-blur-sm` overlay — no shadcn Dialog used in pages yet
- `cn()` from `@/lib/utils` is used everywhere for conditional classes
