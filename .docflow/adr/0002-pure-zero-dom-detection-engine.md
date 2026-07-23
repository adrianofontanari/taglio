---
adr: 0002
title: Pure, zero-DOM detection engine as the reusable core
status: Implemented
date: 2026-06-09
owner: Adriano Fontanari
supersedes:
superseded-by:
depends-on: []
tags: [architecture, engine, backfill]
---

# ADR 0002 — Pure, zero-DOM detection engine as the reusable core

<!-- Backfilled at bootstrap (2026-07-23) from the existing commit history.
Rationale reconstructed from commit messages and code — flag any
speculative rationale for correction. -->

## Context

Taglio detects PII inside a live page (ChatGPT's prompt box) but needs the
same detection logic to power other surfaces later — a desktop app, a
Claude Code hook, an API proxy. Coupling detection to DOM manipulation
would lock the logic to the browser-extension surface only.

## Capability statement

The detection engine (`lib/engine.ts`) is pure TypeScript with **zero DOM
dependencies and zero runtime dependencies**. It exposes `detect()`,
which returns matches as **disjoint, ordered spans** — when two matches
share a start offset, the widest match wins (e.g. an EMAIL match wins
over a shorter, nested Codice Fiscale match). `sanitize()` trusts this
contract and carries no overlap guards of its own. The content script is
the only current surface; it consumes the engine's output to render
inline highlights and drive the submit gate.

## User stories / scenarios

- As the extension's content script, I call `detect()` on the current
  input text and get back a clean, non-overlapping set of matches to
  underline.
- As a future surface (desktop app, CLI, API proxy), I import the same
  `lib/engine.ts` with no browser APIs to satisfy.

## Acceptance criteria

1. `lib/engine.ts` imports no DOM or browser-specific APIs.
2. `detect()` returns spans that are disjoint and ordered; overlap
   resolution (widest-match-wins on tied start) is covered by the test
   suite (`lib/engine.test.ts`).
3. `sanitize()` performs no independent overlap checking — it relies on
   `detect()`'s contract.

## Out of scope

- The specific detection rules (email, IBAN, Codice Fiscale, mobile
  numbers, credit cards) — those are implementation detail inside the
  engine, not separate ADRs, unless a rule introduces a new category of
  decision (e.g. a new detection tier).

## Open questions

- None.

## References

- lib/engine.ts
- lib/engine.test.ts
- README.md §Architecture

## Revision History

| Date | Revision | Author | Change |
|------|----------|--------|--------|
| 2026-06-09 | r1 | Adriano Fontanari | Engine introduced (commit `3d0af73`). |
| 2026-06-11 | r2 | Adriano Fontanari | Overlap bug fixed, disjoint/ordered contract hardened with test suite (commit `5440f71`). |
| 2026-07-23 | r3 | Adriano Fontanari | Backfilled as ADR 0002 at docflow bootstrap; recorded after the fact. |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Maintainer | Adriano Fontanari | 2026-07-23 | — |
