import { prisma } from "$lib/storage/db";
import type { SessionUser } from "./session";
import { ApiError } from "$lib/utils/api-error";
import { HttpStatus } from "$lib/constants/error";

interface ICreateProjectRequest {
    title: string;
    notes: string;
}

interface IGetOptions {
    includeCompleted: boolean;
}

interface IGetProjectQuery {
    id?: number;
    ownerId: number;
    completed?: boolean;
}

const MAX_TITLE_LENGTH = 100;

const defaultGetOptions: IGetOptions = {
    includeCompleted: false,
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
        if (project.title.length > MAX_TITLE_LENGTH) {
            errors.push(new ApiError(`Title must be less than ${MAX_TITLE_LENGTH} characters.`, HttpStatus.Unprocessable, 'title'));
        }
    } else {
        errors.push(new ApiError('Title is required.', HttpStatus.Unprocessable, 'title'));
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