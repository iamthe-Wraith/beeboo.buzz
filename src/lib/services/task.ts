import { prisma } from "$lib/storage/db";
import { ContextRole, type Context } from "@prisma/client";
import { getContexts } from "./context";
import type { SessionUser } from "./session";
import { ApiError } from "$lib/utils/api-error";
import { HttpStatus } from "$lib/constants/error";

interface ICreateTaskRequest {
    title: string;
    notes: string;
    contextId?: string;
}

export const create = async (request: ICreateTaskRequest, user: SessionUser) => {
    const validationError = isValidNewTaskRequest(request);

    if (validationError) throw validationError;

    const { title, notes, contextId } = request;

    return prisma.$transaction(async (tx) => {
        const userContexts = await getContexts(user, tx);

        let context: Context | undefined;

        if (contextId) {
            context = userContexts.find((c) => c.id === parseInt(contextId));
            if (!context) throw new ApiError(`Context with id: ${contextId} not found.`, HttpStatus.NotFound, 'context', { context: contextId });
        } else {
            context = userContexts.find((c) => c.role === ContextRole.INBOX);
            if (!context) throw new ApiError('Inbox not found.', HttpStatus.NotFound, 'context');
        }

        const task = await prisma.task.create({
            data: {
                title,
                notes,
                ownerId: user.id,
                contextId: context?.id,
            },
        });

        return task;
    });
};

const isValidNewTaskRequest = (task: ICreateTaskRequest) => {
    if (!task.title) return new ApiError('Title is required.', HttpStatus.Unprocessable, 'title');

    if (task.contextId) {
        const contextId = parseInt(task.contextId);
        if (isNaN(contextId)) return new ApiError('Context id must be a number.', HttpStatus.Unprocessable, 'contextId');
    }

    return null;
};