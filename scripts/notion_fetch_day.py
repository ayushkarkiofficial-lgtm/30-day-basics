import urllib.request, json, sys, os, re

# Token lives in D:\Claude\AI_optimization\.env under "NOTION CONNECTION TOKEN".
# Read it from there (or from the NOTION_TOKEN env var) — never hardcode secrets.
def load_token():
    tok = os.environ.get("NOTION_TOKEN", "")
    if tok:
        return tok
    env_path = r"D:\Claude\AI_optimization\.env"
    if os.path.exists(env_path):
        with open(env_path, encoding="utf-8") as f:
            for line in f:
                m = re.match(r"\s*NOTION CONNECTION TOKEN\s*[:=]\s*(\S+)", line)
                if m:
                    return m.group(1)
    raise SystemExit("No Notion token found (set NOTION_TOKEN or the .env entry).")

TOKEN = load_token()
PAGE_ID = "36532f18-146f-811e-a2bf-cffc65f6f476"  # AI Builder Revised 30-Day Plan
HEADERS = {
    "Authorization": f"Bearer {TOKEN}",
    "Notion-Version": "2022-06-28",
    "Content-Type": "application/json",
}

def get_children(block_id):
    results, cursor = [], None
    while True:
        url = f"https://api.notion.com/v1/blocks/{block_id}/children?page_size=100"
        if cursor:
            url += f"&start_cursor={cursor}"
        req = urllib.request.Request(url, headers=HEADERS)
        data = json.load(urllib.request.urlopen(req))
        results.extend(data["results"])
        if data.get("has_more"):
            cursor = data["next_cursor"]
        else:
            break
    return results

def rich(block, t):
    return "".join(r.get("plain_text", "") for r in block[t].get("rich_text", []))

def dump(block_id, depth=0):
    for b in get_children(block_id):
        t = b["type"]
        text = ""
        if t in ("paragraph","heading_1","heading_2","heading_3","bulleted_list_item",
                 "numbered_list_item","to_do","toggle","quote","callout","code"):
            text = rich(b, t)
        elif t == "child_page":
            text = "[PAGE] " + b["child_page"]["title"]
        elif t == "divider":
            text = "---"
        prefix = "  " * depth
        marker = {"heading_1":"# ","heading_2":"## ","heading_3":"### ",
                  "bulleted_list_item":"- ","numbered_list_item":"1. ",
                  "to_do":"[ ] ","toggle":"> ","code":"`"}.get(t,"")
        if text:
            print(f"{prefix}{marker}{text}")
        if b.get("has_children"):
            dump(b["id"], depth+1)

def find_day19(block_id):
    for b in get_children(block_id):
        if b["type"] == "child_page" and "Day 19" in b["child_page"]["title"]:
            print("=== " + b["child_page"]["title"] + " ===")
            dump(b["id"])
            return True
        if b.get("has_children"):
            if find_day19(b["id"]):
                return True
    return False

if not find_day19(PAGE_ID):
    print("Day 19 page not found")
