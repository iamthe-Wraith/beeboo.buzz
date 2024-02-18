import { ContextRole, type Context } from "@prisma/client";
import { ContextService } from "./context";
import { ApiError } from "$lib/utils/api-error";
import { HttpStatus } from "$lib/constants/error";
import dayjs from "dayjs";
import { MAX_TASK_TITLE_LENGTH } from "$lib/constants/task";
import { Service, type IServiceProps } from "./service";

interface IGetOptions {
    includeCompleted: boolean;
    includeInactive: boolean;
}

interface ICreateTaskRequest {
    title: string;
    description?: string;
    contextId?: number;
    isActive?: boolean;
}

interface IUpdateTaskRequest {
    id: number;
    title?: string;
    description?: string;
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

const defaultGetOptions: IGetOptions = {
    includeCompleted: false,
    includeInactive: false,
};

export class TaskService extends Service {
    constructor(props: IServiceProps) {
        super(props);
    }

    //#region Static Methods
    public static isValidNewTaskRequest = (task: ICreateTaskRequest) => {
        const errors: ApiError[] = [];
    
        if (task.title) {
            if (task.title.length > MAX_TASK_TITLE_LENGTH) {
                errors.push(new ApiError(`Title must be less than ${MAX_TASK_TITLE_LENGTH} characters.`, HttpStatus.UNPROCESSABLE, 'title'));
            }
        } else {
            errors.push(new ApiError('Title is required.', HttpStatus.UNPROCESSABLE, 'title'));
        }
    
        if (task.contextId) {
            const contextId = parseInt(task.contextId as unknown as string);
            if (isNaN(contextId)) {
                errors.push(new ApiError('Context id must be a number.', HttpStatus.UNPROCESSABLE, 'contextId'));
            }
        }
    
        if (task.isActive !== undefined && typeof task.isActive !== 'boolean') {
            errors.push(new ApiError('Invalid isActive value received.', HttpStatus.UNPROCESSABLE, 'isActive'));
        }
    
        return errors;
    };

    public static isValidUpdateTaskRequest = (task: IUpdateTaskRequest) => {
        const errors: ApiError[] = [];
    
        if (
            !task.title && 
            !task.description && 
            !task.contextId && 
            task.completed === undefined
        ) {
            errors.push(new ApiError('No updatable data received.', HttpStatus.UNPROCESSABLE));
        }
    
        if (task.title) {
            if (task.title.length > MAX_TASK_TITLE_LENGTH) {
                errors.push(new ApiError(`Title must be less than ${MAX_TASK_TITLE_LENGTH} characters.`, HttpStatus.UNPROCESSABLE, 'title'));
            } 
        }
    
        if (task.contextId) {
            const contextId = parseInt(task.contextId as unknown as string);
            if (isNaN(contextId)) {
                errors.push(new ApiError('Context id must be a number.', HttpStatus.UNPROCESSABLE, 'contextId'));
            }
        }
    
        if (task.completed !== undefined && typeof task.completed !== 'boolean') {
            errors.push(new ApiError('Invalid completed value received.', HttpStatus.UNPROCESSABLE, 'completed'));
        }
    
        if (task.isActive !== undefined && typeof task.isActive !== 'boolean') {
            errors.push(new ApiError('Invalid isActive value received.', HttpStatus.UNPROCESSABLE, 'isActive'));
        }
    
        return errors;
    };
    //#endregion

    //#region Public Methods
    public getTaskById = (id: number, options: IGetOptions = defaultGetOptions) => {
        const query: IGetTaskQuery = {
            id,
            ownerId: this.user.id,
            completed: !!options.includeCompleted,
        };
    
        if (!options.includeInactive) query.isActive = true;
    
        return this.transaction(async (tx) => tx.task.findMany({
            where: { ...query },
        }));
    };

    public getTasksByContext = (context: Context, options: IGetOptions = defaultGetOptions) => {
        const query: IGetTaskQuery = {
            ownerId: this.user.id,
            contextId: context.id,
            completed: !!options.includeCompleted,
        };
    
        if (!options.includeInactive) query.isActive = true;
    
        return this.transaction(async(tx) => tx.task.findMany({
            where: { ...query },
        }));
    };

    public quickCreateTask = async (request: ICreateTaskRequest) => {
        const validationErrors = TaskService.isValidNewTaskRequest(request);
    
        if (validationErrors.length) throw validationErrors;
    
        const { title, description, contextId } = request;

        return this.transaction(async (tx) => {
            const contextService = new ContextService({ user: this.user, tx });
            const userContexts = await contextService.getContexts();
            let context: Context | undefined;
    
            if (contextId) {
                context = userContexts.find((c) => c.id === contextId);
                if (!context) throw new ApiError(`Context with id: ${contextId} not found.`, HttpStatus.NOT_FOUND, 'context', { context: contextId });
            } else {
                context = userContexts.find((c) => c.role === ContextRole.INBOX);
                if (!context) throw new ApiError('Inbox not found.', HttpStatus.NOT_FOUND, 'context');
            }
    
            const task = await tx.task.create({
                data: {
                    title,
                    description,
                    ownerId: this.user.id,
                    contextId: context.id,
                },
            });
    
            return task;
        });
    };

    public updateTask = async (request: IUpdateTaskRequest) => {
        const validationErrors = TaskService.isValidUpdateTaskRequest(request);
    
        if (validationErrors.length) throw validationErrors;
    
        const { id, title, description, contextId, completed, isActive } = request;
    
        return this.transaction(async (tx) => {
            let context: Context | null = null;
    
            if (contextId) {
                const contextService = new ContextService({ user: this.user, tx });
                context = await contextService.getContextById(contextId);
                if (!context) throw new ApiError(`Context not found.`, HttpStatus.NOT_FOUND, 'context', { context: contextId });
            }
    
            const data: {
                title?: string;
                description?: string;
                contextId?: number;
                completed?: boolean;
                isActive?: boolean;
            } = {};
    
            if (title) data.title = title;
            if (description) data.description = description;
            if (context) data.contextId = context.id;
            if (completed !== undefined) data.completed = !!completed;
            if (isActive !== undefined) data.isActive = !!isActive;
    
            const task = await tx.task.update({
                where: { id, ownerId: this.user.id },
                data: {
                    ...data,
                    updatedAt: dayjs().utc().toDate(),
                },
            });
    
            if (!task) throw new ApiError(`Task not found.`, HttpStatus.NOT_FOUND, 'task', { task: id });
    
            return task;
        });
    };
    //#endregion
}