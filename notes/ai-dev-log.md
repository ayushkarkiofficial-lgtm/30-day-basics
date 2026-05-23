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
