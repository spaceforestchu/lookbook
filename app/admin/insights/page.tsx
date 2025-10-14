import { ensureSchema, pool } from '@/db/client';

export const revalidate = 0;

export default async function InsightsPage() {
  await ensureSchema();
  const [totals, recent, topPeople, topProjects] = await Promise.all([
    pool.query(`SELECT COUNT(*)::int AS n FROM sharepack_events`),
    pool.query(`SELECT COUNT(*)::int AS n FROM sharepack_events WHERE created_at >= now() - interval '30 days'`),
    pool.query(`
      SELECT slug, COUNT(*)::int AS n
      FROM (
        SELECT unnest(people_slugs) AS slug FROM sharepack_events WHERE people_slugs IS NOT NULL
      ) t
      GROUP BY slug
      ORDER BY n DESC
      LIMIT 10
    `),
    pool.query(`
      SELECT slug, COUNT(*)::int AS n
      FROM (
        SELECT unnest(project_slugs) AS slug FROM sharepack_events WHERE project_slugs IS NOT NULL
      ) t
      GROUP BY slug
      ORDER BY n DESC
      LIMIT 10
    `)
  ]);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-semibold">Insights</h1>
      <p className="text-sm text-neutral-600 mt-1">Usage from Share Packs and CRM leads.</p>

      <section className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card label="Total events" value={totals.rows[0].n} />
        <Card label="Last 30 days" value={recent.rows[0].n} />
        <Card label="Data source" value="sharepack_events" />
      </section>

      <section className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <ListCard title="Top People (by slug)" rows={topPeople.rows} />
        <ListCard title="Top Projects (by slug)" rows={topProjects.rows} />
      </section>
    </main>
  );
}

function Card({ label, value }: { label:string; value:any }) {
  return (
    <div className="rounded-xl border p-4">
      <div className="text-sm text-neutral-600">{label}</div>
      <div className="text-2xl font-semibold mt-1">{String(value)}</div>
    </div>
  );
}
function ListCard({ title, rows }: { title:string; rows: {slug:string; n:number}[] }) {
  return (
    <div className="rounded-xl border p-4">
      <div className="text-sm font-medium mb-2">{title}</div>
      {rows.length === 0 ? <div className="text-sm text-neutral-500">No data.</div> : (
        <ul className="text-sm space-y-1">
          {rows.map((r,i)=>(
            <li key={i} className="flex justify-between">
              <span className="truncate">{r.slug}</span>
              <span className="text-neutral-600">{r.n}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
