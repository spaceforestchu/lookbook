import type { Project } from '@/sanity/lib/queries';

// Helper: Extract unique skills from projects, sorted alphabetically
export function uniqueSkillsFromProjects(projects: Project[]): string[] {
  return [...new Set(projects.flatMap((p) => p.skills))].sort((a, b) =>
    a.localeCompare(b)
  );
}

// Helper: Extract unique sectors from projects, sorted alphabetically
export function uniqueSectorsFromProjects(projects: Project[]): string[] {
  return [...new Set(projects.flatMap((p) => p.sectors ?? []))].sort((a, b) =>
    a.localeCompare(b)
  );
}

// Helper: Convert comma-separated string to array (empty string → empty array)
export function commaListToArray(value?: string): string[] {
  if (!value || !value.trim()) return [];
  return value.split(',').filter(Boolean);
}

// Helper: Convert array to comma-separated string
export function arrayToCommaList(arr: string[]): string {
  return arr.join(',');
}
