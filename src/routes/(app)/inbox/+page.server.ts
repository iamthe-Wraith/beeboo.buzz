import { error, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { TaskService } from "$lib/services/task";
import { ContextService } from "$lib/services/context";
import { type Context } from "@prisma/client";
import { HttpStatus } from "$lib/constants/error";
import { ContextRole } from "../../../types/contexts";

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.session.user) redirect(303, '/?signin=true');

    const contextService = new ContextService({ user: locals.session.user });
    const inbox: Context | null = await contextService.getContextByRole(ContextRole.INBOX);

    if (!inbox) throw error(HttpStatus.NOT_FOUND, 'Inbox not found.');

    const taskService = new TaskService({ user: locals.session.user });
    const tasks = await taskService.getTasksByContext(inbox);

    return { context: inbox, tasks };
};
