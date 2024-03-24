// !IMPORTANT this must match the AccountType and UserRole enums in ./prisma/schema.prisma
export interface IAccountType {
    FREE: 'FREE';
    PAID: 'PAID';
    TRIAL: 'TRIAL';
}

export interface IUserRole {
    USER: 'USER';
    ADMIN: 'ADMIN';
    SUPER_ADMIN: 'SUPER_ADMIN';
}

export const AccountType: IAccountType = {
    FREE: 'FREE',
    PAID: 'PAID',
    TRIAL: 'TRIAL',
};

export const UserRole: IUserRole = {
    USER: 'USER',
    ADMIN: 'ADMIN',
    SUPER_ADMIN: 'SUPER_ADMIN',
};
// !END IMPORTANT