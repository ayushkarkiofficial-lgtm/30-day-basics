# Tasklift MVP App

Week 2 app scaffold for the AI Builder plan.

## Stack

- React with Vite for the app shell.
- Tailwind for styling.
- Supabase later for database, auth, and storage.
- Netlify for hosting.
- n8n, Make, or Zapier later for external automations.

## Local Commands

```powershell
npm install
npm run dev
```

## Folder Mental Model

- `src/App.jsx` - main app composer. It imports the screen sections and decides their order.
- `src/components/` - reusable visible UI sections, such as the sidebar, hero, intake form, review queue, and stack section.
- `src/data/demoData.js` - temporary demo data used by the app shell before a real database exists.
- `src/main.jsx` - connects React to the browser page.
- `src/index.css` - Tailwind imports and global styles.
- `index.html` - browser entry file.
- `tailwind.config.js` - tells Tailwind where to scan for class names.
- `vite.config.js` - Vite app setup.

## Current Scope

This is only the Week 2 app shell. It does not have real database storage, auth, or automation integrations yet.
The form does not submit anywhere yet; it is a visual placeholder for the later intake workflow.
