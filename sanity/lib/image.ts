import createImageUrlBuilder from '@sanity/image-url';
import type { Image } from 'sanity';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;

const builder = createImageUrlBuilder({ projectId, dataset });

/** Build a URL for a Sanity image source. Accepts the raw image object that includes `asset._ref`. */
export function urlForImage(source: Image | { asset?: { _ref?: string } } | null | undefined) {
  if (!source || !('asset' in (source as any)) || !(source as any).asset?._ref) return null;
  return builder.image(source as any);
}
