# Day 20 — AI Summary with Human Approval Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Persist the submission's workflow text, display the AI's pending suggestion per review-queue row, and let a human Approve/Reject it (writing `ai_status` to Supabase).

**Architecture:** A pure helper (`getAiSuggestion`) decides which rows show a suggestion (only `ai_status === 'Pending'`). ReviewQueue renders that suggestion as a sub-row with Approve/Reject buttons. App.jsx owns the Supabase UPDATE handlers (Day-12 UPDATE-then-replace pattern). IntakeForm starts sending the `currentWorkflow` text it already collects. The live AI generation (Make → Anthropic) is deferred; a SQL-seeded `Pending` row stands in for it during testing.

**Tech Stack:** React + Vite, Supabase JS client, Vitest, Tailwind.

**Working directory:** `experiments/websites/tasklift-mvp-app`

---

### Task 1: `getAiSuggestion` pure helper (TDD)

**Files:**
- Create: `experiments/websites/tasklift-mvp-app/src/lib/aiSuggestion.js`
- Test: `experiments/websites/tasklift-mvp-app/src/lib/aiSuggestion.test.js`

- [ ] **Step 1: Write the failing test**

```js
// src/lib/aiSuggestion.test.js
import { describe, it, expect } from "vitest";
import { getAiSuggestion } from "./aiSuggestion.js";

describe("getAiSuggestion", () => {
  it("returns null when ai_status is not Pending", () => {
    expect(getAiSuggestion({ ai_status: null })).toBeNull();
    expect(getAiSuggestion({ ai_status: "Approved" })).toBeNull();
    expect(getAiSuggestion({ ai_status: "Rejected" })).toBeNull();
  });

  it("returns the suggestion fields when ai_status is Pending", () => {
    const item = {
      ai_status: "Pending",
      ai_summary: "Daily invoice transfer.",
      ai_category: "Finance",
      ai_priority: "Medium",
      ai_needs_review: true,
    };
    expect(getAiSuggestion(item)).toEqual({
      summary: "Daily invoice transfer.",
      category: "Finance",
      priority: "Medium",
      needsReview: true,
    });
  });

  it("defaults missing fields safely", () => {
    expect(getAiSuggestion({ ai_status: "Pending" })).toEqual({
      summary: "",
      category: "",
      priority: "",
      needsReview: false,
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd experiments/websites/tasklift-mvp-app && npx vitest run src/lib/aiSuggestion.test.js`
Expected: FAIL — "Failed to resolve import './aiSuggestion.js'" / `getAiSuggestion is not a function`.

- [ ] **Step 3: Write minimal implementation**

```js
// src/lib/aiSuggestion.js
// Pure helper: given a review-queue row, return the AI suggestion to display,
// or null. Only rows the AI has processed and left for a human (ai_status
// === "Pending") show a suggestion. Approved/Rejected/unprocessed rows return
// null. Keeping this pure makes the "what shows the Approve button" rule
// testable without React or Supabase.
export function getAiSuggestion(item) {
  if (!item || item.ai_status !== "Pending") {
    return null;
  }
  return {
    summary: item.ai_summary ?? "",
    category: item.ai_category ?? "",
    priority: item.ai_priority ?? "",
    needsReview: Boolean(item.ai_needs_review),
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/aiSuggestion.test.js`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add experiments/websites/tasklift-mvp-app/src/lib/aiSuggestion.js experiments/websites/tasklift-mvp-app/src/lib/aiSuggestion.test.js
git commit -m "Day 20: getAiSuggestion pure helper + tests"
```

---

### Task 2: IntakeForm persists `currentWorkflow`

**Files:**
- Modify: `experiments/websites/tasklift-mvp-app/src/components/IntakeForm.jsx` (the `onAddCandidate` call in `handleSubmit`)

The form already collects `currentWorkflow` (the "What happens today?" textarea) but `handleSubmit` drops it. Add it to the payload.

- [ ] **Step 1: Add `currentWorkflow` to the onAddCandidate payload**

Find:

```jsx
    onAddCandidate({
      label: formValues.processName.trim(),
      owner: formValues.owner.trim(),
      status: "Ready to map",
      risk: formValues.risk,
    });
