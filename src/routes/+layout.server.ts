import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals }) => {
	console.log('user', locals.session.user);

	return {
		user: locals.session.user,
		featureFlags: locals.featureFlags,
	};
};