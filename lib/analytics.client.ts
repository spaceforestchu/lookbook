'use client';
import { track } from '@vercel/analytics';

export function trackEvent(name: string, props?: Record<string, string | number | boolean | null> | undefined) {
  try {
    track(name, props);
  } catch {
    // no-op: don't crash on analytics failures
  }
}

/** Helpers that preserve privacy (no raw search text) */
export function trackSearch(kind: 'people' | 'projects', q: string) {
  trackEvent(`${kind}_filter_search`, {
    isEmpty: q.trim().length === 0,
    length: Math.min(q.trim().length, 100)
  });
}
export function trackFilter(kind: 'people' | 'projects', facet: 'skills' | 'sectors' | 'open', countOrBool: number | boolean) {
  trackEvent(`${kind}_filter_${facet}`, typeof countOrBool === 'boolean' ? { value: countOrBool } : { count: countOrBool });
}
export function trackFiltersCleared(kind: 'people' | 'projects') {
  trackEvent(`${kind}_filters_cleared`);
}
export function trackCardClick(kind: 'person' | 'project', slug: string) {
  trackEvent(`nav_${kind}_card_click`, { slug });
}
