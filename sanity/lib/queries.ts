import { groq } from 'next-sanity';
import { client } from './client';

export type Person = {
  slug: string;
  name: string;
  title?: string;
  bio?: string;
  skills: string[];
  openToWork?: boolean;
  highlights?: string[];
  industryExpertise?: string[];
  links?: {
    linkedin?: string;
    github?: string;
    website?: string;
    x?: string;
  };
  experience?: Array<{
    org?: string;
    role?: string;
    dateFrom?: string;
    dateTo?: string;
    summary?: string;
  }>;
  photo?: {
    alt?: string;
    asset?: { _ref?: string };  // keep ref so the image builder works
    url?: string;               // convenience URL
    lqip?: string;              // low-quality blur placeholder
  };
  projects?: Array<{
    slug: string;
    title: string;
    summary?: string;
    skills: string[];
    sectors?: string[];
    coverUrl?: string | null;
  }>;
};

export type Project = {
  slug: string;
  title: string;
  summary?: string;
  skills: string[];
  sectors?: string[];
  participants?: Array<{ slug: string; name: string }>;
  githubUrl?: string;
  liveUrl?: string;
};

// PEOPLE
export const allPeopleQuery = groq`*[_type=="person"]{
  "slug": slug.current,
  name,
  title,
  skills,
  openToWork,
  photo{
    alt,
    asset,                                // keep ref for builder
    "url": asset->url,
    "lqip": asset->metadata.lqip
  }
} | order(name asc)`;

export const personBySlugQuery = groq`*[_type=="person" && slug.current==$slug][0]{
  "slug": slug.current,
  name,
  title,
  bio,
  skills,
  openToWork,
  highlights,
  industryExpertise,
  links,
  experience[]{
    org,
    role,
    dateFrom,
    dateTo,
    summary
  },
  photo{
    alt,
    asset,                                // keep ref for builder
    "url": asset->url,
    "lqip": asset->metadata.lqip
  },
  "projects": *[_type=="project" && references(^._id)]{
    "slug": slug.current,
    title,
    summary,
    skills,
    sectors,
    "coverUrl": coalesce(cover.asset->url, image.asset->url)
  } | order(title asc)
}`;

export async function getAllPeople(): Promise<Person[]> {
  return client.fetch(allPeopleQuery);
}

export async function getPersonBySlug(slug: string): Promise<Person | null> {
  return client.fetch(personBySlugQuery, { slug });
}

// PROJECTS (unchanged shapes from earlier steps; included for completeness)
export const allProjectsQuery = groq`*[_type=="project"]{
  "slug": slug.current,
  title,
  summary,
  skills,
  sectors,
  "participants": participants[]->{"slug": slug.current, name},
  githubUrl,
  liveUrl
} | order(title asc)`;

export const projectBySlugQuery = groq`*[_type=="project" && slug.current==$slug][0]{
  "slug": slug.current,
  title,
  summary,
  skills,
  sectors,
  "participants": participants[]->{"slug": slug.current, name},
  githubUrl,
  liveUrl
}`;

export async function getAllProjects() {
  return client.fetch(allProjectsQuery);
}
export async function getProjectBySlug(slug: string) {
  return client.fetch(projectBySlugQuery, { slug });
}
