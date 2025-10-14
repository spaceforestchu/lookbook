import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getAllPeople, getPersonBySlug, type Person } from '@/sanity/lib/queries';
import { urlForImage } from '@/sanity/lib/image';

export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const people = await getAllPeople();
  return people.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const person = await getPersonBySlug(slug);
  if (!person) return {};
  const title = `${person.name} — Lookbook`;
  const description = person.title ? `${person.name} — ${person.title}` : person.name;

  const ogBuilder = urlForImage(person.photo);
  const ogImg = ogBuilder?.width(1200).height(630).fit('crop').url() ?? '/og.svg';

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

  const initials = person!.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  const heroBuilder = urlForImage(person!.photo);
  const heroUrl = heroBuilder?.width(800).height(800).fit('crop').url() ?? null;
  const blur = person!.photo?.lqip;

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <Link href="/people" className="text-sm text-blue-600 hover:underline">&larr; Back to People</Link>

      <section className="mt-6 flex items-center gap-6">
        {heroUrl ? (
          <Image
            src={heroUrl}
            alt={person!.photo?.alt || `${person!.name} headshot`}
            width={320}
            height={320}
            placeholder={blur ? 'blur' : 'empty'}
            blurDataURL={blur}
            className="h-40 w-40 md:h-48 md:w-48 rounded-2xl object-cover"
          />
        ) : (
          <div className="h-40 w-40 md:h-48 md:w-48 rounded-2xl bg-neutral-200 flex items-center justify-center text-3xl font-bold">
            {initials}
          </div>
        )}

        <div>
          <h1 className="text-2xl font-semibold">{person!.name}</h1>
          {person!.title && <p className="text-neutral-600">{person!.title}</p>}
          {person!.openToWork && (
            <span className="mt-2 inline-block text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
              Open to work
            </span>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            {person!.skills.map(s => (
              <span key={s} className="text-[11px] px-2 py-1 rounded-full bg-neutral-100">
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Projects section (from Step 9) */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Projects</h2>
        {person!.projects?.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {person!.projects!.map(p => (
              <Link
                key={p.slug}
                href={`/projects/${p.slug}`}
                className="block rounded-xl border border-neutral-200 p-4 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
              >
                <h3 className="font-semibold">{p.title}</h3>
                {p.summary && <p className="text-sm text-neutral-600 mt-1 line-clamp-2">{p.summary}</p>}
                <div className="mt-2 flex flex-wrap gap-1">
                  {p.skills.slice(0, 3).map(s => (
                    <span key={s} className="text-[11px] px-2 py-1 rounded-full bg-neutral-100">
                      {s}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-neutral-500">No projects yet.</p>
        )}
      </section>
    </main>
  );
}
