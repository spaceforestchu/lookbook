import { NextRequest } from 'next/server';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { ensureSchema, pool } from '@/db/client';
import { getPersonBySlug, getProjectBySlug } from '@/sanity/lib/queries';

export const runtime = 'nodejs';

type Body = {
  peopleSlugs?: string[];
  projectSlugs?: string[];
  requesterEmail?: string;
};

export async function POST(req: NextRequest) {
  await ensureSchema();

  let body: Body;
  try { body = await req.json(); } catch { return new Response('Bad JSON', { status: 400 }); }

  const peopleSlugs = Array.isArray(body.peopleSlugs) ? body.peopleSlugs.filter(Boolean) : [];
  const projectSlugs = Array.isArray(body.projectSlugs) ? body.projectSlugs.filter(Boolean) : [];
  const requesterEmail = typeof body.requesterEmail === 'string' ? body.requesterEmail.trim() : '';

  // Fetch data (simple sequential fetch—small lists expected)
  const people = [];
  for (const s of peopleSlugs) {
    const p = await getPersonBySlug(s);
    if (p) people.push(p);
  }
  const projects = [];
  for (const s of projectSlugs) {
    const pr = await getProjectBySlug(s);
    if (pr) projects.push(pr);
  }

  // Build PDF
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([612, 792]); // Letter portrait
  const margin = 48;
  let y = 792 - margin;

  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold);

  function drawText(text: string, size: number, opts?: { bold?: boolean, color?: {r:number;g:number;b:number} }) {
    const lines = wrapText(text, 612 - margin * 2, size, opts?.bold ? fontBold : font);
    for (const ln of lines) {
      if (y < margin + size * 1.5) { // new page
        const p = pdf.addPage([612, 792]);
        y = 792 - margin;
        (p as any)._ctx = p; // no-op, just keep ref
      }
      page.drawText(ln, { x: margin, y: y - size, size, font: opts?.bold ? fontBold : font, color: opts?.color ? rgb(opts.color.r, opts.color.g, opts.color.b) : rgb(0,0,0) });
      y -= size + 6;
    }
  }

  function wrapText(text: string, maxWidth: number, fontSize: number, fnt: any) {
    const words = text.split(/\s+/);
    const lines: string[] = [];
    let line = '';
    for (const w of words) {
      const test = line ? `${line} ${w}` : w;
      const width = fnt.widthOfTextAtSize(test, fontSize);
      if (width > maxWidth && line) { lines.push(line); line = w; }
      else { line = test; }
    }
    if (line) lines.push(line);
    return lines;
  }

  // Cover
  drawText('Lookbook — Share Pack', 20, { bold: true });
  const now = new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
  drawText(`Generated: ${now}`, 11, { color: { r: 0.2, g: 0.2, b: 0.2 } });
  drawText('', 8);

  // People section
  if (people.length) {
    drawText('People', 16, { bold: true });
    for (const p of people) {
      const header = p.title ? `${p.name} — ${p.title}` : p.name;
      drawText(header, 13, { bold: true });
      if (p.skills?.length) drawText(`Skills: ${p.skills.join(', ')}`, 11);
      drawText(`Profile: /people/${p.slug}`, 11, { color: { r: 0.1, g: 0.1, b: 0.1 } });
      drawText('', 6);
    }
  }

  // Projects section
  if (projects.length) {
    drawText('', 6);
    drawText('Projects', 16, { bold: true });
    for (const pr of projects) {
      drawText(pr.title, 13, { bold: true });
      if (pr.summary) drawText(pr.summary, 11);
      const meta: string[] = [];
      if (pr.skills?.length) meta.push(`Skills: ${pr.skills.join(', ')}`);
      if (pr.sectors?.length) meta.push(`Sectors: ${pr.sectors.join(', ')}`);
      if (meta.length) drawText(meta.join(' | '), 11);
      drawText(`Project: /projects/${pr.slug}`, 11, { color: { r: 0.1, g: 0.1, b: 0.1 } });
      drawText('', 6);
    }
  }

  const pdfBytes = await pdf.save();

  // Log event (fire-and-forget)
  pool.query(
    `INSERT INTO sharepack_events (kind, requester_email, people_count, projects_count, people_slugs, project_slugs)
     VALUES ($1,$2,$3,$4,$5,$6)`,
    ['sharepack', requesterEmail || null, people.length, projects.length, peopleSlugs, projectSlugs]
  ).catch(() => { /* ignore */ });

  // Return PDF
  return new Response(Buffer.from(pdfBytes), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="lookbook-sharepack.pdf"'
    }
  });
}
