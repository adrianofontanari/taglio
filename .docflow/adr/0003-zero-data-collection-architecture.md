---
adr: 0003
title: Zero data collection, zero network calls, zero special permissions
status: Implemented
date: 2026-06-11
owner: Adriano Fontanari
supersedes:
superseded-by:
depends-on: [2]
tags: [privacy, architecture, backfill]
---

# ADR 0003 — Zero data collection, zero network calls, zero special permissions

<!-- Backfilled at bootstrap (2026-07-23) from the existing commit history.
Rationale reconstructed from commit messages and code — flag any
speculative rationale for correction. -->

## Context

Taglio's entire purpose is keeping the user's PII out of third-party
hands before it reaches an LLM. A tool with that purpose that itself
collects data, calls a server, or requests broad permissions would
defeat its own premise and would not be trustworthy on its word alone.

## Capability statement

Taglio is architected so the zero-collection claim is **structurally
true, not just promised**: no network requests (`fetch`, `XMLHttpRequest`,
`sendBeacon`, `WebSocket` — none present in `entrypoints`/`lib`), no
storage (`localStorage`, `chrome.storage`, `indexedDB` — none present),
no special manifest permissions beyond `content_scripts` scoped to
`chatgpt.com` / `chat.openai.com`, and zero runtime dependencies
(`package.json` `dependencies` is empty — TypeScript/Vitest/WXT are
dev-only). Every claim is independently verifiable by the reader via the
`grep` commands published in the README.

## User stories / scenarios

- As a privacy-conscious user, I can verify in under two minutes that
  Taglio makes no network calls and stores nothing, without trusting a
  claim.
- As a reviewer (Chrome Web Store, security researcher), I can audit the
  entire detection logic in one file (`lib/engine.ts`).

## Acceptance criteria

1. `grep -rE "fetch|XMLHttpRequest|sendBeacon|WebSocket" entrypoints lib`
   returns no matches.
2. `grep -rE "localStorage|chrome\.storage|indexedDB" entrypoints lib`
   returns no matches.
3. The built manifest (`.output/chrome-mv3/manifest.json`) carries no
   `permissions` key.
4. `package.json` `dependencies` is empty.
5. Any future permission or network call (e.g. downloading a Phase 1 NER
   model) is documented in the README first, with its reason, before
   being introduced.

## Out of scope

- Phase 1/2 changes that will legitimately need a permission or a model
  download — those get their own ADR when proposed, per acceptance
  criterion 5.

## Open questions

- None.

## References

- README.md §Privacy — Taglio collects nothing
- PRIVACY.md
- STORE_LISTING.md

## Revision History

| Date | Revision | Author | Change |
|------|----------|--------|--------|
| 2026-06-11 | r1 | Adriano Fontanari | Zero-data-collection guarantee made prominent in README (commit `ea50109`). |
| 2026-06-21 | r2 | Adriano Fontanari | Privacy policy and store listing copy added for v0.1 (commit `a5ff019`). |
| 2026-07-23 | r3 | Adriano Fontanari | Backfilled as ADR 0003 at docflow bootstrap; recorded after the fact. |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Maintainer | Adriano Fontanari | 2026-07-23 | — |
