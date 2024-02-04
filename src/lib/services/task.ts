import { prisma } from "$lib/storage/db";
import { ContextRole, type Context } from "@prisma/client";
import { getContextById, getContexts } from "./context";
import type { SessionUser } from "./session";
import { ApiError } from "$lib/utils/api-error";
import { HttpStatus } from "$lib/constants/error";

interface ICreateTaskRequest {
    title: string;
    notes: string;
    contextId?: number;
}

interface IUpdateTaskRequest {
    id: number;
    title?: string;
    notes?: string;
    contextId?: number;
}

const MAX_TITLE_LENGTH = 100;

export const getTaskById = (id: number, user: SessionUser) => {
    return prisma.task.findMany({
        where: {
            id,
            ownerId: user.id,
        },
    });
};

export const getTasksByContext = (context: Context, user: SessionUser) => {
    return prisma.task.findMany({
        where: {
            contextId: context.id,
            ownerId: user.id,
        },
    });
};

export const isValidNewTaskRequest = (task: ICreateTaskRequest) => {
    const errors: ApiError[] = [];

    if (task.title) {
        if (task.title.length > MAX_TITLE_LENGTH) {
            errors.push(new ApiError(`Title must be less than ${MAX_TITLE_LENGTH} characters.`, HttpStatus.Unprocessable, 'title'));
        }
    } else {
        errors.push(new ApiError('Title is required.', HttpStatus.Unprocessable, 'title'));
    }

    if (task.contextId) {
        const contextId = parseInt(task.contextId as unknown as string);
        if (isNaN(contextId)) {
            errors.push(new ApiError('Context id must be a number.', HttpStatus.Unprocessable, 'contextId'));
        }
    }

    return errors;
};

export const isValidUpdateTaskRequest = (task: IUpdateTaskRequest) => {
    const errors: ApiError[] = [];

    if (task.title) {
        if (task.title.length > MAX_TITLE_LENGTH) {
            errors.push(new ApiError(`Title must be less than ${MAX_TITLE_LENGTH} characters.`, HttpStatus.Unprocessable, 'title'));
        } 
    }

    if (task.contextId) {
        const contextId = parseInt(task.contextId as unknown as string);
        if (isNaN(contextId)) {
            errors.push(new ApiError('Context id must be a number.', HttpStatus.Unprocessable, 'contextId'));
        }
    }

    return errors;
};

export const quickCreateTask = async (request: ICreateTaskRequest, user: SessionUser) => {
    const validationErrors = isValidNewTaskRequest(request);

    if (validationErrors.length) throw validationErrors;

    const { title, notes, contextId } = request;

    return prisma.$transaction(async (tx) => {
        const userContexts = await getContexts(user, tx);
        let context: Context | undefined;

        if (contextId) {
            context = userContexts.find((c) => c.id === contextId);
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
                contextId: context.id,
            },
        });

        return task;
    });
};

export const updateTask = async (request: IUpdateTaskRequest, user: SessionUser) => {
    const validationErrors = isValidUpdateTaskRequest(request);

    if (validationErrors.length) throw validationErrors;

    const { id, title, notes, contextId } = request;

    return prisma.$transaction(async (tx) => {
        let context: Context | null = null;

        if (contextId) {
            context = await getContextById(contextId, user, tx);
            if (!context) throw new ApiError(`Context not found.`, HttpStatus.NotFound, 'context', { context: contextId });
        }

        const task = await prisma.task.update({
            where: { id, ownerId: user.id },
            data: {
                title,
                notes,
                contextId: context?.id,
            },
        });

        if (!task) throw new ApiError(`Task not found.`, HttpStatus.NotFound, 'task', { task: id });

        return task;
    });
};