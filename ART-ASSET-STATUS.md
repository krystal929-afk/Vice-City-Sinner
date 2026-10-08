# Vice City Sinner — Art Asset Status

Updated 2026-10-08: Satanica hero redesign on the four Issue 001 essays (approved by Krystal). Site identity is still the 2026-10-01 Miami Nights board.

**Site identity SoT:** 2026-10-01 Miami Nights board — Top 5 `#07040C` `#190B25` `#B8FF2D` `#EAD9EE` `#E14DFF` (magenta = limited accent); Newsreader + Archivo Narrow; logo suite from board crops (live masthead IS the new primary masthead). Board work does not replace story/hero art.

Every large image has an original plus a `-web.webp` copy. The pages load the WebP; keep both.

Current story art direction, approved 2026-10-08: illustrated Satanica Lux as the model in each essay hero (blue curly hair, tattoos, black leather, fishnets, platform boots, Miami-night neon), 2:3 portrait at 1152×1712. This replaces the 2026-09-28 torn offset print / glitch static heroes (no person) on Foxhole, Hair Metal, Real Name and Dungeon. Hoochie Daddy keeps its own approved art. Hero bands and homepage cards crop to a strip; each page sets an `object-position` (page-local `<style>` on essays, inline on homepage images) so her face stays in frame.

## Approved / Live — heroes (Satanica redesign, 2026-10-08)

Same filenames as before, files replaced in place. The old glitch versions are in git history.

- `assets/foxhole-satanica.png` — Satanica sitting on a rooftop ledge, peace sign, pink-sky city skyline at dusk. Foxhole article hero **and** the homepage featured story. Pages load `foxhole-satanica-web.webp`.
- `assets/hair-metal-header-satanica-hq.png` — Satanica in studded leather, chains, ripped mini and fishnets against a graffiti wall under neon pink palms. Hair Metal header and homepage card. Pages load `hair-metal-header-satanica-web.webp`.
- `assets/identity-satanica.png` — Satanica in red devil horns and a black lace mask with a pentagram harness, in a club with green smoke (the approved "real-name-alt" art). Real Name hero and homepage card. Pages load `identity-satanica-web.webp`.
- `assets/dungeon-satanica.png` — Satanica holding a power drill, leaning on a wooden X-cross in a dungeon workshop. Dungeon hero and homepage card. Pages load `dungeon-satanica-web.webp`.
- `assets/hoochie-daddy-satanica.png` / `hoochie-daddy-club-satanica.png` — Hoochie Daddy hero (Miami) and in-article club image, approved 2026-10-08. Pages load the `-web.webp` copies.
- Removed 2026-10-08: `assets/homepage-hero-satanica.png` and `-web.webp` (Ocean Drive glitch art). The homepage feature now uses the Foxhole hero.
- `assets/vcs-lock-banner.png` — VCS masthead (**2026-10-01 board primary masthead**; previous 2026-09-25 lock plate retired). Header and footer load `vcs-lock-banner-web.webp`. `STYLE-GUIDE.html` and newsletter welcome email use the PNG / email JPG.
- `assets/card-style.svg` — compact Hair Metal homepage card only. Not on a live page right now.

About page: no story art, only the board primary masthead in the header and footer.

## Hair Metal outfit guide — live

- `assets/guide-page-1.jpg` — combos 1–3
- `assets/guide-page-2.jpg` — combos 4–6
- `assets/guide-page-3.jpg` — combos 7–9

1008×1792 JPEG, compressed to about 225–250 KB each on 2026-09-28 (same filenames). There are no WebP copies of these.

The previous guide pages are no longer on the site: `assets/hair-metal-guide-1-3-full.png`, `assets/hair-metal-guide-4-6-full.png`, `assets/hair-metal-guide-7-9-full.png`. These have not been remade from the current masthead yet.

## Site identity — 2026-10-01 redone board

- Live masthead replaced from board primary masthead: `assets/vcs-lock-banner.png` / `vcs-lock-banner-web.webp` / `vcs-lock-banner-email.jpg`.
- `assets/vcs-badge.png` — primary circular badge (512×512) cropped from the 2026-10-01 board. Footer/About/404/email stamps (Option C placement unchanged).
- `favicon.ico` (site root) and `assets/favicon.png` (48×48) — board star/compass icon; also `assets/vcs-star-icon.png` (200×200 reference).
- `assets/apple-touch-icon.png` (180×180) — primary badge.
- `assets/share-card.jpg` — 1200×630 `og:image` remade from the new masthead composition (not badge-only).
- Optional (not in chrome): `assets/vcs-monogram.png`, `assets/vcs-wordmark.png`.
- Working board + exports: `/workspace/emailoctopus/brand/vcs-brand-board-2026-10-01.png` and `.../exports/`.

## Site files (shared chrome)

- Stylesheet cache bump: `site.css?v=20261001a` (2026-10-01 brand board).

## In the repo, not on the live site

Kept because the style guide names them. Do not put them back on a page without approval.

- `assets/logo.svg` — old masthead, replaced by board primary masthead.
- `assets/editorial-satanica.avif` — tiny old Foxhole art. Named in `STYLE-GUIDE.md` as do-not-substitute.
- `assets/hair-metal-header-satanica.avif` — old 511×341 Hair Metal header.
- `assets/hair-metal-guide-*-full.png` — previous guide pages (above).
- `assets/story-editorial-illustration.jpeg`, `assets/story-identity-illustration.jpeg` — rejected posters.

Removed 2026-09-28 because nothing used them: old guide drafts (`hair-metal-guide-*-v2.webp`, `-v3.avif`, `-v4.jpg`, `hair-metal-guide-*.webp`), broken WebP files that would not open (`hair-metal-header-satanica.webp`, `homepage-hero-satanica.webp`), `about-art-a.jpg`, `about-satanica.jpg`, `card-dungeon.svg`, `foxhole-satanica.webp`, `hero.svg`, `hero-satanica.avif`, `style-satanica.avif`, `story-style-illustration.jpeg`, `vcs-masthead-engraving.png`. Copies remain on the `drafts` branch and in git history.

## Retired — superseded 2026-09-28

The green-Satanica character scenes are no longer current art direction:

- Foxhole: Satanica beside a gothic throne in a purple-lit chamber (Image Lab portrait)
- Homepage: Satanica climbing out of the foxhole into South Florida daylight
- Hair Metal: green Satanica in a backstage / dressing-room scene
- Real Name: Satanica at a neon-lit vanity holding an ornate mask
- Dungeon: Satanica studying an archive book in a candlelit room

## Rejected / Do not use as site hero or story art

- Sewer / manhole / underpass homepage concepts
- Gothic-throne Foxhole assignment
- Poster graphics with embedded slogans
- From-scratch text-to-image Satanica
