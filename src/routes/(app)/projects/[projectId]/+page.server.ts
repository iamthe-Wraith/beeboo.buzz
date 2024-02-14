import { error, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { HttpStatus } from "$lib/constants/error";
import { getProjectById } from "$lib/services/project";

export const load: PageServerLoad = async ({ locals, params }) => {
    if (!locals.session.user) redirect(303, '/?signin=true');

    const projectId = parseInt(params.projectId);

    if (isNaN(projectId)) error(HttpStatus.BAD_REQUEST, { message: 'Invalid project id.' });

    const project = await getProjectById(projectId, locals.session.user);

    if (!project) error(HttpStatus.NOT_FOUND, { message: 'Project not found.' });

    return { project };
};
