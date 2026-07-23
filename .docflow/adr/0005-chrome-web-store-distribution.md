---
adr: 0005
title: Chrome Web Store as the v0.1 distribution channel
status: Implemented
date: 2026-06-21
owner: Adriano Fontanari
supersedes:
superseded-by:
depends-on: [3]
tags: [distribution, backfill]
---

# ADR 0005 — Chrome Web Store as the v0.1 distribution channel

<!-- Backfilled at bootstrap (2026-07-23) from the existing commit history.
Rationale reconstructed from commit messages and code — flag any
speculative rationale for correction. -->

## Context

Taglio needs a distribution path a non-technical user can install from
in one click, rather than requiring a manual "load unpacked extension"
dev build. The Chrome Web Store is the standard channel for Chrome MV3
extensions and gives users an install path that doesn't require trusting
a random zip file.

## Capability statement

Taglio ships v0.1 through the **Chrome Web Store**, listed under the
**Privacy & Security** category with store copy, a screenshot, and a
privacy policy that mirror the README's zero-collection guarantee
(ADR 0003). The README links directly to the store listing as the
primary install path; the dev-build clone/install steps are kept as a
secondary path for contributors and auditors.

## User stories / scenarios

- As a user, I install Taglio with one click from the Chrome Web Store,
  no build step required.
- As a Chrome Web Store reviewer, I find the listing correctly
  categorised (Privacy & Security) with a privacy policy consistent with
  the extension's actual behaviour.

## Acceptance criteria

1. The extension is published and installable from the Chrome Web Store.
2. Store category is "Privacy & Security".
3. `STORE_LISTING.md` and `PRIVACY.md` copy match the README's privacy
   claims (ADR 0003) — no divergent promises between the two surfaces.
4. README's Install section links the Chrome Web Store listing as the
   first, one-click path.

## Out of scope

- Firefox / other browser store distribution — noted as a Phase 2 item
  in the README roadmap, not yet decided.

## Open questions

- None.

## References

- README.md §Install
- STORE_LISTING.md
- PRIVACY.md
- https://chromewebstore.google.com/detail/taglio/kcfjalbmcmeonhkggpmaijocipffnkpn

## Revision History

| Date | Revision | Author | Change |
|------|----------|--------|--------|
| 2026-06-21 | r1 | Adriano Fontanari | Privacy policy and store listing copy added for v0.1 release (commit `a5ff019`); store category set to Privacy & Security (commit `350dca3`); store screenshot added (commit `1de05fb`). |
| 2026-07-02 | r2 | Adriano Fontanari | README updated to link the live Chrome Web Store listing (commit `d16125c`). |
| 2026-07-23 | r3 | Adriano Fontanari | Backfilled as ADR 0005 at docflow bootstrap; recorded after the fact. |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Maintainer | Adriano Fontanari | 2026-07-23 | — |
