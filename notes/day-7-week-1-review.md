# Day 7 Week 1 Review

## Goal

Finish Week 1 with a working deployed site, a saved audit prompt, and a clear list of weak spots.

## What Was Built This Week

- A local AI builder learning repo with notes, templates, checklists, and experiment folders.
- A static Tasklift Automation landing page.
- A contact form with browser-side validation.
- Demo-only saved submissions using `localStorage`.
- A clearer landing page offer around a 48-hour workflow review.
- GitHub deployment preparation and Netlify static-site configuration.
- A public Netlify preview URL for review.

## Review Categories Used

- Clarity: Can a visitor understand the offer quickly?
- Mobile layout: Does the site stay readable and usable on small screens?
- Accessibility: Can keyboard and assistive-technology users operate the page?
- Broken interactions: Do links, buttons, form validation, and saved submissions behave as expected?
- Deployment risk: What depends on external services, browser-only storage, or account setup?

## Top Issues Found

1. Form error messages were visible but not strongly connected to form fields for screen readers.
2. Keyboard focus feedback on links, buttons, and fields was too subtle.
3. The hero image depends on an external Unsplash URL, so the visual can break if the remote asset changes or fails.
4. The public form is still demo-only because submissions are saved only in the visitor's browser.
5. Final live mobile and browser testing still needs to be done after the latest deploy.

## Safe Small Fixes Implemented

- Added `aria-describedby` links between form fields and their error messages.
- Added `aria-invalid` when fields fail validation.
- Moved focus to the first invalid field after a failed submit.
- Added stronger `:focus-visible` styles for keyboard users.
- Added hero image metadata: width, height, eager loading, async decoding, and referrer policy.

## Larger Follow-Ups

- Replace the external Unsplash hero image with a local optimized asset.
- Add real lead capture through Netlify Forms, Formspree, Airtable, Supabase, or another backend/form service.
- Retest the live deployed URL on desktop and mobile after the latest branch deploy.
- Merge the Day 6/Day 7 branch into `master` once the review is complete.

## Manual Retest Checklist

- Public URL loads.
- Header links jump to Services, Contact, and Saved.
- Primary CTA jumps to the contact form.
- Keyboard tab order is visible and usable.
- Empty submit focuses the first invalid field.
- Invalid email shows an email-specific error.
- Valid submission shows the success message.
- Saved submissions appear in the browser demo storage area.
- Mobile width has no overlapping text or crowded navigation.
- Hero image loads.

## Week 1 Lesson

The practical AI-builder skill is not just asking AI to build. The stronger habit is: define the outcome, inspect the changed files, test manually, identify fragile parts, save the prompt, and keep a clear backlog.
