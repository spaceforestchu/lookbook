import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { pool } from '@/db/client';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Query = {
  q?: string;
  type?: 'people' | 'projects' | 'all';
  skills?: string[];     // AND semantics
  sectors?: string[];    // AND semantics (projects only)
  open?: boolean;        // people only
  limit?: number;
};

// Lazy-load OpenAI client only when needed
function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY not configured');
  }
  return new OpenAI({ apiKey });
}

async function embedOptional(q?: string): Promise<number[] | null> {
  const s = (q ?? '').trim();
  if (!s) return null;
  const openai = getOpenAIClient();
  const { data } = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: s.slice(0, 8000)
  });
  return data[0].embedding as number[];
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as Query;
  const type = body.type ?? 'all';
  const limit = Math.min(Math.max(body.limit ?? 10, 1), 30);

  const embed = await embedOptional(body.q);

  const params: any[] = [];
  const wherePeople: string[] = [];
  const whereProj: string[] = [];

  if (typeof body.open === 'boolean') {
    params.push(body.open);
    wherePeople.push(`open_to_work = ${params.length}`);
  }
  if (body.skills?.length) {
    params.push(body.skills);
    wherePeople.push(`skills @> ${params.length}::text[]`);
    params.push(body.skills);
    whereProj.push(`skills @> ${params.length}::text[]`);
  }
  if (body.sectors?.length) {
    params.push(body.sectors);
    whereProj.push(`sectors @> ${params.length}::text[]`);
  }

  // Build SQLs
  const peopleSQL = embed
    ? {
        text: `
        SELECT slug, name, title, skills, open_to_work,
               1 - (embedding <=> $${params.length + 1}) AS score
        FROM people_index
        ${wherePeople.length ? `WHERE ${wherePeople.join(' AND ')}` : ''}
        ORDER BY embedding <=> $${params.length + 1}
        LIMIT ${limit};
      `,
        values: [...params, `[${embed.join(',')}]`]
      }
    : {
        text: `
        SELECT slug, name, title, skills, open_to_work, 0.0 AS score
        FROM people_index
        ${wherePeople.length ? `WHERE ${wherePeople.join(' AND ')}` : ''}
        ORDER BY name ASC
        LIMIT ${limit};
      `,
        values: [...params]
      };

  const projSQL = embed
    ? {
        text: `
        SELECT slug, title, summary, skills, sectors,
               1 - (embedding <=> ${params.length + 1}) AS score
        FROM projects_index
        ${whereProj.length ? `WHERE ${whereProj.join(' AND ')}` : ''}
        ORDER BY embedding <=> ${params.length + 1}
        LIMIT ${limit};
      `,
        values: [...params, `[${embed?.join(',')}]`]
      }
    : {
        text: `
        SELECT slug, title, summary, skills, sectors, 0.0 AS score
        FROM projects_index
        ${whereProj.length ? `WHERE ${whereProj.join(' AND ')}` : ''}
        ORDER BY title ASC
        LIMIT ${limit};
      `,
        values: [...params]
      };

  const [people, projects] = await Promise.all([
    (type === 'people' || type === 'all') ? pool.query(peopleSQL) : Promise.resolve({ rows: [] }),
    (type === 'projects' || type === 'all') ? pool.query(projSQL) : Promise.resolve({ rows: [] })
  ]);

  return NextResponse.json({
    ok: true,
    people: people.rows,
    projects: projects.rows
  });
}
