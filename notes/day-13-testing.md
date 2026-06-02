# Day 13 — Testing As Verification

## Goal

Add the smallest useful tests and create a manual testing checklist for the
Tasklift app. Also ship the Completed Automations showcase feature.

## What Was Built

- **Completed Automations feature** — new status, graduated items out of queue
  into a card grid showcase, 4th dashboard metric card with anchor scroll link
- **`src/lib/metrics.js`** — extracted `computeMetrics()` pure function
- **`src/lib/metrics.test.js`** — 5 unit tests covering all four counts
- **Vitest installed** — `npm test` now runs the suite

## Files Changed

| File | What changed |
|---|---|
| `ReviewQueue.jsx` | Added "Completed" to statusStyle (indigo) and STATUS_OPTIONS |
| `DashboardSummary.jsx` | Extended metric tuple to support optional href; grid → grid-cols-2 lg:grid-cols-4 |
| `CompletedAutomations.jsx` | New component — card grid, empty state, anchor id |
| `App.jsx` | Import computeMetrics + CompletedAutomations, derive activeItems/completedItems, 4th metric |
| `src/lib/metrics.js` | New — pure function extracting counting logic from App.jsx |
| `src/lib/metrics.test.js` | New — 5 unit tests |
| `package.json` | Added `"test": "vitest run"` script |

## The 4 Types of Testing

### Unit test
Tests one pure function in isolation. No database, no browser, no React.
Input → output. Fastest, cheapest.
Best for: calculation logic, data transforms, validation rules.

### Integration test
Tests two or more pieces working together — e.g. a component + its data.
Supabase is mocked. Renders real JSX via React Testing Library.
Best for: does this component display what it receives correctly?

### End-to-end (E2E) test
A robot drives a real browser through a real user flow.
Tools: Playwright or Cypress.
Best for: the 2-3 flows that absolutely cannot break.

### Manual test
You open the browser and check it yourself with a checklist.
Best for: visual correctness, feel, edge cases you haven't automated.

## Key Concepts

### Why extract logic to a pure function for unit testing
Code trapped inside a React component (useMemo, event handlers) cannot be
unit tested directly — you'd have to render the whole component. Extracting
logic to a pure function in its own file makes it testable with zero setup.
This is also better architecture regardless of testing.

### What useMemo does
`useMemo(() => fn(), [dep])` caches the return value of `fn` and only
recomputes it when `dep` changes. Without it, the calculation runs on every
render even if the data hasn't changed. It's a performance optimisation,
not a correctness fix — removing it would still produce correct values.

### Unit tests vs manual tests — the overlap
Both verify the dashboard counts are correct, but through different means.
Unit tests: fast, automatic, catch regressions silently.
Manual tests: slow, visual, catch things automated tests miss (layout, feel).
Neither replaces the other.

## What Unit Tests Are NOT Good For
- Whether a button click triggers the right Supabase call
- Whether a component renders correctly
- Whether the page looks right on mobile

## Automated Commands

```bash
npm test        # run unit tests (vitest run)
npm run build   # syntax check — no broken imports
```

Both should pass clean after every code change.

## Next Session

Start Day 14: Deploy MVP and review what works, what breaks, what is risky.
