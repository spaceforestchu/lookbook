'use client';
import { useState } from 'react';
import Link from 'next/link';

const SEMANTIC = process.env.NEXT_PUBLIC_FEATURE_SEMANTIC_SEARCH === '1';

type PersonRow = { slug: string; name: string; title?: string|null; skills: string[]; open_to_work: boolean; score?: number };
type ProjectRow = { slug: string; title: string; summary?: string|null; skills: string[]; sectors: string[]; score?: number };

export default function SearchPage() {
  const [q, setQ] = useState('');
  const [skills, setSkills] = useState<string>('');
  const [sectors, setSectors] = useState<string>('');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [people, setPeople] = useState<PersonRow[]>([]);
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [mode, setMode] = useState<'semantic'|'keyword'>(SEMANTIC ? 'semantic' : 'keyword');

  const run = async () => {
    setLoading(true);
    setPeople([]); setProjects([]);
    const payload: any = {
      q,
      type: 'all',
      skills: skills ? skills.split(',').map(s=>s.trim()).filter(Boolean) : undefined,
      sectors: sectors ? sectors.split(',').map(s=>s.trim()).filter(Boolean) : undefined,
      open: open || undefined,
      limit: 10
    };
    const url = SEMANTIC ? '/api/search' : '/api/search/simple';
    const res = await fetch(url, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
    const data = await res.json();
    if (data.ok) {
      setPeople(data.people || []);
      setProjects(data.projects || []);
      setMode(SEMANTIC ? 'semantic' : 'keyword');
    } else {
      alert(data.error || 'Search failed');
    }
    setLoading(false);
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <div className="flex items-baseline justify-between">
        <h1 className="text-2xl font-semibold">Search</h1>
        <span className="text-xs rounded-full px-2 py-1 border">
          Mode: {mode === 'semantic' ? 'Semantic (vectors)' : 'Keyword (GROQ)'}
        </span>
      </div>
      <p className="text-sm text-neutral-600 mt-1">Find people and projects. Skills/sector filters use AND semantics.</p>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-3">
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="e.g., react or fintech"
          className="md:col-span-2 rounded-lg border p-2" />
        <input value={skills} onChange={e=>setSkills(e.target.value)} placeholder="skills (comma)"
          className="rounded-lg border p-2" />
        <input value={sectors} onChange={e=>setSectors(e.target.value)} placeholder="sectors (comma)"
          className="rounded-lg border p-2" />
        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" checked={open} onChange={e=>setOpen(e.target.checked)} />
          Open to work
        </label>
        <button onClick={run} className="rounded-lg bg-black text-white px-4 py-2 w-fit">
          {loading ? 'Searching…' : 'Search'}
        </button>
      </div>

      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-3">People</h2>
        {people.length === 0 ? <p className="text-sm text-neutral-500">No results.</p> : (
          <ul className="space-y-2">
            {people.map(p=>(
              <li key={p.slug} className="rounded-lg border p-3">
                <Link href={`/people/${p.slug}`} className="font-medium hover:underline">{p.name}</Link>
                {p.title && <span className="ml-2 text-neutral-600">{p.title}</span>}
                <div className="mt-1 text-xs text-neutral-600">skills: {p.skills.join(', ')}</div>
                {typeof p.score === 'number' && <div className="text-xs text-neutral-500">score: {p.score.toFixed(3)}</div>}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-3">Projects</h2>
        {projects.length === 0 ? <p className="text-sm text-neutral-500">No results.</p> : (
          <ul className="space-y-2">
            {projects.map(p=>(
              <li key={p.slug} className="rounded-lg border p-3">
                <Link href={`/projects/${p.slug}`} className="font-medium hover:underline">{p.title}</Link>
                {p.summary && <div className="text-sm text-neutral-600">{p.summary}</div>}
                <div className="mt-1 text-xs text-neutral-600">
                  skills: {p.skills.join(', ')}{p.sectors?.length ? ` | sectors: ${p.sectors.join(', ')}`:''}
                </div>
                {typeof p.score === 'number' && <div className="text-xs text-neutral-500">score: {p.score.toFixed(3)}</div>}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
