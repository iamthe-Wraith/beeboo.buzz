import { error, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { getTasksByContext } from "$lib/services/task";
import { getContextById } from "$lib/services/context";
import { type Context } from "@prisma/client";
import { HttpStatus } from "$lib/constants/error";

export const load: PageServerLoad = async ({ locals, params }) => {
    if (!locals.session.user) redirect(303, '/?signin=true');

    const contextId = parseInt(params.contextId);

    if (isNaN(contextId)) throw error(HttpStatus.BAD_REQUEST, 'Invalid context id.');

    const context: Context | null = await getContextById(contextId, locals.session.user)

    if (!context) throw error(HttpStatus.NOT_FOUND, `Context with id: ${contextId} not found.`);

    const tasks = await getTasksByContext(context, locals.session.user);

    return { context, tasks };
};
