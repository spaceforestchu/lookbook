import { NextRequest, NextResponse } from 'next/server';
import { normalizeSkills } from '@/lib/normalize';
import { moderatePerson, type ModerationReport } from '@/lib/moderation';

export const runtime = 'nodejs';

type ExtractedPerson = {
  name: string | null;
  title: string | null;
  skills: string[];
  openToWork: boolean | null;
};

export async function POST(req: NextRequest) {
  try {
    const { extracted, sourceText } = await req.json() as { extracted: ExtractedPerson; sourceText?: string };
    if (!extracted || typeof extracted !== 'object') {
      return NextResponse.json({ ok: false, error: 'Missing `extracted`' }, { status: 400 });
    }

    const name = (extracted.name ?? '').trim().replace(/\s+/g,' ');
    const title = (extracted.title ?? '').trim().replace(/\s+/g,' ');

    const norm = normalizeSkills(extracted.skills ?? []);
    const prepared = {
      name: name || null,
      title: title || null,
      skills: norm.normalized,
      openToWork: extracted.openToWork ?? false
    };

    const moderation: ModerationReport = moderatePerson({
      name: prepared.name,
      title: prepared.title,
      skills: prepared.skills,
      sourceText
    });

    return NextResponse.json({
      ok: true,
      prepared,
      moderation,
      normalization: { renamed: norm.renamed, dropped: norm.dropped }
    });
  } catch (e) {
    return NextResponse.json({ ok: false, error: 'Prepare failed' }, { status: 500 });
  }
}
