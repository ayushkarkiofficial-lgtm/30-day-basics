# Day 16 — Webhooks, and the Push vs Pull Mental Model

Day 16 built the first real automation (form submit → Make webhook → email). But the
bigger win was the concept discussion that followed. This note captures it so the model
is reusable for the rest of Week 3 and beyond.

---

## fetch vs GET vs POST

It is NOT "fetch vs GET vs POST." That is a category mistake.

- **`fetch`** = the tool / messenger. Sends a request to a URL, brings back a response.
- **`GET` / `POST`** = the *type* of message you hand the messenger.

`fetch` defaults to GET if you don't specify a method.

| | GET | POST |
|---|---|---|
| Intent | "Give me data" | "Take this data and do something" |
| Direction | server → you | you → server |
| Data rides in | the URL (`?q=...`) | the hidden **body** |
| Changes things? | No (just reads) | Usually yes (creates/sends/updates) |
| Safe to repeat? | Yes | No — may repeat the action |
| Good for secrets/big data? | No (URL is exposed) | Yes (body is hidden) |
| Tasklift example | Loading the review queue | Sending the form to Make |

Other methods met already without naming them: Day 12's Supabase update = PATCH,
delete = DELETE.

One sentence: **`fetch` is the messenger; GET says "bring me something," POST says
"take this and do something with it."**

---

## Webhook vs API — really Pull vs Push

"Webhook vs API" is also a category mistake — a webhook IS a kind of API. The real
coin is **PULL vs PUSH**, defined by *who makes the first move*:

| | PULL (request/response API call) | PUSH (webhook) |
|---|---|---|
| Who starts it? | You ask | The event starts it |
| When? | Whenever you decide | The moment something happens |
| Direction | you → "give me data" → server replies | server → "this happened" → you |
| Metaphor | Checking your mailbox | Mail landing on your doormat |
| Tasklift example | Loading the queue from Supabase (Day 11) | Form submit → Make (Day 16) |

Push exists to kill **polling** (asking "anything new yet?" over and over).
Instead of constantly asking, the other system tells you the instant it happens.

> Pull = "I'll ask when I'm curious." Push = "Don't call me, I'll call you."

---

## A webhook is a doorbell, not a vending machine

A webhook does NOT sit there holding data to hand back. It is an empty catcher that
**receives** data and **triggers** an action. Data flows INTO it, never out.

- Want a server to **hand you data**? GET an **API endpoint** (e.g. Supabase). That's
  the vending machine.
- A **webhook** (e.g. Make) is the doorbell — you press it (send data in) and something
  happens on the other side.

If you sent a GET to a Make webhook, it would still just *receive + trigger* (reading
fields from the URL). It never reverses into "here, have some data."

---

## How our Tasklift queue actually stays fresh (and the polling question)

Our app does NOT poll Supabase. It fetches **once on load** (`useEffect(..., [])`).
That avoids polling — but by going to the other extreme: it asks once and the data can
then go **stale** (you won't see changes made elsewhere until you refresh).

Three strategies:

| Strategy | What it does | Downside |
|---|---|---|
| Polling | Ask every few seconds | Wasteful, laggy |
| Fetch once on load ← us | Ask one time when the page opens | Data goes stale |
| Push / Realtime | Server tells you the instant data changes | More setup |

Our own changes show instantly NOT from a refetch and NOT from the webhook — it's
because after each action we update the local React array directly
(`setQueueItems([data, ...current])` etc.). Someone else's changes don't show, because
nothing tells our app about them.

**The Day 16 webhook pushes data OUT (to Make), it does NOT refresh our screen.**

---

## Why a webhook can't keep a browser UI live (and what can)

To **receive** a webhook you must be (1) an always-on server with (2) a public URL.
A browser tab is neither — it has no public address. So Supabase cannot "call a webhook
on the UI's side." There's no doorbell to ring.

The fix: the browser **dials out and holds a line open** — a **WebSocket**. The server
then pushes news down that already-open line. Supabase's built-in version is
**Supabase Realtime**. Because it listens at the database level, it fires for **every**
source of change (our form, the SQL editor, another app, another device).

WebSocket detail: it *does* start with a URL (`wss://...`) used **once** to "dial." After
the handshake the line stays open and messages flow as frames — no new URL per message.
A URL is the phone number; a normal request hangs up and re-dials each time; a WebSocket
dials once and keeps talking. One connection per browser tab — costs held-open memory per
client, but far cheaper than polling's constant requests.

---

## The caller / receiver rule (clears up "Supabase Database Webhook")

Every webhook has two roles:
- **Receiver** — provides and **holds the URL**, catches the POST. (the doorbell)
- **Caller** — **fires** the POST to that URL. (the finger pressing it)

**The receiver always holds the URL.** So Make holds the URL in every case.

- **Day 16:** caller = your browser (form submit). receiver = Make.
- **"Supabase Database Webhook":** caller = Supabase (row changed). receiver = Make.

"Supabase Database Webhook" is just the feature that makes **Supabase the caller** —
"when this table changes, POST to [Make's URL]." Use it when the caller should be
Supabase itself (change came from somewhere other than our form, or no browser is open).

---

## The two push tools, split by who's receiving

| You want to notify… | Use | Why |
|---|---|---|
| Another **server** (Make, n8n, an API) when the table changes | Supabase **Database Webhook** | servers can receive POSTs |
| A **browser UI** when the table changes | Supabase **Realtime** (WebSocket) | browsers can't receive POSTs — they open a pipe |

---

## The one-line summary

> **Webhook = push to a server that holds a URL. WebSocket/Realtime = push to a browser
> that opened a pipe. Pull (GET an API) = you ask for data; Push = it tells you.**

NOTE TO FUTURE SESSION: when we build Supabase Realtime, the user wants to run/wire it
themselves by hand (the hands-on Make setup is what made webhooks click). Remind them.
