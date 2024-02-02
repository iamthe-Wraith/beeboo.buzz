import { prisma } from "$lib/storage/db";
import { ContextRole, type User } from "@prisma/client";
import type { PrismaTransaction } from "../../types/prisma";
import { ApiError } from "$lib/utils/api-error";
import { HttpStatus } from "$lib/constants/error";
import type { SessionUser } from "./session";

export interface IContextRequest {
    name: string;
    description?: string;
    role: ContextRole;
}

export const createDefaultUserContexts = async (user: User, ptx?: PrismaTransaction) => {
    const defaultContexts: IContextRequest[] = [
        {
            name: 'Inbox',
            description: 'Everything you capture goes here.',
            role: ContextRole.INBOX,
        },
        {
            name: 'Projects',
            description: 'Big or small, this is a place for all your projects.',
            role: ContextRole.PROJECTS,
        },
        {
            name: 'Waiting For',
            description: 'Put all those things you\'re waiting on (but not doing yourself) here.',
            role: ContextRole.WAITING,
        },
        {
            name: 'At Home',
            description: 'Stuff to do when you\'re at home.',
            role: ContextRole.NONE,
        },
        {
            name: 'At Work',
            description: 'Stuff to do when you\'re at work.',

            role: ContextRole.NONE,
        },
        {
            name: 'At Computer',
            description: 'Stuff to do when you\'re sitting at the computer.',
            role: ContextRole.NONE,
        },
        {
            name: 'Anywhere',
            description: 'Stuff to do when you\'re out and about.',

            role: ContextRole.NONE,
        },
        {
            name: 'Phone Calls',
            description: 'Phone calls you need to make.',
            role: ContextRole.NONE,
        },
    ];

    if (ptx) return await createManyContexts(defaultContexts, user, ptx);

    return await (ptx || prisma.$transaction)(async (tx) => {
        return await createManyContexts(defaultContexts, user, tx);
    });
};

export const createManyContexts = async (contexts: IContextRequest[], user: User, ptx: PrismaTransaction) => {
    const errors: ApiError[] = [];

    contexts.forEach((c) => {
        if (!isValidContextRequest(c)) {
            errors.push(new ApiError('Invalid context.', HttpStatus.UNPROCESSABLE, undefined, { context: c }));
        }
    });

    if (errors.length) throw errors;

    const currentContexts = await ptx.context.findMany({
        where: { 
            ownerId: user.id 
        } 
    });

    let order = currentContexts.length ? Math.max(...currentContexts.map(c => c.order)) : 1.0;

    return ptx.context.createMany({
        data: contexts.map(c => {
            order += 100.0;

            return {
                ...c, 
                order,
                ownerId: user.id
            }
        }),
    });
};

export const getContextById = async (id: number, user: SessionUser, tx?: PrismaTransaction) => {
    return await (tx || prisma).context.findFirst({
        where: {
            ownerId: user.id,
            id,
        },
    });
};

export const getContextByRole = async (role: ContextRole, user: SessionUser, tx?: PrismaTransaction) => {
    return await (tx || prisma).context.findFirst({
        where: {
            ownerId: user.id,
            role,
        },
    });
};

export const getContexts = async (user: SessionUser, tx?: PrismaTransaction) => {
    return await (tx || prisma).context.findMany({
        where: { ownerId: user.id },
        orderBy: { order: 'asc' },
    });
};

export const isValidContextRequest = (context: IContextRequest) => {
    if (!context.name) return false;
    
    if (context.role) {
        if (!Object.values(ContextRole).includes(context.role)) return false;
    } else {
        return false;
    }

    return true;
};