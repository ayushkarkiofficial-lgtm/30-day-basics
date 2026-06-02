# Completed Automations Showcase — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "Completed" status that graduates items out of the Review Queue into a card-grid showcase section, with a clickable summary metric linking to it.

**Architecture:** Four files change. ReviewQueue.jsx gains the new status value. DashboardSummary.jsx learns to render a card as a link when given an href. A new CompletedAutomations.jsx renders the card grid. App.jsx derives two filtered lists from queueItems, adds the completed metric, and renders the new section.

**Tech Stack:** React 18, Vite 6, Tailwind CSS 3, Supabase JS v2. No test suite — verification is `npm run build` (syntax check) + manual browser test.

**Spec:** `docs/superpowers/specs/2026-06-02-completed-automations-design.md`

**All commands run from:** `experiments/websites/tasklift-mvp-app/`

---

### Task 1: Add "Completed" status to ReviewQueue.jsx

**Files:**
- Modify: `experiments/websites/tasklift-mvp-app/src/components/ReviewQueue.jsx`

- [ ] **Step 1: Add "Completed" to statusStyle**

In `ReviewQueue.jsx`, find `statusStyle` and add the indigo entry:

```js
const statusStyle = {
  "Ready to map": "bg-blue-50 text-blue-700 border-blue-200",
  "Needs examples": "bg-amber-50 text-amber-700 border-amber-200",
  "Human review required": "bg-red-50 text-red-700 border-red-200",
  Live: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Completed: "bg-indigo-50 text-indigo-700 border-indigo-200",
};
```

- [ ] **Step 2: Add "Completed" to STATUS_OPTIONS**

Find `STATUS_OPTIONS` and add the new value at the end:

```js
const STATUS_OPTIONS = [
  "Ready to map",
  "Needs examples",
  "Human review required",
  "Live",
  "Completed",
];
```

- [ ] **Step 3: Run the build to verify no syntax errors**

```bash
npm run build
```

Expected: build exits with `✓ built in` — no errors.

- [ ] **Step 4: Commit (user runs this)**

```bash
git add experiments/websites/tasklift-mvp-app/src/components/ReviewQueue.jsx
git commit -m "feat: add Completed status to ReviewQueue"
```

---

### Task 2: Update DashboardSummary.jsx to support clickable metric cards

**Files:**
- Modify: `experiments/websites/tasklift-mvp-app/src/components/DashboardSummary.jsx`

Why this changes: the metrics tuple is currently `[value, label]`. We extend it to optionally `[value, label, href]`. If `href` is present the card renders as an `<a>` tag so clicking it scrolls to the showcase section. We also update the grid from `md:grid-cols-3` to `grid-cols-2 lg:grid-cols-4` to accommodate the 4th card cleanly.

- [ ] **Step 1: Replace DashboardSummary.jsx with the updated version**

```jsx
function DashboardSummary({ metrics }) {
  return (
    <section id="dashboard" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {metrics.map(([value, label, href]) => {
        const inner = (
          <>
            <p className="text-3xl font-extrabold text-accent">{value}</p>
            <h2 className="mt-2 text-sm font-extrabold uppercase text-muted">{label}</h2>
          </>
        );

        return href ? (
          <a
            key={label}
            href={href}
            className="block rounded-lg border border-line bg-white p-5 shadow-panel transition-colors hover:border-accent"
          >
            {inner}
          </a>
        ) : (
          <article
            key={label}
            className="rounded-lg border border-line bg-white p-5 shadow-panel"
          >
            {inner}
          </article>
        );
      })}
    </section>
  );
}

export default DashboardSummary;
```

- [ ] **Step 2: Run the build**

```bash
npm run build
```

Expected: `✓ built in` — no errors.

- [ ] **Step 3: Commit (user runs this)**

```bash
git add experiments/websites/tasklift-mvp-app/src/components/DashboardSummary.jsx
git commit -m "feat: support optional href on DashboardSummary metric cards"
```

---

### Task 3: Create CompletedAutomations.jsx

**Files:**
- Create: `experiments/websites/tasklift-mvp-app/src/components/CompletedAutomations.jsx`

- [ ] **Step 1: Create the new component file**

