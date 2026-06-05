# AI Dev Log

Use this file to record what happened each day.

## Day 1

Status: Complete

### Goal

Set up a simple AI builder learning repo.

### What I Asked AI To Do

Create a clear folder structure for logs, decisions, prompts, and future website/automation experiments.

### What Worked

- Workspace initialized.
- Repo structure created.
- Plain-English templates added.
- Git was initialized in `D:\Claude\30_day_plan`.
- `FILE_ROUTING.md` was added as the lightweight map for where to save future notes.
- The file routing habit was tested with: `Run file routing and remind me what should be saved.`
- The routing decision was saved in `notes/decisions.md`.
- The routing prompt was saved in `notes/prompt-library.md`.

### What Confused Me

- `.git` has many internal files, but the important mental model is simple:
  - `.git` is Git's memory.
  - `HEAD` points to the current branch.
  - `objects` stores committed snapshots.
  - `refs` stores branch and tag pointers.
  - `hooks` contains optional automation samples.
- Markdown files do not automatically control Codex. They are context and workspace instructions only when opened or referenced.

### Decisions Made

- Use manual file routing for now instead of a Claude Code hook.
- Treat file routing as an end-of-task habit, not a product automation.
- Use short keywords like `Open routing`, `Log progress`, `Save decision`, and `Save prompt` to reduce unnecessary file reading.

### Useful Prompts Saved

```text
Run file routing and remind me what should be saved.
```

### Next Session

Start with **Day 2 — Website Mental Model** from the Notion AI Builder Version plan.

Notion page:
https://www.notion.so/36532f18146f81b3b177cb6f210a8d93

When the user says:

```text
Open AI Builder Version 30-Day Plan
```

Open the AI Builder plan, then continue from **Day 2 — Website Mental Model**.

Day 2 outcome:

- Understand pages, sections, components, styling, responsiveness, and accessibility.
- Build a simple one-page website with AI.
- Save useful website-building prompts and lessons.

## Day 2

Status: Complete

### Goal

Build and understand a clean responsive one-page website.

### What I Asked AI To Do

Create a simple professional website for a startup automation company that helps companies with repetitive manual tasks. Include a header, hero, three features, and contact section.

### What Was Built

- Static website experiment: `experiments/websites/startup-automation-site/`
- `index.html` contains the page content and sections.
- `styles.css` contains the visual design, spacing, layout, and responsive behavior.

### What Worked

- The page was built as a simple static website that can be opened directly in a browser.
- Header links point to the features and contact sections.
- The layout uses desktop grids and switches to one-column mobile layouts with CSS media queries.
- URL fragments like `#contact` target any element with `id="contact"`, not class names.
- Anchor links can target sections, headings, forms, or any other element as long as the `id` is unique.
- `scroll-margin-top` can adjust where the browser stops when jumping to an anchor, especially when a fixed header is present.
- The `<head>` stores page metadata and resources, while visible content belongs in `<body>`.
- `<meta name="..." content="...">` uses `name` to identify the metadata type and `content` to provide its value.

### What Confused Me

- Git status shows the whole workspace as untracked, which means the repo likely still needs its first commit.

### Progress Update

- Ran file routing after the Day 2 learning session.
- Saved the website mental-model notes about `#id` navigation, anchor targets, scroll positioning, `<head>`, and `<meta>`.
- Reviewed the files in `templates/` and confirmed they are included in `FILE_ROUTING.md`.
- Kept the template files because they are reusable blank formats, not daily note files.
- Manually tested the page in a browser at desktop and mobile widths.

### Next Session

Start **Day 3** from the Notion AI Builder Version plan.

Notion page:
https://www.notion.so/36532f18146f81b3b177cb6f210a8d93

When the user says:

```text
Review progress log
```

Read this log, open the Notion AI Builder Version plan, find the **Day 3** tasks, and summarize exactly what needs to be done next.

## Day 3

Status: Complete

### Goal

Understand the difference between frontend, backend/API, database/storage, and environment variables by adding app-like behavior to the website form.

### What I Asked AI To Do

Continue from the progress log, open the Day 3 Notion plan, and add a simple contact form flow to yesterday's site.

### What Was Built

- Updated `experiments/websites/startup-automation-site/index.html`.
- Updated `experiments/websites/startup-automation-site/styles.css`.
- Added form validation for name, email, and manual task.
- Added visible field-level error messages.
- Added a success message after valid submission.
- Simulated data storage with browser `localStorage` under `taskliftLeads`.
- Added `notes/app-flow.md` to explain the data flow in plain English.

### What Worked

- The existing contact form was reused instead of rebuilding the page.
- The form now prevents empty submissions and invalid email format.
- Successful submissions are stored locally in the browser for demo purposes.
- The page can still run as a static site by opening `index.html` directly.

### What Confused Me

- `localStorage` is not a real backend or database. It only saves data in the current browser.
- Browser JavaScript is public, so secrets do not belong there.

