# Day 23 — UX Pass & Error States (Tasklift)

**Theme learned:** UX is not decoration — it's whether the user knows *what to do*,
*what happened*, and *what to do next when something fails*. The five states every
screen should answer for: **empty · loading · success · error · disabled.**

**The one bug behind most of the changes:** every failure in the app went to
`console.error` — invisible to the user. Day 23 made failures (and progress) visible
*on screen*. (Same blind spot as the Day-21 theme, here showing up as UX.)

No new features were added — clarity only.

---

## Screen 1 — Review Queue (the table)

| State | Before | After |
|-------|--------|-------|
| Empty | ✅ "No candidates yet…" | ✅ unchanged |
| Loading | ✅ "Loading queue from database…" | ✅ unchanged |
| **Error** | ❌ a failed fetch logged to console + left the list empty → showed the **"No candidates yet"** empty state. A broken load looked identical to an empty queue — user thinks data is gone. | ✅ distinct red **"The review queue didn't load"** panel with a **Retry** button (`role="alert"`). Empty looks empty; broken looks broken. |
| **Delete (destructive)** | ❌ deleted on a single click; failure was console-only | ✅ **confirm prompt** before deleting; failure shows an alert instead of silently failing |

Files: `src/App.jsx` — new `loadError` state; `fetchItems()` lifted out of `useEffect`
so **Retry** can re-run it; error branch in the render block; `handleDelete` confirm + alert.

## Screen 2 — Intake Form

| State | Before | After |
|-------|--------|-------|
| Field validation | ✅ per-field messages + aria | ✅ unchanged |
| **Submitting** | ❌ no feedback; button stayed active (double-submit possible) | ✅ button **disabled** + label **"Saving…"** while in flight |
| **Success** | ❌ "Draft added" shown **instantly**, before the save was confirmed | ✅ shown **only after** the row actually saves (awaits the result) |
| **Error** | ❌ showed "Draft added" **even when the save failed** (error → console only) | ✅ inline red **error message** (`role="alert"`); no false success |

Files: `src/App.jsx` — `handleAddCandidate` now returns `{ ok, error }`.
`src/components/IntakeForm.jsx` — `handleSubmit` is async + awaits; new
`isSubmitting` / `submitError` state; button + message wired to them.

## Screen 3 — File Upload (was already the gold standard)

| State | Before | After |
|-------|--------|-------|
| Loading / disabled / success / error | ✅ all already handled well | ✅ used as the template for screens 1 & 2 |
| **Disabled** | ⚠️ Upload was clickable with no file chosen (errored only after click) | ✅ **disabled until a file is selected** (`disabled={isUploading || !selectedFile}`) |

Files: `src/components/FileUpload.jsx` — one-line disabled condition + cursor style.

---

## Manual test checklist (run these yourself — `npm run dev`)

**Happy paths**
- [ ] Submit the intake form with valid fields → button shows **"Saving…"** briefly, then **"Draft added to the review queue"**, row appears at the top of the queue.
- [ ] Submit with a blank required field → per-field validation messages; no save.
- [ ] Upload button is **greyed out** until you pick a file; pick one → it enables.
- [ ] Upload a valid file → button shows **"Uploading…"**, then **"File uploaded — processing"**, file appears in the list.

**Failure paths (force them):**
- [ ] **Queue load error:** in `src/App.jsx` temporarily change `const TABLE = "First_app_data"` to a wrong name (e.g. `"First_app_dataX"`) and reload → you should see the red **"The review queue didn't load"** panel with **Retry** — *not* "No candidates yet". Put the name back, click **Retry** → queue loads. (Or: stop your network and reload.)
- [ ] **Form save error:** with the wrong table name (or offline), submit the form → button shows "Saving…", then an inline **"Couldn't save the draft…"** error; no false "Draft added".
- [ ] **Delete confirm:** click **Delete** on a row → confirm dialog appears; Cancel = nothing happens; OK = row removed.

**Done checklist (Day 23):**
- [x] Important states are visible (empty / loading / success / error / disabled).
- [x] Error messages are human-friendly.
- [x] No new unnecessary features were added.
- [ ] Manually verified each state above (your hands-on step).

## Key lesson
A failed fetch that falls back to the empty state is a *silent* failure dressed as a
normal screen. Always give "error" its own visible branch, separate from "empty" and
"loading" — three states, three different things on screen.
