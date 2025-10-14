import { NextRequest, NextResponse } from 'next/server';
import { ensureSchema, pool } from '@/db/client';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  await ensureSchema();
  let body: any;
  try { body = await req.json(); } catch { return NextResponse.json({ ok:false, error:'Bad JSON' }, { status:400 }); }

  const { email, note, peopleSlugs = [], projectSlugs = [] } = body || {};
  const url = process.env.CRM_WEBHOOK_URL;
  const auth = process.env.CRM_WEBHOOK_AUTH;

  // Log as a 'lead' event
  pool.query(
    `INSERT INTO sharepack_events (kind, requester_email, people_count, projects_count, people_slugs, project_slugs)
     VALUES ($1,$2,$3,$4,$5,$6)`,
    ['lead', email || null, Array.isArray(peopleSlugs) ? peopleSlugs.length : 0, Array.isArray(projectSlugs) ? projectSlugs.length : 0, peopleSlugs, projectSlugs]
  ).catch(()=>{});

  if (!url) return NextResponse.json({ ok:true, forwarded:false, reason:'No CRM_WEBHOOK_URL set' });

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type':'application/json', ...(auth ? { Authorization: auth } : {}) },
      body: JSON.stringify({ email, note, peopleSlugs, projectSlugs, source: 'lookbook' })
    });
    return NextResponse.json({ ok: res.ok, forwarded:true, status: res.status });
  } catch {
    return NextResponse.json({ ok:false, forwarded:false, error:'Webhook failed' }, { status:502 });
  }
}
