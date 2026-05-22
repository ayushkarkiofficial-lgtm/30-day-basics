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

Scope: While working in `D:\Claude\30_day_plan`, Codex should not run Git terminal commands unless the user explicitly asks Codex to run one. Codex may still explain Git commands, suggest exact commands for the user to run, interpret command output the user pastes back, review diffs, and recommend what to commit.

Revisit when: The user asks Codex to run Git commands for a specific task or workflow.
