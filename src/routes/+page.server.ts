import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { signin, signup } from '$lib/services/auth';
import { ApiError } from '$lib/utils/api-error';
import { ApiResponse } from '$lib/utils/api-response';
import { Session } from '$lib/services/session';

export const actions: Actions = {
    signin: async ({ request, cookies }) => {
        const data = await request.formData();
        const emailOrUsername = data.get('email_or_username')!;
        const password = data.get('password')!;

        try {
            const user = await signin({
                emailOrUsername: (emailOrUsername || '') as string, 
                password: (password || '') as string 
            });

            const session = new Session();
            await session.save(user);
            session.setCookie(cookies);
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
		const data = await request.formData();
		const email = data.get('email')!;
        const username = data.get('username')!;
		const password = data.get('password')!;

        try {
            const user = await signup({
                email: (email || '') as string, 
                username: (username || '') as string, 
                password: (password || '') as string 
            });

            const session = new Session();
            await session.save(user);
            session.setCookie(cookies);

            // TODO: send email verification
        } catch (err) {
            const response = new ApiResponse({ errors: ApiError.parse(err) });
            return fail(response.statusCode, { errors: response.errors });
        }
	},
};