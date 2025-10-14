export default function AdminHome() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-semibold">Admin</h1>
      <p className="text-neutral-600 mt-2">Internal: create/edit candidates and projects in Sanity Studio.</p>
      <div className="mt-6 grid gap-3">
        <a href="/studio" className="rounded-lg border px-4 py-3 hover:bg-neutral-50">Open Sanity Studio</a>
        <a href="/search" className="rounded-lg border px-4 py-3 hover:bg-neutral-50">Search</a>
      </div>
    </main>
  );
}
