import { ApiError } from "$lib/utils/api-error";
import { HttpStatus } from "$lib/constants/error";
import { Service, type IServiceProps } from "./service";
import { ContextRole, type IContextRole } from "../../types/contexts";

export interface IContextRequest {
    name: string;
    description?: string;
    role: keyof IContextRole;
}

export class ContextService extends Service {
    private defaultContexts: IContextRequest[] = [
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
    public static isValidContextRequest = (context: IContextRequest) => {
        if (!context.name) return false;
        
        if (context.role) {
            if (!Object.values(ContextRole).includes(context.role)) return false;
        } else {
            return false;
        }
    
        return true;
    };
    //#endregion

    //#region Public Methods
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
    //#endregion

    //#region Private Methods
    private createManyContexts = async (contexts: IContextRequest[]) => {
        const errors: ApiError[] = [];

        contexts.forEach((c) => {
            if (!ContextService.isValidContextRequest(c)) {
                errors.push(new ApiError('Invalid context.', HttpStatus.UNPROCESSABLE, undefined, { context: c }));
            }
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
