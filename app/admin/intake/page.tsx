import { getAllPeople } from '@/sanity/lib/queries';
import AdminIntake from './ui/AdminIntake';

export const revalidate = 0; // fresh in dev; not critical

export default async function IntakePage() {
  const people = await getAllPeople();
  // We only need {slug,name,title,skills,openToWork} for comparison
  const minimal = people.map(p => ({
    slug: p.slug,
    name: p.name,
    title: p.title ?? null,
    skills: p.skills ?? [],
    openToWork: !!p.openToWork
  }));
  return <AdminIntake existing={minimal} />;
}
