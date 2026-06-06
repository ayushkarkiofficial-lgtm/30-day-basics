# Day 19 — File Upload To Processing Workflow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a standalone "Upload a file" panel to the Tasklift app — validate a PDF/PNG/JPG ≤10 MB, store the bytes in a private Supabase bucket, save a metadata row, fire a Make webhook, and show each file with a status badge that flips `Processing → Done`.

**Architecture:** Mirrors the existing app pattern exactly. A new `FileUpload.jsx` panel owns local form state (selected file, error, uploading flag); `App.jsx` owns the file list + all Supabase calls — identical to how `queueItems` works today. Pure validation logic lives in `lib/fileUpload.js` so it can be unit-tested without React, just like `lib/metrics.js`. Bytes live in Supabase Storage; metadata lives in a real `uploaded_files` table.

**Tech Stack:** React + Vite + Tailwind + Supabase (`@supabase/supabase-js`), Vitest for unit tests.

**Source spec:** `docs/superpowers/specs/2026-06-05-day-19-file-upload-design.md`

---

## File Structure

| File | Responsibility | Action |
|---|---|---|
| `src/lib/fileUpload.js` | Pure `validateFile(file)` + `uploadFile(supabase, file)` helper | Create |
| `src/lib/fileUpload.test.js` | Vitest unit tests for `validateFile()` | Create |
| `src/components/FileUpload.jsx` | Standalone panel: form + file list rows + badges | Create |
| `src/App.jsx` | Add `uploadedFiles` state, fetch effect, `handleFileUploaded`/`handleMarkDone`/`handleViewFile`, render panel | Modify |
| `notes/day-19-file-upload.md` | Risks/lessons doc | Create |

Working directory for all app paths: `experiments/websites/tasklift-mvp-app/`.

---

## Task 0: Hands-on Supabase + Make setup (USER — do this first)

> This task is for the user, done in the Supabase and Make dashboards. The React code in later tasks assumes these exist. The learning-style memory says the user does infra setup hands-on. **Claude: walk the user through these steps and wait for confirmation before starting Task 1.**

- [ ] **Step 1: Create the `uploaded_files` table**

In Supabase → SQL Editor, run:

```sql
create table uploaded_files (
  id uuid primary key default gen_random_uuid(),
  file_name text not null,
  file_path text not null,
  file_type text not null,
  file_size int8 not null,
  status text not null default 'Processing',
  created_at timestamptz not null default now()
);
```

- [ ] **Step 2: Enable RLS + add anon policies on the table**

Matches the existing `First_app_data` setup (anon SELECT/INSERT/UPDATE — no DELETE needed for files).

```sql
alter table uploaded_files enable row level security;

create policy "anon select uploaded_files" on uploaded_files
  for select to anon using (true);

create policy "anon insert uploaded_files" on uploaded_files
  for insert to anon with check (true);

create policy "anon update uploaded_files" on uploaded_files
  for update to anon using (true) with check (true);
```

- [ ] **Step 3: Create the private Storage bucket `uploads`**

In Supabase → Storage → New bucket:
- Name: `uploads`
- Public bucket: **OFF** (private — this is the whole point of signed URLs)
- Additional configuration:
  - Restrict file MIME types: `application/pdf,image/png,image/jpeg`
  - File size limit: `10 MB`

These bucket limits are the **real** server-side enforcement. Client validation (Task 1) is UX only.

- [ ] **Step 4: Add anon Storage policies for the bucket**

In Supabase → Storage → Policies, add two policies on the `uploads` bucket for the `anon` role (or run SQL against `storage.objects`):

```sql
create policy "anon upload to uploads bucket" on storage.objects
  for insert to anon
  with check (bucket_id = 'uploads');

create policy "anon read uploads bucket" on storage.objects
  for select to anon
  using (bucket_id = 'uploads');
```

INSERT lets the app upload; SELECT lets the app mint signed URLs.

- [ ] **Step 5: Create a new Make scenario (Webhook → Email)**

Clone the Day 16 approach:
1. New scenario → **Custom Webhook** trigger → copy the webhook URL (paste it into `App.jsx` in Task 5).
2. Add a **Gmail → Send an email** module.
3. Turn the scenario ON. After the first real upload (Task 7 test), map the fields (`file_name`, `file_type`, `file_size`) — Make learns the payload shape from the first request (Day 16 lesson).

