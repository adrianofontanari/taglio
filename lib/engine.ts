export type EntityType = 'EMAIL' | 'IBAN' | 'CF' | 'PHONE_IT' | 'CREDIT_CARD';

export interface Entity {
  start: number;
  end: number;
  type: EntityType;
  raw: string;
}

function luhn(digits: string): boolean {
  let sum = 0;
  let alt = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = parseInt(digits[i]!, 10);
    if (alt) { n *= 2; if (n > 9) n -= 9; }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
}

const PATTERNS: Array<{
  type: EntityType;
  re: RegExp;
  validate?: (raw: string) => boolean;
}> = [
  {
    type: 'EMAIL',
    re: /\b[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}\b/g,
  },
  {
    // Italian IBAN: IT + 2 check + 1 CIN letter + 10 digits + 12 alphanumeric = 27 chars
    // Matches compact and space-grouped (IT60 X054 2811 ...) forms
    type: 'IBAN',
    re: /\bIT\d{2}[A-Z]\d{10}[A-Z0-9]{12}\b|\bIT\d{2}(?:\s[A-Z0-9]{4}){5}\s[A-Z0-9]{3}\b/gi,
  },
  {
    // Codice Fiscale: 16 chars — strict pattern
    type: 'CF',
    re: /\b[A-Z]{6}\d{2}[ABCDEHLMPRST]\d{2}[A-Z]\d{3}[A-Z]\b/gi,
  },
  {
    // Italian mobile: 3xx xxx xxxx (with optional +39/0039 prefix)
    type: 'PHONE_IT',
    re: /(?:(?:\+39|0039)[\s\-.]?)?3\d{2}[\s\-.]?\d{3}[\s\-.]?\d{4}\b/g,
  },
  {
    // Credit card: 13–19 digit groups, Luhn-validated
    type: 'CREDIT_CARD',
    re: /\b(?:\d[\s\-]?){13,18}\d\b/g,
    validate: (raw) => {
      const d = raw.replace(/[\s\-]/g, '');
      return d.length >= 13 && d.length <= 19 && luhn(d);
    },
  },
];

export function detect(text: string): Entity[] {
  const candidates: Entity[] = [];

  for (const { type, re, validate } of PATTERNS) {
    re.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
      if (validate && !validate(m[0])) continue;
      candidates.push({ start: m.index, end: m.index + m[0].length, type, raw: m[0] });
    }
  }

  // sanitize() assumes disjoint, ordered spans — overlapping entities
  // (e.g. a CF used as the local part of an email) move its cursor
  // backwards and duplicate text. Sort by start (longest first on equal
  // start) and drop anything overlapping the last kept entity, so the
  // widest match wins.
  candidates.sort((a, b) => a.start - b.start || b.end - a.end);
  const result: Entity[] = [];
  let lastEnd = -1;
  for (const e of candidates) {
    if (e.start >= lastEnd) {
      result.push(e);
      lastEnd = e.end;
    }
  }
  return result;
}

export function sanitize(text: string, entities: Entity[]): string {
  let out = '';
  let cursor = 0;
  for (const e of entities) {
    out += text.slice(cursor, e.start) + `[${e.type}]`;
    cursor = e.end;
  }
  return out + text.slice(cursor);
}
