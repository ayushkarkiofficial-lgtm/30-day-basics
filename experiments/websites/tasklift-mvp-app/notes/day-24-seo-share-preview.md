# Day 24 — SEO, Performance & Share Preview (Tasklift app)

**Outcome target:** public pages are easier to find, share, and load.
**Scope chosen:** Tasklift React app only (`tasklift-mvp-app`), live at
https://snazzy-conkies-2372cf.netlify.app/ . The static marketing site was left untouched.

## What changed

`index.html` `<head>` — was just title + description. Added:
- Better, keyword-bearing `<title>`: "Tasklift — Review manual workflows, plan automation"
- Rewritten meta description
- `<link rel="canonical">`
- `theme-color`
- Favicons: `favicon.svg` (vector), `favicon-32.png`, `apple-touch-icon.png` (was none at all)
- Open Graph tags: type, site_name, title, description, url, **image (1200×630)**, image:width/height/alt
- Twitter/X Card: `summary_large_image` + title/description/image

New files in `public/` (Vite copies these to `dist/` root verbatim):
- `og-image.png` — 1200×630 branded share image (generated with Pillow; script:
  `scripts/gen_og_assets.py`)
- `favicon.svg`, `favicon-32.png`, `apple-touch-icon.png`
- `robots.txt` — allow all + Sitemap line
- `sitemap.xml` — single URL (SPA, one public route)

## Recorded numbers (production build, `npm run build`)

| Asset | Raw | Gzip |
|-------|-----|------|
| index.html | 2.36 kB | 0.76 kB |
| CSS (index-*.css) | 13.02 kB | 3.31 kB |
| **JS (index-*.js)** | **377.99 kB** | **107.32 kB** |
| og-image.png | ~30 kB | — |

Build clean, 16/16 vitest pass.

## Obvious performance issues logged (not fixed — kept simple per Day 24)

1. **Single 378 kB JS chunk (107 kB gzip), no code splitting.** Dominated by
   `@supabase/supabase-js`. Fine for an MVP shell; if it grows, options are route-level
   `React.lazy` / dynamic `import()` or splitting the supabase client into its own chunk.
   Vite already warns when a chunk passes 500 kB — we're under that.
2. No render-blocking issues beyond the single bundle; CSS is small (3.3 kB gzip).
3. No on-page images to optimize — the app renders data, not media. Only share/favicon
   assets were added, and those are already small + `optimize=True` PNGs.

## Verification checklist (manual — user's hands-on step)

After the next Netlify deploy (these assets must be live for crawlers to fetch them):

- [ ] Visit https://snazzy-conkies-2372cf.netlify.app/ — browser tab shows the "T" favicon.
- [ ] View source — confirm `<title>`, OG, and Twitter tags are present.
- [ ] https://snazzy-conkies-2372cf.netlify.app/robots.txt loads.
- [ ] https://snazzy-conkies-2372cf.netlify.app/sitemap.xml loads.
- [ ] https://snazzy-conkies-2372cf.netlify.app/og-image.png loads (the 1200×630 image).
- [ ] **Share preview:** paste the URL into one of:
      - https://www.opengraph.xyz/  (no login)
      - LinkedIn Post Inspector: https://www.linkedin.com/post-inspector/
      - Facebook Sharing Debugger (needs FB login): https://developers.facebook.com/tools/debug/
      Confirm the card shows the Tasklift title, description, and the branded image.
      Note: previews are cached by each platform — use the debugger's "scrape again".
- [ ] **Page speed:** run https://pagespeed.web.dev/ on the live URL; record the
      Performance score and any flagged items here:

      Performance score: ____   LCP: ____   Notes: ____________________

## Local check (works before deploy)

`npm run build && npm run preview` → open the preview URL, view source, and hit
`/robots.txt`, `/sitemap.xml`, `/og-image.png` to confirm they serve.
