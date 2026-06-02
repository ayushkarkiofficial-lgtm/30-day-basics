# Completed Automations Showcase — Design Spec
Date: 2026-06-02
Feature: Completed Automations Display Section

## Goal

Add a "Completed" status to the review queue so finished automations graduate
out of the active queue and into a dedicated showcase section. A new summary
metric card shows the count and scrolls to the showcase on click.

## Non-Goals

- No new Supabase columns or schema changes
- No "completed_at" timestamp tracking
- No editing or deleting from the showcase (read-only display)

## Data Model

No schema change required. `status` in `First_app_data` is a free-text string.
Adding "Completed" as a valid value requires only updating `STATUS_OPTIONS`
in `ReviewQueue.jsx`.

Completed badge style: indigo (`bg-indigo-50 text-indigo-700 border-indigo-200`).

## Data Flow

App.jsx derives two lists from `queueItems`:

- `activeItems` — `queueItems.filter(item => item.status !== "Completed")`
  Passed to ReviewQueue. Queue only shows in-progress items.

- `completedItems` — `queueItems.filter(item => item.status === "Completed")`
  Passed to CompletedAutomations. Showcase only shows finished items.

`summaryMetrics` gains a 4th entry:
`[completedCount.toString(), "Automations completed", "#completed-automations"]`

## Component Changes

### DashboardSummary.jsx
- Metric tuple extended from `[value, label]` to `[value, label, href?]`
- If `href` is present, wrap the card in `<a href={href}>` with smooth scroll
- Existing three cards pass no `href` — no visual change to them

### ReviewQueue.jsx
- Add `"Completed"` to `STATUS_OPTIONS`
- Add `"Completed"` entry to `statusStyle` (indigo)
- No filtering logic here — App.jsx handles that

### New: CompletedAutomations.jsx
- Props: `items` (array of completed queue items)
- `id="completed-automations"` on the root `<section>` for anchor scroll
- Layout: 2-column card grid on desktop (`md:grid-cols-2`), 1-column on mobile
- Each card shows: process label (bold), owner (muted text), "Completed" badge
- Empty state: "No completed automations yet." when `items.length === 0`
- Rendered in App.jsx below ReviewQueue, above StackSection

### App.jsx
- Derive `activeItems` and `completedItems` from `queueItems`
- Pass `activeItems` to ReviewQueue (replaces `items={queueItems}`)
- Pass `completedItems` to CompletedAutomations
- Add `completedCount` to `summaryMetrics` useMemo
- Import and render CompletedAutomations

## Acceptance Criteria

1. Marking an item "Completed" removes it from the Review Queue immediately
2. Completed item appears in the showcase section below
3. Summary metric card shows the correct completed count
4. Clicking the metric card scrolls to the showcase section
5. Empty state shows in showcase when no items are completed
6. All three existing summary cards are visually unchanged
7. Build passes: `npm run build` exits 0
