import urllib.request
import json

import os
# Token lives in D:\Claude\AI_optimization\.env (NOTION CONNECTION TOKEN)
TOKEN = os.environ.get("NOTION_TOKEN", "")
# Parent: 30-day AI Builder plan page
PARENT_PAGE_ID = "36532f18-146f-811e-a2bf-cffc65f6f476"

payload = {
    "parent": {"type": "page_id", "page_id": PARENT_PAGE_ID},
    "icon": {"type": "emoji", "emoji": "📋"},
    "title": [{"type": "text", "text": {"content": "Tasklift Submissions"}}],
    "properties": {
        "Name": {
            "title": {}
        },
        "Owner": {
            "rich_text": {}
        },
        "Risk": {
            "select": {
                "options": [
                    {"name": "Low", "color": "green"},
                    {"name": "Medium", "color": "yellow"},
                    {"name": "High", "color": "red"}
                ]
            }
        },
        "Status": {
            "select": {
                "options": [
                    {"name": "pending", "color": "gray"},
                    {"name": "approved", "color": "green"},
                    {"name": "rejected", "color": "red"}
                ]
            }
        },
        "Submitted At": {
            "date": {}
        },
        "Supabase ID": {
            "rich_text": {}
        }
    }
}

data = json.dumps(payload).encode("utf-8")

req = urllib.request.Request(
    "https://api.notion.com/v1/databases",
    data=data,
    method="POST",
    headers={
        "Authorization": f"Bearer {TOKEN}",
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28",
    },
)

with urllib.request.urlopen(req) as resp:
    body = json.loads(resp.read())
    db_id = body["id"]
    db_url = body["url"]
    print(f"Database created!")
    print(f"ID:  {db_id}")
    print(f"URL: {db_url}")
