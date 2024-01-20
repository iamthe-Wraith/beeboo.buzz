import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { Logger } from '$lib/services/logger';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.session.user) redirect(303, '/?signin=true');
    
    Logger.info('locals: ', locals.session.user);
};