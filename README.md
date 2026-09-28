# The Vice City Sinner

**South Florida kink, culture & nightlife.**

An independent digital publication covering South Florida’s kink, alternative, and after-dark communities.

Live at [vicecitysinner.com](https://vicecitysinner.com).

## Issue 001 — September 2026

Published on the site:

- Out of the Foxhole and Into Real Life — Editorial (`foxhole.html`, also the homepage feature)
- I’m Bringing Back Hair Metal Fashion. Sorry Not Sorry. — Style (`hair-metal.html`)
- Wait, What’s Your Real Name? — Culture / Identity (`real-name.html`)
- Who the Fuck Invented the Dungeon? — History (`dungeon.html`)
- About Satanica (`about.html`)

Not published. These seven pieces, plus the Issue 001 email edition, live on the `drafts` branch until they are approved. Do not merge them back into `main` without approval.

- The Beginner’s Guide to Not Being That Person
- Dress to Express Without Going Broke
- Curious Doesn’t Mean Committed
- What Do I Call Myself?
- Green Flags & Red Flags
- Why Kink Korps Exists
- Last Call: You Are Not Too Much

## Publication files

- `index.html` — homepage: featured Foxhole story, latest stories, “Get New Posts” signup
- `foxhole.html`, `hair-metal.html`, `real-name.html`, `dungeon.html` — the four live stories
- `about.html` — About Satanica
- `subscribed.html` — thank-you page after someone signs up
- `404.html` — “Wrong door.” page GitHub Pages shows for any missing URL (uses `/`-rooted paths so it works at any depth)
- `site.css` — the one stylesheet for every page
- `assets/` — story art, masthead, guide pages, favicon, share card
- `favicon.ico`, `robots.txt`, `sitemap.xml`, `CNAME`, `.nojekyll` — site plumbing
- `newsletter/` — list notes and welcome copy (not linked from the site)
- Internal docs, blocked in `robots.txt`: `STYLE-GUIDE.md` / `STYLE-GUIDE.html`, `ART-ASSET-STATUS.md`, `EDITORIAL-GUIDE.md`, `SATANICA-MASTER-BIBLE.md`, `EDITORIAL-QA-2026-09-22.md`, `FIX-NOTES.md`, `skills/`

## Publishing

This is a lightweight static publication built for GitHub Pages. No framework or build process is required. Whatever is on `main` is live.

- **One stylesheet.** Every page links only `site.css`. Don’t add another CSS file or a “fix” layer; edit `site.css` (see the section list at the top of the file).
- **Cache version.** The stylesheet link and any versioned image carry `?v=` plus the date and a letter, currently `?v=20260928b`. When you change `site.css` or replace an image under the same filename, bump the letter (`20260928c`, …) on every page so readers don’t get the old copy.
- **Images.** Large art keeps its full-size original next to a `-web.webp` copy, and the pages load the WebP. Keep both. Details in `STYLE-GUIDE.md` and `ART-ASSET-STATUS.md`.
- **Newsletter.** The homepage form posts to FormSubmit (`formsubmit.co/satanica.lux@vicecitysinner.com`), which emails each signup to that inbox and sends a one-line autoresponse, then lands on `subscribed.html`. See `newsletter/LIST.md`.
- **One PR per batch.** Every push to `main` starts a Pages build and quick back-to-back pushes cancel each other, so group changes into one branch and one PR.
- New pages go in `sitemap.xml`.

The Vice City Sinner is editorially independent. Event information may reference Kink Korps and other South Florida organizers when relevant.

Adults 21+ only.
