---
adr: 0004
title: WXT + TypeScript + Vitest as the extension build and test stack
status: Implemented
date: 2026-06-11
owner: Adriano Fontanari
supersedes:
superseded-by:
depends-on: []
tags: [stack, tooling, backfill]
---

# ADR 0004 — WXT + TypeScript + Vitest as the extension build and test stack

<!-- Backfilled at bootstrap (2026-07-23) from the existing commit history.
Rationale reconstructed from commit messages and code — flag any
speculative rationale for correction. This project uses a single ADR
shape (no capability/technology split, per CONVENTIONS.md), so a
technology-flavoured decision is recorded in the capability shape. -->

## Context

Building a Chrome MV3 extension needs a build/dev tool that handles
manifest generation and hot-reload, a type system to keep the detection
engine's contracts (disjoint/ordered spans) enforced at compile time, and
a test runner to lock in detection behaviour before every change.

## Capability statement

The project builds and tests on **WXT** (MV3 scaffolding, dev server with
hot-reload, `wxt build` / `wxt zip` for packaging), **TypeScript**
(`tsc --noEmit` as the compile/typecheck gate), and **Vitest** (unit
tests for the detection engine). All three are dev-only dependencies —
none ship in the built extension, keeping the zero-runtime-dependency
guarantee (ADR 0003) intact.

## User stories / scenarios

- As a contributor, `npm run dev` gives me a live-reloading Chrome
  instance with the extension loaded.
- As a contributor, `npm test` / `npm run compile` give me a fast local
  verify gate before committing.

## Acceptance criteria

1. `package.json` `dependencies` stays empty; WXT, TypeScript, and Vitest
   are `devDependencies` only.
2. `npm run dev`, `npm run build`, `npm run zip`, `npm test`, and
   `npm run compile` are the project's standard commands (see
   `AGENTS.md`'s local project notes).
3. The verify gate for shipping a change is `npm test && npm run compile`
   (recorded in `CONVENTIONS.md` and `.docflow/_agent/prompts/autonomous.md`).

## Out of scope

- The still-open UI framework choice (React vs Svelte) for Phase 1 — not
  yet decided, gets its own ADR when it lands.

## Open questions

- None for the Phase 0 stack. Phase 1 additions (transformers.js, Dexie)
  will get their own ADR when introduced.

## References

- package.json
- README.md §Install

## Revision History

| Date | Revision | Author | Change |
|------|----------|--------|--------|
| 2026-06-09 | r1 | Adriano Fontanari | WXT + TypeScript adopted for the Phase 0 spike (commit `3d0af73`). |
| 2026-06-11 | r2 | Adriano Fontanari | Vitest added as test runner (commit `86c4f28`). |
| 2026-07-23 | r3 | Adriano Fontanari | Backfilled as ADR 0004 at docflow bootstrap; recorded after the fact. |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Maintainer | Adriano Fontanari | 2026-07-23 | — |
