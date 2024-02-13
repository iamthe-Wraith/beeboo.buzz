import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { ApiError } from '$lib/utils/api-error';
import { ApiResponse } from '$lib/utils/api-response';
import { quickCreateTask, updateTask } from '$lib/services/task';
import { HttpStatus } from '$lib/constants/error';

export const actions: Actions = {
    create: async ({ request, locals }) => {
        if (!locals.session.user) return fail(HttpStatus.UNAUTHORIZED, { errors: ['Unauthorized'] });

        const data = await request.formData();
        const title = data.get('title')! as string;
        const notes = data.get('notes')! as string;

        console.log('creating full task: ', title, notes);
    },
    quickCreate: async ({ request, locals }) => {
        if (!locals.session.user) return fail(HttpStatus.UNAUTHORIZED, { errors: ['Unauthorized'] });

        const data = await request.formData();
        const title = data.get('title')! as string;
        const notes = data.get('notes')! as string;

        try {
            const task = await quickCreateTask({ title, notes }, locals.session.user);

            return { task };
        } catch (err) {
            const response = new ApiResponse({ errors: ApiError.parse(err) });
            return fail(response.statusCode, { errors: response.errors });
        }
    },
    update: async ({ request, locals }) => {
        if (!locals.session.user) return fail(HttpStatus.UNAUTHORIZED, { errors: ['Unauthorized'] });

        const data = await request.formData();
        const id = parseInt(data.get('id')! as string);
        const title = data.get('title')! as string;
        const notes = data.get('notes')! as string;
        const completed = data.get('completed') === 'true';
        const rawContextData = data.get('contextId')! as string;
        let contextId: number | undefined = undefined;
        if (rawContextData) {
            const contextData = JSON.parse(rawContextData);
            contextId = parseInt(contextData.value);
        }

        try {
            const task = await updateTask({
                id, 
                title, 
                notes, 
                completed,
                contextId
            }, locals.session.user);
            return { task };
        } catch (err) {
            const response = new ApiResponse({ errors: ApiError.parse(err) });
            return fail(response.statusCode, { errors: response.errors });
        }
    }
};