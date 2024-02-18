import { error, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { getTasksByContext } from "$lib/services/task";
import { ContextService } from "$lib/services/context";
import { ContextRole, type Context } from "@prisma/client";
import { HttpStatus } from "$lib/constants/error";

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.session.user) redirect(303, '/?signin=true');

    const contextService = new ContextService({ user: locals.session.user });
    const waitingFor: Context | null = await contextService.getContextByRole(ContextRole.WAITING);

    if (!waitingFor) throw error(HttpStatus.NOT_FOUND, 'Waiting context not found.');

    const tasks = await getTasksByContext(waitingFor, locals.session.user);

    return { context: waitingFor, tasks };
};
