import { detect, sanitize, type Entity } from '../lib/engine';

// ─── State ────────────────────────────────────────────────────────────────────

let textarea: HTMLElement | null = null;
let submitButton: HTMLElement | null = null;
let allowNextSubmit = false;
let documentListenersAdded = false;
let inputCleanup: (() => void) | null = null;

// ─── Selectors ────────────────────────────────────────────────────────────────

function findTextarea(): HTMLElement | null {
  return (
    (document.querySelector('#prompt-textarea') as HTMLElement | null) ??
    (document.querySelector('div.ProseMirror[contenteditable="true"]') as HTMLElement | null) ??
    (document.querySelector('[contenteditable="true"][data-lexical-editor]') as HTMLElement | null) ??
    (document.querySelector('[contenteditable="true"]') as HTMLElement | null)
  );
}

function findSubmitButton(): HTMLElement | null {
  return (
    (document.querySelector('button[data-testid="send-button"]') as HTMLElement | null) ??
    (document.querySelector('button[aria-label="Send message"]') as HTMLElement | null) ??
    (document.querySelector('button[aria-label="Send prompt"]') as HTMLElement | null)
  );
}

// ─── Text ─────────────────────────────────────────────────────────────────────

function getText(): string {
  return textarea?.innerText ?? textarea?.textContent ?? '';
}

function setText(text: string): void {
  if (!textarea) return;
  textarea.focus();
  // execCommand is the most reliable way to update React/ProseMirror contenteditable
  document.execCommand('selectAll');
  document.execCommand('insertText', false, text);
}

// ─── Styles ───────────────────────────────────────────────────────────────────

function injectStyles(): void {
  if (document.getElementById('taglio-styles')) return;
  const s = document.createElement('style');
  s.id = 'taglio-styles';
  // CSS Custom Highlight API — underlines matched PII spans without touching the DOM
  s.textContent = `::highlight(taglio-pii) {
    background-color: rgba(239, 68, 68, 0.12);
    text-decoration: underline 2px solid #ef4444;
  }`;
  (document.head ?? document.documentElement).appendChild(s);
}

// ─── Inline highlights ────────────────────────────────────────────────────────

function getTextNodes(el: HTMLElement): Text[] {
  const nodes: Text[] = [];
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  let node: Node | null;
  while ((node = walker.nextNode())) nodes.push(node as Text);
  return nodes;
}

function updateHighlights(entities: Entity[]): void {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const h = (CSS as any).highlights as {
    set: (k: string, v: unknown) => void;
    delete: (k: string) => void;
  } | undefined;
  if (!h) return;

  h.delete('taglio-pii');
  if (!textarea || entities.length === 0) return;

  const textNodes = getTextNodes(textarea);
  const ranges: Range[] = [];

  for (const entity of entities) {
    let offset = 0;
    let sn: Text | null = null, so = 0, en: Text | null = null, eo = 0;

    for (const node of textNodes) {
      const len = node.length;
      if (!sn && offset + len > entity.start) {
        sn = node;
        so = entity.start - offset;
      }
      if (sn && offset + len >= entity.end) {
        en = node;
        eo = entity.end - offset;
        break;
      }
      offset += len;
    }

    if (sn && en) {
      try {
        const range = document.createRange();
        range.setStart(sn, Math.min(so, sn.length));
        range.setEnd(en, Math.min(eo, en.length));
        ranges.push(range);
      } catch {
        // offset out of bounds — skip silently
      }
    }
  }

  if (ranges.length > 0) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    h.set('taglio-pii', new (window as any).Highlight(...ranges));
  }
}

// ─── Badge ────────────────────────────────────────────────────────────────────

function updateBadge(count: number): void {
  let badge = document.getElementById('taglio-badge');
  if (count === 0) { badge?.remove(); return; }
  if (!badge) {
    badge = document.createElement('div');
    badge.id = 'taglio-badge';
    Object.assign(badge.style, {
      position: 'fixed', bottom: '72px', right: '16px',
      background: '#ef4444', color: '#fff',
      borderRadius: '999px', padding: '3px 10px',
      fontSize: '12px', fontWeight: '600',
      zIndex: '2147483646',
      fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
      boxShadow: '0 2px 8px rgba(0,0,0,0.35)',
      userSelect: 'none', pointerEvents: 'none',
    });
    document.body.appendChild(badge);
  }
  badge.textContent = `✂️ ${count} PII`;
}

