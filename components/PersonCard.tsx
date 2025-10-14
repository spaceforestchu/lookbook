'use client';

import Link from 'next/link';
import Image from 'next/image';
import { urlForImage } from '@/sanity/lib/image';
import type { Person } from '@/sanity/lib/queries';
import { trackCardClick } from '@/lib/analytics.client';

export default function PersonCard({ person }: { person: Person }) {
  const initials = person.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  const built = urlForImage(person.photo);
  const photoUrl = built?.width(320).height(320).fit('crop').url() ?? null;
  const blur = person.photo?.lqip;

  return (
    <Link
      href={`/people/${person.slug}`}
      className="group block rounded-2xl border border-neutral-200 p-4 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
      onClick={() => trackCardClick('person', person.slug)}
    >
      <div className="flex items-center gap-4">
        {photoUrl ? (
          <Image
            src={photoUrl}
            alt={person.photo?.alt || `${person.name} headshot`}
            width={160}
            height={160}
            placeholder={blur ? 'blur' : 'empty'}
            blurDataURL={blur}
            className="h-20 w-20 rounded-xl object-cover md:h-24 md:w-24"
          />
        ) : (
          <div className="h-20 w-20 md:h-24 md:w-24 rounded-xl bg-neutral-200 flex items-center justify-center text-lg font-semibold">
            {initials}
          </div>
        )}

        <div className="min-w-0">
          <h3 className="text-base font-semibold truncate">{person.name}</h3>
          {person.title && <p className="text-sm text-neutral-600 truncate">{person.title}</p>}
          <div className="mt-2 flex flex-wrap gap-1">
            {(person.skills || []).slice(0, 3).map(s => (
              <span key={s} className="text-[11px] px-2 py-1 rounded-full bg-neutral-100">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
