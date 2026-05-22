# Day 4 Feature Spec: Saved Submissions List

## Context

Tasklift Automation is a static one-page website in `experiments/websites/startup-automation-site/`. The contact form already validates name, email, and task fields in browser JavaScript, then saves valid submissions to `localStorage` under the `taskliftLeads` key.

## Goal

Add a small saved submissions view so a user can see the demo contact requests saved in the current browser. The newest submissions should be easiest to scan, and the list should update immediately after a valid form submission.

## Constraints

- Keep the site static and openable directly from `index.html`.
- Use the existing `taskliftLeads` `localStorage` data.
- Do not add a backend, database, auth, build tool, or external dependency.
- Keep edits scoped to the existing website files unless learning notes need an update.
- Make the list readable at desktop and mobile widths.
- Treat stored submissions as browser-local demo data, not private production data.

## Acceptance Criteria

- [ ] When no submissions are stored, the page shows a clear empty state.
- [ ] When `taskliftLeads` contains submissions, the page displays name, email, task, and submitted time.
- [ ] Submissions display newest first.
- [ ] After a valid form submit, the list updates without refreshing the page.
- [ ] Existing validation for empty fields and invalid email still works.
- [ ] Refreshing the page preserves and displays saved submissions from `localStorage`.

## Non-Goals

- Do not send data to a server.
- Do not add lead management actions like edit, delete, export, or search.
- Do not redesign the whole website.
- Do not protect or encrypt browser-local demo submissions.

## Manual Test

1. Open `experiments/websites/startup-automation-site/index.html` in a browser.
2. Confirm the saved submissions area shows an empty state when `taskliftLeads` is empty.
3. Submit a valid name, email, and manual task.
4. Confirm the success message appears and the saved submissions list updates.
5. Refresh the page and confirm the saved submission still appears.
6. Submit a second valid request and confirm it appears above the older request.
7. Try empty fields and an invalid email address and confirm validation errors still appear.
8. Check desktop and mobile widths for readable layout with no overlapping text.