- [ ] **Step 6: Confirm done**

Tell Claude: table + RLS + private bucket + bucket policies + Make webhook URL are all ready. Provide the webhook URL.

---

## Task 1: `validateFile()` — pure validation (TDD)

**Files:**
- Create: `experiments/websites/tasklift-mvp-app/src/lib/fileUpload.js`
- Test: `experiments/websites/tasklift-mvp-app/src/lib/fileUpload.test.js`

- [ ] **Step 1: Write the failing test**

Create `src/lib/fileUpload.test.js`. `validateFile` takes a `{ type, size }`-shaped object (a real `File` has both) and returns `{ valid: boolean, error: string }`. `error` is `""` when valid.

```js
import { describe, it, expect } from "vitest";
import { validateFile, MAX_FILE_BYTES, ALLOWED_TYPES } from "./fileUpload.js";

describe("validateFile", () => {
  it("accepts a valid PDF under the limit", () => {
    const file = { type: "application/pdf", size: 1000 };
    expect(validateFile(file)).toEqual({ valid: true, error: "" });
  });

  it("accepts a valid PNG", () => {
    const file = { type: "image/png", size: 1000 };
    expect(validateFile(file).valid).toBe(true);
  });

  it("accepts a valid JPEG", () => {
    const file = { type: "image/jpeg", size: 1000 };
    expect(validateFile(file).valid).toBe(true);
  });

  it("rejects a disallowed type", () => {
    const file = { type: "text/plain", size: 1000 };
    const result = validateFile(file);
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/PDF, PNG, or JPG/);
  });

  it("rejects a file over 10 MB", () => {
    const file = { type: "application/pdf", size: MAX_FILE_BYTES + 1 };
    const result = validateFile(file);
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/10 MB/);
  });

  it("accepts a file exactly at the 10 MB boundary", () => {
    const file = { type: "application/pdf", size: MAX_FILE_BYTES };
    expect(validateFile(file).valid).toBe(true);
  });

  it("rejects when no file is given", () => {
    expect(validateFile(null).valid).toBe(false);
  });

  it("exposes the three allowed MIME types", () => {
    expect(ALLOWED_TYPES).toEqual([
      "application/pdf",
      "image/png",
      "image/jpeg",
    ]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --run src/lib/fileUpload.test.js`
