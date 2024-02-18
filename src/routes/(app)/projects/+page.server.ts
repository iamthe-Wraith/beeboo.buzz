import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { ApiError } from '$lib/utils/api-error';
import { ApiResponse } from '$lib/utils/api-response';
import { HttpStatus } from '$lib/constants/error';
import { ProjectService } from '$lib/services/project';

export const actions: Actions = {
    quickCreate: async ({ request, locals }) => {
        if (!locals.session.user) return fail(HttpStatus.UNAUTHORIZED, { errors: ['Unauthorized'] });

        const data = await request.formData();
        const title = data.get('title')! as string;
        const notes = data.get('notes')! as string;

        try {
            const projectService = new ProjectService({ user: locals.session.user });
            const project = await projectService.quickCreateProject({ title, notes });

            return { project };
        } catch (err) {
            const response = new ApiResponse({ errors: ApiError.parse(err) });
            return fail(response.statusCode, { errors: response.errors });
        }
    },
    delete: async ({ request, locals }) => {
        if (!locals.session.user) return fail(HttpStatus.UNAUTHORIZED, { errors: ['Unauthorized'] });

        try {
            const data = await request.formData();
            if (!data.get('projectId')) throw new ApiError('Project id is required.', HttpStatus.BAD_REQUEST, 'projectId');

            const projectId = parseInt(data.get('projectId')! as string);

            if (isNaN(projectId)) throw new ApiError('Project id must be a number.', HttpStatus.BAD_REQUEST, 'projectId');

            const projectService = new ProjectService({ user: locals.session.user });
            await projectService.deleteProject(projectId);
        } catch (err) {
            const response = new ApiResponse({ errors: ApiError.parse(err) });
            return fail(response.statusCode, { errors: response.errors });
        }

        redirect(303, '/projects');
    },
    update: async ({ request, locals }) => {
        if (!locals.session.user) return fail(HttpStatus.UNAUTHORIZED, { errors: ['Unauthorized'] });

        const data = await request.formData();
        const id = parseInt(data.get('id')! as string);
        const title = data.get('title')! as string;
        const description = data.get('description')! as string;
        const completed = data.get('completed') === 'true';

        const updateData = {
            id, 
            title, 
            description, 
            completed
        };

        try {
            const projectService = new ProjectService({ user: locals.session.user });
            const project = await projectService.updateProject(updateData);

            return { project };
        } catch (err) {
            const response = new ApiResponse({ errors: ApiError.parse(err) });
            return fail(response.statusCode, { errors: response.errors });
        }
    },
};

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.session.user) redirect(303, '/?signin=true');

    const projectService = new ProjectService({ user: locals.session.user });
    const projects = await projectService.getProjects();

    return { projects };
};