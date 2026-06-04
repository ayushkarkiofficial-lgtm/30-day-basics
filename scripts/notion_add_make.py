import urllib.request
import json

import os
# Token lives in D:\Claude\AI_optimization\.env (NOTION CONNECTION TOKEN)
TOKEN = os.environ.get("NOTION_TOKEN", "")
PAGE_ID = "37532f18-146f-8009-8b11-c47bf5a89522"

blocks = [
    {
        "type": "heading_1",
        "heading_1": {
            "rich_text": [{"type": "text", "text": {"content": "Make Automations — Tasklift 30-Day Plan"}}]
        }
    },
    {
        "type": "paragraph",
        "paragraph": {
            "rich_text": [{"type": "text", "text": {"content": "This page documents every Make (make.com) scenario built during the 30-day AI builder plan. Each section is one automation: what it does, how it is wired, and the key lesson learned."}}]
        }
    },
    {"type": "divider", "divider": {}},
    {
        "type": "heading_2",
        "heading_2": {
            "rich_text": [{"type": "text", "text": {"content": "Day 16 — Tasklift Intake Form → Email Notification"}}]
        }
    },
    {
        "type": "heading_3",
        "heading_3": {
            "rich_text": [{"type": "text", "text": {"content": "What it does"}}]
        }
    },
    {
        "type": "paragraph",
        "paragraph": {
            "rich_text": [{"type": "text", "text": {"content": "When a user submits the Tasklift intake form, the row is saved to Supabase and then Make receives a webhook POST with the row details. Make sends an email containing the process label, owner, risk level, status, and timestamp."}}]
        }
    },
    {
        "type": "heading_3",
        "heading_3": {
            "rich_text": [{"type": "text", "text": {"content": "7-Part Automation Map"}}]
        }
    },
    {
        "type": "bulleted_list_item",
        "bulleted_list_item": {
            "rich_text": [{"type": "text", "text": {"content": "Trigger: User submits the Tasklift React intake form"}}]
        }
    },
    {
        "type": "bulleted_list_item",
        "bulleted_list_item": {
            "rich_text": [{"type": "text", "text": {"content": "Input: id, label, owner, risk, status, created_at (6 fields, JSON)"}}]
        }
    },
    {
        "type": "bulleted_list_item",
        "bulleted_list_item": {
            "rich_text": [{"type": "text", "text": {"content": "Decision: None yet — happy path only (risk-based routing comes Day 20)"}}]
        }
    },
    {
        "type": "bulleted_list_item",
        "bulleted_list_item": {
            "rich_text": [{"type": "text", "text": {"content": "Action: Make Send an Email module — all 6 fields mapped into subject and body"}}]
        }
    },
    {
        "type": "bulleted_list_item",
        "bulleted_list_item": {
            "rich_text": [{"type": "text", "text": {"content": "Log: Make execution history (green-check runs visible in scenario dashboard)"}}]
        }
    },
    {
        "type": "bulleted_list_item",
        "bulleted_list_item": {
            "rich_text": [{"type": "text", "text": {"content": "Failure handling: Fire-and-forget fetch with .catch() — failure logs a console warning, never blocks the user or undoes the Supabase save. Retries: Day 21."}}]
        }
    },
    {
        "type": "bulleted_list_item",
        "bulleted_list_item": {
            "rich_text": [{"type": "text", "text": {"content": "Human review: Tasklift ReviewQueue — a human moves status before anything is archived"}}]
        }
    },
    {
        "type": "heading_3",
        "heading_3": {
            "rich_text": [{"type": "text", "text": {"content": "How it is wired"}}]
        }
    },
    {
        "type": "numbered_list_item",
        "numbered_list_item": {
            "rich_text": [{"type": "text", "text": {"content": "In Make: Create scenario with Custom Webhook trigger. Copy the webhook URL."}}]
        }
    },
    {
        "type": "numbered_list_item",
        "numbered_list_item": {
            "rich_text": [{"type": "text", "text": {"content": "In App.jsx: Paste URL into MAKE_WEBHOOK_URL const (~line 38). After Supabase INSERT succeeds, fire a fetch POST with the 6 fields as JSON body."}}]
        }
    },
    {
        "type": "numbered_list_item",
        "numbered_list_item": {
            "rich_text": [{"type": "text", "text": {"content": "Put Make webhook in listening mode, then submit one real test form. Make detects the 6-field payload shape."}}]
        }
    },
    {
        "type": "numbered_list_item",
        "numbered_list_item": {
            "rich_text": [{"type": "text", "text": {"content": "Add Send an Email module. Map all 6 fields into subject and body. Connect email account. Turn scenario ON."}}]
        }
    },
    {
        "type": "heading_3",
        "heading_3": {
            "rich_text": [{"type": "text", "text": {"content": "Key gotcha — data-first workflow"}}]
        }
    },
    {
        "type": "callout",
        "callout": {
            "rich_text": [{"type": "text", "text": {"content": "Make cannot show field label bubbles until it has received one real payload. You cannot map fields Make has not seen yet. Always send one test submission before trying to map fields in the email module."}}],
            "icon": {"type": "emoji", "emoji": "⚠️"},
            "color": "yellow_background"
        }
    },
    {
        "type": "heading_3",
        "heading_3": {
            "rich_text": [{"type": "text", "text": {"content": "Key concept — Push vs Pull"}}]
        }
    },
    {
        "type": "paragraph",
        "paragraph": {
            "rich_text": [{"type": "text", "text": {"content": "This automation is PUSH: the React app presses the doorbell (POSTs to Make's URL) and something happens on the other side. Make does not poll — it catches and reacts. Contrast with PULL: loading the Supabase queue (the app asks Supabase for data on page load)."}}]
        }
    },
    {
        "type": "quote",
        "quote": {
            "rich_text": [{"type": "text", "text": {"content": "Pull = \"I will ask when I am curious.\"  Push = \"Don't call me, I'll call you.\""}}]
        }
    },
    {
        "type": "heading_3",
        "heading_3": {
            "rich_text": [{"type": "text", "text": {"content": "Status"}}]
        }
    },
    {
        "type": "paragraph",
        "paragraph": {
            "rich_text": [
                {"type": "text", "text": {"content": "Working end-to-end. "}, "annotations": {"bold": True}},
                {"type": "text", "text": {"content": "Tested: form submit → Supabase row saved → Make fires → email arrives with all 6 fields filled in."}}
            ]
        }
    },
    {"type": "divider", "divider": {}},
    {
        "type": "heading_2",
        "heading_2": {
            "rich_text": [{"type": "text", "text": {"content": "Day 17 — Tasklift Intake Form → Notion Row (coming next)"}}]
        }
    },
    {
        "type": "paragraph",
        "paragraph": {
            "rich_text": [{"type": "text", "text": {"content": "Goal: add a second module to the existing Day 16 Make scenario so each form submission also creates a row in a Notion database. No new React code needed — just an extra Make module on the same webhook."}}]
        }
    },
    {
        "type": "bulleted_list_item",
        "bulleted_list_item": {
            "rich_text": [{"type": "text", "text": {"content": "Same webhook, same 6 fields, same trigger"}}]
        }
    },
    {
        "type": "bulleted_list_item",
        "bulleted_list_item": {
            "rich_text": [{"type": "text", "text": {"content": "Add Make Notion module: Create a database item"}}]
        }
    },
    {
        "type": "bulleted_list_item",
        "bulleted_list_item": {
            "rich_text": [{"type": "text", "text": {"content": "Connect Make to Notion via the official Notion integration"}}]
        }
    },
    {
        "type": "bulleted_list_item",
        "bulleted_list_item": {
            "rich_text": [{"type": "text", "text": {"content": "Map label → Name, owner → Owner, risk → Risk, status → Status, created_at → Date"}}]
        }
    },
]

payload = json.dumps({"children": blocks}).encode("utf-8")

req = urllib.request.Request(
    f"https://api.notion.com/v1/blocks/{PAGE_ID}/children",
    data=payload,
    method="PATCH",
    headers={
        "Authorization": f"Bearer {TOKEN}",
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28",
    },
)

with urllib.request.urlopen(req) as resp:
    body = json.loads(resp.read())
    print(f"OK — {len(body.get('results', []))} blocks added")
