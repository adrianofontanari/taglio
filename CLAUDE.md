# Taglio — Browser Extension

PII detection per prompt LLM. "Cuts PII out of your prompts before they reach the LLM."

## Comandi

- `npm test` — vitest, run singolo (gira anche in automatico via hook dopo ogni edit)
- `npm run test:watch` — vitest watch mode
- `npm run compile` — typecheck `tsc --noEmit`
- `npm run dev` — WXT dev mode (Chrome)
- `npm run build` / `npm run zip` — build produzione

## Stack (locked — non riaprire)

TypeScript, MV3, WXT, vitest. Phase 1 aggiungerà transformers.js (NER) e Dexie.
UI framework (React vs Svelte): decisione aperta, si chiude in Phase 1.

## Architettura

- `lib/engine.ts` — detection engine **puro, zero DOM, zero dipendenze**. Tutta la logica PII vive qui. È il core riusabile per surface futuri (extension, Claude Code hook, API proxy). Non importare nulla di browser-specifico.
- `entrypoints/` — content script (submit gate su chatgpt.com), popup.
- `lib/engine.test.ts` — test suite. Ogni nuova regola di detection nasce con i suoi test.

## Fase corrente: Phase 0 CHIUSA (2026-06-11) → prep Phase 1

Phase 0 completa: engine + content script + overlap fix + 16 test verdi + README con privacy audit. Niente altro scope su Phase 0.

Contratto engine (difendibile a colloquio): `detect()` ritorna span **disgiunti e ordinati** — a parità di start vince il match più largo (es. EMAIL batte CF annidato). `sanitize()` si fida di questo contratto, non ha guardie proprie.

**Vincolo privacy (README "Verify it yourself"):** ogni nuova permission o network call va documentata nel README *prima* di introdurla, con motivazione. Il claim zero-collection è verificabile via grep — non romperlo silenziosamente.

Prossimo (Phase 1, da pianificare prima di codare): site adapter pattern, NER transformers.js, decisione React vs Svelte. Vedi Build Plan §3.

## Regola di lavoro (non negoziabile)

Adry deve saper difendere ogni riga di questo codice a un colloquio. Quando scrivi o modifichi codice:
- Spiega la scelta mentre la fai (perché Luhn, perché questo pattern regex, cosa rompe l'alternativa)
- Una modifica alla volta, niente refactor a sorpresa
- Se Adry chiede "perché", la risposta deve riferirsi al codice reale, non a principi generici

## Workflow

1. Feature non banale → plan mode prima, codice dopo l'ok
2. I test girano da soli (hook PostToolUse su edit `.ts`); rosso = fermati e sistema
3. Prima del commit: review del diff (`/code-review` o cavecrew-reviewer)
4. Commit piccoli, messaggio che spiega il perché
