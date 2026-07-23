# Conventions

## Project

Project name: Taglio.

Artefact root: `.docflow/` — `adr/`, `plan/`, `INDEX.md`, and this file
live under this root; `AGENTS.md` and `CLAUDE.md` always stay at the
repository root. Every lifecycle skill resolves paths against this root.

Discovery: the `.docflow/` **directory** at the repository root is itself
the artefact root — no separate `.docflow` pointer file is written.

Assessment depth: `guided` — the depth chosen at bootstrap (2026-07-23).
Skill assessments pre-select it as the recommended depth; the depth
selector always still appears, so the record steers the recommendation
and is never applied silently. Change this line to change the
recommendation.

## ADR Files

ADR filenames use `NNNN-kebab-case-slug.md`, zero-padded to 4 digits,
with contiguous numbering and no reserved gaps.

The number is an **integer**; the four-digit zero-padding is a display
convention only — tools sort ADRs **numerically**, not lexically, so the
catalogue is not capped at `9999` (widen the padding to five digits if you
ever approach it; none do). Related ADRs may be **grouped** under
`domains/<slug>/README.md` without changing their numbers — grouping is a
curated view, not a separate namespace; the contiguous number stays the
single identity.

Each ADR describes one decision. If a decision splits, supersede the
original ADR and create new ADRs rather than expanding scope inside a
single document.

Status lifecycle: full — `Proposed → Accepted → Implemented →
(Superseded | Deprecated)`.

| Status | Meaning |
|---|---|
| Proposed | Draft. Decision authored but not yet approved. |
| Accepted | Decision approved; implementation authorised. Work item lives in `plan/todo/`. |
| Implemented | Code shipped per the completion event. Work item moved to `plan/done/`. ADR is the authoritative spec the running system matches. |
| Superseded | Replaced by another ADR. The successor is named in `superseded-by:` metadata. |
| Deprecated | Was real; the world moved on; no successor. Capability is not being rebuilt. |

Terminal states (Superseded / Deprecated) are reachable from any prior
state.

The first **persisted** status is `Proposed` — there is no separate `Draft`
state and no `brainstorming/`/`drafts/` folder. Work-in-progress lives in
the brainstorm conversation; only an approved decision is written, as a
numbered `Proposed` ADR.

Cross-references link by relative path to `adr/NNNN-*.md`.

## ADR Shapes

This project uses a single ADR shape. ADRs use `adr/0000-template.md`
and contain these sections in order: Context, Capability statement,
User stories / scenarios, Acceptance criteria, Out of scope, Open
questions, References, Revision History, Approvals.

## ADR Privacy

ADRs are internal artefacts. ADR numbers, ADR titles, and the
existence of the ADR catalogue must never appear in any string the
product emits to users: UI copy, API response bodies, error messages,
customer-visible log lines, public documentation, release notes,
marketing copy, or support communications.

Allowed references:
- Inline code comments tying a non-obvious choice to its ADR
  (`// see adr/0042-foo.md`).
- Commit messages and PR descriptions.
- Internal documents: `AGENTS.md`, `INDEX.md`, the `plan/` queue,
  `_agent/` files, internal runbooks.

Rule of thumb: if a non-builder could ever read the string, the ADR
reference comes out. Refer to the behaviour by its product-level name
instead.

## Multi-Agent Rules

A single agent owns this repo. The `_agent/` directory tracks live
state and history; no LOCKS discipline.

## Plan Folder

Pending and shipped work live in `plan/` at the artefact root:

- `plan/todo/NNNN-<slug>.md` — pending work, lower numbers run first.
  Each file names the owning ADR(s), scope, and exit criteria.
- `plan/done/<YYYY-MM-DD>-<slug>.md` — shipped work, chronological. A
  `git mv` from `todo/` to `done/` is the completion event.

The completion event is: fast-forwarded to `main` + remote push
succeeded.

When a `plan/todo/` item ships, the file moves to `plan/done/` AND the
owning ADR(s)' `status:` advances from `Accepted` to `Implemented`.
`INDEX.md` is regenerated to match.

## Project-Specific Conventions (backfilled from existing de-facto practice)

- **Test colocation.** Test files sit beside the source they cover
  (`lib/engine.test.ts` next to `lib/engine.ts`), not in a separate
  `test/` tree.
- **Commit messages already followed Conventional Commits loosely**
  before this bootstrap (`feat:`, `docs:`, `chore:` prefixes seen
  throughout history) — the Git Contract below formalises what was
  already de-facto practice, it does not introduce a new style.

## Audit Trail Policy

Every substantive change to an Accepted ADR appends a new row to its
Revision History table.

Editorial changes — typos, formatting, link fixes — are excluded from
Revision History but must be flagged "editorial" in the commit message.

The Approvals table is populated when an ADR transitions to Accepted
and updated on every subsequent substantive revision.

## Git Contract

Commit messages follow Conventional Commits with a mandatory
`Rationale:` footer for any commit that touches an ADR.

- Signed commits: no (no signing key configured in this repo — revisit if one is added).
- ADR-revision tags `adr-NNNN-rN`: no.
- Co-Authored-By trailer on agent commits: no.

Direct-to-main: changes are fast-forwarded onto `main`; no merge
commits. The verify gate (`npm test && npm run compile`) runs locally
and must pass before push. A change is "shipped" when it is on `main`
and pushed.
