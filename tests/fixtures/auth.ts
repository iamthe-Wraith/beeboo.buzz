import { generatePasswordHash } from "$lib/utils/auth";
import { AccountType } from "../../src/types/user";
import type { Database } from "../db";
import type { Locator, Page } from "@playwright/test";

interface INewUserRequest {
    email: string;
    username?: string;
    password?: string;
    accountType?: typeof AccountType
    createdAt?: Date;
    updatedAt?: Date;
}

export class AuthFixture {
    public modal: Locator;
    public modalCloseButton: Locator;

    public invalidUsernames = [
        'Invalid Username',
        'Invalid@Username',
        'Invalid#Username',
        'Invalid$Username',
        'Invalid%Username',
        'Invalid^Username',
        'Invalid&Username',
        'Invalid*Username',
        'Invalid(Username',
        'Invalid)Username',
        'Invalid+Username',
        'Invalid=Username',
        'Invalid{Username',
        'Invalid}Username',
        'Invalid[Username',
        'Invalid]Username',
        'Invalid|Username',
        'Invalid;Username',
        'Invalid:Username',
        'Invalid\'Username',
        'Invalid"Username',
        'Invalid<Username',
        'Invalid>Username',
        'Invalid,Username',
        'Invalid.Username',
        'Invalid/Username',
        'Invalid?Username',
        'Invalid\\Username',
        'Invalid`Username',
    ];
    
    constructor(public readonly page: Page) {
        this.modal = this.page.getByTestId('auth-modal');
        this.modalCloseButton = this.modal.getByTestId('close-modal-button');
    }

    public async cleanup(email: string, database: Database): Promise<void> {
        const result = await database.executeQuery(`SELECT id FROM "User" WHERE email = '${email}'`);

        if (result?.length) {
            await database.executeQuery(`DELETE FROM "Task" WHERE "owner_id" = '${result[0].id}'`);
            await database.executeQuery(`DELETE FROM "Project" WHERE "owner_id" = '${result[0].id}'`);
            await database.executeQuery(`DELETE FROM "Context" WHERE "owner_id" = '${result[0].id}'`);
            await database.executeQuery(`DELETE FROM "User" WHERE "email" = '${email}'`);
        }
    };

    public async createUser({ email, username, password, accountType, createdAt, updatedAt }: INewUserRequest, database: Database): Promise<void> {
        const _username = username || email.split('@')[0];
        const _password = password || 'Password123!';
        const _accountType = accountType || AccountType.FREE;
        const _createdAt = createdAt || new Date();
        const _updatedAt = updatedAt || new Date();

        await database.executeQuery(`INSERT INTO "User" (email, username, password, account_type, created_at, updated_at) VALUES ('${email}', '${_username}', '${await generatePasswordHash(_password)}', '${_accountType}', '${_createdAt.toISOString()}', '${_updatedAt.toISOString()}')`);
    }
}