Expected: FAIL — `Failed to resolve import "./fileUpload.js"` (file doesn't exist yet).

- [ ] **Step 3: Write the minimal implementation**

Create `src/lib/fileUpload.js`:

```js
// fileUpload.js — pure validation + the upload sequence helper.
//
// validateFile() is pure (no React, no network) so it can be unit-tested
// in isolation, exactly like lib/metrics.js / computeMetrics.
//
// SECURITY NOTE: this client-side check is UX only and is trivially
// bypassable. The REAL enforcement is the Supabase bucket's MIME-type
// and size limits + RLS. See notes/day-19-file-upload.md.

export const ALLOWED_TYPES = ["application/pdf", "image/png", "image/jpeg"];
export const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB

export function validateFile(file) {
  if (!file) {
    return { valid: false, error: "Choose a file first." };
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: "Only PDF, PNG, or JPG up to 10 MB." };
  }
  if (file.size > MAX_FILE_BYTES) {
    return { valid: false, error: "Only PDF, PNG, or JPG up to 10 MB." };
  }
  return { valid: true, error: "" };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- --run src/lib/fileUpload.test.js`
Expected: PASS — 8 tests pass.

- [ ] **Step 5: Commit**

```bash
git add experiments/websites/tasklift-mvp-app/src/lib/fileUpload.js experiments/websites/tasklift-mvp-app/src/lib/fileUpload.test.js
git commit -m "Day 19: validateFile() pure validation + Vitest tests"
```

---

## Task 2: `uploadFile()` — the upload sequence helper

**Files:**
- Modify: `experiments/websites/tasklift-mvp-app/src/lib/fileUpload.js`

This wraps the Storage upload + metadata insert (steps 2–3 of the spec's data flow). It is not unit-tested (it crosses the Supabase network boundary — that is covered by manual test 1). Keeping it out of the component keeps `FileUpload.jsx` declarative.

- [ ] **Step 1: Add the `BUCKET` constant and `uploadFile()` to `src/lib/fileUpload.js`**

Append to `src/lib/fileUpload.js`:

```js
export const BUCKET = "uploads";
export const FILES_TABLE = "uploaded_files";

// uploadFile — runs the byte-then-metadata sequence from the spec:
//   1. upload bytes to Storage under a collision-proof path
//   2. insert a metadata row pointing at that path
// Returns { row, error }. On any failure, row is null and error is a
// human-readable string. Bytes are uploaded BEFORE the row so we never
// create a row that points at a missing file.
export async function uploadFile(supabase, file) {
  const path = `${crypto.randomUUID()}-${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, file);

  if (uploadError) {
    console.error("Storage upload error:", uploadError.message);
    return { row: null, error: "Upload failed — try again." };
  }

  const { data, error: insertError } = await supabase
    .from(FILES_TABLE)
    .insert({
      file_name: file.name,
      file_path: path,
      file_type: file.type,
      file_size: file.size,
      status: "Processing",
    })
    .select()
    .single();

  if (insertError) {
    // Orphaned-byte edge case: bytes uploaded but metadata failed.
    // Not cleaned up here — that is Day 21 territory (logged in risks doc).
    console.error("Metadata insert error:", insertError.message);
    return { row: null, error: "Couldn't save file details." };
  }

  return { row: data, error: "" };
}
```

- [ ] **Step 2: Confirm existing tests still pass**

Run: `npm test -- --run src/lib/fileUpload.test.js`
Expected: PASS — the 8 `validateFile` tests still pass (no test for `uploadFile`, by design).

- [ ] **Step 3: Commit**

```bash
git add experiments/websites/tasklift-mvp-app/src/lib/fileUpload.js
git commit -m "Day 19: uploadFile() Storage+metadata sequence helper"
```

---

## Task 3: `FileUpload.jsx` panel component

**Files:**
- Create: `experiments/websites/tasklift-mvp-app/src/components/FileUpload.jsx`

The panel owns local form state only (selected file, inline message, uploading flag). It calls `validateFile` itself for instant feedback, then hands the file to `onUpload` (an App.jsx handler). The file list + status come from props, exactly like `ReviewQueue`.

Props:
- `files` — array of `uploaded_files` rows (from App state)
- `onUpload(file)` — async; returns `{ ok: boolean, error: string }`
- `onMarkDone(id)` — flips a row to `Done`
- `onView(filePath)` — opens a signed URL

- [ ] **Step 1: Create `src/components/FileUpload.jsx`**

```jsx
import { useState } from "react";
import { validateFile } from "../lib/fileUpload.js";

// Status badge colors — reuse the same look as ReviewQueue's badges.
const statusStyle = {
  Processing: "bg-amber-50 text-amber-700 border-amber-200",
  Done: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

// Human-readable size, e.g. "2.4 MB". Pure display helper.
function formatSize(bytes) {
  const mb = bytes / (1024 * 1024);
  if (mb >= 1) return `${mb.toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

function FileUpload({ files, onUpload, onMarkDone, onView }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isUploading, setIsUploading] = useState(false);

  function handleFileChange(event) {
    setSelectedFile(event.target.files[0] ?? null);
    setMessage({ type: "", text: "" });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    // Client-side validation = instant UX feedback only (bucket enforces for real).
    const check = validateFile(selectedFile);
    if (!check.valid) {
      setMessage({ type: "error", text: check.error });
      return;
    }

    setIsUploading(true);
    const result = await onUpload(selectedFile);
    setIsUploading(false);

    if (!result.ok) {
      setMessage({ type: "error", text: result.error });
      return;
    }

    setSelectedFile(null);
    event.target.reset(); // clear the native file input
    setMessage({ type: "success", text: "File uploaded — processing." });
  }

  return (
    <section
      id="upload"
      className="grid gap-5 rounded-lg border border-line bg-white p-6 shadow-panel"
    >
      <div>
        <p className="text-sm font-extrabold uppercase text-accent">Upload</p>
        <h2 className="mt-2 text-2xl font-extrabold">Upload a file</h2>
        <p className="mt-1 text-sm text-muted">
          PDF, PNG, or JPG up to 10 MB. Files start processing on upload.
        </p>
      </div>

      <form className="grid gap-4" onSubmit={handleSubmit}>
        <input
          type="file"
          accept="application/pdf,image/png,image/jpeg"
          onChange={handleFileChange}
          className="rounded-md border border-line px-3 py-3 text-sm file:mr-4 file:rounded file:border-0 file:bg-accent file:px-4 file:py-2 file:font-bold file:text-white"
        />
        <button
          type="submit"
          disabled={isUploading}
          className="min-h-12 rounded-md bg-accent px-5 py-3 font-extrabold text-white outline-offset-2 hover:bg-[#164c40] focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent disabled:opacity-60 md:w-fit"
        >
          {isUploading ? "Uploading…" : "Upload"}
        </button>

        {message.text ? (
          <p
            role={message.type === "error" ? "alert" : "status"}
            className={`text-sm font-bold ${
              message.type === "error" ? "text-red-700" : "text-accent"
            }`}
          >
            {message.text}
          </p>
        ) : null}
      </form>

      {files.length === 0 ? (
        <p className="text-sm text-muted">No files uploaded yet.</p>
      ) : (
        <ul className="grid gap-3">
          {files.map((file) => (
            <li
              key={file.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-line px-4 py-3"
            >
              <div className="min-w-0">
                <p className="truncate font-bold">{file.file_name}</p>
                <p className="text-xs text-muted">
                  {file.file_type} · {formatSize(file.file_size)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-block rounded-md border px-2 py-0.5 text-xs font-bold ${
                    statusStyle[file.status] ??
                    "bg-gray-50 text-gray-700 border-gray-200"
                  }`}
                >
                  {file.status}
                </span>
                <button
                  type="button"
                  onClick={() => onView(file.file_path)}
                  className="rounded border border-line px-2 py-0.5 text-xs font-medium text-muted hover:border-ink hover:text-ink transition-colors"
                >
                  View
                </button>
                {file.status !== "Done" ? (
                  <button
                    type="button"
                    onClick={() => onMarkDone(file.id)}
                    className="rounded border border-line px-2 py-0.5 text-xs font-medium text-muted hover:border-ink hover:text-ink transition-colors"
                  >
                    Mark done
                  </button>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default FileUpload;
```

- [ ] **Step 2: Verify the app still builds**

Run: `npm run build`
Expected: build succeeds (component is not yet imported, but must be valid JSX).

- [ ] **Step 3: Commit**

```bash
git add experiments/websites/tasklift-mvp-app/src/components/FileUpload.jsx
git commit -m "Day 19: FileUpload panel component"
```

---

## Task 4: Wire state + fetch into `App.jsx`

**Files:**
- Modify: `experiments/websites/tasklift-mvp-app/src/App.jsx`

- [ ] **Step 1: Add the import**

In `src/App.jsx`, after the existing component imports (around line 23, after the `StackSection` import) add:

```jsx
import FileUpload from "./components/FileUpload.jsx";
```

And after the `metrics` import (line 26) add the lib imports:

```jsx
import { uploadFile } from "./lib/fileUpload.js";
```

- [ ] **Step 2: Add `uploadedFiles` state**

In `src/App.jsx`, right after the `const [queueItems, setQueueItems] = useState([]);` line (line 43) add:

```jsx
  // uploadedFiles — the list of rows from the uploaded_files table.
  // Same ownership pattern as queueItems: App owns the data + Supabase calls,
  // FileUpload just renders what it's given.
  const [uploadedFiles, setUploadedFiles] = useState([]);
```

- [ ] **Step 3: Add a second fetch effect**

In `src/App.jsx`, immediately after the closing `}, []);` of the existing `fetchItems` effect (line 87) add a parallel effect:

```jsx
  // FETCH UPLOADED FILES ON FIRST LOAD
  // A second, independent effect — newest files first — so the list
  // survives a page refresh (manual test 7).
  useEffect(() => {
    async function fetchFiles() {
      const { data, error } = await supabase
        .from("uploaded_files")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase file fetch error:", error.message);
        return;
      }
      setUploadedFiles(data);
    }

    fetchFiles();
  }, []);
```

- [ ] **Step 4: Verify it builds**

Run: `npm run build`
Expected: build succeeds. (`FileUpload` and `uploadFile` are imported but not yet rendered/used — acceptable mid-task; if the linter in build errors on unused vars, proceed to Task 5 which uses them, then re-run.)

- [ ] **Step 5: Commit**

```bash
git add experiments/websites/tasklift-mvp-app/src/App.jsx
git commit -m "Day 19: App state + fetch effect for uploaded files"
```

---

## Task 5: Add the three handlers + render the panel in `App.jsx`

**Files:**
- Modify: `experiments/websites/tasklift-mvp-app/src/App.jsx`

- [ ] **Step 1: Add the Make webhook constant for files**

In `src/App.jsx`, right after the existing `MAKE_WEBHOOK_URL` constant (line 38) add:

```jsx
// MAKE FILE WEBHOOK URL
// Separate Make scenario for file uploads (Task 0, step 5). Same fire-and-forget
// pattern as MAKE_WEBHOOK_URL. Paste the new scenario's webhook URL here.
const MAKE_FILE_WEBHOOK_URL = "PASTE_FILE_WEBHOOK_URL_HERE";
```

> The user provides this URL in Task 0, step 6. Replace the placeholder before manual testing.

- [ ] **Step 2: Add `handleFileUploaded`**

In `src/App.jsx`, after the existing `handleAddCandidate` function (after line 164) add:

```jsx
  // HANDLE A FILE UPLOAD
  //
  // Called by FileUpload after client validation passes. Runs the
  // Storage+metadata sequence (uploadFile), prepends the saved row,
  // then fires the Make webhook fire-and-forget (Day 16 pattern).
  // Returns { ok, error } so the panel can show an inline message.
  async function handleFileUploaded(file) {
    const { row, error } = await uploadFile(supabase, file);

    if (error) {
      return { ok: false, error };
    }

    setUploadedFiles((current) => [row, ...current]);

    if (MAKE_FILE_WEBHOOK_URL && MAKE_FILE_WEBHOOK_URL !== "PASTE_FILE_WEBHOOK_URL_HERE") {
      fetch(MAKE_FILE_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: row.id,
          file_name: row.file_name,
          file_type: row.file_type,
          file_size: row.file_size,
          file_path: row.file_path,
          created_at: row.created_at,
        }),
      }).catch((err) => console.warn("Make file webhook failed:", err.message));
    }

    return { ok: true, error: "" };
  }
