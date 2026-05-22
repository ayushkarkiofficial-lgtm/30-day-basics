# Prompt Library

Save prompts that produce useful results.

## Feature Spec Prompt

```text
Context:
Goal:
Constraints:
Acceptance criteria:
Non-goals:
Manual test:
```

## Spec Then Build Prompt

```text
Before implementing a feature, write a short spec with:
Context:
Goal:
Constraints:
Acceptance criteria:
Non-goals:
Manual test:

Then implement only what the spec requires, verify it manually, and update the learning log.
```

## Explain Changes Prompt

```text
Explain the changed files in plain English.
What behavior changed?
What assumptions did you make?
What can break?
How do I test this manually?
What is the smallest rollback plan?
```

## Debug Prompt

```text
Here is what I expected:
Here is what happened:
Here is the exact error:
Here are the recent changes:

Find the likely root cause, suggest the smallest fix, and tell me how to verify it.
```

## Automation Review Prompt

```text
Review this automation map.
Find missing failure cases, duplicate-run risks, privacy risks, and places where human review is needed.
```

## File Routing Prompt

```text
Run file routing and remind me what should be saved.
```

## App Flow Form Prompt

```text
Add a simple contact form to this site. I want to understand the app flow, not learn code deeply. After implementation, explain frontend, backend/API, and data storage responsibilities in plain English.
```

## Landing Page Iteration Prompt

```text
Improve this landing page for clarity and conversion. Keep the design simple and professional. Do not add unnecessary sections. Explain the changes and give me a manual review checklist.
```

## Static Deployment Prep Prompt

```text
Prepare this static website for public deployment. Tell me the exact folder to deploy, which hosting option is simplest, what settings are needed, and what I should test after the public URL is live.
```
