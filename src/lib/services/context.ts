import { ApiError } from "$lib/utils/api-error";
import { HttpStatus } from "$lib/constants/error";
import { Service, type IServiceProps } from "./service";
import { ContextRole, type IContextRole } from "../../types/contexts";
import { MAX_CONTEXT_DESCRIPTION_LENGTH, MAX_CONTEXT_NAME_LENGTH } from "$lib/constants/context";
import dayjs from "dayjs";

export interface ICreateContextRequest {
    name: string;
    description?: string;
    role?: keyof IContextRole;
}

export interface IUpdateContextRequest extends ICreateContextRequest {
    id: number;
}

export class ContextService extends Service {
    private defaultContexts: ICreateContextRequest[] = [
        {
            name: 'Inbox',
            description: 'Everything you capture goes here.',
            role: ContextRole.INBOX,
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

    constructor(props: IServiceProps) {
        super(props);
    }

    //#region Static Methods
    public static isValidContextRequest = (context: ICreateContextRequest | IUpdateContextRequest) => {
        const { name, description, role } = context;
        const errors: ApiError[] = [];

        if (name) {
            if (name.length > MAX_CONTEXT_NAME_LENGTH) {
                errors.push(new ApiError(`Name must be less than ${MAX_CONTEXT_NAME_LENGTH} characters.`, HttpStatus.UNPROCESSABLE, 'name', { context }));
            }
        } else {
            errors.push(new ApiError('Name is required.', HttpStatus.UNPROCESSABLE, 'name', { context }));
        }

        if (description && description.length > MAX_CONTEXT_DESCRIPTION_LENGTH) {
            errors.push(new ApiError(`Description must be less than ${MAX_CONTEXT_DESCRIPTION_LENGTH} characters.`, HttpStatus.UNPROCESSABLE, 'description', { context }));
        }

        if (role) {
            if (!Object.values(ContextRole).includes(role)) {
                errors.push(new ApiError('Invalid role.', HttpStatus.UNPROCESSABLE, 'role', { context }));    
            }
        } else {
            errors.push(new ApiError('Role is required.', HttpStatus.UNPROCESSABLE, 'role', { context }));
        }

        return errors;
    };
    //#endregion

    //#region Public Methods
    public createContext = async (request: ICreateContextRequest) => {
        const errors = ContextService.isValidContextRequest({ ...request, role: ContextRole.NONE });

        if (errors.length) throw errors;

        const { name, description } = request;

        return this.transaction(async (tx) => {
            const [context] = await tx.context.findMany({
                where: { ownerId: this.user.id },
                orderBy: { order: 'desc' },
            });

            const order = (context?.order || 0) + 100.0;

            return tx.context.create({
                data: {
                    name,
                    description: description || '', 
                    role: ContextRole.NONE,
                    order,
                    ownerId: this.user.id,
                    createdAt: dayjs().utc().toDate(),
                    updatedAt: dayjs().utc().toDate(),
                },
            });
        });
    };

    public createDefaultUserContexts = async () => {
        return await this.createManyContexts(this.defaultContexts);
    }

    public getContextById = async (id: number) => {
        return this.transaction(async (tx) => tx.context.findFirst({
            where: {
                ownerId: this.user.id,
                id,
            },
        }));
    }

    public getContextByRole = async (role: keyof IContextRole) => {
        return this.transaction(async (tx) => tx.context.findFirst({
            where: {
                ownerId: this.user.id,
                role,
            },
        }));
    };

    public getContexts = async () => {
        return this.transaction(async (tx) => tx.context.findMany({
            where: { ownerId: this.user.id },
            orderBy: { order: 'asc' },
        }));
    };

    public updateContext = async (request: IUpdateContextRequest) => {
        const errors = ContextService.isValidContextRequest({ ...request, role: ContextRole.NONE });

        if (errors.length) throw errors;

        const { id, name, description } = request;

        return this.transaction(async (tx) => {
            return tx.context.update({
                where: { id, ownerId: this.user.id },
                data: {
                    name,
                    description: description || '',
                    updatedAt: dayjs().utc().toDate(),
                },
            });
        });
    };
    //#endregion

    //#region Private Methods
    private createManyContexts = async (contexts: ICreateContextRequest[]) => {
        let errors: ApiError[] = [];

        contexts.forEach((c) => {
            errors = [
                ...errors,
                ...ContextService.isValidContextRequest(c),
            ];
        });
    
        if (errors.length) throw errors;
    
        return this.transaction(async (tx) => {
            const currentContexts = await tx.context.findMany({
                where: { 
                    ownerId: this.user.id 
                } 
            });

            let order = currentContexts.length ? Math.max(...currentContexts.map(c => c.order)) : 1.0;
    
            return tx.context.createMany({
                data: contexts.map(c => {
                    order += 100.0;
        
                    return {
                        ...c, 
                        order,
                        ownerId: this.user.id
                    }
                }),
            });
        });
    }
    //#endregion
}
