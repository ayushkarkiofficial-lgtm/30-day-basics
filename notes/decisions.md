# Decisions

Use this file to record choices so you do not re-decide the same things later.

## Decision Template

### Decision

What did you choose?

### Why

Why is this the practical choice?

### Alternatives Considered

What else could you have chosen?

### Revisit When

When should this decision be reconsidered?

---

## Current Decisions

### Use this repo as the learning workspace

Why: One place for prompts, notes, experiments, and checklists keeps AI-assisted work organized.

Revisit when: The workspace becomes too large or a real production project needs its own repo.

### Use manual file routing before automating it

Why: The routing habit is still new. A manual phrase keeps the workflow simple and avoids hook/config distraction.

Alternatives considered: Add a Claude Code hook immediately. If automated later, a `Stop` hook fits better than a `PreToolUse` hook because routing is an end-of-task reminder.

Revisit when: Remembering to run file routing becomes annoying or the workflow is stable enough to automate.

### Improve the existing Tasklift page for Day 5

Why: Continuing the same site keeps the 30-day learning path focused and makes before/after landing page improvements easier to compare.

Alternatives considered: Create a separate landing page experiment, or only track progress without changing the site.

Revisit when: A new business idea needs its own landing page or the Tasklift demo becomes too crowded for the current learning goal.

### Use GitHub plus Netlify for public deployment

Why: The GitHub repo becomes the source of truth for the 30-day-plan, and Netlify can deploy the static Tasklift site directly from the repo.

Repo: `https://github.com/ayushkarkiofficial-lgtm/30-day-basics.git`

Netlify settings: branch `master`, base directory `experiments/websites/startup-automation-site`, blank build command, publish directory `.`.

Alternatives considered: Netlify Drop for a one-time upload, GitHub Pages for static hosting, Vercel for a Git-based static deployment.

Revisit when: The project moves to a framework app, needs environment variables, or the repo branch changes from `master` to `main`.

### User handles Git terminal commands manually

Why: The user wants to build confidence using Git from the terminal directly while Codex focuses on helping with code, docs, explanations, reviews, and command guidance.

Scope: While working in `D:\Claude\30_day_plan`, Codex should not run mutating Git terminal commands for the user. This includes `git add`, `git commit`, `git push`, branch changes, merges, rebases, resets, and checkouts.

Default behavior: Codex should give the exact Git commands in a code block and let the user run them manually. Codex may still explain Git commands, run read-only checks when needed, interpret command output the user pastes back, review diffs, and recommend what to commit.

Important wording rule: If the user says "let's commit", "let's push", or similar, treat that as a request for the commands to run, not permission for Codex to run Git automatically. Only run mutating Git commands if the user clearly says Codex should run them directly.

Revisit when: The user asks Codex to run Git commands for a specific task or workflow.

### Use React, Vite, Tailwind, Supabase, Netlify, and n8n-style automation for Week 2

Why: This is a boring, common stack that AI coding tools understand well. It keeps the focus on building and reviewing useful app behavior instead of switching frameworks.

Scope: Week 2 app work should start from `experiments/websites/tasklift-mvp-app/`. Use React with Vite for the frontend shell, Tailwind for styling, Supabase later for database/auth/storage, Netlify for hosting, and n8n/Make/Zapier for external automations where practical.

Alternatives considered: Next.js instead of Vite, Vercel instead of Netlify, and custom backend code before Supabase. These are reasonable later, but they add switching cost right now.

Revisit when: The app needs server-rendered pages, complex backend logic, custom API routes, or a production requirement that Vite plus Supabase cannot handle cleanly.

### Use the Notion HTML/JS reference page as a living syntax log

Why: Instead of only saving prompts and notes locally, new syntax patterns and concepts learned during a session should be appended to the Notion reference page so they are readable and searchable outside the repo.

Scope: After learning a new syntax concept in any session, append it to the Notion page using the API. Credentials are at `D:\Claude\AI_optimization\.env` under `NOTION CONNECTION TOKEN`. Page URL: https://www.notion.so/HTML-and-JavaScript-Basics-for-Automation-Projects-36632f18146f81439bb8e87425e3b78c

