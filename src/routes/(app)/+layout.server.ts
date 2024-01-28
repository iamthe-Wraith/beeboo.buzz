import { getContexts } from '$lib/services/context';
import type { Context } from '@prisma/client';
import type { LayoutServerLoad } from './$types';
import { ApiError, type IApiError } from '$lib/utils/api-error';
import { HttpStatus } from '$lib/constants/error';
import { Logger } from '$lib/services/logger';

export const load: LayoutServerLoad = async ({ locals }) => {
	const errors: IApiError[] = [];
	
	let contexts: Context[] = [];

	if (locals.session.user) {
		try {
			contexts = await getContexts(locals.session.user);
		} catch (err) {
			Logger.error(err);
			errors.push(new ApiError('Failed to load contexts.', HttpStatus.INTERNAL_SERVER_ERROR, 'contexts').toJSON());
		}
	}

	return {
		user: locals.session.user,
		contexts,
		errors,
	};
};