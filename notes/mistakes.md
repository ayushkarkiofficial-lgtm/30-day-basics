# Mistakes

Use this file to record mistakes so they become reusable lessons.

## Mistake Template

### What Happened

Describe the issue plainly.

### Why It Happened

What assumption or missing check caused it?

### Fix

What solved it?

### Prevention

What checklist item or prompt would prevent it next time?

---

## Git Workspace Ownership Warning

### What Happened

Git refused to add files because the repo was marked as having dubious ownership. `git status` also warns that `C:\Users\Acer/.config/git/ignore` cannot be accessed.

### Why It Happened

The `.git` folder appears to be owned by a different Windows user than the current shell user.

### Fix

No fix was applied yet. Commits were skipped for the Day 5 session after the user asked to avoid commits for now.

### Prevention

Before starting a commit workflow, run `git status --short`. If Git reports dubious ownership, decide whether to mark the repo as a safe directory or recreate the repo under the current user.

## AI Did Multiple Days In One Session Without Stopping

### What Happened

At the start of the session, Claude read the progress log, marked Day 9 complete, implemented all of Day 10, wrote the notes file, and updated the dev log — all in one shot without pausing for the user to learn, question, or do anything.

### Why It Happened

The instruction was "go through the progress log and continue." That was treated as permission to do as much as possible, instead of one day at a time with the user involved.

### Fix

User corrected it immediately. Explanation of Day 10 was given separately afterward.

### Prevention

One day per session. Before implementing anything, explain what the day covers and why. Let the user ask questions first. Only build after the concept is understood. The user is here to learn, not watch.

---

## Codex Ran Mutating Git Commands

### What Happened

Codex ran `git add`, `git commit`, and `git push` even though the user's standing preference is to run Git terminal commands manually.

### Why It Happened

The phrase "let's commit and push" was treated as permission for Codex to run the commands, instead of a request to provide the commands for the user to run.

### Fix

The preference was strengthened in `notes/decisions.md`: Codex should provide exact Git commands in a code block by default and should not run mutating Git commands unless the user clearly says Codex should run them directly.

### Prevention

When Git changes are needed, Codex should respond with:

## Default Supabase Policy Blocks Unauthenticated Apps

### What Happened

The app could not read or insert rows even though the anon key was set up
correctly. The policy in place was "authenticated users only" — the Supabase
default — which blocked all requests from the app because there was no login
system.

### Why It Happened

Supabase enables RLS on new tables and adds a default policy for authenticated
users only. The anon role has no permissions until you explicitly create policies
for it.

### Fix

Added two explicit policies in the Supabase SQL Editor:
- `create policy "Allow public read" on "public"."First_app_data" for select to anon using (true);`
- `create policy "Allow public insert" on "public"."First_app_data" for insert to anon with check (true);`

### Prevention

When creating a Supabase table for an app without auth:
1. Enable RLS on the table.
2. Immediately add explicit anon SELECT and INSERT policies.
3. Do not rely on the default policy — it only covers authenticated users.

---

```powershell
git status
git add <files>
git commit -m "<message>"
git push
```

Then wait for the user to run the commands and paste back any output that needs review.

---

## Client-Side ID Passed To Supabase Insert

### What Happened

`IntakeForm.jsx` constructed the candidate object with a client-generated
`id: \`candidate-${Date.now()}\`` field and passed it to `handleAddCandidate`.
`handleAddCandidate` correctly ignored it by only spreading `label`, `owner`,
`status`, and `risk` into the Supabase `.insert({})` call — so no live bug
existed. However, if a future developer refactored the insert to spread the
full candidate object (`...candidate`), Supabase would receive a string `id`
into what is likely a `uuid` column and throw an error.

### Why It Happened

The `id` field was added to the candidate object early in the project to
give React a temporary `key` prop for list rendering before the real
Supabase UUID was available. When Day 11 introduced real Supabase inserts,
the `id` field was never cleaned up from `IntakeForm`.

### Fix

Removed the `id: \`candidate-${Date.now()}\`` line from the `onAddCandidate`
object in `IntakeForm.jsx`. The real UUID comes from Supabase and is returned
by `.select().single()` after insert.

### Prevention

When introducing a real backend insert, audit all form submit handlers for
client-generated fake IDs that were added for demo or local-state purposes.
Remove them so they cannot accidentally be sent to the database.

---

## Direction Error In Code Comment

### What Happened

A comment inside `handleStatusChange` said "caught by the error check above"
but the `if (error)` check was written below the `.single()` call in the
file, not above it. A learner reading top-to-bottom would be confused.

### Why It Happened

The comment was written while thinking about the logical flow (error handling
is conceptually "above" the success path) rather than the physical order of
lines in the file.

### Fix

Changed "above" to "below" to match the actual file order.

### Prevention

When writing comments that reference other lines with directional words
(above, below, before, after), verify the direction against the actual
line order in the file before saving.
