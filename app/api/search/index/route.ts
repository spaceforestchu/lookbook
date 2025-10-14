import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { pool, ensureSchema } from '@/db/client';
import { getAllPeople, getAllProjects } from '@/sanity/lib/queries';

export const runtime = 'nodejs';
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

async function embed(text: string): Promise<number[]> {
  const input = text.replace(/\s+/g, ' ').trim().slice(0, 8000); // safety cap
  const { data } = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input
  });
  return data[0].embedding as number[];
}

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-index-secret') ?? req.nextUrl.searchParams.get('secret');
  if (!secret || secret !== process.env.INDEX_SECRET) {
    return NextResponse.json({ ok: false, error: 'Invalid secret' }, { status: 401 });
  }

  await ensureSchema();

  const [people, projects] = await Promise.all([getAllPeople(), getAllProjects()]);

  // Index PEOPLE
  for (const p of people) {
    const content = [
      p.name ?? '',
      p.title ?? '',
      (p.skills ?? []).join(' ')
    ].join(' | ');
    const vec = await embed(content);
    await pool.query(
      `
      INSERT INTO people_index (slug, name, title, skills, open_to_work, content, embedding)
      VALUES ($1,$2,$3,$4,$5,$6, $7::vector)
      ON CONFLICT (slug) DO UPDATE SET
        name=EXCLUDED.name,
        title=EXCLUDED.title,
        skills=EXCLUDED.skills,
        open_to_work=EXCLUDED.open_to_work,
        content=EXCLUDED.content,
        embedding=EXCLUDED.embedding;
      `,
      [
        p.slug,
        p.name ?? null,
        p.title ?? null,
        (p.skills ?? []) as any,
        !!p.openToWork,
        content,
        `[${vec.join(',') }]`
      ]
    );
  }

  // Index PROJECTS
  for (const pr of projects) {
    const content = [
      pr.title ?? '',
      pr.summary ?? '',
      (pr.skills ?? []).join(' '),
      (pr.sectors ?? []).join(' ')
    ].join(' | ');
    const vec = await embed(content);
    await pool.query(
      `
      INSERT INTO projects_index (slug, title, summary, skills, sectors, content, embedding)
      VALUES ($1,$2,$3,$4,$5,$6, $7::vector)
      ON CONFLICT (slug) DO UPDATE SET
        title=EXCLUDED.title,
        summary=EXCLUDED.summary,
        skills=EXCLUDED.skills,
        sectors=EXCLUDED.sectors,
        content=EXCLUDED.content,
        embedding=EXCLUDED.embedding;
      `,
      [
        pr.slug,
        pr.title ?? null,
        pr.summary ?? null,
        (pr.skills ?? []) as any,
        (pr.sectors ?? []) as any,
        content,
        `[${vec.join(',')}]`
      ]
    );
  }

  return NextResponse.json({ ok: true, people: people.length, projects: projects.length });
}
