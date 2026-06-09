# Taglio ✂️

> Cuts PII out of your prompts before they reach the LLM.

Browser extension (Chrome MV3) that detects sensitive data in your ChatGPT prompts locally and blocks or sanitizes before send. No proxies. No servers. Nothing leaves your device.

<!-- GIF demo here -->

## Phase 0 — what works right now

- **Real-time detection** as you type: email, IBAN, Codice Fiscale, Italian mobile numbers, credit cards (Luhn-validated)
- **Inline underlines** on matched PII via CSS Custom Highlight API — no DOM modification
- **Submit gate**: intercepts Enter / click and shows a banner with detected items
- **Sanitize and send**: replaces PII with `[EMAIL]`, `[IBAN]`, `[CF]`, etc., then submits
- **Send anyway**: lets you override with one click
- Active on `chatgpt.com` and `chat.openai.com`

## Install (dev)

```bash
git clone https://github.com/adrianofontanari/taglio
cd taglio
npm install
npm run dev       # opens Chrome with extension loaded via hot-reload
```

Or build once:

```bash
npm run build
# Load .output/chrome-mv3 as unpacked extension in chrome://extensions
```

## Architecture

```
Detection Engine (TypeScript, no DOM)
├── Tier 0: Regex   ← Phase 0, this release
├── Tier 1: NER     ← Phase 1, transformers.js
└── Tier 2: LLM     ← Phase 2, web-llm sanitization
```

The engine is pure TypeScript with zero DOM dependencies (`lib/engine.ts`). The content script is the only surface — same engine will power a desktop app and SDK in later phases.

## Roadmap

| Phase | Status | Output |
|---|---|---|
| **0 — Spike** | ✅ Done | Regex detection on ChatGPT, submit gate, inline highlights |
| **1 — MVP** | Planned | NER via transformers.js, adapter for Claude + Gemini, Chrome Web Store |
| **2 — Production** | Planned | Constrained-decoding sanitization, policy JSON, Firefox |
| **3 — Desktop** | Optional | Tauri clipboard guard, Python SDK |

## License

MIT — see [LICENSE](LICENSE).
