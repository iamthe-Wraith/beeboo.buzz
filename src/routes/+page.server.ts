import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { signup } from '$lib/services/user';
import { ApiError } from '$lib/utils/api-error';
import { ApiResponse } from '$lib/utils/api-response';

export const actions: Actions = {
	signup: async ({ request }) => {
		const data = await request.formData();
		const email = data.get('email')!;
        const username = data.get('username')!;
		const password = data.get('password')!;

        try {
            await signup({
                email: (email || '') as string, 
                username: (username || '') as string, 
                password: (password || '') as string 
            });

            // the user session work will be handled in https://github.com/iamthe-Wraith/oh-my-gtd/issues/27

            // TODO: send email verification
        } catch (err) {
            const response = new ApiResponse({ errors: ApiError.parse(err) });
            return fail(response.statusCode, { errors: response.errors });
        }

        redirect(302, '/dashboard');
	},
};