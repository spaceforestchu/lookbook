'use client';

import { useState } from 'react';

type Person = { slug: string; name: string };
type Project = { slug: string; title: string };

export default function ShareClient({ people, projects }: { people: Person[]; projects: Project[] }) {
  const [ps, setPs] = useState<string[]>([]);
  const [pr, setPr] = useState<string[]>([]);
  const [email, setEmail] = useState('');

  const toggle = (arr: string[], setArr: (v: string[]) => void, slug: string) => {
    setArr(arr.includes(slug) ? arr.filter(s => s !== slug) : [...arr, slug]);
  };

  const gen = async () => {
    const res = await fetch('/api/sharepack', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ peopleSlugs: ps, projectSlugs: pr, requesterEmail: email || undefined })
    });
    if (!res.ok) {
      alert('Failed to generate PDF');
      return;
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lookbook-sharepack.pdf';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <div className="font-medium mb-2">People</div>
        <div className="max-h-64 overflow-auto border rounded-lg p-2 space-y-1">
          {people.map(p => (
            <label key={p.slug} className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={ps.includes(p.slug)} onChange={() => toggle(ps, setPs, p.slug)} />
              {p.name}
            </label>
          ))}
        </div>
      </div>
      <div className="md:col-span-1">
        <div className="font-medium mb-2">Projects</div>
        <div className="max-h-64 overflow-auto border rounded-lg p-2 space-y-1">
          {projects.map(p => (
            <label key={p.slug} className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={pr.includes(p.slug)} onChange={() => toggle(pr, setPr, p.slug)} />
              {p.title}
            </label>
          ))}
        </div>
      </div>
      <div className="md:col-span-1">
        <div className="font-medium mb-2">Requester Email (optional)</div>
        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="recruiter@company.com"
          className="w-full rounded-lg border p-2 text-sm"
        />
        <button onClick={gen} className="mt-4 rounded-lg bg-black text-white px-4 py-2">
          Generate PDF
        </button>
      </div>
    </div>
  );
}