### Decisions Made

- Keep Day 3 as a static-site simulation instead of adding a real backend yet.
- Use this session to understand the shape of app data flow before introducing a framework or database.

### Useful Prompts Saved

```text
Add a simple contact form to this site. I want to understand the app flow, not learn code deeply. After implementation, explain frontend, backend/API, and data storage responsibilities in plain English.
```

### Next Session

Start **Day 4 - Spec Writing For AI Agents** from the Notion AI Builder Version plan.

Day 4 outcome:

- Write tighter AI feature specs with context, goal, constraints, acceptance criteria, non-goals, and manual tests.
- Practice asking AI for a small feature from a clear spec.

## Day 4

Status: Complete

### Goal

Practice writing a clear feature spec before implementation, then add a small saved submissions view to the Tasklift contact form demo.

### What I Asked AI To Do

Use the Day 4 plan as the source of intent, write the feature spec first, then implement a saved submissions list using the existing `taskliftLeads` browser storage.

### What Was Built

- Added `notes/day-4-feature-spec.md`.
- Updated `experiments/websites/startup-automation-site/index.html`.
- Updated `experiments/websites/startup-automation-site/styles.css`.
- Added a saved submissions area that reads from `localStorage`.
- Displayed saved name, email, task, and submitted time.
- Rendered submissions newest first.
- Added an empty state for browsers with no saved requests.

### What Worked

- The feature could be added without changing the static-site setup.
- The existing form validation and storage key were reused.
- The saved list updates immediately after a valid form submit.
- Refreshing the page can still show saved requests because the data stays in browser `localStorage`.

### What Confused Me

- Nothing new from implementation. The main reminder is that this is still demo-only browser storage, not a private backend.

### Decisions Made

- Kept the saved submissions list as a read-only demo view.
- Did not add delete, edit, search, backend sync, or authentication.

### Useful Prompts Saved

```text
Before implementing a feature, write a short spec with:
Context:
Goal:
Constraints:
Acceptance criteria:
Non-goals:
Manual test:

Then implement only what the spec requires, verify it manually, and update the learning log.
```

### Next Session

Start **Day 5** from the Notion AI Builder Version plan.

## Day 5

Status: Complete

### Goal

Improve the existing Tasklift landing page for clarity and conversion while keeping the site static and focused.

### What I Asked AI To Do

Use the Day 5 plan as the source of intent, skip Git commits for now, improve the existing landing page instead of creating a new experiment, and update progress tracking afterward.

### What Was Built

- Updated `experiments/websites/startup-automation-site/index.html`.
- Updated `experiments/websites/startup-automation-site/styles.css`.
- Reframed the hero around a concrete 48-hour workflow review.
- Changed the main CTA to "Request a workflow review".
- Added a compact trust strip with three practical signals: one process mapped, no-code first, and human approval points.
- Tightened feature and contact copy around reviewing one repeated weekly process.

### What Worked

- The page now has one clearer goal: get the visitor to request a workflow review.
- The existing form validation, browser `localStorage`, and saved submissions list were left in place.
- The new trust signals were added without creating an unnecessary new section.
- The site still works as a static page that can be opened directly from `index.html`.

### What Confused Me

- Git could not be used for a baseline commit because the repo is marked as a dubious ownership directory for the current Windows user.
- Per user direction, commits were skipped and the remaining Day 5 work continued.

### Decisions Made

- Improve the existing Tasklift page instead of creating a separate landing-page experiment.
- Keep Day 5 focused on copy, CTA clarity, and trust signals instead of redesigning the full page.

### Useful Prompts Saved

```text
Improve this landing page for clarity and conversion. Keep the design simple and professional. Do not add unnecessary sections. Explain the changes and give me a manual review checklist.
```

### Manual Review

- Page goal is clearer: request a workflow review.
- CTA is obvious and still points to the contact form.
- Existing form and saved submissions behavior remain in the page code.
- Mobile styles include a one-column trust strip so short trust labels do not crowd each other.

### Next Session

Start **Day 6 - Deploy Publicly** from the Notion AI Builder Version plan.

## Day 6

Status: GitHub baseline pushed; pull request branch pushed

### Goal

Prepare the Tasklift static site for public deployment and understand what changes when a local website becomes a public URL.

### What I Asked AI To Do

Read the progress log and move on from Day 5 into the next documented task.

### What Was Built

- Added `notes/day-6-deployment-plan.md`.
- Added `netlify.toml` at the repo root so Netlify can deploy the static site from the correct subfolder.
- Documented the exact local folder and files needed for deployment.
- Chose GitHub plus Netlify as the deployment path because this repo will be the source of truth for the 30-day-plan.
- Added a post-deployment manual test checklist.
- Added the GitHub repo as local `origin`.
- Created the first local Git commit: `521a2b3 Initialize 30-day plan workspace`.
- Amended the first local commit to `578e98b Initialize 30-day plan workspace`.
- Pushed `master` to GitHub as the base branch.
- Pushed `day-6-github-netlify-setup` to GitHub as the pull request branch.
- Added a plain-English pull request explanation to the Day 6 deployment plan.
- User staged, committed, and pushed the Netlify config commit manually: `8f6f975 Add Netify build config`.

