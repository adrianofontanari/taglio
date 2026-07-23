# Pure, zero-DOM detection engine

Owning ADR: `adr/0002-pure-zero-dom-detection-engine.md`

Built the detection engine (`lib/engine.ts`) as pure TypeScript with zero
DOM and zero runtime dependencies, returning disjoint/ordered spans from
`detect()`, with an overlap bug fixed and a test suite added to lock the
contract in.

---
Shipped at HEAD `5440f71` (backfilled 2026-07-23 — recorded after the fact).
