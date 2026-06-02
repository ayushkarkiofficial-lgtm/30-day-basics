# Day 12 — Complete Supabase CRUD

## Goal

Add UPDATE and DELETE to the Tasklift review queue, completing the full
Supabase CRUD cycle introduced in Day 11.

## What Changed

- `src/App.jsx` — added `handleStatusChange(id, newStatus)` and `handleDelete(id)`,
  passed both as props to `ReviewQueue`
- `src/components/ReviewQueue.jsx` — added `STATUS_OPTIONS` constant, `ActionCell`
  component, and a 5th Actions column to the table

## The Complete CRUD Picture

| Operation | Supabase call | Local state update |
|---|---|---|
| Create | `.insert({...}).select().single()` | prepend returned row |
| Read | `.select("*").order(...)` | replace entire array |
| Update | `.update({...}).eq("id", id).select().single()` | map — replace matching row |
| Delete | `.delete().eq("id", id)` | filter — remove matching row |

## Key Concepts

### `.eq("id", id)` — row targeting
Every mutating Supabase call (UPDATE, DELETE) needs a `.eq()` filter.
Without it, the call would update or delete EVERY row in the table.
`.eq("id", id)` means: "only affect the row where the `id` column equals this value."

### Why UPDATE uses `.select().single()` but DELETE does not
UPDATE returns the changed row — we ask for it with `.select()` so local state
stays in sync with the exact values the database stored.
DELETE just removes the row. There is nothing to return. We already know the `id`
to filter out of local state.

### `array.map` for update vs `array.filter` for delete
- `map` replaces: "go through every item; if this is the one, swap it; otherwise keep it"
- `filter` removes: "go through every item; keep only those where the condition is true"
These are the two standard React patterns for mutating a list without direct mutation.

### `STATUS_OPTIONS.filter((s) => s !== item.status)`
Filters the full status list down to only the statuses the item can move TO.
This prevents showing a button for the status the item already has.

## Decisions Made

- Status buttons show all options except the current one (not a fixed set of transitions)
- Delete has no confirmation dialog (added in a future session if needed)
- No optimistic updates — wait for Supabase to confirm before changing local state

## Next Session

Start Day 13. Check the Notion AI Builder plan for the next task.
