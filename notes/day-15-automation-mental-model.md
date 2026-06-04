# Day 15 — Automation Mental Model

Week 3 starts here. Before wiring any automation into Tasklift, understand the 7-part
shape that every automation follows regardless of the tool (n8n, Make, Zapier, custom code).

---

## The 7 Parts of Every Automation

### 1. Trigger
What starts the automation? Something changes and the system reacts.

Examples:
- A form is submitted
- A Supabase row is updated
- A scheduled time arrives (cron)
- A file is uploaded
- A webhook fires from an external service

### 2. Input
What data does the automation receive when it starts?

The trigger always carries a payload — the raw information the automation will work with.

Examples:
- Form fields: `process_name`, `owner`, `frequency`, `risk_level`
- The row ID that changed
- The timestamp of the scheduled run

### 3. Decision
Does this input meet the conditions to proceed?

Automations should not fire blindly. A decision step filters, validates, or routes.

Examples:
- Only notify if `risk_level = High`
- Only create a Notion page if status changed to `Completed`
- Skip if the `owner` field is empty

### 4. Action
What does the automation actually do?

This is the work — sending data somewhere, creating something, updating something, notifying someone.

Examples:
- Send an email
- Create a Notion database row
- Post a Slack message
- Insert a row in Google Sheets
- Call an external API

### 5. Log
What record is kept that this run happened?

Without logging you cannot debug, audit, or replay failures. A good log records:
what triggered it, what input it received, what decision was made, what action was taken,
and whether it succeeded or failed.

Examples:
- A `automation_runs` table in Supabase
- A log file
- A Notion database
- Console output in n8n's execution history

### 6. Failure Handling
What happens when something goes wrong?

Networks time out. APIs return errors. Emails bounce. Every automation needs a defined
response to failure.

Options:
- Retry up to N times with backoff
- Send a failure alert to the owner
- Mark the record with an `error` status
- Halt the workflow and wait for manual intervention

### 7. Human Review
Where does a human need to approve or check before the automation continues?

Automations that skip human review cause silent damage. The best automations pause, show
their work, and wait for a thumbs-up on anything risky.

Examples:
- A "Pending Approval" queue before sending a bulk email
- A Slack message asking "Should I archive this?" with Yes/No buttons
- The Tasklift ReviewQueue — a human changes status before anything moves forward

---

## Automation Map: Tasklift Form Submission

Use this as the template before building any automation in Days 16–21.

| Part | What it is in Tasklift |
|---|---|
| Trigger | User submits the Intake form → INSERT fires |
| Input | `process_name`, `owner`, `frequency`, `risk_level`, `status = Reviewing` |
| Decision | If `risk_level = High` → escalate; else → add to queue normally |
| Action | Send email to owner / create Notion page / post Slack alert |
| Log | Record run in `automation_logs` table or append to a log column |
| Failure | If email fails → mark row `notify_failed`, retry on next cron |
| Human Review | ReviewQueue — status must be manually moved before anything is archived |

---

## Why This Mental Model Matters

Without it, automations:
- Fire on bad data (no decision step)
- Cause damage silently (no log step)
- Fail invisibly (no failure handling)
- Act without consent (no human review)

With it, you can describe any automation in plain English before touching a tool,
and you can debug any automation by asking "which of the 7 parts broke?"

---

## Key Questions Before Building Any Automation

1. What triggers this — user action, schedule, or external event?
2. What exact data does the trigger carry?
3. Under what conditions should this NOT run?
4. What is the one action this automation takes?
5. Where will I see proof that it ran?
6. What happens if the action fails?
7. Does a human need to approve anything first?

---

## Week 3 Map

| Day | Part focused on |
|---|---|
| Day 15 (today) | Mental model — all 7 parts |
| Day 16 | Action — email notification on form submit |
| Day 17 | Action — write to Notion/Sheets/CRM on form submit |
| Day 18 | Trigger — scheduled cron digest |
| Day 19 | Trigger — file upload to processing workflow |
| Day 20 | Decision + Human Review — AI classification with approval queue |
| Day 21 | Log + Failure Handling — retries, idempotency, rate limits, failure alerts |
