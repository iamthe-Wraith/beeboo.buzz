import { error, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { getTasks } from "$lib/services/task";
import { getContextByRole } from "$lib/services/context";
import { ContextRole, type Context } from "@prisma/client";
import { HttpStatus } from "$lib/constants/error";

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.session.user) redirect(303, '/?signin=true');

    const inbox: Context | null = await getContextByRole(ContextRole.INBOX, locals.session.user)

    if (!inbox) throw error(HttpStatus.NotFound, 'Inbox not found.');

    const tasks = await getTasks(inbox, locals.session.user);

    return { context: inbox, tasks };
};
