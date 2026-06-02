# Manual Test Checklist

Use this before saying a feature is done.

## Basic Website Checks

- Page loads without errors.
- Main action is obvious.
- Mobile layout works.
- Buttons and forms behave as expected.
- Error states are understandable.
- No private keys or secrets are visible.

## Tasklift App Checks (run after any code change)

**Automated first:**
- [ ] `npm run build` exits clean
- [ ] `npm test` — 5 tests pass

**Page load**
- [ ] Page opens without errors
- [ ] Loading message appears, then queue loads from Supabase
- [ ] Dashboard shows 4 metric cards

**Create**
- [ ] Submit intake form → row appears at top of queue
- [ ] "Processes in review" count increments

**Update**
- [ ] Click a status button → badge updates immediately
- [ ] Click "Completed" → row leaves queue, appears in showcase
- [ ] "Automations completed" count increments

**Delete**
- [ ] Click Delete → row disappears, count decrements

**Showcase section**
- [ ] Clicking "Automations completed" card scrolls to showcase
- [ ] Empty state: "No completed automations yet." when none exist
- [ ] Completed cards show correct label, owner, badge

**Edge cases**
- [ ] Delete all items → queue shows "No candidates yet."

## Automation Checks

- Trigger works.
- Correct data is passed.
- Action completes.
- Success is logged.
- Failure is visible.
- Duplicate runs are considered.
- Human review exists for risky AI output.
