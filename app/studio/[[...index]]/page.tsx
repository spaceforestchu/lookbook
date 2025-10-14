/**
 * Sanity Studio mounted at /studio
 * This route handler allows you to manage content in your Sanity dataset.
 */

'use client';

import { NextStudio } from 'next-sanity/studio';
import config from '../../../sanity.config';

export default function StudioPage() {
  return <NextStudio config={config} />;
}
