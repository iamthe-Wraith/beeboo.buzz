import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, params }) => {
    if (!locals.session.user) redirect(303, '/?signin=true');

    return {
        contextId: parseInt(params.contextId) + 1000,
        dummy: 'this is a dummy message.',
    }
};
