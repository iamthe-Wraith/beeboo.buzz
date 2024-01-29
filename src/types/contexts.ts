// this must match the ContextRole enum in ./prisma/schema.prisma
export enum ContextRole {
    NONE = 'NONE',
    INBOX = 'INBOX',
    PROJECTS = 'PROJECTS',
    WAITING = 'WAITING',
}