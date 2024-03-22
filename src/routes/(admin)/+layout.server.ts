import { UserRole } from '@prisma/client';
import type { LayoutServerLoad } from './$types';
import { HttpStatus } from '$lib/constants/error';
import { error, redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ locals }) => {
	if (!locals.session.user) redirect(303, '/?signin=true');

    if (locals.session.user.role !== UserRole.ADMIN && locals.session.user.role !== UserRole.SUPER_ADMIN) {
        error(HttpStatus.FORBIDDEN);
    }

	return {};
};