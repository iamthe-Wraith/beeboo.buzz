import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { signup } from '$lib/services/user';

export const actions: Actions = {
	signup: async ({ request }) => {
		const data = await request.formData();
		const email = data.get('email')!;
        const username = data.get('username')!;
		const password = data.get('password')!;

        const res = await signup({
            email: (email || '') as string, 
            username: (username || '') as string, 
            password: (password || '') as string 
        });

        if (res.success) {
            // TODO: create session in Redis

            // TODO: send email confirmation

            // TODO: pass user data back in response

            redirect(302, '/dashboard');
        } else {
            return fail(res.statusCode || 400, res.errors || {});
        }
	},
};