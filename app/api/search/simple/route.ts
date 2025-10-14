import { NextRequest, NextResponse } from 'next/server';
import { groq } from 'next-sanity';
import { client } from '@/sanity/lib/client';

export const runtime = 'nodejs';

const PEOPLE_Q = groq`*[
  _type == "person" && !(_id in path("drafts.**")) &&
  (!defined($open) || openToWork == $open) &&
  (
    !defined($term) ||
    name match $term || title match $term
  ) &&
  (
    !defined($skills) || count($skills) == 0 ||
    count((skills)[@ in $skills]) == count($skills)
  )
]|order(name asc)[0...$limit]{
  "slug": slug.current,
  name,
  title,
  skills,
  "open_to_work": coalesce(openToWork, false)
}`;

const PROJECTS_Q = groq`*[
  _type == "project" && !(_id in path("drafts.**")) &&
  (
    !defined($term) ||
    title match $term || summary match $term
  ) &&
  (
    !defined($skills) || count($skills) == 0 ||
    count((skills)[@ in $skills]) == count($skills)
  ) &&
  (
    !defined($sectors) || count($sectors) == 0 ||
    count((sectors)[@ in $sectors]) == count($sectors)
  )
]|order(title asc)[0...$limit]{
  "slug": slug.current,
  title,
  summary,
  skills,
  sectors
}`;

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({} as any));
  const q: string = (body?.q ?? '').trim();
  const skills: string[] = Array.isArray(body?.skills) ? body.skills : [];
  const sectors: string[] = Array.isArray(body?.sectors) ? body.sectors : [];
  const open: boolean | undefined = typeof body?.open === 'boolean' ? body.open : undefined;
  const type: 'people'|'projects'|'all' = body?.type ?? 'all';
  const limit = Math.min(Math.max(body?.limit ?? 10, 1), 30);

  // GROQ `match` works best with a trailing wildcard per token (e.g., "react*")
  const firstToken = q.split(/\s+/).filter(Boolean)[0];
  const term = firstToken ? `${firstToken}*` : undefined;

  const [people, projects] = await Promise.all([
    (type === 'people' || type === 'all')
      ? client.fetch(PEOPLE_Q, { term, skills, open, limit })
      : Promise.resolve([]),
    (type === 'projects' || type === 'all')
      ? client.fetch(PROJECTS_Q, { term, skills, sectors, limit })
      : Promise.resolve([]),
  ]);

  return NextResponse.json({ ok: true, people, projects });
}
