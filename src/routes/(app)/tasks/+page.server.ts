import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { ApiError } from '$lib/utils/api-error';
import { ApiResponse } from '$lib/utils/api-response';
import { TaskService } from '$lib/services/task';
import { HttpStatus } from '$lib/constants/error';
import { ContextRole, type Context } from '@prisma/client';
import { ContextService } from '$lib/services/context';

export const actions: Actions = {
    create: async ({ request, locals }) => {
        if (!locals.session.user) return fail(HttpStatus.UNAUTHORIZED, { errors: ['Unauthorized'] });

        const data = await request.formData();
        const title = data.get('title')! as string;
        const description = data.get('description')! as string;

        console.log('creating full task: ', title, description);
    },
    delete: async ({ request, locals }) => {
        if (!locals.session.user) return fail(HttpStatus.UNAUTHORIZED, { errors: ['Unauthorized'] });
        
        let context: Context;

        try {
            const data = await request.formData();
            if (!data.get('taskId')) throw new ApiError('Task id is required.', HttpStatus.BAD_REQUEST, 'projectId');

            const taskId = parseInt(data.get('taskId')! as string);

            if (isNaN(taskId)) throw new ApiError('Project id must be a number.', HttpStatus.BAD_REQUEST, 'projectId');

            const contextService = new ContextService({ user: locals.session.user });
            const contexts = await contextService.getContexts();

            const taskService = new TaskService({ user: locals.session.user });
            const task = await taskService.deleteTask(taskId);

            context = contexts.find(c => c.id === task.contextId)!;
        } catch (err) {
            const response = new ApiResponse({ errors: ApiError.parse(err) });
            return fail(response.statusCode, { errors: response.errors });
        }

        if (context) {
            if (context.role === ContextRole.NONE) {
                redirect(303, `/contexts/${context.id}`);
            } else {
                redirect(303, `/${context.role.toLowerCase()}`);
            }
        } else {
            redirect(303, '/inbox');
        }
    },
    quickCreate: async ({ request, locals }) => {
        if (!locals.session.user) return fail(HttpStatus.UNAUTHORIZED, { errors: ['Unauthorized'] });

        const data = await request.formData();
        const title = data.get('title')! as string;
        const description = data.get('description')! as string;

        try {
            const taskService = new TaskService({ user: locals.session.user });
            const task = await taskService.quickCreateTask({ title, description });

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
        const description = data.get('description')! as string;
        const completed = data.get('completed') === 'true';
        const rawContextData = data.get('contextId')! as string;
        let contextId: number | undefined = undefined;
        if (rawContextData) {
            const contextData = JSON.parse(rawContextData);
            contextId = parseInt(contextData.value);
        }

        try {
            const taskService = new TaskService({ user: locals.session.user });
            const task = await taskService.updateTask({
                id, 
                title, 
                description, 
                completed,
                contextId
            });
            return { task };
        } catch (err) {
            const response = new ApiResponse({ errors: ApiError.parse(err) });
            return fail(response.statusCode, { errors: response.errors });
        }
    }
};