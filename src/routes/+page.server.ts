import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { signup } from '$lib/services/auth';
import { ApiError } from '$lib/utils/api-error';
import { ApiResponse } from '$lib/utils/api-response';
import { Session } from '$lib/services/session';

export const actions: Actions = {
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