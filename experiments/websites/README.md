# Website Experiments

Use this folder for small website builds and notes.

Each experiment should have:

- A short goal.
- The prompt used.
- Screenshots or notes.
- Manual test checklist.
- What to reuse later.

## First Experiment Idea

Build a simple landing page with:

- Header
- Hero section
- Three feature blocks
- Contact form
- Mobile responsive layout

## Startup Automation Site

Folder: `experiments/websites/startup-automation-site/`

Goal: Build a clean one-page website for a startup automation company that helps companies reduce repetitive manual tasks.

Prompt used:

```text
Build a clean one-page website for startup automation company thats on a starting journey and helps company with their manuual tasks. Use simple, professional design. Include header, hero, three features, and contact section. Make it responsive. After building, explain the page structure in plain English.
```

Manual test checklist:

- [ ] Page opens in a browser.
- [ ] Header links jump to the correct sections.
- [ ] Hero message is clear.
- [ ] Three feature blocks are visible.
- [ ] Contact form fields are usable.
- [ ] Layout works on mobile width.

Reusable lesson:

- For one-page navigation, use links like `href="#contact"` and matching unique IDs like `id="contact"`.
- Use `scroll-margin-top` on anchor targets if a fixed header covers the target after clicking a nav link.
- Put metadata, CSS links, and responsive viewport settings in `<head>`; put visible page content in `<body>`.
- A static site can simulate app behavior with browser JavaScript and `localStorage`, but a real lead workflow needs a backend/API and database.
- Secrets such as API keys and database credentials should not be placed in public HTML, CSS, or browser JavaScript.

## Day 5 Landing Page Iteration

Goal: Improve the existing Tasklift page for clarity and conversion without adding unnecessary sections.

Prompt used:

```text
Improve this landing page for clarity and conversion. Keep the design simple and professional. Do not add unnecessary sections. Explain the changes and give me a manual review checklist.
```

What changed:

- Hero copy now focuses on a 48-hour workflow review.
- The primary CTA now asks visitors to request a workflow review.
- A compact trust strip was added under the CTA.
- Feature and contact copy now focus on one repeated weekly process.

Manual review checklist:

- [ ] Page has one clear goal.
- [ ] CTA is obvious.
- [ ] Contact form still validates entries.
- [ ] Saved submissions still display from browser storage.
- [ ] Mobile layout stays readable.

## Day 6 Deployment Prep

Goal: Prepare the existing Tasklift static site for a first public deployment.

Recommended first host: Netlify connected to GitHub.

GitHub repo:

```text
https://github.com/ayushkarkiofficial-lgtm/30-day-basics.git
```

Folder to deploy:

```text
experiments/websites/startup-automation-site/
```

Why this works:

- The site is static HTML, CSS, and browser JavaScript.
- There is no build command.
- There are no dependencies to install.
- There are no environment variables.

Netlify settings:

```text
Branch: master
Base directory: experiments/websites/startup-automation-site
Build command: leave blank
Publish directory: .
```

Manual public URL checklist:

- [ ] Push the workspace to GitHub.
- [ ] Connect Netlify to the GitHub repo.
- [ ] Open the generated public URL.
- [ ] Confirm the page, image, navigation links, form validation, success state, and saved submissions work.
- [ ] Test mobile width.
- [ ] Save the public URL in `notes/ai-dev-log.md`.
