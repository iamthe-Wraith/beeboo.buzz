import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { ApiError } from '$lib/utils/api-error';
import { ApiResponse } from '$lib/utils/api-response';
import { create } from '$lib/services/task';
import { HttpStatus } from '$lib/constants/error';

export const actions: Actions = {
    create: async ({ request, locals }) => {
        if (!locals.session.user) return fail(HttpStatus.Unauthorized, { errors: ['Unauthorized'] });

        const data = await request.formData();
        const title = data.get('title')! as string;
        const notes = data.get('notes')! as string;

        console.log('creating full task: ', title, notes);
    },
    quickCreate: async ({ request, locals }) => {
        if (!locals.session.user) return fail(HttpStatus.Unauthorized, { errors: ['Unauthorized'] });

        const data = await request.formData();
        const title = data.get('title')! as string;
        const notes = data.get('notes')! as string;

        try {
            const task = await create({ title, notes }, locals.session.user);

            return { task };
        } catch (err) {
            const response = new ApiResponse({ errors: ApiError.parse(err) });
            return fail(response.statusCode, { errors: response.errors });
        }
    },
    update: async ({ request, locals }) => {
        if (!locals.session.user) return fail(HttpStatus.Unauthorized, { errors: ['Unauthorized'] });

        const data = await request.formData();
        const title = data.get('title')! as string;
        const notes = data.get('notes')! as string;
        const contextData = JSON.parse(data.get('contextId')! as string);
        const contextId = parseInt(contextData.value);

        console.log('updating task');
        console.log('title: ', title);
        console.log('notes: ', notes);
        console.log('contextId: ', contextId);
    }
};