# Day 20 AI Prompt — v1

**Version:** `v1` (stored in the `ai_prompt_version` column on each row)
**Model:** `claude-opus-4-8` (stored in the `ai_model` column)
**Where it runs:** Make → Anthropic Claude module, inside the existing submission
scenario (the one `MAKE_WEBHOOK_URL` fires on Day 16/17).
**Status:** documentation only — not live until an Anthropic API key is added to
the Make connection.

---

## Input

The webhook sends the row's `current_workflow` text (what the user typed into the
intake form's "What happens today?" box). Feed that text in as the user message.

## System prompt (paste into the Make Anthropic module)

```
You classify and summarize a manual business process that a user wants to
automate. You are given a free-text description of what the team does today.

Return ONLY a single JSON object, no prose, no markdown fences, with exactly
these keys:

{
  "summary": string,        // one clear sentence describing the process
  "category": string,       // one word/short phrase: e.g. Finance, Support, Ops, Sales, HR, IT
  "priority": string,       // exactly one of: "Low", "Medium", "High"
  "needs_review": boolean   // true if the text is vague/empty, OR involves money,
                            // payments, customer PII, or anything high-risk, OR
                            // you are uncertain about the classification
}

Rules:
- "summary" must be one sentence, plain language, no jargon.
- "priority" is your judgment of automation urgency/value, not the user's risk field.
- Set "needs_review" to true whenever a human should double-check before acting.
- If the description is empty or nonsense, return a best-effort summary and set
  needs_review = true.
- Output the JSON object and nothing else.
```

## Expected output shape

```json
{ "summary": "...", "category": "...", "priority": "Low|Medium|High", "needs_review": true }
```

## After the model returns

1. **Parse JSON** module → fields `summary`, `category`, `priority`, `needs_review`.
2. **HTTP PATCH** to the Supabase REST API (same `apikey` + `Authorization: Bearer`
   headers as the Day-18 GET — this is the first WRITE-back to Supabase from Make):

   ```
   PATCH {SUPABASE_URL}/rest/v1/First_app_data?id=eq.{{webhook.id}}
   Headers:
     apikey: <anon or service_role key>
     Authorization: Bearer <same key>
     Content-Type: application/json
     Prefer: return=representation
   Body:
   {
     "ai_summary": "{{parsed.summary}}",
     "ai_category": "{{parsed.category}}",
     "ai_priority": "{{parsed.priority}}",
     "ai_needs_review": {{parsed.needs_review}},
     "ai_prompt_version": "v1",
     "ai_model": "claude-opus-4-8",
     "ai_status": "Pending"
   }
   ```

   `?id=eq.{{webhook.id}}` is load-bearing — without it the PATCH updates EVERY row.

## Quality test cases (run when the AI step is live)

- **Good:** "Manually copy invoices from email into a spreadsheet every morning."
  → coherent summary, category ≈ Finance, sensible priority, `needs_review=false`.
- **Bad:** gibberish / near-empty → best-effort summary, `needs_review=true`.
- **Edge:** "Process customer credit-card refunds by hand."
  → `priority=High`, `needs_review=true`.

## Changing the prompt later

Bump the version (`v2`, ...) and update the `ai_prompt_version` value the PATCH
writes. The column then records which prompt produced each row's suggestion.
