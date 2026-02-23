

## Fix: Daily Planner Focus Assignments Not Persisting Across Tab Switches

### Problem
When you assign a focus task to a time block and switch to another page (like Board), coming back to the Daily Planner shows empty blocks. The assignment IDs are stored in global context, but the task lookup fails because the tasks array may briefly clear during auth state changes.

### Solution

**1. Prevent tasks from clearing during auth token refresh (`src/context/AppContext.tsx`)**
- Update the auth state change handler to ignore `TOKEN_REFRESHED` and `SIGNED_IN` events that don't actually change the user -- only clear tasks when the user truly signs out
- Add a guard so the data-loading effect doesn't reset `tasks` to `[]` before reloading if the userId hasn't actually changed

**2. Show assignment titles even if tasks haven't fully loaded (`src/pages/DailyPlanPage.tsx`)**
- When resolving assigned task IDs, fall back to showing the stored task ID reference (or a "Loading..." placeholder) instead of silently dropping unresolved IDs via `.filter(Boolean)`
- This ensures the UI always reflects that something is assigned, even during brief loading states

### Technical Details

In `AppContext.tsx`:
- Track previous userId with a ref to avoid unnecessary reloads
- Only clear tasks/goals on explicit sign-out (when userId goes from a value to null), not on every auth event

In `DailyPlanPage.tsx`:
- Keep the `.filter(Boolean)` but also check `assignedTaskIds.length > 0` independently to show assigned state even when task objects aren't resolved yet

These are small, targeted changes -- no new database tables or migrations needed.
