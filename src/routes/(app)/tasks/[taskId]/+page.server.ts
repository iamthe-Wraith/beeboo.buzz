import { error, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { HttpStatus } from "$lib/constants/error";
import { TaskService } from "$lib/services/task";

export const load: PageServerLoad = async ({ locals, params }) => {
    if (!locals.session.user) redirect(303, '/?signin=true');

    const taskId = parseInt(params.taskId);

    if (isNaN(taskId)) error(HttpStatus.BAD_REQUEST, { message: 'Invalid task id.' });

    const taskService = new TaskService({ user: locals.session.user });
    const task = await taskService.getTaskById(taskId, { includeCompleted: true });

    if (!task) error(HttpStatus.NOT_FOUND, { message: 'Task not found.' });

    return { task };
};
