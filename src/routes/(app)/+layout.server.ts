import { ContextService } from '$lib/services/context';
import type { Context } from '@prisma/client';
import type { LayoutServerLoad } from './$types';
import { ApiError, type IApiError } from '$lib/utils/api-error';
import { HttpStatus } from '$lib/constants/error';
import { Logger } from '$lib/services/logger';

export const load: LayoutServerLoad = async ({ locals }) => {
	const errors: IApiError[] = [];
	
	let contexts: Context[] = [];

	if (locals.session.user) {
		const contextService = new ContextService({ user: locals.session.user });

		try {
			contexts = await contextService.getContexts();
		} catch (err) {
			Logger.error(err);
			errors.push(new ApiError('Failed to load contexts.', HttpStatus.SERVER, 'contexts').toJSON());
		}
	}

	return {
		contexts,
		errors,
	};
};