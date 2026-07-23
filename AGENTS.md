# AGENTS.md

This file provides guidance to coding agents working in this repository.

## What this repository is

Taglio — browser extension (Chrome MV3) that detects and sanitizes PII in
ChatGPT prompts before they're sent, entirely client-side (zero network
calls, zero data collection). Phase 0 (regex detection) shipped to the
Chrome Web Store on 2026-07-02. The project is currently paused (decided
2026-07-15) — Phase 1 (NER, multi-site adapters) is frozen until it
resumes. This repo also carries a documentation-led, ADR-driven
convention set (adopted via `docflow`, see `.docflow/adr/0001`).

## Repository structure

- `.docflow/adr/0000-template.md` — canonical ADR template.
- `.docflow/adr/NNNN-<kebab-slug>.md` — one ADR per decision, contiguous
  numbering, no gaps.
- `.docflow/INDEX.md` — table regenerated from every ADR's metadata block.
- `.docflow/CONVENTIONS.md` — authoring rules (read before editing anything).
- `.docflow/plan/todo/NNNN-<slug>.md` — pending work, lower numbers run first.
- `.docflow/plan/done/<YYYY-MM-DD>-<slug>.md` — shipped work, chronological.
- `.docflow/_agent/` — coordination: `ROLES.md`, `WORKLOG.md`,
  `CURRENT_FOCUS.md`, `HANDOFF.md`, `prompts/`.

## Hard rules when editing ADRs

These come from `.docflow/CONVENTIONS.md` and override default behaviour:

- **One decision per ADR.** Splits become new ADRs that supersede; never
  expand scope inside an existing one.
- **Status lifecycle:** `Proposed → Accepted → Implemented → (Superseded | Deprecated)`.
- **Capability ADR section order:** metadata → Context → Capability
  statement → User stories / scenarios → Acceptance criteria → Out of
  scope → Open questions → References → Revision History → Approvals.
- **Acceptance criteria are testable and numbered.**
- **ADRs are internal artefacts — never user-visible.** ADR numbers, ADR
  titles, and the existence of the ADR catalogue must NEVER appear in any
  string the product emits to users: UI copy, API response bodies, error
  messages, customer-visible log lines, public documentation, release
  notes, marketing copy, or support communications. References ARE
  allowed in: code comments, commit messages, PR descriptions, internal
  docs, `AGENTS.md`, `CONVENTIONS.md`, `INDEX.md`, and the `plan/` queue.

## Implementation work

- Start from the ADRs. Identify which ADRs a code change implements or
  affects before changing behaviour.
- If implementation reveals a capability gap or changed decision, update
  the relevant ADR rather than silently diverging.
- Add or update tests for implemented behaviour. Map tests back to ADR
  acceptance criteria where practical.
- **Do not leak ADR identifiers into user-visible surfaces.**

## Audit trail and revision discipline

- Substantive ADR changes append a row to the Revision History table.
  Editorial changes (typos, formatting, link fixes) are excluded but
  flagged `editorial` in the commit message.
- Approvals table populates when an ADR is Accepted and updates on each
  later substantive revision.
- Regenerate `.docflow/INDEX.md` from ADR metadata after any ADR status
  change or new ADR.

## Multi-agent workflow

A single agent owns this repo. The `_agent/` directory tracks live state
and history; LOCKS discipline is not in use.

## Plan folder

- A pending item gets a `.docflow/plan/todo/NNNN-<slug>.md` file BEFORE
  work starts, naming the owning ADR(s), scope, and exit criteria.
- The completion event is: fast-forwarded to `main` + remote push
  succeeded. On completion, `git mv` the file to
  `.docflow/plan/done/<YYYY-MM-DD>-<slug>.md` with a footer naming the
  HEAD SHA and any artefact id.
- The owning ADR(s) advance `Accepted → Implemented` on the same commit.
  Regenerate `.docflow/INDEX.md`.

## Git contract

- Commit messages follow **Conventional Commits**.
- Mandatory `Rationale:` footer on any commit touching an ADR.
- Signed commits: no (no signing key configured in this repo — revisit if one is added).
- ADR-revision tags `adr-NNNN-rN`: no.
- Co-Authored-By trailer: no.
- Cross-references between ADRs use relative paths (`adr/NNNN-*.md`).
- **Integration:** direct-to-main, **fast-forward only**. No merge
  commits on `main`. The verify gate (`npm test && npm run compile`) runs
  locally and must pass before push. Completion event: fast-forwarded to
  `main` + remote push succeeded.

## Local, non-public project notes

Detailed project-specific working notes (commands, stack, current phase,
non-negotiable working rules) live in the local, gitignored `CLAUDE.md` —
not duplicated here, and not published in this public repo.
