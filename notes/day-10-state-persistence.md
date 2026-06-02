# Day 10 — State Persistence And Visual Feedback

## Goal

Understand why React state is lost on page refresh, learn how `useEffect` works,
add localStorage persistence to the review queue, and add colored risk and status
badges to the review table.

## What Changed

- Updated `src/App.jsx` — added `useEffect` to save `queueItems` to localStorage after
  every change, and a lazy `useState` initializer to reload saved items on first load.
- Updated `src/components/ReviewQueue.jsx` — added colored `Badge` component for risk
  and status columns, added empty-state message, and replaced raw text with badge counts.

## The Core Mental Model: Where Data Lives

| Storage type | Survives refresh? | Visible to others? | Limit |
|---|---|---|---|
| React `useState` | No — memory only | No | RAM |
| `localStorage` | Yes — browser disk | No — per device | ~5 MB |
| Supabase (cloud DB) | Yes — server | Yes — all users | Unlimited |

React state is the fastest but most temporary. localStorage makes things survive refresh
but only on this browser. Supabase makes things real and shareable. Each step in the
30-day plan advances one level.

## What `useEffect` Does

```jsx
useEffect(() => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(queueItems));
}, [queueItems]);
```

Translation: "After every render where `queueItems` changed, run this code."

React's rule: you cannot write side effects (saving, fetching, timers) directly inside
the component function body, because that body can run many times per second. `useEffect`
is the safe, controlled place for side effects — React waits for the render to finish
before running the callback.

## What the Lazy Initializer Does

```jsx
const [queueItems, setQueueItems] = useState(loadQueueFromStorage);
```

Note there are NO parentheses after `loadQueueFromStorage`. You are passing the function
itself, not calling it immediately. React calls the function itself — but ONLY once, on
the very first render. After that it uses the current state value and ignores the
initializer completely.

If you wrote `useState(loadQueueFromStorage())` (with parentheses), the function would
run on EVERY render, wasting work reading localStorage every time.

## What the Risk Badges Do

```jsx
const riskStyle = {
  Low: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Medium: "bg-amber-50 text-amber-700 border-amber-200",
  High: "bg-red-50 text-red-700 border-red-200",
};
```

This is a plain JavaScript object used as a lookup table. Given a risk string, get a
Tailwind class string. This keeps the mapping in one place instead of scattering
`if/else` logic through the JSX.

The `??` operator is a safe fallback:
```jsx
riskStyle[item.risk] ?? "bg-gray-50 text-gray-700 border-gray-200"
```
If `item.risk` has an unexpected value (not Low, Medium, or High), the lookup returns
`undefined`, and `??` falls back to a neutral gray style instead of crashing.

## Data Flow Summary

```
User submits form
  → IntakeForm calls onAddCandidate(candidate)
  → App.jsx: setQueueItems([candidate, ...currentItems])
  → React re-renders: new queueItems flows down as props to:
      - DashboardSummary (counters update)
      - ReviewQueue (new row appears at top)
  → useEffect fires: saves new queueItems to localStorage
  → User refreshes page
  → loadQueueFromStorage reads localStorage
  → useState starts with saved items instead of demo data
```

## Manual Test

1. Run `npm run dev` in `experiments/websites/tasklift-mvp-app`.
2. Open `http://localhost:5173` in your browser.
3. Submit a new process using the intake form.
4. Confirm it appears at the top of the review queue with a colored badge.
5. Confirm the "Processes in review" counter in the dashboard increases.
6. Refresh the page.
7. Confirm the submitted item is still there — it survived the refresh.
8. Submit a second item, then check both are visible.
9. Confirm "High" risk shows red badge, "Medium" shows amber, "Low" shows green.

## Current Non-Goals

- No delete or edit for queue items.
- No user login.
- No Supabase connection (that comes later).
- No server sync — localStorage is still browser-only.

## Next Step

Day 11 should introduce **Supabase** — signing up, creating a project, understanding
what a database table is, and replacing the localStorage persistence with a real
Supabase table so data is stored on a server instead of only in the browser.
