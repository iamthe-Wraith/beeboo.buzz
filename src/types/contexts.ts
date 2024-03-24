// !IMPORTANT this must match the ContextRole enum in ./prisma/schema.prisma
export interface IContextRole {
    NONE: 'NONE';
    INBOX: 'INBOX';
    WAITING: 'WAITING';
}

export const ContextRole: IContextRole = {
    NONE: 'NONE',
    INBOX: 'INBOX',
    WAITING: 'WAITING',
}
// !END IMPORTANT