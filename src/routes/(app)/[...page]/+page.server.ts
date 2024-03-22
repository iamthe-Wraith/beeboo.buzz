import { error } from '@sveltejs/kit';
import { wrapServerLoadWithSentry } from '@sentry/sveltekit';
import type { PageServerLoad } from './$types';

export const load = wrapServerLoadWithSentry(async () => {
  throw error(404, 'We couldn\'t find the page you were looking for.');
}) satisfies PageServerLoad;