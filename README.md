# Taglio

> Cuts PII out of your prompts before they reach the LLM.

Browser extension that intercepts prompts sent to ChatGPT, Claude, and Gemini, detects sensitive data locally, and blocks or sanitizes before send. No proxies, no TLS interception, no data leaves your device.

## Status

Phase 0 — Spike in development. Public roadmap coming.

## What it does (planned)

- **Local-only PII detection.** Regex for deterministic patterns (Codice Fiscale, IBAN, email, phone, credit cards) plus on-device NER for contextual entities (names, organizations, addresses).
- **Inline highlights as you type.** Grammarly-style underline with hover tooltips: see what was flagged, why, and one-click sanitize.
- **Submit gate.** Blocks send when high-risk PII is detected. Sanitize to placeholders, allow once, or override with audit trail.
- **Multi-LLM.** Works across major web interfaces: ChatGPT, Claude, Gemini, Perplexity.

## Why local-only

Existing DLP solutions for LLM prompts require TLS interception, MDM-enforced proxies, or switching to controlled tools. Few organizations adopt them. Taglio runs entirely in the browser via WebGPU — the text never leaves your device. The extension itself is not a PII processor.

## License

MIT — see [LICENSE](LICENSE).
