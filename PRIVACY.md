# Privacy Policy — Taglio

_Last updated: 2026-06-21_

Taglio is a browser extension that detects personal data (PII) in your ChatGPT
prompts and lets you remove it before the prompt is sent. It is built so it
**can't** leak your data, not just promised not to.

## What Taglio collects

**Nothing.** Taglio collects no data of any kind:

- **No personal data.** Taglio does not collect, store, or transmit your prompts,
  the PII it detects, your identity, or any other information.
- **No usage data.** No analytics, no telemetry, no tracking pixels, no error
  reporting. Nothing phones home.
- **No network requests.** The extension makes no calls to any server. There is
  no backend, no API, no remote endpoint. All detection is plain regex running
  locally in your browser.
- **No storage.** Detected matches live in memory only and are gone when you
  close the tab. Taglio keeps no history.

## How Taglio works

Detection runs entirely on your device. When you type in the ChatGPT input box,
Taglio reads the text locally, highlights any detected PII, and — on submit —
shows a banner so you can sanitize it (e.g. replace an email with `[EMAIL]`)
before the prompt is sent. The text never leaves your browser through Taglio.

## Permissions

Taglio requests no special permissions. It runs only as a content script scoped
to `chatgpt.com` and `chat.openai.com`, where it needs to read the prompt text
in the input box to detect PII and show the warning. It has no access to any
other site, your browsing history, or your files.

## Third parties

Taglio shares no data with anyone, because it collects none. It loads no
third-party code at runtime; its runtime dependency list is empty.

## Verify it yourself

Taglio is open source. Every claim above is checkable against the source code in
under two minutes — see the "Verify it yourself" section of the
[README](https://github.com/adrianofontanari/taglio#verify-it-yourself).

## Changes

If a future version ever needs a permission or a network call (for example,
downloading an on-device NER model), it will be documented here and in the
README first, with the reason, before it ships.

## Contact

Questions: adriano.fontanari@gmail.com
