import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4002/api';

// Fetch all people from backend API
async function getAllPeople() {
  const res = await fetch(`${API_URL}/profiles?limit=100`, {
    next: { revalidate: 300 }
  });
  if (!res.ok) return [];
  const json = await res.json();
  return json.data || [];
}

// Fetch person by slug from backend API
async function getPersonBySlug(slug: string) {
  const res = await fetch(`${API_URL}/profiles/${slug}`, {
    next: { revalidate: 300 }
  });
  if (!res.ok) return null;
  const json = await res.json();
  return json.data || null;
}

export async function generateStaticParams() {
  const people = await getAllPeople();
  return people.map((p: any) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const person = await getPersonBySlug(slug);
  if (!person) return {};
  const title = `${person.name} — Lookbook`;
  const description = person.title ? `${person.name} — ${person.title}` : person.name;

  const ogImg = person.photo_url || '/og.svg';

  return {
    title,
    description,
    openGraph: { title, description, images: [ogImg] },
    twitter: { card: 'summary_large_image', title, description, images: [ogImg] },
  };
}

export default async function PersonPage({ params }: Props) {
  const { slug } = await params;
  const person = await getPersonBySlug(slug);
  if (!person) notFound();

  // Get all people to calculate position and navigation
  const allPeople = await getAllPeople();
  const sortedPeople = allPeople.sort((a: any, b: any) => a.name?.localeCompare(b.name));
  const currentIndex = sortedPeople.findIndex((p: any) => p.slug === slug);
  const position = currentIndex + 1;
  const total = sortedPeople.length;
  const prevSlug = currentIndex > 0 ? sortedPeople[currentIndex - 1].slug : undefined;
  const nextSlug = currentIndex < sortedPeople.length - 1 ? sortedPeople[currentIndex + 1].slug : undefined;

  const heroUrl = person.photo_url || null;

  return (
    <main className="relative mx-auto max-w-[1200px] px-4 py-8">
      {/* Side arrows */}
      <div className="hidden lg:block">
        <NavArrow side="left" href={prevSlug ? `/people/${prevSlug}` : undefined} />
        <NavArrow side="right" href={nextSlug ? `/people/${nextSlug}` : undefined} />
      </div>

      {/* Top meta row */}
      <div className="mb-6 flex items-center justify-between text-sm text-neutral-600">
        <div className="flex items-center gap-3">
          <Link href="/projects" className="rounded-full border px-3 py-1 hover:bg-neutral-50">PROJECTS</Link>
          <span className="rounded-full border bg-black px-3 py-1 text-white">PEOPLE</span>
        </div>
        <div><span className="font-medium">{position}</span> of <span className="font-medium">{total}</span></div>
      </div>

      {/* Hero section with photo and bio side-by-side */}
      <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[280px_1fr]">
          {/* Photo */}
          <div className="relative h-[320px] w-full overflow-hidden rounded-xl bg-neutral-200">
            {heroUrl ? (
              <Image
                src={heroUrl}
                alt={person.name}
                fill
                className="object-cover"
                sizes="280px"
              />
            ) : null}
          </div>

          {/* Name, links, and bio */}
          <div>
            <div className="mb-4 flex items-center gap-3">
              <h1 className="text-3xl font-bold uppercase tracking-tight">{person.name}</h1>
              {person.x_url && (
                <a href={person.x_url} target="_blank" rel="noopener noreferrer" className="text-neutral-600 hover:text-black">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
              )}
              {person.linkedin_url && (
                <a href={person.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-neutral-600 hover:text-blue-600">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
              )}
              {person.website_url && (
                <a href={person.website_url} target="_blank" rel="noopener noreferrer" className="text-neutral-600 hover:text-black">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
                </a>
              )}
              {person.github_url && (
                <a href={person.github_url} target="_blank" rel="noopener noreferrer" className="text-neutral-600 hover:text-black">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                </a>
              )}
            </div>

            {person.bio && (
              <div>
                <h2 className="mb-2 text-sm font-semibold">Bio &amp; Credentials</h2>
                <p className="text-sm leading-relaxed text-neutral-700">{person.bio}</p>
              </div>
            )}
          </div>
        </div>

        {/* 4-column section */}
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Highlights */}
          {Array.isArray(person.highlights) && person.highlights.length > 0 && (
            <div className="rounded-xl bg-neutral-900 p-4 text-white">
              <h3 className="mb-3 text-sm font-semibold">Highlights</h3>
              <ul className="space-y-2 text-sm">
                {person.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-500 text-xs">✓</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Experience + Education */}
          {Array.isArray(person.experience) && person.experience.length > 0 && (
            <div className="rounded-xl border bg-white p-4">
              <h3 className="mb-3 text-sm font-semibold">Experience + Education</h3>
              <ul className="space-y-3">
                {person.experience.map((e, i) => (
                  <li key={i} className="flex gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-neutral-900 text-xs font-bold text-white">
                      {e.org?.substring(0, 2).toUpperCase() || '?'}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium">{e.org || 'Organization'}</div>
                      <div className="text-xs text-neutral-600">{e.role}</div>
                      {(e.dateFrom || e.dateTo) && (
                        <div className="text-xs text-neutral-500">
                          {e.dateFrom || ''}{e.dateTo ? ` - ${e.dateTo}` : ''}
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Skills */}
          {Array.isArray(person.skills) && person.skills.length > 0 && (
            <div className="rounded-xl border bg-white p-4">
              <h3 className="mb-3 text-sm font-semibold">Skills</h3>
              <ul className="space-y-1 text-sm text-neutral-700">
                {person.skills.map((s) => (
                  <li key={s}>• {s}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Industry Expertise */}
          {Array.isArray(person.industryExpertise) && person.industryExpertise.length > 0 && (
            <div className="rounded-xl border bg-white p-4">
              <h3 className="mb-3 text-sm font-semibold">Industry Expertise</h3>
              <div className="space-y-2">
                {person.industryExpertise.map((e) => (
                  <div key={e} className="rounded-full bg-gradient-to-r from-pink-200 to-pink-300 px-3 py-1.5 text-center text-xs font-medium uppercase tracking-wide">
                    {e}
                  </div>
                ))}
                {person.openToWork && (
                  <div className="rounded-full bg-gradient-to-r from-emerald-200 to-emerald-300 px-3 py-1.5 text-center text-xs font-medium uppercase tracking-wide">
                    Open to Work
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Select Projects */}
      {Array.isArray(person.projects) && person.projects.length > 0 && (
        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Select Projects</h2>
            <button className="text-neutral-600 hover:text-black">→</button>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {person.projects.map((p) => (
              <Link key={p.slug} href={`/projects/${p.slug}`} className="group rounded-xl border bg-white p-4 hover:shadow-md">
                <div className="mb-3 flex items-center gap-3">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                    {p.coverUrl && (
                      <Image
                        src={p.coverUrl + '?w=100&h=100&fit=crop'}
                        alt={p.title}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium group-hover:text-blue-600">{p.title}</div>
                  </div>
                </div>
                {p.summary && (
                  <p className="line-clamp-2 text-sm text-neutral-600">{p.summary}</p>
                )}
                <div className="mt-2 text-xs text-blue-600">View project →</div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

function NavArrow({ side, href }: { side: 'left' | 'right'; href?: string }) {
  const base =
    'fixed top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border bg-white/90 text-lg shadow lg:flex';
  const cls = side === 'left' ? `${base} left-6` : `${base} right-6`;
  if (!href) {
    return <div className={`${cls} opacity-40`}>{side === 'left' ? '‹' : '›'}</div>;
  }
  return (
    <Link href={href} className={cls} aria-label={side === 'left' ? 'Previous' : 'Next'}>
      {side === 'left' ? '‹' : '›'}
    </Link>
  );
}