Alternatives considered: Saving everything only in `notes/prompt-library.md`. That file works for prompts but is not well-suited for structured syntax references with code examples.

Revisit when: A dedicated documentation tool or wiki replaces Notion, or the page becomes too large to be useful.

### Use the Notion Supabase page as a living reference for Supabase concepts

Why: Supabase has many moving parts — keys, roles, RLS policies, client setup, table design. Keeping a dedicated Notion page means these concepts are searchable and readable outside the repo, separate from the HTML/JS syntax log.

Scope: After learning any Supabase concept in a session, append it to this page using the same Notion API connection (token at `D:\Claude\AI_optimization\.env` under `NOTION CONNECTION TOKEN`).

Page URL: https://www.notion.so/Supabase-Ins-and-Outs-36b32f18146f8085b974d953f67fe824
Page ID: 36b32f18-146f-8085-b974-d953f67fe824

Alternatives considered: Adding Supabase notes to the existing HTML/JS page. Kept separate because Supabase is backend/database territory, not frontend syntax.

Revisit when: A dedicated docs tool replaces Notion, or Supabase concepts move into a project-specific wiki.

### Store project credentials in D:\Claude\30_day_plan\.env

Why: The tasklift-mvp-app needs Supabase credentials to connect to the database. Keeping them in a local `.env` file outside the React source folder means they are easy to find but not hardcoded into component files.

Scope: All Supabase credentials for the 30-day-plan project live in `D:\Claude\30_day_plan\.env`. Current values:
- SUPABASE URL: https://lfqvnkseyetoilxiylsz.supabase.co
- ANON KEY: stored in file (safe for frontend use — Supabase RLS controls access)
- PUBLISHABLE KEY: stored in file
- SECRET KEY: stored in file (do not use in frontend code — backend/server only)

The `.env` file must be listed in `.gitignore` so credentials are never committed to GitHub.

In the React app, credentials are referenced via Vite environment variables using the `VITE_` prefix in a `.env` file inside the app folder (e.g. `experiments/websites/tasklift-mvp-app/.env`).

Alternatives considered: Hardcoding the URL and anon key directly in the Supabase client file. Works for demos but is bad practice — credentials end up in Git history.

Revisit when: The project moves to a real production environment with proper secrets management (e.g. Netlify environment variables, Supabase Vault, or a backend proxy).

### Use Make (make.com) for the first form-to-email automation

Why: Make has the simplest free setup for a webhook-triggered email — create a Custom
Webhook trigger, point the app's `fetch` POST at it, add a Send-an-Email action. No code
to host, no server to manage.

Scope: Day 16's automation. The React app fires a fire-and-forget `fetch` POST to the
Make webhook after a successful Supabase insert. Future automations (Days 17–21) can
add more Make modules or switch to n8n if self-hosting is wanted.

Alternatives considered: n8n (more powerful, but needs hosting), Zapier (fewer free ops),
or a Supabase edge function (more code). Make wins on lowest setup cost for learning.

Revisit when: An automation needs logic Make can't do cleanly, or self-hosting/n8n is
preferred for cost or control.

### Embed the Make webhook URL directly in frontend code

Why: A webhook URL is a public endpoint, not a secret credential like the Supabase
service key. It is safe to commit. The URL itself is the only "secret" — anyone who
knows it can trigger the scenario — so the mitigation is rotation, not hiding.

Scope: `MAKE_WEBHOOK_URL` is a `const` at the top of `App.jsx`. Unlike the Supabase
keys (which live in `.env` / Netlify env vars), this URL is hardcoded and committed.
Consequence: once deployed, the live Netlify site also fires the webhook, so real
submissions there send a real email.

Alternatives considered: Storing it as a `VITE_` env var like the Supabase keys. Not
necessary — it's not a credential — but would be the move if we ever wanted to swap
URLs per environment without a code change.

Revisit when: The URL is leaked/abused (rotate it in Make), or we need different
webhook URLs for local vs production.

