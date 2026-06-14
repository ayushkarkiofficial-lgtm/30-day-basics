# EPS_valuation — MVP Build Backlog ("the final automation")

> **Day 22 deliverable.** This converts the approved PRD
> (`docs/superpowers/specs/2026-06-14-day-22-eps-valuation-prd.md`) into an ordered,
> scoped task list. It is a **planning artifact**, not a code-level TDD plan: the real
> `EPS-main` codebase is used here only as the example and is **not modified** by this
> exercise. File references below describe *where the work would live* in that project,
> for grounding — not instructions to edit it now.

**Goal:** Take EPS_valuation from "demo approved" to **running on real work, daily, at
the office** by closing the six must-have gaps from the PRD.

**Definition of done (MVP):** staff use it on live valuation work for several
consecutive weeks without reverting to manual tracking; emails classify/match correctly
the large majority of the time; no case sits past its stage unnoticed.

---

## Sequencing logic

The order is driven by one rule: **protect data integrity before pointing the system at
the real, high-volume company inbox.** A junk folder or a wrong rupee figure created
during cutover erodes the boss's trust faster than any missing feature.

1. **Confirm guard** — must land *before* cutover, or live ambiguous mail can create junk folders.
2. **Mailbox cutover** — the switch that makes it "real."
3. **Bank-field cleanup** — cheap data-quality win, improves every view.
4. **PDF amount fix** — wrong money figures are the fastest trust-killer.
5. **Save attachments to disk** — completes the real day-to-day workflow.
6. **Live inbox → build-details** — closes the last sample-`.eml` gap.

Items 3–6 are largely independent of each other and could be reordered or parallelized;
1 and 2 are the gated front of the line.

---

## Task 1 — Pending confirm guard

- [ ] **What:** Block a one-click "Confirm → Site Visit" when the email's match mode is
  `ambiguous` or `unidentified`, so it can't silently create a junk/mis-named case.
- [ ] **Why:** Once the live company inbox is connected (Task 2), bad matches arrive at
  volume; an unguarded confirm writes them onto the board and (later) to disk.
- **Where it lives (example):** the matcher already emits modes (`matched`,
  `autoMatched`, `ambiguous`, `new_client`/`new_job`, `unidentified`) in `emails/match.js`;
  the guard belongs at the confirm path (`POST /confirm` in `serve.js`) + the Pending UI
  (`dashboard/pending.js`) that renders the Confirm button.
- **Acceptance criteria:**
  - `matched` / `autoMatched` → Confirm works as today.
  - `ambiguous` / `unidentified` → Confirm is disabled (or requires an explicit
    "pick the right case / mark as new" step first); no case is created by a blind click.
  - A pure-logic check covers each mode → allowed/blocked.
- **Depends on:** nothing. **Do first.**

## Task 2 — Cut over to the company cPanel mailbox

- [ ] **What:** Point live email ingestion at the real company mailbox instead of the
  test Gmail.
- [ ] **Why:** The system can't be "the final automation" while it reads a test inbox.
- **Where it lives (example):** the documented **4-setting swap** in `mail.local.json`
  (`host`, `port`, `user`, `pass`); nothing else changes. A dedicated
  `automation@…` mailbox should be created on the company cPanel (not a personal staff inbox).
- **Acceptance criteria:**
  - IMAP IDLE connects to the company mailbox; the connection status dot shows healthy.
  - A real incoming email is classified and appears on the dashboard via SSE with no manual refresh.
  - Credentials stay git-ignored.
- **Depends on:** Task 1 (guard in place before real mail flows); access to cPanel /
  the new mailbox credentials (an **external dependency** — may need the office's IT/host).

## Task 3 — Clean up the bank field

- [ ] **What:** Stop branch names being mislabelled as banks in the index/case data.
- [ ] **Why:** The bank/branch split drives the filter rail and matching; wrong labels
  pollute filters and weaken email→folder matching.
- **Where it lives (example):** bank/branch detection rules in `config.js` + how the
  indexer (`build-index.js`) assigns them; verify against the case roll-up.
- **Acceptance criteria:**
  - Known mislabelled folders now report the correct bank vs. branch.
  - The filter rail's Bank list no longer contains branch names.
  - A pure-logic check on a few representative folder paths.
- **Depends on:** nothing.

## Task 4 — Fix the PDF amount parser (crore/lakh)

- [ ] **What:** Correctly parse the valuation rupee figure from report PDFs (e.g. read
  the full amount, not "2.97"); handle Nepali crore/lakh magnitudes.
- [ ] **Why:** A visibly wrong valuation amount is the single fastest way to lose the
  boss's trust in the tool.
- **Where it lives (example):** the PDF extractor (`extractors/pdf.js`) feeding
  `build-details.js` → the "Client & property" amount field.
- **Acceptance criteria:**
  - A set of real-format sample amounts parse to the correct rupee value.
  - Crore/lakh wording resolves to the right magnitude.
  - A pure-logic check with a table of input strings → expected numbers.
- **Depends on:** nothing.

## Task 5 — Save email attachments to disk (the old "Feature 3")

- [ ] **What:** When an email is matched to a case, save its attachments into that
  case's folder (the right bucket: Photo / docs / Drawing).
- [ ] **Why:** Documents arriving by email is a core part of the real workflow; today
  they aren't filed automatically.
- **Where it lives (example):** the ingestion pipeline (`serve.js` IMAP handler →
  classify/match) + folder layout from `folder-create.js`; writes to the SERVER tree
  (the second write-to-disk action after folder creation).
- **Acceptance criteria:**
  - A matched email's attachments land in the correct case folder/bucket.
  - Unmatched / guarded emails (Task 1) do **not** write attachments anywhere.
  - Re-processing the same email doesn't duplicate files (idempotent on filename).
  - The folder watcher re-indexes so the new files appear in the dashboard.
- **Depends on:** Task 1 (don't file attachments for bad matches); benefits from Task 2.

## Task 6 — Feed the live inbox into `build-details.js`

- [ ] **What:** Make the detail extractor's email half read the **live** feed instead of
  sample `.eml` fixtures.
- [ ] **Why:** Closes the last gap where a piece of the pipeline still runs on demo data;
  the dashboard already works around it, but the underlying `clients-detail.json` should
  reflect real mail.
- **Where it lives (example):** `build-details.js` email half (currently reads `.eml`
  fixtures) → align with the live `emails.json` the rest of the app uses.
- **Acceptance criteria:**
  - `clients-detail.json` reflects fields from live incoming mail, not fixtures.
  - The "Client & property" panel matches what the live-email join already shows.
- **Depends on:** Task 2 (a live feed must exist).

---

## Out of scope for this MVP (from the PRD's non-goals)

Completed-list sort + separate completed folder path; pipeline drawer manual stage-move;
delete unused `explorer.html`; web hosting / Cloudflare Tunnel; calendar tithi labels +
reached-✓ marks; sending chase emails; AI classifier; Outlook/`.msg`; override-edit UI;
second client / multi-tenant / SaaS / vertical templating.

## External dependencies / risks to flag early

- **cPanel mailbox access** (Task 2) is not in your control — request the
  `automation@…` mailbox from whoever manages the company host *now*, since it gates "real."
- **Running on the office machine / network share:** `fs.watch` on a share needs the
  noted polling fallback before deploy.
- **Privacy:** real client + bank data on disk — keep the data and `index.json` out of
  any public repo.