```jsx
// CompletedAutomations.jsx
// Renders completed items as a card grid, separate from the review queue.
// Receives only completed items — filtering happens in App.jsx.
function CompletedAutomations({ items }) {
  return (
    <section
      id="completed-automations"
      className="rounded-lg border border-line bg-white p-6 shadow-panel"
    >
      <p className="text-sm font-extrabold uppercase text-accent">Showcase</p>
      <h2 className="mt-2 text-2xl font-extrabold">Completed automations</h2>

      {items.length === 0 ? (
        <p className="mt-5 text-sm text-muted">No completed automations yet.</p>
      ) : (
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {items.map((item) => (
            <article
              key={item.id}
              className="rounded-lg border border-indigo-100 bg-indigo-50 p-4"
            >
              <p className="font-extrabold text-ink">{item.label}</p>
              <p className="mt-1 text-sm text-muted">{item.owner}</p>
              <span className="mt-3 inline-block rounded-md border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-xs font-bold text-indigo-700">
                Completed
              </span>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default CompletedAutomations;
```

- [ ] **Step 2: Run the build**

```bash
npm run build
```

Expected: `✓ built in` — no errors.

- [ ] **Step 3: Commit (user runs this)**

```bash
git add experiments/websites/tasklift-mvp-app/src/components/CompletedAutomations.jsx
git commit -m "feat: add CompletedAutomations showcase component"
```

---

### Task 4: Wire everything together in App.jsx

**Files:**
- Modify: `experiments/websites/tasklift-mvp-app/src/App.jsx`

This is the integration task. Four changes:
1. Import CompletedAutomations
2. Derive `activeItems` and `completedItems` from `queueItems`
3. Add `completedCount` to the `summaryMetrics` useMemo (with href)
4. Pass `activeItems` to ReviewQueue, render `<CompletedAutomations>` below it

- [ ] **Step 1: Add the import at the top of App.jsx**

After the existing imports, add:

```js
import CompletedAutomations from "./components/CompletedAutomations.jsx";
```

- [ ] **Step 2: Derive filtered lists after the state declarations**

Add these two lines after `const [isLoading, setIsLoading] = useState(true);`:

```js
const activeItems = queueItems.filter((item) => item.status !== "Completed");
const completedItems = queueItems.filter((item) => item.status === "Completed");
```

These re-derive automatically whenever `queueItems` changes — no `useMemo` needed because they're simple filters with no expensive computation.

- [ ] **Step 3: Add completedCount to the summaryMetrics useMemo**

Replace the existing `summaryMetrics` useMemo with:

```js
const summaryMetrics = useMemo(() => {
  const highRiskCount = queueItems.filter(
    (item) => item.risk === "High",
  ).length;
  const liveAutomationCount = queueItems.filter(
    (item) => item.status === "Live",
  ).length;
  const completedCount = queueItems.filter(
    (item) => item.status === "Completed",
  ).length;

  return [
    [queueItems.length.toString(), "Processes in review"],
    [highRiskCount.toString(), "High-risk handoff"],
    [liveAutomationCount.toString(), "Live automations"],
    [completedCount.toString(), "Automations completed", "#completed-automations"],
  ];
}, [queueItems]);
```

- [ ] **Step 4: Update the JSX — pass activeItems and render CompletedAutomations**

Find the `isLoading` ternary in the JSX and replace it with:

```jsx
{isLoading ? (
  <section className="rounded-lg border border-line bg-white p-6 shadow-panel">
    <p className="text-sm text-muted">Loading queue from database…</p>
  </section>
) : (
  <>
    <ReviewQueue
      items={activeItems}
      onStatusChange={handleStatusChange}
      onDelete={handleDelete}
    />
    <CompletedAutomations items={completedItems} />
  </>
)}
```

- [ ] **Step 5: Run the build**

```bash
npm run build
```

Expected: `✓ built in` — no errors.

- [ ] **Step 6: Manual browser verification**

With the dev server running at http://localhost:5173, verify each acceptance criterion:

1. **Metric card appears** — dashboard now shows 4 cards including "Automations completed"
2. **Click the metric card** — page scrolls down to the "Completed automations" showcase section
3. **Empty state** — showcase shows "No completed automations yet." on a fresh load
4. **Mark an item Completed** — open the Actions column on any queue row, click "Completed"
5. **Item leaves the queue** — that row disappears from the Review Queue immediately
6. **Item appears in showcase** — the item's card appears in the "Completed automations" grid
7. **Metric count updates** — "Automations completed" card increments to 1
8. **Mark a second item Completed** — card grid shows 2 columns side by side
9. **Existing cards unchanged** — the first 3 metric cards look and behave the same as before

- [ ] **Step 7: Commit (user runs this)**

```bash
git add experiments/websites/tasklift-mvp-app/src/App.jsx
git commit -m "feat: wire CompletedAutomations showcase into App — Day 13"
```