### What Worked

- The current Tasklift site is deployment-ready as a static folder.
- Required deployment files are only `index.html` and `styles.css`.
- The site can be deployed from GitHub without changing the code.
- Netlify can read `netlify.toml` instead of relying only on UI build settings.
- User practiced `git status`, `git add`, `git commit`, and `git push` directly in the terminal.

### What Confused Me

- Public deployment needs external GitHub and Netlify account access, so Codex cannot fully complete the Netlify connection from the local workspace alone.
- The Notion connector could not open the linked plan because its MCP server failed during startup.
- Git initially reported this repo as a dubious ownership directory for the current Windows user. The workspace has now been marked as a safe Git directory.
- Pushing initially failed because GitHub rejected the current credentials. After `InfraWatch68` was added as a collaborator, the push succeeded.

### Decisions Made

- Use `https://github.com/ayushkarkiofficial-lgtm/30-day-basics.git` as the GitHub repo for the 30-day-plan.
- Connect Netlify to the GitHub repo instead of using Netlify Drop.
- Treat `localStorage` as browser-only demo storage after deployment; it is not shared between visitors.
- Codex should give Git guidance, but the user runs Git terminal commands manually unless explicitly requested otherwise.

### Useful Prompts Saved

```text
Prepare this static website for public deployment. Tell me the exact folder to deploy, which hosting option is simplest, what settings are needed, and what I should test after the public URL is live.
```

### Next Session

Open or refresh the pull request from `day-6-github-netlify-setup` into `master`, review the changed docs and `netlify.toml`, merge it, then confirm Netlify deploys from `master`. Paste the public Netlify URL back into this workspace so it can be logged and reviewed.

### Continuation Note

- Reviewed the Day 6 progress log and confirmed the remaining work is PR merge plus Netlify deployment.
- Updated the Day 6 deployment plan so it no longer says GitHub push is blocked.
- Updated the website deployment checklist to include reviewing and merging the pull request before connecting Netlify.

### Public Site Audit

- Audited the Netlify preview URL for practical AI-builder issues: clarity, mobile layout, accessibility, interactions, and deployment risk.
- Implemented safe small source fixes only: stronger keyboard focus states, screen-reader-linked form errors, invalid-field state, first-invalid-field focus, and hero image loading metadata.
- Left larger follow-ups for a separate pass: real lead capture backend/form service, replacing the external Unsplash dependency with a local asset, and final live mobile/browser testing after Netlify redeploys.

### File Routing Update

- Opened `FILE_ROUTING.md` and checked what should be saved.
- Confirmed the manual Git workflow rule belongs in `notes/decisions.md`.
- Added the Codex Git-command mistake and prevention rule to `notes/mistakes.md`.

## Day 7

Status: In progress

### Goal

Finish Week 1 by reviewing the deployed Tasklift site, fixing safe rough edges, saving the useful audit prompt, and writing a Week 1 summary.

### What I Asked AI To Do

Review the AI Builder Version Notion plan, open the next day, and continue from the current progress log.

### What Was Built

- Opened the Notion parent plan and confirmed the next task is `Day 7 - Review, Fix, And Save Prompts`.
- Added `notes/day-7-week-1-review.md`.
- Added the AI builder website audit prompt to `notes/prompt-library.md`.

### What Worked

- The Notion connector opened successfully this time.
- The Day 7 plan matched the live-site audit already started from the Netlify preview URL.
- The Week 1 review now captures what was built, top issues, safe fixes, larger follow-ups, and a manual retest checklist.

### What Confused Me

- The live Netlify URL could not be loaded by the fetch tool from this environment, so final public-site retesting still needs to be done manually in the browser.

### Next Session

Retest the live Netlify URL manually, then finish Day 7 by marking whether the latest deployment still works and deciding whether to merge `day-6-github-netlify-setup` into `master`.

## Day 8

Status: Complete

### Goal

Choose one Week 2 MVP stack and scaffold the project base.

### What I Asked AI To Do

Move on to the next week, review the AI Builder Notion plan, and avoid stalling on Week 1 review work.

### What Was Built

- Opened the Notion guide for `Day 8 - Choose One Stack And Stop Switching`.
- Added `experiments/websites/tasklift-mvp-app/`.
- Scaffolded a React plus Vite plus Tailwind app shell.
- Added a Week 2 stack decision note in `notes/day-8-stack-decision.md`.
- Added the stack choice to `notes/decisions.md`.
- Added the new app experiment summary to `experiments/websites/README.md`.

### What Worked

