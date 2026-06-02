# Day 8 Stack Decision

## Goal

Choose one boring MVP stack for Week 2 and stop switching tools.

## Chosen Stack

- App framework: React with Vite
- Styling: Tailwind CSS
- Database/auth/storage later: Supabase
- Hosting: Netlify
- External automations later: n8n, Make, or Zapier

## Why This Stack

- React and Vite are common, fast, and well understood by AI coding tools.
- Tailwind makes UI changes easy to request and review without writing much custom CSS.
- Supabase gives one place to learn tables, auth, storage, and environment variables later.
- Netlify is already part of this repo's deployment workflow from Week 1.
- n8n, Make, or Zapier can handle external automations without building every backend step from scratch.

## What Was Scaffolded

Folder:

```text
experiments/websites/tasklift-mvp-app/
```

Files:

```text
package.json
index.html
vite.config.js
tailwind.config.js
postcss.config.js
src/main.jsx
src/App.jsx
src/index.css
README.md
```

## Folder Mental Model

- `package.json` lists the app commands and dependencies.
- `index.html` is the browser entry page.
- `src/main.jsx` mounts the React app into the page.
- `src/App.jsx` contains the current app screen.
- `src/index.css` loads Tailwind and global styles.
- `vite.config.js` configures the local app builder.
- `tailwind.config.js` tells Tailwind which files to scan.

## Verification

Installed dependencies:

```powershell
npm install
```

Production build passed:

```powershell
npm run build
```

Local dev server:

```text
http://127.0.0.1:5173/
```

## Current Scope

This is an app shell only. It does not yet have real data storage, auth, protected routes, or automation integrations.

## Next Step

Day 9 should build the homepage plus dashboard shell more deliberately, using this app as the Week 2 project base.
