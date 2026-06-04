# Day 14 — Deploy Review

## What Was Deployed

- **App:** Tasklift MVP (React + Vite + Tailwind + Supabase)
- **Live URL:** https://snazzy-conkies-2372cf.netlify.app/
- **Repo base dir:** `experiments/websites/tasklift-mvp-app`
- **Env vars set in Netlify:** `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- All Days 7–13 commits were merged to `master` before the deploy.

---

## What Works (Verified Live)

| Feature | Status |
|---|---|
| Dashboard summary (4 metric cards) | ✅ Working |
| Intake form (add new process to Review Queue) | ✅ Working |
| Review Queue table (status badges, risk badges) | ✅ Working |
| Action buttons — status change + delete | ✅ Working |
| Completed Automations card grid | ✅ Working |
| Stack section | ✅ Working |
| Supabase reads on page load | ✅ Working |
| Supabase INSERT on form submit | ✅ Working |
| Supabase UPDATE on status change | ✅ Working |
| Supabase DELETE on delete button | ✅ Working |

---

## What Breaks or Could Break

### Known Weaknesses

- **No error UI.** If Supabase is down or the anon key is revoked, the app shows a blank review queue with no message. A user would not know why.
- **No loading state.** The fetch runs on mount. Until it completes, the review queue is empty. On slow connections this looks like a bug.
- **No auth.** Any visitor can insert, update, or delete records. The Supabase RLS policies allow anon access to all four operations. Fine for a demo; risky for real data.
- **No form validation on process name uniqueness.** Duplicate names can be inserted without warning.
- **No pagination.** If the table grows to hundreds of rows, the full table loads every time. No limit is applied to the SELECT query.

### Risk: Env Vars Baked In At Build Time

Vite embeds `VITE_` env variables into the JavaScript bundle at build time, not at runtime.

**What this means:**
- If env vars are set in Netlify UI *after* the first deploy, the already-built bundle still has `undefined` baked in.
- The app crashes silently with a blank screen and no helpful error.
- Fix: trigger a new Netlify deploy after any env var change. The rebuild reads the new values.

**How to spot the problem:** Open browser DevTools → Console. Look for `supabaseUrl is required` or similar Supabase client errors. These only appear if env vars were not present at build time.

---

## What Is Risky to Change

| Area | Risk | Reason |
|---|---|---|
| Supabase table name `First_app_data` | High | Renaming the table means updating every query. Easy to miss one. |
| Column names in Supabase | High | `process_name`, `owner`, `frequency`, `risk_level`, `status` are referenced in multiple components. |
| RLS policies | Medium | Removing anon SELECT breaks the page load. Removing anon INSERT breaks the form. |
| Netlify env var names | High | Must exactly match `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. Case-sensitive. |

---

## Key Lesson Learned

> **Vite bakes env vars into the bundle at build time.**
> Adding env vars to Netlify after the first build does nothing until you trigger a redeploy.
> Always trigger a fresh Netlify build after changing env vars, and verify the app loads data before considering the deploy complete.

---

## Manual Retest Checklist

- [ ] Open the live URL — no blank screen, dashboard loads
- [ ] Submit a new process via the Intake form — it appears in the Review Queue
- [ ] Change a process status — Dashboard counters update
- [ ] Delete a process — it disappears from the queue
- [ ] Move a process to "Completed" — it appears in the Completed Automations section
- [ ] Refresh the page — data persists (Supabase, not localStorage)

---

## Next

Move to Day 15.