```

Replace with:

```jsx
    onAddCandidate({
      label: formValues.processName.trim(),
      owner: formValues.owner.trim(),
      status: "Ready to map",
      risk: formValues.risk,
      currentWorkflow: formValues.currentWorkflow.trim(),
    });
```

- [ ] **Step 2: Verify the existing test suite still passes**

Run: `npx vitest run`
Expected: PASS (no test covers IntakeForm directly; this confirms nothing broke).

- [ ] **Step 3: Commit**

```bash
git add experiments/websites/tasklift-mvp-app/src/components/IntakeForm.jsx
git commit -m "Day 20: persist currentWorkflow from intake form (was discarded)"
```

---

### Task 3: App.jsx — store `current_workflow`, send it to Make, add approval handlers

**Files:**
- Modify: `experiments/websites/tasklift-mvp-app/src/App.jsx`

- [ ] **Step 1: Insert `current_workflow` and include it in the webhook payload**

In `handleAddCandidate`, find the `.insert({...})` object:

```jsx
      .insert({
        label: candidate.label,
        owner: candidate.owner,
        status: candidate.status,
        risk: candidate.risk,
      })
```

Replace with:

```jsx
      .insert({
        label: candidate.label,
        owner: candidate.owner,
        status: candidate.status,
        risk: candidate.risk,
        current_workflow: candidate.currentWorkflow,
      })
```

Then, in the same function, find the webhook `body: JSON.stringify({...})`:

```jsx
        body: JSON.stringify({
          id: data.id,
          label: data.label,
          owner: data.owner,
          risk: data.risk,
          status: data.status,
          created_at: data.created_at,
        }),
```

Replace with (adds `current_workflow` so Make can feed it to the AI):

```jsx
        body: JSON.stringify({
          id: data.id,
          label: data.label,
          owner: data.owner,
          risk: data.risk,
          status: data.status,
          current_workflow: data.current_workflow,
          created_at: data.created_at,
        }),
```

- [ ] **Step 2: Add the approval handlers**

Immediately after the `handleDelete` function (before the `return (` of the component), add:

```jsx
  // APPROVE AN AI SUGGESTION
  //
  // The Day-20 human-review point. The AI (in Make) only ever writes
  // ai_status="Pending". A human moving it to "Approved" is the required
  // approval step — the AI never auto-approves. Same UPDATE-then-replace
  // shape as handleStatusChange (Day 12).
  async function handleApproveSuggestion(id) {
    const { data, error } = await supabase
      .from(TABLE)
      .update({ ai_status: "Approved" })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Supabase approve error:", error.message);
      return;
    }

    setQueueItems((current) =>
      current.map((item) => (item.id === id ? data : item))
    );
  }

  // REJECT AN AI SUGGESTION
  // Same as approve, but records the human's "no". The suggestion is kept
  // for the record (ai_status="Rejected"); we do not delete the AI fields.
  async function handleRejectSuggestion(id) {
    const { data, error } = await supabase
      .from(TABLE)
      .update({ ai_status: "Rejected" })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Supabase reject error:", error.message);
      return;
    }

    setQueueItems((current) =>
      current.map((item) => (item.id === id ? data : item))
    );
  }
```

- [ ] **Step 3: Pass the handlers to ReviewQueue**

Find:

```jsx
              <ReviewQueue
                items={activeItems}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
              />
```

Replace with:

```jsx
              <ReviewQueue
                items={activeItems}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
                onApprove={handleApproveSuggestion}
                onReject={handleRejectSuggestion}
              />
