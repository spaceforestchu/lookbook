/** Very small, transparent moderation with errors/warnings and PII detection. */
export type ModerationReport = {
  errors: string[];
  warnings: string[];
  pii: { emails: string[]; phones: string[]; urls: string[] };
};

const PROFANITY = ['damn','hell','shit','fuck']; // tiny sample; extend as needed
const reEmail = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/ig;
const rePhone = /(\+?\d[\d\s().-]{7,}\d)/g;
const reUrl   = /\bhttps?:\/\/[^\s)]+/ig;
const reBadNameChars = /[^a-zA-Z0-9 ''.-]/;

export function moderatePerson(input: {
  name: string | null;
  title: string | null;
  skills: string[];
  sourceText?: string;
}): ModerationReport {
  const errors: string[] = [];
  const warnings: string[] = [];
  const pii = { emails: [] as string[], phones: [] as string[], urls: [] as string[] };

  // PII from source text (if provided)
  if (input.sourceText) {
    pii.emails = Array.from(new Set(input.sourceText.match(reEmail) ?? []));
    pii.phones = Array.from(new Set(input.sourceText.match(rePhone) ?? [])).slice(0, 5);
    pii.urls   = Array.from(new Set(input.sourceText.match(reUrl) ?? []));
    if (pii.emails.length || pii.phones.length) {
      warnings.push('Source text contains contact PII (email/phone). Avoid publishing PII.');
    }
  }

  // Name/title checks
  const name = (input.name ?? '').trim();
  const title = (input.title ?? '').trim();

  if (!name) errors.push('Name is required.');
  if (name.length > 80) errors.push('Name exceeds 80 characters.');
  if (reBadNameChars.test(name)) warnings.push('Name contains unusual characters.');

  if (title.length > 80) warnings.push('Title exceeds 80 characters.');

  // Profanity scan (very small)
  const scan = (s: string) => {
    const low = s.toLowerCase();
    return PROFANITY.some(p => low.includes(p));
  };
  if (scan(name) || scan(title)) errors.push('Profanity detected in name or title.');

  // Skills count/length
  if (input.skills.length > 12) warnings.push('More than 12 skills; consider trimming.');
  if (input.skills.some(s => s.length > 30)) warnings.push('One or more skills exceed 30 chars.');

  return { errors, warnings, pii };
}
