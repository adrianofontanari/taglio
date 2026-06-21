# Chrome Web Store — Listing copy (v0.1.0)

Copy-paste source for the Developer Dashboard. Not shipped in the extension.

---

## Store listing tab

**Name** (manifest-derived)
```
Taglio
```

**Summary** (max 132 chars)
```
Detects personal data in your ChatGPT prompts and sanitizes it before sending. 100% local — zero data collection, zero network.
```

**Category**
```
Privacy & Security
```

**Language**
```
English
```

**Description**
```
Taglio cuts PII out of your prompts before they reach the LLM.

It detects sensitive data in your ChatGPT prompts locally and blocks or
sanitizes it before send. No proxies. No servers. Nothing leaves your device.

WHAT IT DOES (Phase 0)
• Real-time detection as you type: email, IBAN, Codice Fiscale, Italian mobile
  numbers, credit cards (Luhn-validated)
• Inline underlines on matched PII via the CSS Custom Highlight API — no DOM
  modification
• Submit gate: intercepts Enter / click and shows a banner with the detected
  items
• Sanitize and send: replaces PII with [EMAIL], [IBAN], [CF], etc., then submits
• Send anyway: override with one click
• Active on chatgpt.com and chat.openai.com

PRIVACY — TAGLIO COLLECTS NOTHING
Taglio is built so it can't leak your data, not just promised not to.
• No data collection. Zero prompts, zero detected PII, zero usage stats.
• No network requests. No backend, no API, no telemetry. Detection is pure
  regex running in your browser.
• No analytics. Nothing phones home.
• Nothing stored. Detected matches live in memory only and vanish when you
  close the tab.
• Open source. Every line is public — audit it yourself.

The whole point of Taglio is keeping your PII out of third-party hands. Sending
it to ours would defeat the purpose.

Source code: https://github.com/adrianofontanari/taglio
```

---

## Privacy practices tab

**Single purpose**
```
Taglio detects personal data (PII) in the text you type into ChatGPT and lets
you remove it before the prompt is sent. It does one thing: protect PII in
ChatGPT prompts.
```

**Permission justification — host access (chatgpt.com, chat.openai.com)**
```
Taglio runs as a content script on chatgpt.com and chat.openai.com only. It
needs to read the text in the prompt input box to detect PII as you type and to
show the warning banner before submit. It requests no other permissions and has
no access to any other site, browsing history, or files. The manifest has no
"permissions" key — only content_scripts scoped to these two domains.
```

**Remote code**
```
No. Taglio executes no remote code. Runtime dependencies are empty; all code
ships in the package.
```

**Data usage — certifications (check all true)**
```
☑ I do not sell or transfer user data to third parties, outside of approved use cases
☑ I do not use or transfer user data for purposes unrelated to my item's single purpose
☑ I do not use or transfer user data to determine creditworthiness or for lending
Data collected: NONE — do not check any data type box.
```

**Privacy policy URL**
```
https://github.com/adrianofontanari/taglio/blob/main/PRIVACY.md
```
(Push PRIVACY.md to the repo first so this URL resolves. Alternative: host on
adrianofontanari.com and use that URL.)

---

## Assets checklist

- [x] Icon 128×128 — public/icon/128.png
- [ ] Screenshot 1280×800 or 640×400 (min 1, max 5) — TODO, capture banner in action
- [ ] Small promo tile 440×280 (optional)
- [x] Package zip — .output/taglio-0.1.0-chrome.zip