```

- [ ] **Step 4: Verify tests still pass and the app builds**

Run: `npx vitest run`
Expected: PASS.

Run: `npx vite build`
Expected: build succeeds with no errors.

- [ ] **Step 5: Commit**

```bash
git add experiments/websites/tasklift-mvp-app/src/App.jsx
git commit -m "Day 20: store current_workflow, send to Make, add approve/reject handlers"
```

---

### Task 4: ReviewQueue — render the AI suggestion + Approve/Reject

**Files:**
- Modify: `experiments/websites/tasklift-mvp-app/src/components/ReviewQueue.jsx`

- [ ] **Step 1: Import the helper and add a priority style map**

At the top of the file (after the existing comment block, before `const riskStyle`), add the import:

```jsx
import { getAiSuggestion } from "../lib/aiSuggestion.js";
```

The AI priority uses the same Low/Medium/High vocabulary as risk, so reuse `riskStyle` for it — no new map needed.

- [ ] **Step 2: Accept the new props**

Change the component signature:

```jsx
function ReviewQueue({ items, onStatusChange, onDelete }) {
```

to:

```jsx
function ReviewQueue({ items, onStatusChange, onDelete, onApprove, onReject }) {
```

- [ ] **Step 3: Render the suggestion sub-row**

Find the row block inside `items.map`:

```jsx
              <tr className="border-b border-line last:border-0" key={item.id}>
                <td className="py-4 pr-4 font-bold">{item.label}</td>
                <td className="py-4 pr-4 text-muted">{item.owner}</td>
                <td className="py-4 pr-4">
                  <Badge
                    label={item.status}
                    styleClass={
                      statusStyle[item.status] ??
                      "bg-gray-50 text-gray-700 border-gray-200"
                    }
                  />
                </td>
                <td className="py-4 pr-4">
                  <Badge
                    label={item.risk}
                    styleClass={
                      riskStyle[item.risk] ??
                      "bg-gray-50 text-gray-700 border-gray-200"
                    }
                  />
                </td>
                <ActionCell
                  item={item}
                  onStatusChange={onStatusChange}
                  onDelete={onDelete}
                />
              </tr>
```

Wrap it in a fragment and append the suggestion sub-row. Replace the whole block above with:

```jsx
              <Fragment key={item.id}>
                <tr className="border-b border-line last:border-0">
                  <td className="py-4 pr-4 font-bold">{item.label}</td>
                  <td className="py-4 pr-4 text-muted">{item.owner}</td>
                  <td className="py-4 pr-4">
                    <Badge
                      label={item.status}
                      styleClass={
                        statusStyle[item.status] ??
                        "bg-gray-50 text-gray-700 border-gray-200"
                      }
                    />
                  </td>
                  <td className="py-4 pr-4">
                    <Badge
                      label={item.risk}
                      styleClass={
                        riskStyle[item.risk] ??
                        "bg-gray-50 text-gray-700 border-gray-200"
                      }
                    />
                  </td>
                  <ActionCell
                    item={item}
                    onStatusChange={onStatusChange}
                    onDelete={onDelete}
                  />
                </tr>
                <SuggestionRow item={item} onApprove={onApprove} onReject={onReject} />
              </Fragment>
```

Note: `key` moves from the `<tr>` to the `<Fragment>` because the fragment is now the mapped element.

- [ ] **Step 4: Add the `Fragment` import and the `SuggestionRow` component**

At the very top of the file, add the React import (the file currently has none):

```jsx
import { Fragment } from "react";
```

Then add this component just above `function ReviewQueue(`:

```jsx
// SuggestionRow renders, beneath a queue row, the AI's pending suggestion and
// the human Approve/Reject controls. It renders nothing unless the row is in
// the "Pending" AI state (getAiSuggestion returns null otherwise). Once a human
// approves/rejects, the row's ai_status changes and this returns null again —
// replaced by a small chip shown inline (see below).
function SuggestionRow({ item, onApprove, onReject }) {
  const suggestion = getAiSuggestion(item);

  // Already decided by a human — show a status chip, no buttons.
  if (item.ai_status === "Approved" || item.ai_status === "Rejected") {
    const chipStyle =
      item.ai_status === "Approved"
        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
        : "bg-red-50 text-red-700 border-red-200";
    return (
      <tr className="border-b border-line last:border-0">
        <td className="pb-4 pl-4 text-xs text-muted" colSpan={5}>
          <span className={`inline-block rounded-md border px-2 py-0.5 font-bold ${chipStyle}`}>
            AI suggestion {item.ai_status.toLowerCase()}
          </span>
        </td>
      </tr>
    );
  }

  // Not processed by the AI yet, or no suggestion to show.
  if (!suggestion) {
    return null;
  }

  return (
    <tr className="border-b border-line last:border-0">
      <td className="pb-4 pl-4" colSpan={5}>
        <div className="rounded-md border border-dashed border-accent/40 bg-accent/5 p-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-extrabold uppercase text-accent">
              AI suggestion
            </span>
            {suggestion.category ? (
              <Badge
                label={suggestion.category}
                styleClass="bg-indigo-50 text-indigo-700 border-indigo-200"
              />
            ) : null}
            {suggestion.priority ? (
              <Badge
                label={`Priority: ${suggestion.priority}`}
                styleClass={
                  riskStyle[suggestion.priority] ??
                  "bg-gray-50 text-gray-700 border-gray-200"
                }
              />
            ) : null}
            {suggestion.needsReview ? (
              <Badge
                label="Needs review"
                styleClass="bg-amber-50 text-amber-700 border-amber-200"
              />
            ) : null}
          </div>

          <p className="mt-2 text-sm text-ink">{suggestion.summary}</p>

          <div className="mt-3 flex gap-2">
            <button
              onClick={() => onApprove(item.id)}
              className="rounded border border-emerald-300 px-3 py-1 text-xs font-bold text-emerald-700 hover:border-emerald-500 hover:text-emerald-900 transition-colors"
            >
              Approve
            </button>
            <button
              onClick={() => onReject(item.id)}
              className="rounded border border-red-200 px-3 py-1 text-xs font-bold text-red-600 hover:border-red-400 hover:text-red-800 transition-colors"
            >
              Reject
            </button>
          </div>
        </div>
      </td>
    </tr>
  );
}
```

- [ ] **Step 5: Verify tests pass and the app builds**

Run: `npx vitest run`
Expected: PASS (Task 1's 3 tests + the existing suite).

Run: `npx vite build`
Expected: build succeeds.

- [ ] **Step 6: Commit**

```bash
git add experiments/websites/tasklift-mvp-app/src/components/ReviewQueue.jsx
git commit -m "Day 20: ReviewQueue AI suggestion row + Approve/Reject controls"
```

---

### Task 5: Manual verification (seeded Pending row — no API key)

**Files:** none (manual). Requires the SQL from the spec already run (columns + the seeded "Invoice copy-paste" `Pending` row).

- [ ] **Step 1: Run the app**

Run: `cd experiments/websites/tasklift-mvp-app && npm run dev`
Open the local URL.

- [ ] **Step 2: Confirm the suggestion shows**

Expected: the "Invoice copy-paste" row shows, beneath it, an "AI suggestion" block with the summary, a "Finance" category badge, a "Priority: Medium" badge, and **Approve** / **Reject** buttons.

- [ ] **Step 3: Approve and confirm persistence**

Click **Approve**. Expected: the suggestion block is replaced by a green "AI suggestion approved" chip. In the Supabase Table Editor, the row's `ai_status` is now `Approved`. Refresh the page — the chip persists (proves it was written to the DB, not just local state).

- [ ] **Step 4: (Optional) Test reject**

Seed or reset another `Pending` row, click **Reject**, confirm `ai_status='Rejected'` and a red chip.

---

## Notes

- **Deferred (needs Anthropic API key):** the Make → Anthropic (`claude-opus-4-8`) → Supabase PATCH step that produces real `Pending` rows. Spec'd in the design doc; wire in later. Until then, the SQL-seeded row exercises the whole human-approval half.
- **Prompt file:** `notes/day-20-ai-prompt-v1.md` (the versioned prompt) is referenced by `ai_prompt_version='v1'`. Create it when wiring the Make step, or now as documentation — not required for the app build.
