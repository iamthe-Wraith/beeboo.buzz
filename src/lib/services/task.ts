import { prisma } from "$lib/storage/db";
import { ContextRole, type Context } from "@prisma/client";
import { getContextById, getContexts } from "./context";
import type { SessionUser } from "./session";
import { ApiError } from "$lib/utils/api-error";
import { HttpStatus } from "$lib/constants/error";
import dayjs from "dayjs";

interface IGetOptions {
    includeCompleted: boolean;
    includeInactive: boolean;
}

interface ICreateTaskRequest {
    title: string;
    notes: string;
    contextId?: number;
    isActive?: boolean;
}

interface IUpdateTaskRequest {
    id: number;
    title?: string;
    notes?: string;
    completed?: boolean;
    contextId?: number;
    isActive?: boolean;
}

interface IGetTaskQuery {
    id?: number;
    ownerId: number;
    completed?: boolean;
    contextId?: number;
    isActive?: boolean;
}

const MAX_TITLE_LENGTH = 100;

const defaultGetOptions: IGetOptions = {
    includeCompleted: false,
    includeInactive: false,
};

export const getTaskById = (id: number, user: SessionUser, options: IGetOptions = defaultGetOptions) => {
    const query: IGetTaskQuery = {
        id,
        ownerId: user.id,
        completed: !!options.includeCompleted,
    };

    if (!options.includeInactive) query.isActive = true;

    return prisma.task.findMany({
        where: { ...query },
    });
};

export const getTasksByContext = (context: Context, user: SessionUser, options: IGetOptions = defaultGetOptions) => {
    const query: IGetTaskQuery = {
        ownerId: user.id,
        contextId: context.id,
        completed: !!options.includeCompleted,
    };

    if (!options.includeInactive) query.isActive = true;

    return prisma.task.findMany({
        where: { ...query },
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

    if (task.isActive !== undefined && typeof task.isActive !== 'boolean') {
        errors.push(new ApiError('Invalid isActive value received.', HttpStatus.Unprocessable, 'isActive'));
    }

    return errors;
};

export const isValidUpdateTaskRequest = (task: IUpdateTaskRequest) => {
    const errors: ApiError[] = [];

    if (
        !task.title && 
        !task.notes && 
        !task.contextId && 
        task.completed === undefined
    ) {
        errors.push(new ApiError('No updatable data received.', HttpStatus.Unprocessable));
    }

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

    if (task.completed !== undefined && typeof task.completed !== 'boolean') {
        errors.push(new ApiError('Invalid completed value received.', HttpStatus.Unprocessable, 'completed'));
    }

    if (task.isActive !== undefined && typeof task.isActive !== 'boolean') {
        errors.push(new ApiError('Invalid isActive value received.', HttpStatus.Unprocessable, 'isActive'));
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

        const task = await tx.task.create({
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

    const { id, title, notes, contextId, completed, isActive } = request;

    return prisma.$transaction(async (tx) => {
        let context: Context | null = null;

        if (contextId) {
            context = await getContextById(contextId, user, tx);
            if (!context) throw new ApiError(`Context not found.`, HttpStatus.NotFound, 'context', { context: contextId });
        }

        const data: {
            title?: string;
            notes?: string;
            contextId?: number;
            completed?: boolean;
            isActive?: boolean;
        } = {};

        if (title) data.title = title;
        if (notes) data.notes = notes;
        if (context) data.contextId = context.id;
        if (completed !== undefined) data.completed = !!completed;
        if (isActive !== undefined) data.isActive = !!isActive;

        const task = await tx.task.update({
            where: { id, ownerId: user.id },
            data: {
                ...data,
                updatedAt: dayjs().utc().toDate(),
            },
        });

        if (!task) throw new ApiError(`Task not found.`, HttpStatus.NotFound, 'task', { task: id });

        return task;
    });
};