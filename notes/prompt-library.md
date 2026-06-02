# Prompt Library

Save prompts that produce useful results.

## Supabase Connection Prompt

```text
Connect this React app to Supabase. Replace localStorage with a real fetch on
mount and an async insert on submit. Explain useEffect, async/await, and why
we do not send the id to the database. Keep all explanations in plain English.
```

## Supabase Concepts Prompt

```text
Explain each Supabase credential (URL, anon key, publishable key, secret key),
when it is safe to use in frontend code, and what could go wrong if misused.
Then explain the difference between the anon, authenticated, and service_role
roles and how Supabase decides which role a request uses.
```

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

## AI Builder Website Audit Prompt

```text
Audit this website as an AI builder. Focus on practical issues: clarity, mobile layout, accessibility, broken interactions, deployment risk. Give me top 5 fixes, then implement only the safe small ones.
```

## State Persistence Explanation Prompt

```text
Explain why this React state disappears on refresh and show me the simplest way to
persist it. Explain useEffect, JSON.stringify, and the localStorage sync pattern
in plain English, then implement it in the existing App.jsx.
```

## React Data Flow Prompt

```text
Trace the data flow for this feature from user action to screen update.
Explain where state lives, how it flows down through props, and how events
bubble back up through callbacks. Show me what re-renders and why.
```

## Smallest Useful Tests Prompt

```text
Add the smallest useful test coverage for this workflow. Do not over-engineer.
Explain what each test proves, what it does not prove, and give me a manual
test checklist.
```

## Extract And Test Logic Prompt

```text
Extract the business logic from this component into a pure function in its own
file so it can be unit tested without React. Then write the smallest useful
unit tests for it using Vitest. Explain what each test proves.
```

## Supabase CRUD Completion Prompt

```text
Add update and delete to this Supabase-connected React app. Keep all
Supabase logic in App.jsx, pass handlers as props, and explain .eq(),
.map() vs .filter(), and why UPDATE needs .select() but DELETE does not.
```
