// !IMPORTANT this must match the AccountType and UserRole enums in ./prisma/schema.prisma
export const AccountType = {
    FREE: 'FREE',
    PRO: 'PRO',
    TRIAL: 'TRIAL',
} as const;

export const UserRole = {
    USER: 'USER',
    ADMIN: 'ADMIN',
    SUPER_ADMIN: 'SUPER_ADMIN',
} as const;
// !END IMPORTANT