- Node and npm were already installed.
- `npm install` completed after allowing dependency download.
- `npm run build` passed.
- The local dev server is running at `http://127.0.0.1:5173/`.

### What Confused Me

- Starting Vite through `npm` in the background did not bind to the port at first. Starting the local Vite command shim directly worked.

### Decisions Made

- Use React with Vite for the Week 2 app shell.
- Use Tailwind for styling.
- Use Supabase later for database, auth, and storage.
- Continue with Netlify for hosting practice.
- Use n8n, Make, or Zapier for external automation when possible.

### Next Session

Start Day 9 by turning the app shell into a clearer homepage plus dashboard shell, then explain the folder structure in plain English.

## Day 9

Status: Complete

### Goal

Turn the Week 2 React scaffold into a clearer Tasklift homepage plus dashboard shell, while explaining the app structure in plain English.

### What I Asked AI To Do

Move on to Day 9 and explain every aspect of the work in detail from now on.

### What Was Built

- Added focused UI components under `experiments/websites/tasklift-mvp-app/src/components/`.
- Added temporary demo content in `experiments/websites/tasklift-mvp-app/src/data/demoData.js`.
- Updated `src/App.jsx` so it composes the page from named components instead of holding every section inline.
- Added a dashboard summary row for process count, high-risk handoff count, and live automation count.
- Updated the Tasklift app README folder mental model.
- Added `notes/day-9-app-shell.md`.

### What Worked

- The app now shows the core React idea more clearly: components receive data and render UI.
- `App.jsx` is easier to read because it shows page structure at a glance.
- Demo data is separated from layout, which prepares the app for replacing hardcoded arrays with real Supabase data later.

### What Confused Me

- Nothing new yet. The main thing to remember is that splitting files does not add new user behavior by itself; it improves maintainability and learning clarity.

### Next Session

Finish verifying the Day 9 app shell, then decide whether Day 10 should add real form behavior, local demo state, or a first Supabase planning note.

## Day 10

Status: Complete

### Goal

Understand why React state disappears on refresh, add localStorage persistence to the
review queue using `useEffect`, and add colored risk and status badges to the review table.

### What I Asked AI To Do

Go through the progress log and continue. Explain everything that occurs in detail.

### What Was Built

- Updated `experiments/websites/tasklift-mvp-app/src/App.jsx` with `useEffect` to save
  `queueItems` to localStorage after every change, and a lazy `useState` initializer to
  restore saved items on first load.
- Updated `experiments/websites/tasklift-mvp-app/src/components/ReviewQueue.jsx` with a
  `Badge` component for risk (red/amber/green) and status (blue/amber/red/green) columns,
  an empty-state message when the queue has no items, and a process count label.
- Added `notes/day-10-state-persistence.md`.

### What Worked

- `npm run build` passed after both changes. CSS grew from 8.76 kB to 10.36 kB because the
  badge color utility classes were added.
- The data flow is now: form submit → React state update → `useEffect` saves to localStorage
  → refresh → localStorage read restores state.
- Dashboard counters update automatically when items are added because `DashboardSummary`
  receives metrics computed from the same `queueItems` state.

### What Confused Me — And Why It Works The Way It Does

**Why `useState(loadQueueFromStorage)` instead of `useState(loadQueueFromStorage())`?**
With parentheses, the function runs on every single render. Without parentheses, React
calls it only once. This "lazy initializer" pattern prevents unnecessary localStorage
reads on every keystroke or re-render.

**Why use `useEffect` instead of saving inside `handleAddCandidate`?**
You could save inside the handler too. But `useEffect` with a dependency array is the
React-idiomatic pattern because it automatically responds to any state change — even
future ones from new update paths — without needing to remember to call a save function
each time.

**Why `JSON.stringify` and `JSON.parse`?**
localStorage can only store strings. Arrays are not strings. `JSON.stringify` converts
`[{id: "...", label: "..."}]` to a text string. `JSON.parse` converts it back to an
array when loading. The `try/catch` handles the case where stored data is corrupted.

### Decisions Made

- Use localStorage as the persistence layer until Supabase is introduced on Day 11.
- Use a lookup-table pattern (`{ Low: "...", Medium: "...", High: "..." }`) for badge
  colors instead of inline if/else, so the mapping is readable and in one place.

### Useful Prompts Saved

```text
Explain why this React state disappears on refresh and show me the simplest way to
persist it. Explain useEffect, JSON.stringify, and the localStorage sync pattern
in plain English, then implement it in the existing App.jsx.
```

### Next Session

Start Day 11 — Supabase introduction. Sign up for a Supabase project, understand what
a database table is vs. localStorage, create a `review_queue` table, and replace the
localStorage sync with a real Supabase fetch and insert.

## Day 11

Status: Complete

### Goal

Replace browser localStorage with a real Supabase database. Understand what
changes when data moves from a local device to a server.

### What I Asked AI To Do

Review the progress log and continue from Day 10. Explain everything in detail.

### What Was Built