---

## AI Collaboration Rules (Claude + Codex shared workspace)

This project is worked on by both Claude Code and Codex. The following rules apply to
both AIs to ensure they do not undo each other's work or break established patterns.

### Architecture: App.jsx is the single source of truth

Why: All Supabase calls, state declarations, and derived metrics live in `App.jsx`.
Components under `src/components/` are presentation-only — they receive data via props
and fire events upward via callback props. This keeps data flow predictable.

Rule: Never add a Supabase call inside a component file. If a component needs to
mutate data, it should call a prop callback (e.g. `onStatusChange`, `onDelete`) that
App.jsx implements.

Revisit when: The app grows large enough that a context or custom hook layer is needed.

### State mutation patterns

When updating `queueItems` in App.jsx after a Supabase operation, always use:
- **INSERT**: prepend the server-returned row — `[data, ...current]`
- **UPDATE**: map and replace — `current.map((item) => (item.id === id ? data : item))`
- **DELETE**: filter out — `current.filter((item) => item.id !== id)`

Always use the server-returned row (via `.select().single()`) for INSERT and UPDATE,
not the locally-constructed object. Supabase generates the real UUID and `created_at`.

### Naming conventions

- Handler functions in App.jsx: `handle*` prefix (e.g. `handleStatusChange`, `handleDelete`)
- Props passed to child components: `on*` prefix (e.g. `onStatusChange`, `onDelete`)
- Supabase table name: stored as `const TABLE = "First_app_data"` in App.jsx.
  Never hardcode the table name string elsewhere — always import or reference TABLE.

### Verification: no test suite — use the build

Why: This project has no automated test suite. The build is the fastest correctness check.

Rule: After any code change, run `npm run build` inside
`experiments/websites/tasklift-mvp-app/`. If the build passes, the change is
syntactically correct. Manual browser testing is the next step.

### Comment style: explain WHY not just WHAT

Why: This is a learning project. The target reader is someone learning React and
Supabase for the first time. Comments should explain the reasoning, not just restate
the code.

Rule: Every new function or non-obvious pattern should have a comment block that
answers "why is it done this way?" not just "what does this line do?".

### RLS policy rule

Why: Supabase blocks all anon requests by default. Every new Supabase operation
(SELECT, INSERT, UPDATE, DELETE) requires an explicit RLS policy for the `anon` role
on the relevant table before it will work.

Rule: Before implementing a new Supabase operation in code, confirm the matching
RLS policy exists in the Supabase dashboard. Current policies on `First_app_data`:
- anon SELECT ✅
- anon INSERT ✅
- anon UPDATE ✅ (added Day 12)
- anon DELETE ✅ (added Day 12)

### Git commands: user runs them

Why: The user is building Git confidence by running commands in the terminal directly.

Rule: Neither Claude nor Codex should run `git add`, `git commit`, `git push`,
or any other mutating Git command. Provide the exact commands in a code block and
wait for the user to run them. Read-only commands (`git status`, `git log`, `git diff`)
are fine to run when needed for diagnosis.

---

## Use spec → plan → subagent workflow for new features

Why: Jumping straight to code without a design produces inconsistent, hard-to-review
changes. The spec-first workflow catches scope and design problems before any code is
written, and the plan gives both Claude and Codex a shared reference for what was
intentionally built.

Scope: For any Day that introduces new behavior (new Supabase operations, new
components, new state), follow this order:
1. Brainstorm — explore intent, ask clarifying questions, propose approaches
2. Write spec — save to `docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md`
3. Write implementation plan — save to `docs/superpowers/plans/YYYY-MM-DD-<topic>.md`
4. Execute — subagent-driven development, one task at a time with spec + quality review

Alternatives considered: Inline implementation without a spec. Works for trivial one-liner
changes but produces unreviewed scope drift on anything involving Supabase or new components.

Revisit when: The workflow feels like overhead for genuinely trivial changes (e.g.
a one-line CSS fix or a comment update). Those can skip straight to implementation.
