# Day 22 PRD — EPS_valuation (Automation Service for Small Companies)

**Date:** 2026-06-14
**Type:** Day 22 deliverable — Pick MVP theme + write a small, scoped PRD.
**Status:** Approved (brainstorm complete).

> **Note on scope of this document.** This is a *learning-plan* PRD written in the
> 30-day-plan repo. The real project it describes (`EPS-main`) is a separate, live
> codebase and is **not modified by this exercise** — it is used here only as the
> concrete example that grounds the PRD. Nothing in this document should be taken as
> a change to that repo.

---

## 1. Problem

Small companies run their core operations on manual, repetitive back-office work —
sorting email, wrangling files in folders, tracking jobs through stages, and
re-typing the same data into reports. It eats staff time and things slip ("which job
is waiting on documents?"). Off-the-shelf SaaS rarely fits, because each small
company's workflow is idiosyncratic, and they can't afford enterprise tools or an
in-house developer.

**Concrete example (the flagship case):** EPS, a property-valuation office serving
banks in Nepal, loses hours manually triaging bank emails, hunting through folders,
and tracking which valuation is at which stage.

## 2. Target user

- **Buyer:** the owner/boss of a small company, usually non-technical, drowning in
  manual work.
- **Daily user:** their staff (engineers, clerks) who actually process the work.
- **Reach:** *opportunistic across industries* — anywhere the pattern is "email in →
  files pile up → work moves through stages → documents go out."
- **Flagship / first user:** the EPS valuation office.

## 3. Main workflow (two layers)

**How you deliver (the service):**
discover a company's manual pain → map their real workflow → build it, **reusing the
existing engine when the workflow is similar (model C), building fresh when it isn't
(model A)** → deploy on their real data → support & iterate. The per-client decision
is explicit: *"is this similar enough to reuse the engine, or is it a fresh build?"*

**What the automation does (EPS as the example):**
email arrives → auto-classified & matched to the right case → case tracked through
stages (Site Visit → Primary → Final → Delivered) on a live dashboard → client
folders created/organized automatically → staff see what's pending/urgent at a glance.

## 4. MVP features — "the final automation"

The demo has already been shown and approved. The MVP finish line is now **the final
automation running on real work, every day, at the office** — real company mailbox,
real folder tree, staff relying on it instead of manual tracking.

Most of the engine already exists; the MVP work is to close the remaining gaps that
block *real production use*:

- **Cut over to the company cPanel mailbox** (the 4-setting swap) — it can't be "real"
  on a test Gmail.
- **Pending confirm guard** — don't let an ambiguous/unidentified email be one-click
  confirmed into a junk folder (data integrity).
- **Save email attachments to disk** in the right case folder (the original "Feature 3").
- **PDF amount parser fix** — wrong rupee figures (needs crore/lakh handling); wrong
  numbers erode trust fast.
- **Clean up the bank field** — some branch names are mislabelled as banks (data quality).
- **Feed the live inbox into `build-details.js`** — close the last sample-`.eml` gap.

## 5. Non-goals (explicitly NOT in this MVP)

Deferred backlog — genuinely useful, but not blocking real daily use:

- Completed-list sort by completion date + a separate completed-jobs folder path.
- Pipeline drawer manual stage-move.
- Delete the unused `dashboard/explorer.html`.
- Web hosting / Cloudflare Tunnel to reach the dashboard off-site ("later").
- Calendar tithi/lunar-day labels + reached-✓ marks on past visits.
- Send the draft chase emails; AI classifier swap; Outlook/`.msg` support; an
  override-edit UI.

Bigger strategic non-goals (the broader vision, not this MVP):

- A second client / multi-tenant onboarding.
- A self-serve SaaS anyone can sign up for.
- A "configure for any vertical" templating layer — engine reuse stays manual/ad-hoc.
- Replacing the report tools (Excel/Word/AutoCAD/GIS).
- Generalizing the engine *before the first client is even live*.

## 6. Success metrics

- Staff use it on live valuation work for several consecutive weeks **without
  reverting to manual tracking**.
- Time-to-find-a-case drops; no case sits past its stage unnoticed.
- Incoming emails classify/match correctly the large majority of the time.
- The boss would pay for it / recommend it to a peer.

## 7. Risks

- **Adoption:** staff revert to old folder habits if the tool feels like extra work
  rather than less.
- **Trust:** a few mis-classified or mis-matched emails (or wrong amounts) erode
  confidence quickly.
- **Deployment:** the test-Gmail → company cPanel mailbox swap; running on the office's
  real machine / network share (`fs.watch` on a share needs a polling fallback).
- **Privacy:** real client names + bank data live on disk — not for a public repo.
- **Focus:** single developer; the project has already grown many features
  (scope-creep risk).

## 8. Automation opportunities

- **Already built:** email classify + match, case-state rollup, automatic folder
  creation, incremental reindex, live SSE refresh.
- **Next candidates (post-MVP):** auto-save attachments to the right folder; AI
  classifier swap behind the existing `classify()` seam; auto-send the pending-docs
  chase emails (drafts are already generated); final-report date → calendar `F` tag;
  `.msg`/Outlook support.

---

## Decisions captured during brainstorming

| Decision | Choice |
|----------|--------|
| What the PRD is about | The broader **automation service for small companies** (EPS_valuation as flagship), not just the EPS tool in isolation. |
| Delivery model | **Bespoke per client (A)**, reusing the engine when the next company is similar (**C**). "Custom builds that harvest reusable parts." |
| Target customer | **Opportunistic** — any small company with manual back-office pain. |
| MVP success metric | **EPS_valuation in real daily use at the valuation office** (the "final automation"). Demo milestone already achieved. |
| Name | **EPS_valuation** |
| Real `EPS-main` repo | **Not modified** — used only as the example for this learning-plan PRD. |
