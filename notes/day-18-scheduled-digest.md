# Day 18 — Scheduled Daily Digest

Day 18 replaced a webhook-triggered scenario with a time-triggered one, and introduced
querying an external API (Supabase) from inside Make instead of receiving data pushed in.

---

## Event-driven vs Time-driven automation

Days 16–17 were event-driven: a form submit fires the webhook → Make runs immediately.
Day 18 is time-driven: a clock fires Make at 8pm every day regardless of user activity.

| | Event-driven (Days 16–17) | Time-driven (Day 18) |
|---|---|---|
| What starts it? | Something happens | The clock hits a time |
| When? | Immediately, any time of day | At a fixed schedule |
| Data source | Webhook payload (pushed in) | API query (pulled out) |
| Make trigger | Custom Webhook module | Scenario schedule setting |
| Good for | Notifications, real-time sync | Digests, reports, batch jobs |

The schedule is NOT a module — it is a setting on the scenario itself (the clock icon
at the bottom of the Make scenario editor). Set it to Daily + a time → Make wakes the
scenario automatically.

---

## The Make scenario built today

```
Schedule (Daily 8pm Asia/Kathmandu)
  → HTTP: Make a request (GET Supabase → today's submissions)
  → Gmail: Send digest email (one email summarising all rows)
```

Cloned from the Day 16/17 scenario. Webhook replaced with HTTP. Gmail updated for digest format.

---

## HTTP module — calling Supabase REST API

Supabase exposes every table as a REST endpoint:
```
GET https://<project>.supabase.co/rest/v1/<table>?<filter>
```

**URL used:**
```
https://lfqvnkseyetoilxiylsz.supabase.co/rest/v1/First_app_data?created_at=gte.{{formatDate(now; "YYYY-MM-DD")}}
```

`gte` = "greater than or equal to". This is the same as SQL: `WHERE created_at >= '2026-06-04'`.
Without the filter the query would return every row ever inserted.

**Two required headers:**

| Header | Value | Why |
|--------|-------|-----|
| `apikey` | Supabase anon key | Identifies the Supabase project |
| `Authorization` | `Bearer <anon key>` | Proves the caller's role (anon) |

Both use the same token value but serve different checks. Missing either returns 401.
Authentication type in Make: **None** — the headers handle auth, not Make's built-in auth system.

**Parse response: Yes** — tells Make to decode the JSON body so downstream modules can
access individual fields. Without it, Make gets a raw string, not usable data.

---

## How the data comes back

Supabase returns an array of objects (one per matching row). With Parse response ON, Make
wraps this as a single bundle with a `data` array inside:

```
Bundle 1
└── data (Array)
    ├── 1: { id, label, owner, status, risk, created_at }
    └── 2: { id, label, owner, status, risk, created_at }
```

This is different from the webhook scenario (Days 16–17), where each webhook call was
already one item → Make created one bundle per call.

Here, all today's rows arrive at once inside one bundle's `data` array.

---

## Array functions used in Gmail body

Because all rows are in one array, you can't just write `{{1.label}}` (that's a single
item). You use array functions:

| Expression | What it does |
|---|---|
| `{{length(1.data)}}` | Count how many items are in the array |
| `{{map(1.data; "label")}}` | Extract the `label` field from every item → new array |
| `{{join(map(1.data; "label"); "\n")}}` | Turn that array into a newline-separated string |

The result: **one email per day** with a count and a line-by-line task list — not one
email per submission.

---

## Why `1.data` not `1.label`

`1` always refers to the output of Module 1 (HTTP).
The HTTP module returned: `{ data: [...], headers: {...}, statusCode: 200 }`.
So `1.data` = the array of rows. `1.label` would be undefined — label is inside each
item in the array, not on the top-level response object.

---

## Digest email template

```
Subject: Daily Tasklift Digest – {{formatDate(now; "YYYY-MM-DD")}}

Body:
Tasklift Daily Digest

Date: {{formatDate(now; "YYYY-MM-DD")}}
Total submissions today: {{length(1.data)}}

Tasks:
{{join(map(1.data; "label"); "
")}}
```

---

## Key lessons

1. **Scheduled trigger ≠ a module.** It is a scenario-level setting.
2. **Pulling data means you query an API.** Supabase's REST API is the query interface.
   Filters go in the URL query string (`?field=gte.value`).
3. **Two Supabase headers are always required:** `apikey` + `Authorization: Bearer`.
4. **Array functions (`length`, `map`, `join`)** are how you turn a list of rows into
   a single readable message. Essential for any digest or batch automation.
5. **One bundle vs many bundles matters.** If HTTP returns an array as one bundle, Gmail
   runs once. If data came in as separate bundles (e.g. from an iterator), Gmail would
   run once per item — producing many emails instead of one digest.
