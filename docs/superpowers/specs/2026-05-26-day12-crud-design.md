# Day 12 — Complete Supabase CRUD (Update + Delete)

**Date:** 2026-05-26  
**Status:** Approved  
**App:** `experiments/websites/tasklift-mvp-app/`

---

## Goal

Add UPDATE and DELETE operations to the Tasklift review queue, completing the full
Supabase CRUD cycle started in Day 11. After Day 12, every row in the queue can have
its status changed and can be permanently removed — both changes persisted in the
Supabase database.

---

## Architecture

`App.jsx` remains the single source of truth for `queueItems` state.
Two new async handler functions are added:

### `handleStatusChange(id, newStatus)`
1. Call `supabase.from(TABLE).update({ status: newStatus }).eq("id", id).select().single()`
   — `.select().single()` asks Supabase to return the updated row so local state stays
   in sync with the database (same pattern as Day 11's insert)
2. On success: replace the matching row in `queueItems` with the returned updated row
3. On error: `console.error` — UI stays unchanged

### `handleDelete(id)`
1. Call `supabase.from(TABLE).delete().eq("id", id)`
2. On success: filter `id` out of `queueItems`
3. On error: `console.error` — UI stays unchanged

Both handlers are passed as props to `ReviewQueue`:

```jsx
<ReviewQueue
  items={queueItems}
  onStatusChange={handleStatusChange}
  onDelete={handleDelete}
/>
```

`DashboardSummary` counters update automatically — they are computed from `queueItems`
via `useMemo`, so any state change triggers a re-render with correct counts.

---

## Components

### `App.jsx` — changes
- Add `handleStatusChange(id, newStatus)` async function
- Add `handleDelete(id)` async function
- Pass both as props to `ReviewQueue`

### `ReviewQueue.jsx` — changes
- Accept `onStatusChange` and `onDelete` as props
- Add a 5th table column header: **Actions**
- In each row, render an `ActionCell` (inline or extracted component)

### `ActionCell` (new function defined inside `ReviewQueue.jsx`, not a separate file)
Receives: `item`, `onStatusChange`, `onDelete`

Renders:
- One compact button per status that is **not** the current status:
  - `Ready to map` | `Needs examples` | `Human review required` | `Live`
  - Clicking a button calls `onStatusChange(item.id, label)`
- One red `Delete` button that calls `onDelete(item.id)`

Status buttons: `text-xs`, neutral gray outline, hover effect  
Delete button: `text-xs`, red text, no fill — destructive but not alarming

---

## Data Flow (complete picture after Day 12)

```
FETCH  (on mount)     → SELECT *         → setQueueItems(data)
INSERT (form submit)  → INSERT row       → prepend returned row to queueItems
UPDATE (status btn)   → UPDATE row       → replace row in queueItems
DELETE (delete btn)   → DELETE row       → filter row out of queueItems
```

---

## Supabase Prerequisites

Two RLS policies must exist on `public.First_app_data` for the `anon` role:

```sql
-- Allow public update
create policy "Allow public update"
on "public"."First_app_data"
as PERMISSIVE for UPDATE to anon
using (true) with check (true);

-- Allow public delete
create policy "Allow public delete"
on "public"."First_app_data"
as PERMISSIVE for DELETE to anon
using (true);
```

**Status:** Both policies added to Supabase dashboard on 2026-05-26. ✅

---

## Error Handling

- Both handlers log errors with `console.error` and return early
- Local state is only updated after Supabase confirms success
- No UI toast or error banner in Day 12 — that is a future concern
- No confirmation dialog on delete — added later when app becomes production-grade

---

## Non-Goals (Day 12)

- No edit of `label`, `owner`, or `risk` fields (status only)
- No undo / undo toast after delete
- No confirmation modal before delete
- No optimistic UI updates
- No loading spinner per row during Supabase calls
- No batch delete

---

## Manual Test Checklist

1. `npm run dev` in `experiments/websites/tasklift-mvp-app`
2. Open `http://localhost:5173`
3. Add a new process via the intake form — confirm it appears in the queue
4. Click a status button on that row — confirm the badge updates immediately
5. Refresh — confirm the updated status persists (saved to Supabase)
6. Click **Delete** on a row — confirm it disappears from the table
7. Refresh — confirm the deleted row is gone from Supabase
8. Check dashboard counters update immediately after both actions
9. Open Supabase Table Editor — confirm row reflects changes

---

## Files Changed

| File | Change |
|---|---|
| `src/App.jsx` | Add `handleStatusChange`, `handleDelete`, pass as props to ReviewQueue |
| `src/components/ReviewQueue.jsx` | Add Actions column, `ActionCell` component, accept new props |
| `notes/ai-dev-log.md` | Add Day 12 log entry |
| `notes/day-12-crud.md` | Add Day 12 learning note |
