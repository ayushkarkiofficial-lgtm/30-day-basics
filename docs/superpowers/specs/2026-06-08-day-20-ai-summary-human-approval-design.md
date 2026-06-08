# Day 20 — AI Summary with Human Approval (Design)

**Date:** 2026-06-08
**Status:** Approved (live Anthropic call deferred until API key obtained)
**App:** `experiments/websites/tasklift-mvp-app`

## Outcome

For each review-queue submission, an AI (Claude, run in Make) generates a
**summary, category, priority, and a needs-review flag**. The app stores the AI
output plus the **prompt version** and **model**, and **requires a human to
approve** each suggestion. The AI never auto-approves — it only ever sets status
to `Pending`; the Approved/Rejected transition is human-only.

## Mental model

AI suggests, human approves. Important actions are never taken on the AI's word
alone. This is the Day-15 "human review" node made concrete.

## Scope note (no API key yet)

The live Anthropic call is **deferred**, the same way the Day-19 Gmail send was.
Everything that does not need a key is built and verified now; the Make→Anthropic
step is fully specified but not run until a key exists.

- **Built & testable now:** schema, `current_workflow` persistence, ReviewQueue
  AI-suggestion block, Approve/Reject handlers, the versioned prompt file, the
  written Make-scenario spec.
- **Test the human-approval half without a key:** manually seed one row's `ai_*`
  fields + `ai_status='Pending'` via the Supabase Table Editor (or a small
  script). The app then shows the suggestion and the Approve/Reject loop is
  verified end-to-end. Only AI *generation* waits on the key.
- **Deferred until key:** Make → Anthropic Claude (`claude-opus-4-8`) → Supabase
  "Update a Row". Spec'd below, not run.

## Architecture & data flow

The AI step lives **inside the existing Make submission scenario** (the one
`MAKE_WEBHOOK_URL` already fires on Day 16/17). No new webhook URL.

```
IntakeForm submit
  → App inserts row into First_app_data (now incl. current_workflow, ai_status=null)
  → fires MAKE_WEBHOOK_URL (payload now also sends current_workflow + row id)
        → Make: Anthropic Claude module summarizes/classifies current_workflow
        → Make: parse JSON, PATCH the SAME Supabase row with ai_* fields + ai_status='Pending'
        → (existing Gmail / Notion steps continue unchanged)
  → App (on load/refresh) shows a "Pending AI suggestion" block + Approve / Reject
        → human clicks → UPDATE ai_status='Approved' | 'Rejected' (Day-12 UPDATE pattern)
```

Rule enforced structurally: the AI only ever writes `ai_status='Pending'`.
`Approved`/`Rejected` is a human-only transition in the app.

## Schema — new columns on `First_app_data`

| Column | Type | Set by | Purpose |
|---|---|---|---|
| `current_workflow` | text | app (insert) | the text the AI summarizes (currently collected by the form but thrown away) |
| `ai_summary` | text | Make/AI | one-line summary |
| `ai_category` | text | Make/AI | e.g. Finance / Support / Ops |
| `ai_priority` | text | Make/AI | Low / Medium / High |
| `ai_needs_review` | bool | Make/AI | AI's own "I'm unsure / this is risky" flag (confidence proxy) |
| `ai_status` | text | app (human action) | null → `Pending` (AI) → `Approved`/`Rejected` (human) |
| `ai_prompt_version` | text | Make/AI | e.g. `"v1"` — documents which prompt produced it |
| `ai_model` | text | Make/AI | e.g. `"claude-opus-4-8"` — documents the model |

`ai_prompt_version` + `ai_model` satisfy the "prompt version documented" Done item.

## The prompt (stored & versioned)

Stored at `notes/day-20-ai-prompt-v1.md` and pasted into the Make Anthropic
module. Takes `current_workflow` and returns **strict JSON only**:

```json
{ "summary": "...", "category": "...", "priority": "Low|Medium|High", "needs_review": true|false }
```

`needs_review` = true when the text is vague/empty, high-risk (payments, PII,
customer money), or the model is uncertain.

- **Provider:** Anthropic Claude (Make's built-in "Anthropic Claude" module).
- **Model:** `claude-opus-4-8` (quality default; `claude-haiku-4-5` is the
  cheaper option the user may switch to later — their call, not a silent default).
- **Key:** Anthropic API key, entered once in the Make connection. Never in
  frontend code.

## Make scenario spec (deferred — wire in when key exists)

Insert after the existing Webhook module, before Gmail/Notion:

1. **Anthropic Claude → "Create a Chat Completion"** (or message module)
   - Model: `claude-opus-4-8`
   - System / prompt: contents of `notes/day-20-ai-prompt-v1.md`
   - User content: the webhook's `current_workflow` value
   - Instruct: return strict JSON, no prose.
2. **Parse JSON** module on the model's text output → fields summary, category,
   priority, needs_review.
3. **Supabase → "Update a Row"** (HTTP PATCH to the REST API, `apikey` +
   `Authorization: Bearer` headers, same as Day 18)
   - Match on `id` = webhook row id
   - Set: `ai_summary`, `ai_category`, `ai_priority`, `ai_needs_review`,
     `ai_prompt_version="v1"`, `ai_model="claude-opus-4-8"`, `ai_status="Pending"`

## App code changes

- **IntakeForm.jsx** — include `currentWorkflow` in the `onAddCandidate` payload
  (fixes the throw-away at the current `handleSubmit`).
- **App.jsx**
  - `handleAddCandidate` inserts `current_workflow`; webhook payload includes it
    + row id.
  - Add `handleApproveSuggestion(id)` and `handleRejectSuggestion(id)` —
    UPDATE `ai_status` to `Approved`/`Rejected`, replace row in local state
    (Day-12 UPDATE-then-replace pattern).
- **ReviewQueue.jsx** — for each row, when `ai_status === 'Pending'`, render an
  AI-suggestion block: summary, category, priority, a "Needs review" badge when
  `ai_needs_review`, and **Approve** / **Reject** buttons. When `ai_status` is
  `Approved`/`Rejected`, show a small status chip instead of buttons.

**Approve semantics:** Approve only sets `ai_status='Approved'`. It does NOT
apply the AI's priority to the row's `risk` — the AI must not silently mutate
data; a human edits risk manually if desired.

## Testing (good / bad / edge)

Seed `current_workflow` + run the AI (or manually seed `ai_*` while key is
deferred) for three cases:

- **Good:** "Manually copy invoices from email into a spreadsheet every morning"
  → coherent summary, category≈Finance, sensible priority, `needs_review=false`.
- **Bad:** gibberish / near-empty → `needs_review=true` (low confidence).
- **Edge:** "Process customer credit-card refunds by hand" → `priority=High`,
  `needs_review=true`.

Human-approval loop (verifiable now): seed a `Pending` row → app shows
suggestion + buttons → Approve → row flips to `Approved` in Supabase and UI →
refresh persists.

## Error handling

Fire-and-forget webhook stays (Day-16 pattern). If Make/AI fails, the row stays
`ai_status=null` (no suggestion shown); the submission itself is unaffected.
Retries / idempotency / rate limits are explicitly **Day 21's** scope.

## Done checklist (from the plan)

- [x] AI output is stored — `ai_*` columns.
- [x] Human approval is required — AI only writes `Pending`; Approved/Rejected is
  human-only in the app.
- [x] Prompt version is documented — `ai_prompt_version` + `ai_model` columns,
  prompt text versioned in `notes/day-20-ai-prompt-v1.md`.
