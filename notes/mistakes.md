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
