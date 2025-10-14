/** Canonicalize & de-duplicate skills with small synonym mapping. */
export const CANONICAL_SKILLS = [
  'JavaScript','TypeScript','React','Next.js','Node.js','Python','Django','Flask',
  'Postgres','MySQL','MongoDB','AWS','Docker','Kubernetes','Tailwind CSS','Ruby','Rails','Go','Java'
] as const;

const SYNONYMS: Record<string,string> = {
  'js':'JavaScript',
  'javascript':'JavaScript',
  'ts':'TypeScript',
  'typescript':'TypeScript',
  'react.js':'React',
  'reactjs':'React',
  'next':'Next.js',
  'nextjs':'Next.js',
  'node':'Node.js',
  'nodejs':'Node.js',
  'postgresql':'Postgres',
  'tailwind':'Tailwind CSS',
  'ruby on rails':'Rails'
};

function tidySkill(s: string): string {
  const t = s.trim().replace(/\s+/g,' ');
  // lower for lookup
  const lower = t.toLowerCase();
  if (SYNONYMS[lower]) return SYNONYMS[lower];
  // Title-case some techs and preserve punctuation
  const basic = t
    .replace(/^javascript$/i,'JavaScript')
    .replace(/^typescript$/i,'TypeScript')
    .replace(/^react(\.js|js)?$/i,'React')
    .replace(/^next(\.js|js)?$/i,'Next.js')
    .replace(/^node(\.js|js)?$/i,'Node.js')
    .replace(/^postgresql$/i,'Postgres')
    .replace(/^tailwind(\s*css)?$/i,'Tailwind CSS');
  return basic.charAt(0).toUpperCase() + basic.slice(1);
}

/** Returns normalized skills (alpha-sorted), plus rename & drop info. */
export function normalizeSkills(input: unknown, max = 12): {
  normalized: string[];
  renamed: Array<{ from: string; to: string }>;
  dropped: string[];
} {
  const renamed: Array<{from:string;to:string}> = [];
  const dropped: string[] = [];
  if (!Array.isArray(input)) return { normalized: [], renamed, dropped };

  const seen = new Set<string>();
  for (const raw of input) {
    if (typeof raw !== 'string') continue;
    const before = raw;
    const after = tidySkill(before);
    if (after !== before && before.trim()) renamed.push({ from: before, to: after });
    // enforce length per skill
    if (after.length > 30) { dropped.push(after); continue; }
    seen.add(after);
  }

  // If a canonical exists that matches case-insensitively, prefer canonical label
  const canonMap = new Map(CANONICAL_SKILLS.map(c => [c.toLowerCase(), c]));
  const normalized = Array.from(seen).map(s => canonMap.get(s.toLowerCase()) ?? s);

  // Sort alpha and cap to max
  normalized.sort((a,b)=>a.localeCompare(b));
  const capped = normalized.slice(0, max);
  const overflow = normalized.slice(max);
  dropped.push(...overflow);
  return { normalized: capped, renamed, dropped };
}
