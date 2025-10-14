import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Verify secret token
    const authHeader = request.headers.get('x-revalidate-secret');
    if (authHeader !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    const { type, slug, personSlugs } = body as {
      type?: string;
      slug?: string;
      personSlugs?: string[];
    };

    // Revalidate listing pages
    revalidatePath('/people');
    revalidatePath('/projects');

    // Revalidate specific detail pages based on type
    if (type === 'person' && slug) {
      revalidatePath(`/people/${slug}`);
    }

    if (type === 'project' && slug) {
      revalidatePath(`/projects/${slug}`);
    }

    // Revalidate impacted person pages when project changes
    if (Array.isArray(personSlugs)) {
      for (const personSlug of personSlugs) {
        if (typeof personSlug === 'string' && personSlug) {
          revalidatePath(`/people/${personSlug}`);
        }
      }
    }

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      paths: {
        listings: ['/people', '/projects'],
        detail: type && slug ? `/${type}s/${slug}` : null,
        people: personSlugs || [],
      },
    });
  } catch (err) {
    return NextResponse.json(
      { message: 'Error revalidating', error: String(err) },
      { status: 500 }
    );
  }
}
