# File Routing

Use this file at the end of a task to decide whether anything should be saved.

## Core Files

- `README.md` - Workspace overview and basic working rhythm.
- `FILE_ROUTING.md` - Quick map of which file should store which type of information.

## Notes

- `notes/ai-dev-log.md` - Daily progress, what was built, what worked, what confused you, and next steps.
- `notes/day-N-*.md` - Deep-dive notes for a specific day (e.g. `day-10-state-persistence.md`). Create one when a day has enough detail to deserve its own file beyond the dev log summary.
- `notes/app-flow.md` - Plain-English notes about frontend, backend/API, storage, and environment-variable responsibilities.
- `notes/decisions.md` - Important choices about tools, stack, architecture, workflow, or scope.
- `notes/prompt-library.md` - Prompts that worked well and should be reused.
- `notes/mistakes.md` - Bugs, wrong assumptions, bad prompts, failed attempts, and how to prevent them.

## Experiments

- `experiments/websites/README.md` - Website experiment ideas, notes, prompts, screenshots, and lessons.
- `experiments/automations/README.md` - Automation ideas, workflow maps, webhook tests, and integration notes.

## Checklists

- `checklists/manual-test-checklist.md` - Manual checks before calling a website or automation feature done.
- `checklists/ai-review-checklist.md` - Review questions after Claude/Codex changes files.

## Templates

- `templates/feature-spec.md` - Template for asking AI to build a website/app feature.
- `templates/automation-map.md` - Template for planning an automation workflow.
- `templates/daily-review.md` - Template for end-of-day review.

## External References

- Notion HTML/JS reference page: https://www.notion.so/HTML-and-JavaScript-Basics-for-Automation-Projects-36632f18146f81439bb8e87425e3b78c
  - Use this as the living syntax reference. Add new patterns here when a concept is learned in a session.
  - Credentials to write via API: `D:\Claude\AI_optimization\.env` (NOTION CONNECTION TOKEN)

- Notion Supabase reference page: https://www.notion.so/Supabase-Ins-and-Outs-36b32f18146f8085b974d953f67fe824
  - Use this for all Supabase concepts: keys, roles, RLS policies, client setup, table design.
  - Same API connection as the HTML/JS page (NOTION CONNECTION TOKEN).

## End-Of-Task Reminder

At the end of a task, check whether the work created any of these:

- Progress or next step -> `notes/ai-dev-log.md`
- Important choice -> `notes/decisions.md`
- Useful prompt -> `notes/prompt-library.md`
- Mistake or lesson -> `notes/mistakes.md`
- New syntax or concept learned -> Notion HTML/JS reference page (see External References above)
- Detailed day notes -> `notes/day-N-*.md`
- Website idea/result -> `experiments/websites/README.md`
- Automation idea/result -> `experiments/automations/README.md`
- Reusable process -> `checklists/` or `templates/`
