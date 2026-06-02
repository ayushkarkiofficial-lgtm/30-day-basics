# Day 11 — Supabase Introduction

Status: Complete

## Goal

Replace browser localStorage with a real Supabase database. Understand what
changes when data moves from a local device to a server.

## What Was Built

- Created `experiments/websites/tasklift-mvp-app/.env` with `VITE_SUPABASE_URL`
  and `VITE_SUPABASE_ANON_KEY` for Vite to read at build time.
- Created root `D:\Claude\30_day_plan\.gitignore` to protect the credentials
  `.env` file from being committed to GitHub.
- Installed `@supabase/supabase-js` via npm.
- Created `experiments/websites/tasklift-mvp-app/src/lib/supabase.js` —
  a single shared Supabase client instance.
- Updated `App.jsx`:
  - Removed `STORAGE_KEY`, `loadQueueFromStorage`, and the localStorage
    `useEffect`.
  - Added `isLoading` state to prevent the empty-state flash while fetching.
  - Added a `useEffect` with empty `[]` that fetches all rows from
    `First_app_data` on first mount, ordered newest first.
  - Made `handleAddCandidate` async — it inserts the new row to Supabase,
    receives the saved row back (with server-generated UUID + created_at),
    then prepends it to local state.
- Added decisions for Supabase credentials path and Supabase Notion reference page.
- Wrote Supabase keys, roles, and RLS concepts to the Supabase Notion page.

## What Worked

- `npm run build` passed after all changes. Bundle grew from ~200 kB to
  366 kB because the Supabase JS client is included.
- The data flow is now:
  - Load: Supabase fetch → React state → ReviewQueue renders rows
  - Submit: async insert → Supabase saves row → returned row prepended to state
- Credentials are protected by `.gitignore` at both the repo root and the
  app folder level.

## Key Concepts Learned

### localStorage vs Supabase
localStorage is browser-only per-device storage. Supabase stores data on a
server — all devices see the same data, and it survives clearing the browser.

### Supabase keys
- URL — address of the project, safe to share
- Anon key (eyJ...) — JWT for anonymous requests, safe in frontend code
- Publishable key (sb_publishable_...) — newer format, same job as anon key
- Secret key (sb_secret_...) — admin access, bypasses RLS, never in frontend

### Supabase roles
- anon — requests with no login token (what the app uses now)
- authenticated — requests with a valid Supabase Auth token (after login)
- service_role — server-side admin using the secret key, bypasses all policies
- All other roles (authenticator, dashboard-user, pgbouncer, etc.) are
  Supabase's internal infrastructure — never write policies for them.

### RLS policies
The anon key is just an ID badge. RLS policies are the real lock. Without
explicit anon policies, the anon key can do nothing. Two policies needed for
Day 11: allow anon SELECT and allow anon INSERT.

### useEffect as a reader (not a writer)
Before: useEffect watched state and wrote to localStorage on every change.
After: useEffect runs once on mount and reads from the server.
The hook is the same — what it talks to changed.

### Why async inside useEffect
useEffect's callback cannot itself be async. The pattern is to define an
async function inside and call it immediately.

### Why .select().single() after insert
Supabase generates the real UUID and created_at timestamp on the server.
.select() returns the saved row so local state stays in sync with the database.
Without it you would prepend the local candidate object (with a fake id)
instead of the real server row.

### Why VITE_ prefix on env variables
Vite only exposes variables starting with VITE_ to browser code. This prevents
accidentally leaking server-side secrets into the bundle.

## Decisions Made

- Store Supabase credentials in `D:\Claude\30_day_plan\.env` (never commit).
- Use `VITE_` prefix in `experiments/websites/tasklift-mvp-app/.env` for
  Vite to expose credentials to the React app.
- Use `First_app_data` as the Supabase table name (user's existing table).
- Use the Supabase Notion page for ongoing Supabase reference notes.

## Next Session

Start Day 12. Check the Notion AI Builder plan for the Day 12 task.