// ─── Banner ───────────────────────────────────────────────────────────────────

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function showBanner(
  entities: Entity[],
  onSanitize: () => void,
  onSendAnyway: () => void,
  onCancel: () => void,
): void {
  hideBanner();

  const host = document.createElement('div');
  host.id = 'taglio-banner-host';
  Object.assign(host.style, {
    position: 'fixed', bottom: '80px', left: '50%',
    transform: 'translateX(-50%)',
    zIndex: '2147483647', width: '440px', maxWidth: '92vw',
  });

  const shadow = host.attachShadow({ mode: 'open' });
  const listItems = entities
    .map(e => {
      const preview = escapeHtml(e.raw.length > 26 ? e.raw.slice(0, 26) + '…' : e.raw);
      return `<li><span class="tag">${e.type}</span><code>${preview}</code></li>`;
    })
    .join('');

  shadow.innerHTML = `
    <style>
      *{box-sizing:border-box;margin:0;padding:0}
      :host{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}
      .b{background:#111827;border:1.5px solid #ef4444;border-radius:12px;
         padding:16px 18px;color:#f1f5f9;box-shadow:0 16px 48px rgba(0,0,0,.6)}
      .h{display:flex;align-items:center;gap:8px;font-size:14px;font-weight:700;
         color:#ef4444;margin-bottom:10px}
      ul{list-style:none;padding:0;margin-bottom:14px;display:flex;flex-direction:column;gap:4px}
      li{display:flex;align-items:center;gap:8px;font-size:12px;color:#94a3b8}
      .tag{background:#991b1b;color:#fecaca;padding:1px 7px;border-radius:4px;
           font-size:11px;font-weight:600;text-transform:uppercase;
           letter-spacing:.05em;white-space:nowrap}
      code{background:#1f2937;padding:2px 6px;border-radius:4px;
           font-size:12px;color:#fca5a5;font-family:ui-monospace,monospace}
      .btns{display:flex;gap:8px;flex-wrap:wrap}
      button{cursor:pointer;border:none;padding:8px 15px;border-radius:8px;
             font-size:13px;font-weight:500;transition:filter .15s}
      button:hover{filter:brightness(1.12)}
      .s{background:#ef4444;color:#fff}
      .a{background:#374151;color:#d1d5db}
      .c{background:transparent;color:#6b7280;border:1px solid #374151}
    </style>
    <div class="b">
      <div class="h">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/>
          <path d="M20 4 8.12 8.12"/><path d="M14.8 14.8 20 20"/>
          <path d="m8.12 15.88 5.91-5.91"/>
        </svg>
        Taglio detected ${entities.length} sensitive item${entities.length > 1 ? 's' : ''}
      </div>
      <ul>${listItems}</ul>
      <div class="btns">
        <button class="s" id="s">✂️ Sanitize and send</button>
        <button class="a" id="a">Send anyway</button>
        <button class="c" id="c">Cancel</button>
      </div>
    </div>`;

  shadow.getElementById('s')!.onclick = onSanitize;
  shadow.getElementById('a')!.onclick = onSendAnyway;
  shadow.getElementById('c')!.onclick = onCancel;

  document.body.appendChild(host);
}

function hideBanner(): void {
  document.getElementById('taglio-banner-host')?.remove();
}

// ─── Submit interception ──────────────────────────────────────────────────────

function handleSubmit(e: Event): void {
  if (allowNextSubmit) { allowNextSubmit = false; return; }

  const isClick =
    e instanceof MouseEvent &&
    !!(e.target as HTMLElement)?.closest(
      'button[data-testid="send-button"], button[aria-label*="Send"]',
    );
  const isEnter =
    e instanceof KeyboardEvent &&
    e.key === 'Enter' &&
    !e.shiftKey &&
    (e.target === textarea || !!textarea?.contains(e.target as Node));

  if (!isClick && !isEnter) return;

  const text = getText();
  const entities = detect(text);
  if (entities.length === 0) return;

  e.stopImmediatePropagation();
  e.preventDefault();

  showBanner(
    entities,
    () => {
      setText(sanitize(text, entities));
      hideBanner();
      setTimeout(() => {
        allowNextSubmit = true;
        submitButton?.click();
      }, 60);
    },
    () => {
      hideBanner();
      allowNextSubmit = true;
      submitButton?.click();
    },
    hideBanner,
  );
}

// ─── Input handler ────────────────────────────────────────────────────────────

function handleInput(): void {
  const entities = detect(getText());
  updateHighlights(entities);
  updateBadge(entities.length);
}

// ─── Setup ────────────────────────────────────────────────────────────────────

function setup(ta: HTMLElement, btn: HTMLElement): void {
  inputCleanup?.();

  textarea = ta;
  submitButton = btn;

  let debounce: ReturnType<typeof setTimeout>;
  const onInput = () => { clearTimeout(debounce); debounce = setTimeout(handleInput, 120); };
  ta.addEventListener('input', onInput);
  inputCleanup = () => { ta.removeEventListener('input', onInput); clearTimeout(debounce); };

  if (!documentListenersAdded) {
    document.addEventListener('click', handleSubmit, true);
    document.addEventListener('keydown', handleSubmit, true);
    documentListenersAdded = true;
  }

  handleInput();
}

// ─── Entry ────────────────────────────────────────────────────────────────────

export default defineContentScript({
  matches: ['*://chatgpt.com/*', '*://chat.openai.com/*'],
  runAt: 'document_idle',

  main() {
    injectStyles();

    let setupThrottle: ReturnType<typeof setTimeout> | null = null;

    const trySetup = () => {
      const ta = findTextarea();
      const btn = findSubmitButton();
      if (ta && btn && ta !== textarea) setup(ta, btn);
    };

    const trySetupThrottled = () => {
      if (setupThrottle) return;
      setupThrottle = setTimeout(() => { trySetup(); setupThrottle = null; }, 200);
    };

    trySetup();
    new MutationObserver(trySetupThrottled).observe(document.body, {
      childList: true,
      subtree: true,
    });
  },
});
