# Day 9 - Homepage And Dashboard Shell

## Goal

Turn the Week 2 React scaffold into a clearer Tasklift app shell and explain the folder structure in plain English.

## What Changed

- Split the visible app into focused React components under `src/components/`.
- Moved temporary review, metric, and stack data into `src/data/demoData.js`.
- Kept `src/App.jsx` as the main screen composer.
- Added a small dashboard summary row above the intake form.
- Updated the Tasklift app README with the new folder mental model.

## Component Mental Model

- `App.jsx` decides what appears on the page and in what order.
- `Sidebar.jsx` owns the left navigation.
- `HeroPanel.jsx` owns the top message for the app shell.
- `DashboardSummary.jsx` receives metric data and renders summary cards.
- `IntakeForm.jsx` owns the visual workflow intake form.
- `ReviewQueue.jsx` receives review items and renders the table.
- `StackSection.jsx` receives stack data and renders the technology cards.
- `demoData.js` holds temporary content until real Supabase data exists.

## Important Learning

React components are just functions that return UI. Passing data into a component through props lets the same component stay reusable instead of hardcoding everything inside it.

## Current Non-Goals

- No real form submission.
- No localStorage.
- No Supabase connection.
- No login.
- No routing between pages.
- No automation integration.

## Manual Test

1. Run `npm run build` in `experiments/websites/tasklift-mvp-app`.
2. Start or refresh the dev server.
3. Open the app locally.
4. Confirm the sidebar links jump to Dashboard, Intake, Review queue, and Stack.
5. Confirm the table still shows three demo workflow candidates.
