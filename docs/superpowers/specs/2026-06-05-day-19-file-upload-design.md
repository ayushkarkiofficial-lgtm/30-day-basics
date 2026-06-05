# Day 19 — File Upload To Processing Workflow (Design)

**Date:** 2026-06-05
**Status:** Design approved. Implementation not started.
**App:** `experiments/websites/tasklift-mvp-app` (React + Vite + Tailwind + Supabase)

---

## Goal (from Notion plan)

Users can upload a file and the app starts a processing workflow. File automation
needs: upload, storage, metadata, processing status, and limits. Files are risky, so
keep the first version simple.

**Done checklist:** valid file uploads · invalid file is rejected · processing status visible.

## Decisions (from brainstorming)

- **Standalone** "Upload a file" panel — isolated from the intake form and review queue.
- Accept **PDF / PNG / JPG**, max **10 MB**.
- **Private** Supabase Storage bucket; viewing uses short-lived **signed URLs**.
- On upload → store file → save metadata row → **fire a Make webhook** (fire-and-forget, like Day 16).
- Status lifecycle: `Processing` → (manual **Mark done**) → `Done`. The manual flip is the
  human review point from the Day 15 automation mental model.
- Approach **A**: a real metadata table mirrors the existing `First_app_data` mental model
  (a table you query + insert into), with bytes living in Storage.

---

## Section 1 — Architecture & components

| Piece | Type | Built by |
|---|---|---|
| `uploaded_files` table | Supabase | User (hands-on) |
| Private Storage bucket `uploads` | Supabase | User (hands-on) |
| RLS policies (table + bucket) | Supabase | User (hands-on) |
| New Make scenario (Webhook → email) | Make | User (hands-on) |
| `FileUpload.jsx` component | React | Claude |
| `lib/fileUpload.js` helpers (validate + upload) | React | Claude |
| Wiring in `App.jsx` (state, fetch, handlers) | React | Claude |

Panel rendered in `App.jsx` after `IntakeForm`:
Hero → Summary → Intake → **Upload** → Queue → Completed → Stack.

```
FileUpload.jsx  (standalone panel)
├── <form>: file input + "Upload" button + inline error/success
└── <ul>: list of uploaded files
     └── per row: name · type · size · status badge · [View] [Mark done]
```

Split mirrors the existing pattern: the panel owns local form state (selected file,
error, uploading flag); `App.jsx` owns the file list + all Supabase calls — same as
`queueItems` today. Nothing existing changes except adding the panel + handlers.

## Section 2 — Data model + Supabase setup (user, hands-on)

**Table `uploaded_files`:**

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | PK, default `gen_random_uuid()` |
| `file_name` | `text` | original name, for display |
| `file_path` | `text` | path inside bucket (used to mint signed URLs) |
| `file_type` | `text` | MIME type |
| `file_size` | `int8` | bytes |
| `status` | `text` | `Processing` → `Done` |
| `created_at` | `timestamptz` | default `now()` |

**Bucket `uploads`:** private. Bucket-level safety nets (real server-side enforcement):
- Allowed MIME types: `application/pdf, image/png, image/jpeg`
- Max file size: `10 MB`

**RLS (anon role, matching `First_app_data`):**
- `uploaded_files`: SELECT, INSERT, UPDATE
- bucket `uploads`: INSERT (upload) + SELECT (signed URL)

**Security lesson:** client-side type/size checks are UX only and bypassable. The bucket
MIME/size limits + RLS are the real enforcement. To be documented in the risks note.

## Section 3 — Data flow (upload sequence)

```
1. VALIDATE (client, lib/fileUpload.js)
   - type in [pdf,png,jpeg]?  no -> error, stop
   - size <= 10 MB?           no -> error, stop
2. UPLOAD BYTES -> Storage
   path = `${crypto.randomUUID()}-${file.name}`
   supabase.storage.from('uploads').upload(path, file)
   on error -> error, stop
3. INSERT METADATA ROW -> uploaded_files
   { file_name, file_path: path, file_type, file_size, status: 'Processing' }
   .select().single()
   on error -> error, stop
4. PREPEND returned row to local state
5. FIRE MAKE WEBHOOK (fire-and-forget)
   POST { id, file_name, file_type, file_size, file_path, created_at }
   .catch(warn)
6. Reset form, show success
```

Ordering rationale:
- **Bytes before metadata** — never create a row pointing at a missing file.
- **Webhook last** — the metadata row is the source of truth before notifying Make;
  the notification is best-effort (Day 16 reasoning).

On first load, `App.jsx` fetches `uploaded_files` newest-first in a second `useEffect`
parallel to the `queueItems` fetch, so the list survives refresh.

## Section 4 — Viewing, status lifecycle, error handling

**View (private bucket):** `[View]` calls
`supabase.storage.from('uploads').createSignedUrl(file_path, 60)` → opens a URL valid
60s in a new tab. Short-lived by design — concrete "files are risky" lesson.

**Status:** new rows start `Processing`. `[Mark done]` runs an `update` (same shape as
`handleStatusChange`) → `Done`. Colored badge reuses existing badge styling
(amber `Processing`, green `Done`).

**Error handling (all inline, nothing silent):**

| Failure | User sees | State |
|---|---|---|
| Wrong type / too big | "Only PDF, PNG, or JPG up to 10 MB." | nothing uploaded |
| Storage upload fails | "Upload failed — try again." | nothing uploaded |
| Metadata insert fails | "Couldn't save file details." | orphaned byte (noted in risks) |
| Webhook fails | nothing (console warn) | file uploaded fine |

Orphaned-byte edge case (step 2 ok, step 3 fails): documented in risks, not solved now
(cleanup/transactions are Day 21 territory).

## Section 5 — Testing

**Unit tests (Vitest) — the ONLY unit tests here:** `validateFile()` in `lib/fileUpload.js`,
pure logic like Day 13's `computeMetrics`:
- valid pdf/png/jpeg → valid
- bad type (e.g. text/plain) → invalid
- oversized (> 10 MB) → invalid
- boundary (exactly 10 MB) → valid

**Manual / integration tests (each crosses a boundary — NOT unit tests):**

| # | Test | Expected | Category | Done checkbox |
|---|---|---|---|---|
| 1 | Upload valid PDF | In list, `Processing`, Make email arrives | integration (manual) | valid file uploads |
| 2 | Upload valid PNG/JPG | Same | integration (manual) | valid file uploads |
| 3 | Try `.txt`/`.docx` | Inline error, nothing stored | manual | invalid rejected |
| 4 | Try 11 MB+ file | Inline error | manual | invalid rejected |
| 5 | Click View | Opens via signed URL; dead after 60s | integration (manual) | signed-URL safety |
| 6 | Click Mark done | Badge `Processing` → `Done`, survives refresh | integration (manual) | status visible |
| 7 | Refresh page | List persists (fetched from table) | integration (manual) | persistence |

Why both test 3 and the unit test exist (same Day 13 reasoning): the **unit test** proves
the validation *logic* is correct in isolation; **manual test 3** proves the logic is
*wired into the UI* and its result is acted on. A correct-but-unwired validator passes the
unit test and fails test 3.

**Risks doc:** `notes/day-19-file-upload.md` — client validation ≠ security, bucket-level
enforcement, signed-URL expiry, orphaned-byte edge case, the prompt used.

---

## Open item for next session

- (Optional) relabel/confirm the test-category table wording — already incorporated above.
- Then: invoke `writing-plans` to turn this spec into a step-by-step implementation plan
  (Supabase setup steps for the user + React build steps for Claude + Vitest tests).
