import { error, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { TaskService } from "$lib/services/task";
import { ContextService } from "$lib/services/context";
import { HttpStatus } from "$lib/constants/error";
import { ContextRole } from "../../../types/contexts";
import type { Context } from "@prisma/client";

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.session.user) redirect(303, '/?signin=true');

    const contextService = new ContextService({ user: locals.session.user });
    const waitingFor: Context | null = await contextService.getContextByRole(ContextRole.WAITING);

    if (!waitingFor) throw error(HttpStatus.NOT_FOUND, 'Waiting context not found.');

    const taskService = new TaskService({ user: locals.session.user });
    const tasks = await taskService.getTasksByContext(waitingFor);

    return { context: waitingFor, tasks };
};
