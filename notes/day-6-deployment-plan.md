# Day 6 Deployment Plan: Tasklift Static Site

## Goal

Publish the Tasklift static website so it has a public URL that can be shared and tested outside this computer.

## Current Site

Local folder:

```text
experiments/websites/startup-automation-site/
```

Files required for deployment:

```text
index.html
styles.css
```

The site is static. It does not need a backend, database, build command, package install, or environment variables.

## Recommended Deployment Option

Use GitHub plus Netlify.

GitHub repo:

```text
https://github.com/ayushkarkiofficial-lgtm/30-day-basics.git
```

Why:

- GitHub becomes the source of truth for the 30-day-plan workspace.
- Netlify can auto-deploy whenever the repo is updated.
- This creates a more realistic deployment workflow than one-time drag-and-drop uploads.
- The current site still needs no backend, database, build command, package install, or environment variables.

## Netlify Deployment Settings

When connecting the repo in Netlify, use these settings:

```text
Repository: ayushkarkiofficial-lgtm/30-day-basics
Branch: master
Base directory: experiments/websites/startup-automation-site
Build command: leave blank
Publish directory: .
```

If Netlify asks for a framework preset, choose a plain/static site option or leave the preset unconfigured.

The repo also includes this config file at the root:

```text
netlify.toml
```

Current config:

```toml
[build]
  base = "experiments/websites/startup-automation-site"
  publish = "."
```

This gives Netlify the same deployment instructions from the repo itself.

## Manual Deployment Steps

1. Push the local workspace to GitHub.
2. Open Netlify and choose **Add new site**.
3. Choose **Import an existing project**.
4. Connect GitHub and select:

```text
ayushkarkiofficial-lgtm/30-day-basics
```

5. Enter the Netlify deployment settings above.
6. Deploy the site.
7. Open the generated public URL.
8. Save the public URL in `notes/ai-dev-log.md`.

## Pull Request Flow

A pull request is a review step between two Git branches.

For this workspace:

```text
Base branch: master
Compare branch: day-6-github-netlify-setup
```

Plain-English flow:

1. `master` is the stable branch.
2. A feature branch contains proposed changes.
3. A pull request asks GitHub to compare the feature branch against `master`.
4. GitHub shows the changed files, added lines, removed lines, and comments.
5. After review, merging the pull request copies those branch changes into `master`.
6. Netlify can then deploy from `master`, or from another branch if configured that way.

Useful rule:

```text
Work on a branch -> push the branch -> open a pull request -> review -> merge into master.
```

## What To Test After Deployment

- Page loads from the public URL.
- Header links jump to Services, Contact, and Saved.
- Hero image loads.
- Primary CTA jumps to the contact form.
- Empty form shows validation errors.
- Invalid email shows an email error.
- Valid form submission shows the success message.
- Saved submissions appear in the browser demo storage area.
- Refreshing the public page keeps saved submissions in the same browser.
- Mobile width stays readable with no overlapping text.

## Important Deployment Lesson

`localStorage` data is not uploaded with the site. Each visitor gets their own browser-local saved submissions. This is fine for the current demo, but a real lead capture flow needs a backend, form service, CRM, or database.

## Alternatives

Netlify Drop:

- Still useful for a quick one-time static upload.
- Not the main path now because this workspace will use the GitHub repo.

GitHub Pages:

- Good static hosting option if Netlify is not needed.
- Does not provide the same Netlify deploy workflow practice.

Vercel:

- Good for static sites and future app projects.
- Usually expects a Git-based workflow.

Cloudflare Pages:

- Good static hosting and custom domains.
- Usually easiest after Git is working.

## Current Status

- The branch `day-6-github-netlify-setup` has been pushed to GitHub.
- The branch contains the deployment notes plus the root `netlify.toml` config.
- The remaining work is browser/account work: review and merge the GitHub pull request, then connect or refresh Netlify so it deploys from `master`.
- The local repo has been marked as safe for the current Windows user so Git commands can run.
