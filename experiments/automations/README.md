# Automation Experiments

Use this folder for automation maps, webhook tests, and workflow notes.

Start every automation in plain English before building.

## Automation Map

```text
Trigger:
Input data:
Decision step:
Action:
Where result is stored:
Failure handling:
Human review point:
How I know it worked:
```

## First Experiment Idea

Visitor submits a form -> record is saved -> email notification is sent -> result appears in a dashboard or Notion table.

---

## Built: Tasklift Intake → Make → Email (Day 16)

First real automation. Status: working end-to-end (tested locally; not yet pushed to Netlify).

```text
Trigger:            User submits the Tasklift intake form (in the React app)
Input data:         id, label, owner, risk, status, created_at (JSON)
Decision step:      None yet — happy path only (risk-based routing comes Day 20)
Action:             Make "Send an Email" module emails the process details
Where result is stored: Supabase row (saved before the webhook fires); Make execution history
Failure handling:   Fire-and-forget fetch with .catch() — failure logs a warning, never
                    blocks the user or undoes the save. Retries are a Day 21 concern.
Human review point: Tasklift ReviewQueue — a human moves status before anything is archived
How I know it worked: Email lands in inbox; Make history shows a green-check run
```

### How it's wired
- Tool: **Make (make.com)**, free plan. Scenario = Custom Webhook trigger → Send an Email.
- App side: `App.jsx` `handleAddCandidate` does the Supabase insert, then fires a
  fire-and-forget `fetch` POST to `MAKE_WEBHOOK_URL` (hardcoded const, line ~38).
- Make learns the payload shape from the **first real submission**, so the build order is:
  paste URL → put webhook in "listening" mode → submit one test form → map the 6 fields
  into the email → turn scenario ON.

### Key gotcha
Make can't show the field bubbles to map until it has received one real payload. You
cannot map fields Make hasn't seen yet — always send one test submission first.

See `notes/day-16-webhooks-and-push.md` for the full webhook / push-vs-pull mental model.