- Created `experiments/websites/tasklift-mvp-app/.env` with Vite-prefixed Supabase credentials.
- Created root `.gitignore` to protect the credentials file.
- Installed `@supabase/supabase-js`.
- Created `src/lib/supabase.js` — a single shared client instance.
- Updated `App.jsx`: removed localStorage, added Supabase fetch on mount and
  async insert on form submit.
- Added Supabase credentials decision and Supabase Notion reference page decision
  to `notes/decisions.md`.
- Wrote Supabase keys, roles, and RLS policy concepts to the Supabase Notion page.
- Wrote React input rendering concepts (HTML → JS → React) to the HTML/JS Notion page.

### What Worked

- `npm run build` passed. Bundle grew from ~200 kB to 366 kB (Supabase client included).
- Data flow is now: fetch from server on load → insert to server on submit.
- Credentials are protected by `.gitignore` at repo root and app folder level.

### What Confused Me — And Why It Works The Way It Does

**Why are there so many Supabase roles?**
Most roles (authenticator, dashboard-user, pgbouncer, supabase_auth_admin, etc.)
are Supabase's internal infrastructure. You only write policies for anon,
authenticated, and service_role. The rest appear in the dropdown because
PostgreSQL exposes all roles, but they belong to Supabase's own services.

**Why did the default policy block the app?**
The default Supabase policy is "authenticated users only." Since the app has
no login system, every request uses the anon role — which had no permissions.
Two explicit anon policies (SELECT + INSERT) were required to allow the app to work.

**Why VITE_ prefix?**
Vite only exposes env variables with the VITE_ prefix to browser code.
Variables without it are invisible to React components — a safety rule to
prevent leaking server secrets into the frontend bundle.

### Decisions Made

