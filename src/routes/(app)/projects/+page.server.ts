import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { ApiError } from '$lib/utils/api-error';
import { ApiResponse } from '$lib/utils/api-response';
import { HttpStatus } from '$lib/constants/error';
import { getProjects, quickCreateProject } from '$lib/services/project';

export const actions: Actions = {
    quickCreate: async ({ request, locals }) => {
        if (!locals.session.user) return fail(HttpStatus.Unauthorized, { errors: ['Unauthorized'] });

        const data = await request.formData();
        const title = data.get('title')! as string;
        const notes = data.get('notes')! as string;

        try {
            const project = await quickCreateProject({ title, notes }, locals.session.user);

            return { project };
        } catch (err) {
            const response = new ApiResponse({ errors: ApiError.parse(err) });
            return fail(response.statusCode, { errors: response.errors });
        }
    },
};

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.session.user) redirect(303, '/?signin=true');

    const projects = await getProjects(locals.session.user);

    return { projects };
};