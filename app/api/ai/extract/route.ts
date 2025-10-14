import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export const runtime = 'nodejs';

type ExtractedPerson = {
  name: string | null;
  title: string | null;
  skills: string[];
  openToWork: boolean | null;
  // we do NOT set slug here; UI can suggest from name
};

const SYSTEM_PROMPT = `
You are a strict information extractor. Output ONLY valid JSON matching this TypeScript type:
type ExtractedPerson = {
  name: string | null;
  title: string | null;
  skills: string[];              // unique, case-preserving; 0-12 items
  openToWork: boolean | null;    // if text clearly implies open to work / seeking opportunities
};

Rules:
- If a field is unknown, use null (or [] for skills).
- Do NOT invent facts. Extract only from the provided text.
- For skills: include technical stacks or clear competencies (e.g., React, TypeScript, Postgres, Python).
- openToWork: true if clearly stated, false if clearly not, else null.
- Respond with JSON ONLY. No markdown, no extra text.
`;

export async function POST(req: NextRequest) {
  try {
    const { sourceText } = await req.json();
    if (typeof sourceText !== 'string' || sourceText.trim().length < 20) {
      return NextResponse.json({ ok: false, error: 'Provide at least ~20 characters of text.' }, { status: 400 });
    }

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
    const userPrompt = `Extract from this text:\n\n${sourceText}\n\nReturn only JSON of type ExtractedPerson.`;

    const msg = await client.messages.create({
      model: 'claude-3-5-sonnet-latest',
      max_tokens: 800,
      temperature: 0,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }]
    });

    const raw = (msg.content?.[0] as any)?.text ?? '';
    let parsed: ExtractedPerson | null = null;
    try {
      parsed = JSON.parse(raw);
    } catch {
      // try to salvage JSON substring
      const start = raw.indexOf('{');
      const end = raw.lastIndexOf('}');
      if (start >= 0 && end > start) {
        parsed = JSON.parse(raw.slice(start, end + 1));
      }
    }

    // Runtime validation (minimal)
    const clean: ExtractedPerson = {
      name: typeof parsed?.name === 'string' || parsed?.name === null ? parsed?.name ?? null : null,
      title: typeof parsed?.title === 'string' || parsed?.title === null ? parsed?.title ?? null : null,
      skills: Array.isArray(parsed?.skills) ? [...new Set(parsed!.skills.filter(s => typeof s === 'string').slice(0, 12))] : [],
      openToWork: typeof parsed?.openToWork === 'boolean' ? parsed!.openToWork : null,
    };

    return NextResponse.json({ ok: true, data: clean });
  } catch (e) {
    return NextResponse.json({ ok: false, error: 'Extraction failed' }, { status: 502 });
  }
}
