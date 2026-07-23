---
adr: 0006
title: Keep internal agent working notes (CLAUDE.md) local and gitignored
status: Implemented
date: 2026-06-21
owner: Adriano Fontanari
supersedes:
superseded-by:
depends-on: []
tags: [privacy, process, backfill]
---

# ADR 0006 — Keep internal agent working notes (CLAUDE.md) local and gitignored

<!-- Backfilled at bootstrap (2026-07-23) from the existing commit history.
Rationale reconstructed from commit messages — flag any speculative
rationale for correction. -->

## Context

Taglio is a public MIT repository. `CLAUDE.md` carries internal working
instructions for coding agents — commands, locked stack notes, current
phase status, and non-negotiable working rules aimed at the maintainer's
own workflow. This content is useful for driving local agent sessions
but is not meant for public consumption, and isn't something a public
reader needs to use or audit the extension.

## Capability statement

`CLAUDE.md` is tracked **locally only** — it is listed in `.gitignore`
and never appears in the public repository or its history going forward.
Coding-agent guidance that *is* meant to be public (repository structure,
ADR/docflow conventions, hard rules for editing ADRs) lives instead in
the committed `AGENTS.md`, which stays deliberately generic and free of
internal working notes (see `AGENTS.md` §Local, non-public project
notes).

## User stories / scenarios

- As a public repo visitor, I don't see internal working notes, phase
  planning, or maintainer-specific instructions when browsing the repo.
- As the maintainer, I keep a detailed local `CLAUDE.md` for agent
  sessions without needing to sanitise it before every commit.

## Acceptance criteria

1. `CLAUDE.md` is listed in `.gitignore`.
2. `CLAUDE.md` does not appear in any commit after `bdcb051`.
3. Any content in `AGENTS.md` is safe for public visibility — no
   internal-only project notes duplicated there.

## Out of scope

- The specific contents of the local `CLAUDE.md` — those are not
  governed by this ADR and can change freely without touching the
  catalogue.

## Open questions

- None.

## References

- .gitignore
- AGENTS.md §Local, non-public project notes

## Revision History

| Date | Revision | Author | Change |
|------|----------|--------|--------|
| 2026-06-21 | r1 | Adriano Fontanari | `CLAUDE.md` tracked, then removed from the repo and gitignored, keeping it local-only (commits `6745368`, `bdcb051`). |
| 2026-07-23 | r2 | Adriano Fontanari | Backfilled as ADR 0006 at docflow bootstrap; re-affirmed when `AGENTS.md` was scoped to stay public-safe during the same bootstrap. |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Maintainer | Adriano Fontanari | 2026-07-23 | — |