- Supabase credentials stored in `D:\Claude\30_day_plan\.env` (never committed).
- VITE_ prefixed credentials in `experiments/websites/tasklift-mvp-app/.env`.
- Table name: `First_app_data` (user's existing table).
- Supabase Notion page used for all ongoing Supabase reference notes.

### Useful Prompts Saved

```text
Connect this React app to Supabase. Replace localStorage with a real fetch on
mount and an async insert on submit. Explain useEffect, async/await, and why
we do not send the id to the database. Keep all explanations in plain English.
```

### Next Session

Open the Notion AI Builder plan and start Day 12.

## Day 12

Status: Complete

### Goal

Complete the Supabase CRUD cycle by adding UPDATE and DELETE to the
Tasklift review queue.

### What I Asked AI To Do

Review the decisions log, design Day 12, and implement the full CRUD
completion with named status buttons and a delete action per row.

### What Was Built

- Updated `experiments/websites/tasklift-mvp-app/src/App.jsx` with
  `handleStatusChange(id, newStatus)` and `handleDelete(id)` — both
  call Supabase and update local state on success.
- Updated `experiments/websites/tasklift-mvp-app/src/components/ReviewQueue.jsx`
  with a `STATUS_OPTIONS` constant, `ActionCell` component, and a 5th
  Actions column in the review table.
- Added `notes/day-12-crud.md`.

### What Worked

- The data flow is now complete: CREATE + READ + UPDATE + DELETE all go
  through Supabase. Local state stays in sync by using the server-returned
  row for UPDATE and filtering by id for DELETE.
- Dashboard counters update automatically after status changes and deletes
  because they are computed from `queueItems` via `useMemo`.
- The Actions column scrolls with the table on mobile — no extra layout work.

### What Confused Me — And Why It Works The Way It Does

**Why `.eq("id", id)` on every mutating call?**
Without a `.eq()` filter, Supabase would update or delete every row in
the table. The filter scopes the operation to exactly one row.

**Why does UPDATE use `.select().single()` but DELETE does not?**
UPDATE returns the changed row — asking for it keeps local state in sync
with the exact values the database stored. DELETE removes the row; there
is nothing to return. We already know the id to filter out.

**Why `map` for update and `filter` for delete?**
`map` replaces one item in the array while keeping all others.
`filter` removes one item while keeping all others.
These are the two standard React patterns for immutable list mutation.

### Decisions Made

- Status buttons show every status except the current one (not a fixed workflow).
- Delete has no confirmation dialog — added later if needed.
- No optimistic updates — wait for Supabase confirmation before changing UI.

### Useful Prompts Saved

```text
Add update and delete to this Supabase-connected React app. Keep all
Supabase logic in App.jsx, pass handlers as props, and explain .eq(),
.map() vs .filter(), and why UPDATE needs .select() but DELETE does not.
```

### Next Session

Open the Notion AI Builder plan and start Day 13.

## Day 13

Status: Complete

### Goal

Learn unit, integration, E2E, and manual testing. Add the smallest useful
automated tests. Ship the Completed Automations showcase feature.

### What Was Built

- **Completed Automations feature** — new "Completed" status graduates items
  out of the Review Queue into a card grid showcase section below it.
  4th dashboard metric card shows count and scrolls to the section on click.
- **`src/lib/metrics.js`** — `computeMetrics(items)` pure function extracted
  from App.jsx's useMemo so it can be unit tested without React.
- **`src/lib/metrics.test.js`** — 5 Vitest unit tests covering all four counts
  (total, highRisk, live, completed).
- **Vitest installed** — `npm test` runs the suite in under 1 second.

### What Worked

- Extracting pure logic out of a component into its own file is the right move
  both for testability and for architecture. The component is cleaner too.
- Vitest requires almost zero config in a Vite project — just install and add
  the test script to package.json.
- The subagent-driven development workflow (spec → plan → subagents → review)
  handled all 4 implementation tasks cleanly with no rework needed.

### What I Learned — Testing Mental Model

**Unit test:** pure function, input → output, no network, no browser.
Best for calculation logic. Runs in milliseconds.

**Integration test:** component + data together. Supabase mocked.
Best for checking a component displays what it receives correctly.

**E2E test:** robot drives a real browser through a real flow.
Best for the 2-3 flows that absolutely cannot break.

**Manual test:** you open the browser and check with a checklist.
Best for visual correctness and things automation misses.

Unit tests and manual tests overlap on dashboard count verification —
unit tests do it automatically, manual does it visually. Both are useful.

### What useMemo Does

`useMemo(() => fn(), [dep])` caches the return value of `fn` and only
recomputes when `dep` changes. Performance optimisation, not correctness.
The app would behave identically without it — it would just recalculate
on every render instead of only when queueItems changes.

### Decisions Made

- Business logic (counting) lives in `src/lib/` not inside components.
- `npm test` is the automated correctness check; `npm run build` is the
  syntax check. Both run after every code change.
- No integration or E2E tests for now — manual checklist covers Supabase flows.

### Useful Prompts Saved

```text
Add the smallest useful test coverage for this workflow. Do not over-engineer.
Explain what each test proves, what it does not prove, and give me a manual
test checklist.
```

### Next Session

Open the Notion AI Builder plan and start Day 14:
Deploy the MVP and write what works, what breaks, and what is risky.

## Day 14

Status: Complete

### Goal

Deploy the Tasklift MVP to Netlify, verify everything works live, and document what works, what breaks, and what is risky.

### What I Asked AI To Do

Review the progress log and continue from Day 13.

### What Was Built

- All Days 7–13 commits merged to `master` and pushed to GitHub.
- Netlify connected to `master`, base dir `experiments/websites/tasklift-mvp-app`, with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` set as env vars.
- Live URL confirmed: https://snazzy-conkies-2372cf.netlify.app/
- All components verified live: dashboard, intake form, review queue, completed automations, stack section.
- Added `notes/day-14-deploy-review.md` — what works, what breaks, what is risky, key lesson learned, and a manual retest checklist.

### What Worked

- Every Supabase CRUD operation works in production (SELECT, INSERT, UPDATE, DELETE).
- Dashboard counters update live after status changes.
- Completed Automations section populates correctly from Supabase data.
- Netlify build pipeline reads Vite env vars at build time and bundles them into the output correctly.

### What Breaks or Could Break

- No error UI — if Supabase is down the app shows a blank queue with no message.
- No loading state — the queue appears empty until the fetch completes.
- No auth — any visitor can insert, update, or delete records.
- No query limit — the SELECT fetches all rows with no pagination.

### Key Lesson Learned

> **Vite bakes env vars into the bundle at build time.**
> Adding env vars to Netlify after the first build does nothing until you trigger a redeploy.
> Always trigger a fresh Netlify build after changing env vars, and verify the app loads data before considering the deploy complete.

### What Is Risky

- Renaming the Supabase table or column names breaks all queries.
- Changing Netlify env var names breaks the build silently (blank screen, no error message).
- Removing any anon RLS policy breaks the corresponding operation for all visitors.

### Useful Prompts Saved

```text
Deploy this Vite + React app to Netlify. Explain what env vars need to be set,
what happens if they are missing, how to verify the deploy worked, and what risks
exist in production that didn't exist in local dev.
```

### Next Session

Open the Notion AI Builder plan and start Day 15.

## Day 15

Status: Complete

### Goal

Build the automation mental model before wiring any real automation into Tasklift.
Understand the 7 parts every automation shares: trigger, input, decision, action, log,
failure handling, and human review.

### What I Asked AI To Do

Review the progress log and continue from Day 14.

### What Was Built

- Added `notes/day-15-automation-mental-model.md` with the full 7-part mental model,
  a Tasklift automation map, key pre-build questions, and the Week 3 roadmap.

### The Automation Mental Model

Every automation — n8n, Make, Zapier, custom code — has the same 7 parts:

| Part | What it does |
|---|---|
| Trigger | What starts the automation (form submit, schedule, webhook, row change) |
| Input | The data payload the trigger carries |
| Decision | Conditions that must be true before the action runs |
| Action | The actual work (send email, write to Notion, call API) |
| Log | The record that proves the automation ran |
| Failure Handling | What happens when the action fails (retry, alert, halt) |
| Human Review | Where a human must approve before the automation continues |

### Tasklift Automation Map (Form Submission)

- **Trigger:** Intake form submit → Supabase INSERT
- **Input:** `process_name`, `owner`, `frequency`, `risk_level`
- **Decision:** If `risk_level = High` → escalate; else → add normally
- **Action:** Email owner / create Notion page / post Slack alert
- **Log:** Record in `automation_logs` table
- **Failure:** Mark row `notify_failed`, retry on next cron
- **Human Review:** ReviewQueue — status moved manually before archiving

### Why This Mental Model Matters

Without it, automations fire on bad data, fail invisibly, cause silent damage, and
act without consent. With it, you can describe any automation in plain English before
touching a tool, and debug any automation by asking "which of the 7 parts broke?"

### Decisions Made

- No code built today — Day 15 is deliberately conceptual groundwork.
- The 7-part model and Tasklift automation map are the reference for Days 16–21.

### Useful Prompts Saved

```text
Before we build this automation, let's map it. What is the trigger, input, decision,
action, log, failure handling, and human review point? Write the map in plain English
before touching any code or tool.
```

### Next Session

Open the Notion AI Builder plan and start Day 16:
Form submission to email notification.

## Day 16

Status: Complete

### Goal

Build the first real automation: when someone submits the Tasklift intake form,
send an email notification automatically. Wire the React app to Make (make.com)
via a webhook.

### What I Asked AI To Do

Review the progress log and continue from Day 15. Guide the Make account setup
and scenario build step by step.

### What Was Built

- Created a free Make account and a scenario: **Custom Webhook trigger → Send an Email action**.
- Pasted the Make webhook URL into `MAKE_WEBHOOK_URL` (line 38 of
  `experiments/websites/tasklift-mvp-app/src/App.jsx`).
- The webhook-firing code was already in place from earlier: a fire-and-forget
  `fetch()` POST in `handleAddCandidate` that sends `id`, `label`, `owner`,
  `risk`, `status`, `created_at` as JSON after the Supabase insert succeeds.
- In Make: captured the payload structure (6 fields), added the Email module,
  mapped all fields into the subject and body, connected an email account,
  and turned the scenario ON.

### What Worked

- End-to-end test succeeded: submit form → row saved to Supabase → webhook fired
  → Make ran → email arrived with all fields filled in.
- `npm test` (5/5) and `npm run build` both pass.

### What I Learned — Webhook Data-First Workflow

**Make can't show field labels until it receives one real payload.**
The Custom Webhook "learns" the data shape from the first POST it sees. So the
build order is: paste URL → put webhook in "listening" mode → submit one real
test form → Make detects the 6 fields → THEN map them into the email.
You can't map fields that Make hasn't seen yet.

**Why fire-and-forget (no await)?**
The form submission already succeeded — the row is in Supabase. A failed
notification should not undo the user's action or block the UI. Failures are
logged quietly with `.catch()`; retries are a Day 21 concern.

### Decisions Made

- The webhook URL is embedded directly in frontend code. This is acceptable:
  it is a public endpoint, not a secret credential. If leaked, rotate it in Make.
- Used Make instead of n8n/Zapier for the first automation — easiest free setup.
- No decision/failure-handling step yet — Day 16 is the happy path only.
  Conditional routing (risk = High) and retries come in Days 20–21.

### Useful Prompts Saved

```text
Connect this form to a Make webhook so it sends an email on submit. Walk me
through creating the Make account and scenario step by step, and explain why
the webhook must receive one real payload before I can map the email fields.
```

### Next Session

Open the Notion AI Builder plan and start Day 17:
Write form submissions to Notion / Sheets / CRM on submit.

## Day 17

Status: Complete

### Goal

Add a second automation action: when the Tasklift intake form is submitted, also
create a row in a Notion database (alongside the existing Make email notification).

### What Was Built

- Extended the Day 16 Make scenario to 3 modules: Webhook → Gmail → Notion "Create a Database Item (Legacy)".
- Created "Tasklift Submissions" Notion database via API script (`scripts/notion_create_submissions_db.py`).
- Connected Make to Notion using Internal Integration Token (not OAuth).
- Mapped 6 fields: label→Name, owner→Owner, risk→Risk, status→Status, created_at→Submitted At, id→Supabase ID.
- End-to-end test passed: form submit → email received → Notion row created.

### What I Learned — Key Gotchas

- **Notion's `Name`/title field requires Value Type "Title"** in Make, not Text or Rich Text.
  Using Text causes a [400] validation error listing every possible type.
- **Gmail [403] insufficient scopes** = the Gmail connection was created with limited OAuth permissions.
  Fix: add a new Gmail connection and grant all requested Google permissions during OAuth.
- **Notion integration must be explicitly shared with each database** via the Connections menu
  (••• → Connections → add integration). Integrations are sandboxed by default.
- **Database ID vs View ID in Notion URL:** the ID before `?v=` is the database ID; after `?v=` is the view ID.
  Only the database ID goes into Make.

### Next Session

Start Day 18: Scheduled daily digest.

## Day 18

Status: Complete

### Goal

Build a scheduled daily digest: Make queries Supabase at 8pm every day and sends
a summary email of that day's submissions.

### What Was Built

- Cloned the Day 16/17 Make scenario. Replaced the webhook trigger with an HTTP module.
- Set the scenario schedule to Daily at 8pm Asia/Kathmandu time (scenario settings → clock icon).
- HTTP module: GET request to Supabase REST API with `?created_at=gte.{{formatDate(now; "YYYY-MM-DD")}}` filter.
- Gmail module updated with digest format using `length(1.data)`, `map(1.data; "label")`, and `join()`.
- End-to-end test passed: scenario ran → Supabase returned 2 today's rows → one digest email sent.
- Added `notes/day-18-scheduled-digest.md`.

### What I Learned

**Event-driven vs time-driven:** Days 16–17 fired on form submit. Day 18 fires on a clock schedule.
The schedule is not a module — it is a scenario-level setting.

**Pulling data from Supabase in Make:**
- URL: `https://<project>.supabase.co/rest/v1/<table>?field=gte.value`
- Two required headers: `apikey` (identifies project) + `Authorization: Bearer <key>` (proves role).
- Auth type in Make: None — headers handle it.
- Parse response: Yes — decodes JSON so Make can use the fields.

**Array functions for digest email:**
- `length(1.data)` — count of rows returned
- `map(1.data; "label")` — extract one field from every item
- `join(...; "\n")` — turn the array into a line-by-line string
- Without these, you can't turn a list of rows into one readable email.

**Why one email and not many:** HTTP returned all rows as one bundle (a `data` array inside
Bundle 1). Gmail ran once because there was one bundle. If data arrived as separate bundles
(e.g. via an iterator), Gmail would run once per bundle — producing one email per row.

### Decisions Made

- Digest runs at 8pm Kathmandu time daily — arbitrary choice, easy to change in schedule settings.
- No Notion module added to this scenario — digest is email-only (adding Notion log is a Day 21 concern).
- No empty-state handling yet — if zero rows today, the email sends with count = 0.

### Useful Prompts Saved

```text
Build a Make scenario that queries Supabase on a daily schedule and sends a digest email.
Explain the difference between a webhook trigger and a schedule trigger, how to call the
Supabase REST API with headers, and how to turn an array of rows into one email using
length, map, and join.
```

### Next Session

Open the Notion AI Builder plan and start Day 19:
File upload to processing workflow.

## Day 19

Status: Design approved — implementation not started.

### Goal

Standalone file-upload panel in the Tasklift app: upload a PDF/PNG/JPG (≤10 MB) to a
private Supabase Storage bucket, save a metadata row, fire a Make webhook, and show a
visible processing status. (Notion plan: "File upload to processing workflow.")

### What Was Done This Session

- Pulled the exact Day 19 spec from the Notion plan via `scripts/notion_fetch_day.py`
  (reads the Notion token from `D:\Claude\AI_optimization\.env`, no hardcoded secret).
- Brainstormed the full design and got approval on all 5 sections.
- Wrote the spec: `docs/superpowers/specs/2026-06-05-day-19-file-upload-design.md`.

### Design Decisions (see spec for detail)

- **Approach A:** real `uploaded_files` metadata table (mirrors the `First_app_data`
  mental model) + bytes in a **private** Storage bucket `uploads`.
- Client validation = UX only; **bucket-level MIME/size limits + RLS are the real
  enforcement.** This is the "files are risky" security lesson.
- Upload order: bytes → metadata row → Make webhook (fire-and-forget, Day 16 pattern).
- Status: `Processing` → manual **Mark done** → `Done` (the human review point).
- View files via short-lived (60s) **signed URLs** because the bucket is private.
- Testing taxonomy clarified: only the `validateFile()` Vitest tests are **unit** tests;
  the 7-row manual table is **manual/integration** (each crosses a boundary). Unit test
  proves the rule; manual test 3 proves the rule is wired into the UI.

### Next Session

1. User reviews the spec (`docs/superpowers/specs/2026-06-05-day-19-file-upload-design.md`).
2. Invoke `writing-plans` to turn the spec into a step-by-step implementation plan
   (Supabase setup steps for the user + React build steps for Claude + Vitest tests).
3. User does the hands-on Supabase setup: create `uploaded_files` table, private
   `uploads` bucket, RLS policies, and a new Make Webhook→email scenario.
4. Build `lib/fileUpload.js`, `FileUpload.jsx`, wire into `App.jsx`.
