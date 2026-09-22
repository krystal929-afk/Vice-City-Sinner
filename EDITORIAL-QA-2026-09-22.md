# Vice City Sinner — Editorial and Visual QA

**Review date:** 22 September 2026  
**Scope:** Live publication pages, article pages, feature and column pages, fallback HTML, email edition, assigned artwork, and responsive rendering.

## Summary

The site had two material artwork defects. The homepage hero file was corrupted and rendered with repeated content and large blank bands; it has been restored to the approved 1448×1086 composition. The Hair Metal header was only 511×341 and was too small for a large desktop hero; a resolution-restored 2304×1536 version is now used by the article.

The editorial review found no broad spelling or structural failure across the issue. The main problems were generic slogan-heavy cadence, unsupported universal claims, missing adult and consent-capacity framing, inaccurate or unverified image provenance, and a few continuity or grammar issues. These were corrected with targeted edits rather than wholesale rewrites.

## Applied changes

| Area | Corrections |
| --- | --- |
| Homepage | Restored the approved 1448×1086 Foxhole composition and revalidated desktop and mobile rendering. |
| Hair Metal | Added the high-resolution header, corrected intrinsic dimensions, and verified the article hero in context. |
| Dungeon | Replaced the rejected poster reference in the HTML with the approved Dungeon artwork and accurate alt text. |
| Foxhole | Corrected the hero image’s intrinsic dimensions and removed repeated heading/lead phrasing. Added a qualifier so the recovery metaphor does not imply that readers should ignore ongoing danger. |
| Beginner’s Guide | Removed the externally hosted active-play photo, added an adults-only context notice, qualified alcohol and public-viewing advice, and tightened reporting guidance. |
| Dress to Express | Removed the noncanonical externally hosted portrait, added venue-policy context, defined “little black dress,” qualified fashion-accessory safety, and separated breath restriction from ordinary outfit guidance. |
| Curious Doesn’t Mean Committed | Removed the unverified remote image, added adult-consent and intoxication framing, clarified exit consent, and reduced self-help aphorism cadence. |
| What Do I Call Myself? | Corrected two awkward sentences, clarified that the article focuses on labels rather than duplicating the designated Real Name story, and reduced parallel slogan construction. |
| Green Flags & Red Flags | Added adult/capacity-to-consent language, corrected a compressed sentence, and softened three categorical safety predictions. |
| Why Kink Korps Exists | Added the repository’s 21+ event context, improved parallel wording, clarified shared safety responsibility, qualified an unsupported generalization, and reduced mission-statement fragments. |
| Last Call | Consolidated repeated fragment lists and affirmation stacks while preserving the central accountability and belonging argument. |
| Fallback surfaces | Removed remote image dependencies from the offline fallback and email edition. Their image areas now use local text treatments and links. |

## Validation

The following checks passed after the edits:

- `git diff --check`
- Desktop and mobile Chromium renders for the homepage and primary article pages
- Rendered verification of the revised Beginner’s Guide and Dress to Express layouts
- Asset metadata verification for the homepage hero and Hair Metal header
- Search for remote article image URLs
- Search for rejected image references in live, fallback, and mailer HTML
- Search for unfinished article markers and placeholder image filenames

## Remaining project decisions

The newsletter form remains intentionally unconnected because the repository does not specify a mailing-list provider or endpoint. The About page remains a holding page because the project’s own style guide says that copy requires explicit approval. Neither item was changed during this visual and editorial pass.

## References

[1]: SATANICA-MASTER-BIBLE.md "Canonical Satanica visual and editorial continuity rules"
[2]: EDITORIAL-GUIDE.md "Vice City Sinner editorial guide"
[3]: STYLE-GUIDE.md "Vice City Sinner visual source of truth"
[4]: ART-ASSET-STATUS.md "Vice City Sinner art asset status"
