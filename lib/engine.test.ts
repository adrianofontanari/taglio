import { describe, it, expect } from 'vitest';
import { detect, sanitize } from './engine';

// Smoke tests — prove the harness works. The real detection suite
// (10 cases + overlap fix) is the next milestone: write those tests
// FIRST, watch them fail on the overlap bug, then fix detect/sanitize.

describe('detect — smoke', () => {
  it('finds an email', () => {
    const entities = detect('scrivimi a mario.rossi@example.com grazie');
    expect(entities).toHaveLength(1);
    expect(entities[0]!.type).toBe('EMAIL');
    expect(entities[0]!.raw).toBe('mario.rossi@example.com');
  });

  it('rejects a credit-card-shaped number that fails Luhn', () => {
    const entities = detect('numero 4111 1111 1111 1112 non valido');
    expect(entities.filter((e) => e.type === 'CREDIT_CARD')).toHaveLength(0);
  });

  it('returns empty array on clean text', () => {
    expect(detect('nessun dato sensibile qui')).toEqual([]);
  });
});

describe('sanitize — smoke', () => {
  it('replaces a single entity with its placeholder', () => {
    const text = 'contatto: mario.rossi@example.com fine';
    expect(sanitize(text, detect(text))).toBe('contatto: [EMAIL] fine');
  });
});

describe('detect — entity coverage', () => {
  it('EMAIL: indirizzo con + e sottodomini', () => {
    const entities = detect('scrivi a mario+newsletter@mail.sub.example.co per info');
    expect(entities).toHaveLength(1);
    expect(entities[0]!.type).toBe('EMAIL');
    expect(entities[0]!.raw).toBe('mario+newsletter@mail.sub.example.co');
  });

  it('IBAN: forma compatta IT60X0542811101000000123456', () => {
    const entities = detect('bonifico su IT60X0542811101000000123456 entro venerdì');
    expect(entities).toHaveLength(1);
    expect(entities[0]!.type).toBe('IBAN');
    expect(entities[0]!.raw).toBe('IT60X0542811101000000123456');
  });

  it('IBAN: forma con spazi IT60 X054 2811 1010 0000 0123 456', () => {
    const entities = detect('IBAN: IT60 X054 2811 1010 0000 0123 456 — usa questo');
    expect(entities).toHaveLength(1);
    expect(entities[0]!.type).toBe('IBAN');
    expect(entities[0]!.raw).toBe('IT60 X054 2811 1010 0000 0123 456');
  });

  it('CF: codice fiscale valido, case insensitive', () => {
    const entities = detect('il mio cf è rssmra80a01h501z grazie');
    expect(entities).toHaveLength(1);
    expect(entities[0]!.type).toBe('CF');
    expect(entities[0]!.raw).toBe('rssmra80a01h501z');
  });

  it('PHONE_IT: con prefisso +39 e separatori misti', () => {
    const entities = detect('chiamami al +39 333-123 4567 stasera');
    expect(entities).toHaveLength(1);
    expect(entities[0]!.type).toBe('PHONE_IT');
    expect(entities[0]!.raw).toBe('+39 333-123 4567');
  });

  it('PHONE_IT: numero senza prefisso', () => {
    const entities = detect('cell 3331234567 ok');
    expect(entities).toHaveLength(1);
    expect(entities[0]!.type).toBe('PHONE_IT');
    expect(entities[0]!.raw).toBe('3331234567');
  });

  it('CREDIT_CARD: Visa 16 cifre Luhn-valida con trattini', () => {
    const entities = detect('carta 4111-1111-1111-1111 scade 06/27');
    expect(entities).toHaveLength(1);
    expect(entities[0]!.type).toBe('CREDIT_CARD');
    expect(entities[0]!.raw).toBe('4111-1111-1111-1111');
  });
});

describe('detect + sanitize — overlap handling', () => {
  // Un CF usato come local-part di una PEC: il CF è un sottospan dell'email.
  // detect() deve restituire span disgiunti, altrimenti il cursore di
  // sanitize() torna indietro e duplica il testo già consumato.
  it('overlap: entità sovrapposte non producono output garbled', () => {
    const text = 'cf RSSMRA80A01H501Z@pec.example.it inviato';
    const entities = detect(text);
    for (let i = 1; i < entities.length; i++) {
      expect(entities[i]!.start).toBeGreaterThanOrEqual(entities[i - 1]!.end);
    }
    expect(sanitize(text, entities)).toBe('cf [EMAIL] inviato');
  });

  it('overlap: sanitize con entità annidate mantiene il testo restante', () => {
    const text = 'inizio RSSMRA80A01H501Z@example.com fine';
    const out = sanitize(text, detect(text));
    expect(out.startsWith('inizio ')).toBe(true);
    expect(out.endsWith(' fine')).toBe(true);
    expect(out).not.toContain('@example.com');
  });

  it('overlap: a parità di start vince il match più largo', () => {
    const entities = detect('cf RSSMRA80A01H501Z@pec.example.it inviato');
    expect(entities).toHaveLength(1);
    expect(entities[0]!.type).toBe('EMAIL');
  });

  it('sanitize: span adiacenti (end === start successivo) restano entrambi', () => {
    const out = sanitize('AB', [
      { start: 0, end: 1, type: 'CF', raw: 'A' },
      { start: 1, end: 2, type: 'EMAIL', raw: 'B' },
    ]);
    expect(out).toBe('[CF][EMAIL]');
  });

  it('multi-entity: frase con email + telefono + CF insieme, ordine corretto', () => {
    const text = 'mail mario.rossi@example.com tel 333 123 4567 cf RSSMRA80A01H501Z fine';
    const entities = detect(text);
    expect(entities.map((e) => e.type)).toEqual(['EMAIL', 'PHONE_IT', 'CF']);
    expect(sanitize(text, entities)).toBe('mail [EMAIL] tel [PHONE_IT] cf [CF] fine');
  });
});
