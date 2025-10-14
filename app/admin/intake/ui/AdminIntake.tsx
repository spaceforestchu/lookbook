'use client';

import { useState } from 'react';
import { shallowDiff } from '@/lib/diff';
import { kebabify } from '@/lib/kebab';

type Existing = { slug: string; name: string; title: string | null; skills: string[]; openToWork: boolean };
type Extracted = { name: string | null; title: string | null; skills: string[]; openToWork: boolean | null };
type Prepared = { name: string | null; title: string | null; skills: string[]; openToWork: boolean };

export default function AdminIntake({ existing }: { existing: Existing[] }) {
  const [sourceText, setSourceText] = useState('');
  const [result, setResult] = useState<Extracted | null>(null);
  const [matchSlug, setMatchSlug] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const [prepared, setPrepared] = useState<Prepared | null>(null);
  const [modReport, setModReport] = useState<{ errors: string[]; warnings: string[]; pii: {emails:string[]; phones:string[]; urls:string[]} } | null>(null);
  const [normInfo, setNormInfo] = useState<{ renamed: Array<{from:string;to:string}>; dropped: string[] } | null>(null);
  const [prepLoading, setPrepLoading] = useState(false);

  const matched = existing.find(p => p.slug === matchSlug) || null;

  const handleExtract = async () => {
    setLoading(true);
    setResult(null);
    setPrepared(null);
    setModReport(null);
    setNormInfo(null);
    try {
      const res = await fetch('/api/ai/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceText })
      });
      const data = await res.json();
      if (data.ok) setResult(data.data as Extracted);
      else alert(data.error || 'Extraction failed');
    } catch {
      alert('Request failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePrepare = async () => {
    if (!result) { alert('Extract first'); return; }
    setPrepLoading(true);
    setPrepared(null);
    setModReport(null);
    setNormInfo(null);
    try {
      const res = await fetch('/api/ai/prepare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ extracted: result, sourceText })
      });
      const data = await res.json();
      if (data.ok) {
        setPrepared(data.prepared as Prepared);
        setModReport(data.moderation);
        setNormInfo(data.normalization);
      } else {
        alert(data.error || 'Prepare failed');
      }
    } catch {
      alert('Request failed');
    } finally {
      setPrepLoading(false);
    }
  };

  const suggestedSlug = (prepared?.name ?? result?.name) ? kebabify((prepared?.name ?? result?.name) as string) : '';

  const oldObj = matched ? matched : {};
  const newObj = {
    name: prepared?.name ?? result?.name ?? null,
    title: prepared?.title ?? result?.title ?? null,
    skills: prepared?.skills ?? result?.skills ?? [],
    openToWork: prepared?.openToWork ?? (result?.openToWork ?? null)
  };

  const diff = shallowDiff(oldObj, newObj);

  const copySanitized = async () => {
    const payload = {
      name: prepared?.name ?? null,
      title: prepared?.title ?? null,
      skills: prepared?.skills ?? [],
      openToWork: prepared?.openToWork ?? false,
      suggestedSlug: suggestedSlug || undefined
    };
    await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    alert('Copied sanitized JSON to clipboard');
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-semibold">AI Intake (Person)</h1>
      <p className="text-sm text-neutral-600 mt-1">Extract → Sanitize & Check → Review. No CMS writes yet.</p>

      <section className="mt-6 space-y-3">
        <label className="block text-sm font-medium">Source text</label>
        <textarea
          value={sourceText}
          onChange={e => setSourceText(e.target.value)}
          placeholder="Paste resume / LinkedIn profile text here…"
          className="w-full h-40 rounded-lg border border-neutral-300 p-3"
        />
        <div className="flex items-center gap-3">
          <button onClick={handleExtract} disabled={loading || sourceText.trim().length < 20}
            className="rounded-lg bg-black text-white px-4 py-2 disabled:opacity-60">
            {loading ? 'Extracting…' : 'Extract Profile'}
          </button>

          <button onClick={handlePrepare} disabled={!result || prepLoading}
            className="rounded-lg border px-4 py-2 disabled:opacity-60">
            {prepLoading ? 'Checking…' : 'Sanitize & Check'}
          </button>

          {(prepared?.name || result?.name) && (
            <div className="text-sm text-neutral-700">
              Suggested slug: <code className="px-1 py-0.5 bg-neutral-100 rounded">{suggestedSlug}</code>
            </div>
          )}
        </div>
      </section>

      <section className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <h2 className="font-semibold mb-2">Proposed (raw)</h2>
          <pre className="text-sm bg-neutral-50 border border-neutral-200 rounded-lg p-3 overflow-auto">
{JSON.stringify(result ?? { name: null, title: null, skills: [], openToWork: null }, null, 2)}
          </pre>
        </div>

        <div className="md:col-span-1">
          <h2 className="font-semibold mb-2">Sanitized</h2>
          <pre className="text-sm bg-neutral-50 border border-neutral-200 rounded-lg p-3 overflow-auto">
{JSON.stringify(prepared ?? { name: null, title: null, skills: [], openToWork: false }, null, 2)}
          </pre>
          <button onClick={copySanitized} disabled={!prepared}
            className="mt-2 rounded-lg border px-3 py-1.5 text-sm">
            Copy Sanitized JSON
          </button>

          {normInfo && (normInfo.renamed.length > 0 || normInfo.dropped.length > 0) && (
            <div className="mt-3 text-sm">
              {normInfo.renamed.length > 0 && (
                <div className="mb-2">
                  <div className="font-medium">Renamed</div>
                  <ul className="list-disc list-inside">
                    {normInfo.renamed.map(r => <li key={`${r.from}->${r.to}`}>{r.from} → <strong>{r.to}</strong></li>)}
                  </ul>
                </div>
              )}
              {normInfo.dropped.length > 0 && (
                <div>
                  <div className="font-medium">Dropped</div>
                  <ul className="list-disc list-inside">
                    {normInfo.dropped.map(s => <li key={s}>{s}</li>)}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="md:col-span-1">
          <h2 className="font-semibold mb-2">Moderation</h2>
          <div className="border rounded-lg p-3 text-sm">
            {!modReport && <p className="text-neutral-500">Run "Sanitize & Check" to see issues.</p>}
            {modReport && (
              <>
                {modReport.errors.length > 0 && (
                  <div className="mb-2">
                    <div className="font-medium text-red-700">Errors</div>
                    <ul className="list-disc list-inside text-red-700">
                      {modReport.errors.map((e, i) => <li key={i}>{e}</li>)}
                    </ul>
                  </div>
                )}
                {modReport.warnings.length > 0 && (
                  <div className="mb-2">
                    <div className="font-medium text-amber-700">Warnings</div>
                    <ul className="list-disc list-inside text-amber-700">
                      {modReport.warnings.map((w, i) => <li key={i}>{w}</li>)}
                    </ul>
                  </div>
                )}
                {(modReport.pii.emails.length || modReport.pii.phones.length || modReport.pii.urls.length) ? (
                  <div>
                    <div className="font-medium">PII detected</div>
                    <p className="text-neutral-600">Emails: {modReport.pii.emails.length} | Phones: {modReport.pii.phones.length} | URLs: {modReport.pii.urls.length}</p>
                  </div>
                ) : null}
                {modReport.errors.length === 0 && modReport.warnings.length === 0 && !modReport.pii.emails.length && !modReport.pii.phones.length && !modReport.pii.urls.length && (
                  <p className="text-green-700">✓ No issues detected</p>
                )}
              </>
            )}
          </div>

          <div className="mt-4">
            <h3 className="font-medium">Compare with existing (optional)</h3>
            <label className="block text-sm mb-1 mt-1">Person</label>
            <select
              value={matchSlug}
              onChange={e => setMatchSlug(e.target.value)}
              className="w-full rounded-lg border border-neutral-300 p-2"
            >
              <option value="">— None —</option>
              {existing.map(p => (
                <option key={p.slug} value={p.slug}>{p.name}</option>
              ))}
            </select>

            {matchSlug && (
              <div className="mt-3 text-sm">
                <div className="mb-1">Diff summary:
                  <span className="ml-2 rounded bg-amber-100 px-2 py-0.5">changed: {diff.changed.length}</span>
                  <span className="ml-2 rounded bg-green-100 px-2 py-0.5">same: {diff.same.length}</span>
                  <span className="ml-2 rounded bg-blue-100 px-2 py-0.5">added: {diff.added.length}</span>
                  <span className="ml-2 rounded bg-rose-100 px-2 py-0.5">removed: {diff.removed.length}</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="border rounded-lg p-2">
                    <div className="font-medium mb-1">Existing</div>
                    <pre className="text-xs overflow-auto">{JSON.stringify(oldObj, null, 2)}</pre>
                  </div>
                  <div className="border rounded-lg p-2">
                    <div className="font-medium mb-1">Proposed</div>
                    <pre className="text-xs overflow-auto">{JSON.stringify(newObj, null, 2)}</pre>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