```

- [ ] **Step 3: Add `handleMarkDone`**

Immediately after `handleFileUploaded` add:

```jsx
  // MARK A FILE DONE
  // The human-review point from the Day 15 automation mental model.
  // Same UPDATE-then-replace shape as handleStatusChange.
  async function handleMarkDone(id) {
    const { data, error } = await supabase
      .from("uploaded_files")
      .update({ status: "Done" })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Supabase file update error:", error.message);
      return;
    }

    setUploadedFiles((current) =>
      current.map((file) => (file.id === id ? data : file))
    );
  }
```

- [ ] **Step 4: Add `handleViewFile`**

Immediately after `handleMarkDone` add:

```jsx
  // VIEW A FILE
  // The bucket is private, so we mint a short-lived (60s) signed URL and
  // open it in a new tab. Short expiry is the concrete "files are risky"
  // lesson — the link is dead a minute later.
  async function handleViewFile(filePath) {
    const { data, error } = await supabase.storage
      .from("uploads")
      .createSignedUrl(filePath, 60);

    if (error) {
      console.error("Signed URL error:", error.message);
      return;
    }

    window.open(data.signedUrl, "_blank", "noopener");
  }
```

- [ ] **Step 5: Render the panel after `IntakeForm`**

In `src/App.jsx`, in the JSX, find the `<IntakeForm onAddCandidate={handleAddCandidate} />` line (line 233) and add the panel right after it:

```jsx
          <IntakeForm onAddCandidate={handleAddCandidate} />

          <FileUpload
            files={uploadedFiles}
            onUpload={handleFileUploaded}
            onMarkDone={handleMarkDone}
            onView={handleViewFile}
          />
