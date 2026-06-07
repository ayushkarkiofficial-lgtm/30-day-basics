# Day 19 — File Upload Notes (risks & lessons)

## What I built
A standalone "Upload a file" panel in the Tasklift app. Validates PDF/PNG/JPG
≤10 MB, stores bytes in a **private** Supabase bucket (`uploads`), saves a
metadata row in `uploaded_files`, fires a Make webhook (fire-and-forget), and
shows each file with a status badge that flips Processing → Done via a manual
"Mark done" button.

## Key lessons
- **Client validation ≠ security.** `validateFile()` is UX only — it gives
  instant feedback. Anyone can bypass it (curl, devtools). The REAL enforcement
  is the bucket's MIME-type + 10 MB size limits and RLS policies on the server.
- **Bytes before metadata.** Upload the file first, then insert the row. This
  way a row never points at a missing file.
- **Webhook last + best-effort.** The metadata row is the source of truth; the
  Make notification is fire-and-forget (same reasoning as Day 16).
- **Private bucket + signed URLs.** Files aren't publicly readable. "View" mints
  a 60-second signed URL — the link is dead a minute later. Concrete version of
  "files are risky."

## Known edge case (not solved — Day 21 territory)
- **Orphaned byte:** if the Storage upload succeeds but the metadata insert
  fails, the file sits in the bucket with no row pointing at it. No cleanup /
  transaction yet — that's the logs/retries/idempotency work on Day 21.

## Prompt used
(Record the brainstorming/spec prompt here for the dev log.)
