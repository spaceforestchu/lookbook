import { NextRequest, NextResponse } from 'next/server';
import { groq } from 'next-sanity';
import { client } from '@/sanity/lib/client';

export const runtime = 'nodejs';
export const revalidate = 300;

type Params = {
  search?: string;
  cohort?: string;
  industries?: string[];
  hasDemoVideo?: boolean;
  openToRelocate?: boolean;
  openToWork?: boolean;
  freelance?: boolean;
  nycBased?: boolean;
  remoteOnly?: boolean;
  page?: number;
  perPage?: number;
};

const PROJECTS_QUERY = groq`
  *[
    _type == "project" && !(_id in path("drafts.**"))
    $FILTERS
  ] | order(title asc) {
    "slug": slug.current,
    title,
    summary,
    mainImage {
      asset->,
      alt
    },
    skills,
    sectors,
    cohort,
    industries,
    hasDemoVideo,
    openToRelocate,
    openToWork,
    freelance,
    nycBased,
    remoteOnly,
    "team": team[]-> {
      "slug": slug.current,
      name,
      image
    }
  }
`;

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Params;

    const filters: string[] = [];

    // Text search
    if (body.search?.trim()) {
      const term = `*${body.search.trim()}*`;
      filters.push(`(title match "${term}" || summary match "${term}")`);
    }

    // Cohort filter
    if (body.cohort) {
      filters.push(`cohort == "${body.cohort}"`);
    }

    // Industries (multi-select AND)
    if (body.industries?.length) {
      const industryChecks = body.industries.map(ind => `"${ind}" in industries`);
      filters.push(`(${industryChecks.join(' && ')})`);
    }

    // Boolean flags
    if (typeof body.hasDemoVideo === 'boolean') {
      filters.push(`hasDemoVideo == ${body.hasDemoVideo}`);
    }
    if (typeof body.openToRelocate === 'boolean') {
      filters.push(`openToRelocate == ${body.openToRelocate}`);
    }
    if (typeof body.openToWork === 'boolean') {
      filters.push(`openToWork == ${body.openToWork}`);
    }
    if (typeof body.freelance === 'boolean') {
      filters.push(`freelance == ${body.freelance}`);
    }
    if (typeof body.nycBased === 'boolean') {
      filters.push(`nycBased == ${body.nycBased}`);
    }
    if (typeof body.remoteOnly === 'boolean') {
      filters.push(`remoteOnly == ${body.remoteOnly}`);
    }

    // Build final query
    const filterStr = filters.length > 0 ? ` && ${filters.join(' && ')}` : '';
    const query = PROJECTS_QUERY.replace('$FILTERS', filterStr);

    // Fetch all matching projects
    const allProjects = await client.fetch(query);

    // Pagination
    const page = Math.max(1, body.page ?? 1);
    const perPage = Math.min(Math.max(1, body.perPage ?? 12), 50);
    const total = allProjects.length;
    const totalPages = Math.ceil(total / perPage);
    const start = (page - 1) * perPage;
    const projects = allProjects.slice(start, start + perPage);

    return NextResponse.json({
      ok: true,
      projects,
      pagination: {
        page,
        perPage,
        total,
        totalPages
      }
    });
  } catch (error: any) {
    console.error('Browse projects error:', error);
    return NextResponse.json(
      { ok: false, error: error?.message || 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}