```

This gives the page order: Hero → Summary → Intake → **Upload** → Queue → Completed → Stack (matches the spec).

- [ ] **Step 6: Verify build + all tests**

Run: `npm run build`
Expected: build succeeds.

Run: `npm test -- --run`
Expected: PASS — all tests (metrics + fileUpload) pass.

- [ ] **Step 7: Commit**

```bash
git add experiments/websites/tasklift-mvp-app/src/App.jsx
git commit -m "Day 19: wire FileUpload panel + upload/markDone/view handlers"
```

---

## Task 6: Risks & lessons note

**Files:**
- Create: `notes/day-19-file-upload.md`

- [ ] **Step 1: Write `notes/day-19-file-upload.md`**

```markdown
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
```

- [ ] **Step 2: Commit**

```bash
git add notes/day-19-file-upload.md
git commit -m "Day 19: file upload risks & lessons note"
```

---

## Task 7: Manual / integration test pass (USER — hands-on, with the live app)

> These cross real boundaries (browser → Supabase → Make), so they can't be unit-tested. Run them against `npm run dev` locally (or the deployed site after a redeploy). Check each off in the spec's done-checklist.

- [ ] **Test 1 — Upload a valid PDF:** appears in the list as `Processing`; a Make email arrives. *(After this first upload, map the Make fields — it learns the payload shape now.)*
- [ ] **Test 2 — Upload a valid PNG or JPG:** same result.
- [ ] **Test 3 — Try a `.txt` or `.docx`:** inline error "Only PDF, PNG, or JPG up to 10 MB."; nothing stored.
- [ ] **Test 4 — Try an 11 MB+ file:** inline error; nothing stored. *(If the file input's `accept` blocks selection, test via a renamed large file or temporarily widen `accept`.)*
- [ ] **Test 5 — Click View:** opens the file via signed URL in a new tab; re-opening the same URL after 60s fails (link expired).
- [ ] **Test 6 — Click Mark done:** badge flips `Processing → Done`; the "Mark done" button disappears; survives a refresh.
- [ ] **Test 7 — Refresh the page:** the file list persists (re-fetched from `uploaded_files`).

- [ ] **Final commit (docs/progress):** update `notes/ai-dev-log.md` with the Day 19 entry and check off the spec's done-checklist (valid uploads · invalid rejected · processing status visible).

```bash
git add notes/ai-dev-log.md
git commit -m "Day 19: dev log + manual test pass complete"
git push
```

---

## Self-Review (done by author)

**Spec coverage:**
- Architecture/components table → Tasks 1–5 + Task 0 (Supabase/Make). ✅
- Data model + Supabase setup → Task 0. ✅
- Data flow (validate → upload bytes → insert → prepend → webhook → reset) → `validateFile` (T1) + `uploadFile` (T2) + `handleFileUploaded` (T5) + panel reset (T3). ✅
- Viewing via signed URL → `handleViewFile` (T5). ✅
- Status lifecycle Processing→Done → `handleMarkDone` (T5) + badge (T3). ✅
- Error handling table (4 failure modes, all inline) → `uploadFile` returns errors (T2), panel shows them (T3), webhook `.catch` warns (T5). ✅
- Unit tests for `validateFile` (valid/bad-type/oversized/boundary) → Task 1. ✅
- Manual/integration tests 1–7 → Task 7. ✅
- Risks doc → Task 6. ✅

**Placeholder scan:** Only intentional placeholders are `PASTE_FILE_WEBHOOK_URL_HERE` (user fills in Task 0/5) and the dev-log prompt line — both flagged as user actions, not code gaps. ✅

**Type consistency:** `validateFile` returns `{valid,error}` (used in T1 tests + T3 panel); `uploadFile` returns `{row,error}` (used in T5); `onUpload` returns `{ok,error}` (T3 panel ↔ T5 handler). Column names (`file_name`, `file_path`, `file_type`, `file_size`, `status`) consistent across Task 0 SQL, `uploadFile` insert, and panel display. ✅
