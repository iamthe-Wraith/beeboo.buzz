import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { AuthService } from '$lib/services/auth';
import { ApiError } from '$lib/utils/api-error';
import { ApiResponse } from '$lib/utils/api-response';

export const actions: Actions = {
    signin: async ({ request, cookies }) => {
        const authService = new AuthService(cookies);

        const data = await request.formData();
        const emailOrUsername = data.get('email_or_username')! as string;
        const password = data.get('password')! as string;

        try {
            await authService.signin({ emailOrUsername, password });
        } catch (err) {
            const response = new ApiResponse({ errors: ApiError.parse(err) });
            return fail(response.statusCode, { errors: response.errors });
        }
    },
    signout: async ({ locals, cookies }) => {
        locals.session?.delete(cookies);
        return redirect(302, '/');
    },
	signup: async ({ request, cookies }) => {
        const authService = new AuthService(cookies);

		const data = await request.formData();
		const email = data.get('email')! as string;
        const username = data.get('username')! as string;
		const password = data.get('password')! as string;

        try {
            await authService.signup({ email, username, password });
        } catch (err) {
            const response = new ApiResponse({ errors: ApiError.parse(err) });
            return fail(response.statusCode, { errors: response.errors });
        }
	},
};