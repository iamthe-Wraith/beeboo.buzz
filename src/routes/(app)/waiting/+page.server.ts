import { error, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { getTasksByContext } from "$lib/services/task";
import { getContextByRole } from "$lib/services/context";
import { ContextRole, type Context } from "@prisma/client";
import { HttpStatus } from "$lib/constants/error";

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.session.user) redirect(303, '/?signin=true');

    const waitingFor: Context | null = await getContextByRole(ContextRole.WAITING, locals.session.user)

    if (!waitingFor) throw error(HttpStatus.NotFound, 'Waiting context not found.');

    const tasks = await getTasksByContext(waitingFor, locals.session.user);

    return { context: waitingFor, tasks };
};
