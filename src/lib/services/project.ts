import { prisma } from "$lib/storage/db";
import type { SessionUser } from "./session";
import { ApiError } from "$lib/utils/api-error";
import { HttpStatus } from "$lib/constants/error";
import { MAX_PROJECT_TITLE_LENGTH } from "$lib/constants/project";

export interface ICreateProjectRequest {
    title: string;
    notes: string;
}

export interface IUpdateProjectRequest {
    id: number;
    title?: string;
    description?: string;
    completed?: boolean;
}

interface IGetOptions {
    includeCompleted: boolean;
}

interface IGetProjectQuery {
    id?: number;
    ownerId: number;
    completed?: boolean;
}

const defaultGetOptions: IGetOptions = {
    includeCompleted: false,
};

export const deleteProject = async (projectId: number, user: SessionUser) => {
    return prisma.project.delete({
        where: {
            id: projectId,
            ownerId: user.id,
        },
    });
};

export const getProjectById = async (id: number, user: SessionUser) => {
    return prisma.project.findFirst({
        where: {
            id,
            ownerId: user.id,
        },
    });
};

export const getProjects = async (user: SessionUser, options: IGetOptions = defaultGetOptions) => {
    const query: IGetProjectQuery = {
        ownerId: user.id,
    }

    if (!options.includeCompleted) query.completed = false;

    return prisma.project.findMany({
        where: { ...query },
    });
};

export const isValidNewProjectRequest = (project: ICreateProjectRequest) => {
    const errors: ApiError[] = [];

    if (project.title) {
        if (project.title.length > MAX_PROJECT_TITLE_LENGTH) {
            errors.push(new ApiError(`Title must be less than ${MAX_PROJECT_TITLE_LENGTH} characters.`, HttpStatus.UNPROCESSABLE, 'title'));
        }
    } else {
        errors.push(new ApiError('Title is required.', HttpStatus.UNPROCESSABLE, 'title'));
    }

    return errors;
};

export const isValidUpdateProjectRequest = (project: IUpdateProjectRequest) => {
    const errors: ApiError[] = [];

    if (
        !project.title && 
        !project.description && 
        project.completed === undefined
    ) {
        return [new ApiError('No updatable data received.', HttpStatus.UNPROCESSABLE)];
    }

    if (!project.id) {
        return [new ApiError('Project id is required.', HttpStatus.UNPROCESSABLE, 'id')];
    }

    if (project.title) {
        if (project.title.length > MAX_PROJECT_TITLE_LENGTH) {
            errors.push(new ApiError(`Title must be less than ${MAX_PROJECT_TITLE_LENGTH} characters.`, HttpStatus.UNPROCESSABLE, 'title'));
        } 
    } else {
        errors.push(new ApiError('Title is required.', HttpStatus.UNPROCESSABLE, 'title'));
    }

    // TODO: Add validation for description
    // descriptions should have a max length to ensure the database can handle it.

    if (project.completed === undefined) {
        errors.push(new ApiError('Completed status is required.', HttpStatus.UNPROCESSABLE, 'completed'));
    } else if(typeof project.completed !== 'boolean') {
        errors.push(new ApiError('Invalid completed value received.', HttpStatus.UNPROCESSABLE, 'completed'));
    }

    return errors;
};

export const quickCreateProject = async (request: ICreateProjectRequest, user: SessionUser) => {
    const validationErrors = isValidNewProjectRequest(request);

    if (validationErrors.length) throw validationErrors;

    const { title, notes } = request;

    return prisma.$transaction(async (tx) => {
        const project = await tx.project.create({
            data: {
                title,
                notes,
                ownerId: user.id,
            },
        });

        return project;
    });
};

export const updateProject = async (request: IUpdateProjectRequest, user: SessionUser) => {
    const validationErrors = isValidUpdateProjectRequest(request);

    if (validationErrors.length) throw validationErrors;

    const { id, title, description, completed } = request;

    const project = prisma.project.update({
        where: {
            id,
            ownerId: user.id,
        },
        data: {
            title,
            completed,
            notes: description,
        },
    });

    if (!project) throw new ApiError(`Project not found.`, HttpStatus.NOT_FOUND, 'project', { project: id });

    return project;
};