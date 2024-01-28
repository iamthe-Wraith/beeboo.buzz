import { generatePasswordHash } from "$lib/utils/auth";
import { AccountType } from "@prisma/client";
import type { Database } from "../db";
import type { Locator, Page } from "@playwright/test";

interface INewUserRequest {
    email: string;
    username?: string;
    password?: string;
    accountType?: AccountType;
}

export class AuthFixture {
    public modal: Locator;
    public modalCloseButton: Locator;
    
    constructor(public readonly page: Page) {
        this.modal = this.page.getByTestId('auth-modal');
        this.modalCloseButton = this.modal.getByTestId('close-modal-button');
    }

    public async cleanup(email: string, database: Database): Promise<void> {
        await database.executeQuery(`DELETE FROM "User" WHERE email = '${email}'`);
    };

    public async createUser({ email, username, password, accountType }: INewUserRequest, database: Database): Promise<void> {
        const _username = username || email.split('@')[0];
        const _password = password || 'Password123!';
        const _accountType = accountType || AccountType.FREE;
        await database.executeQuery(`INSERT INTO "User" (email, username, password, account_type) VALUES ('${email}', '${_username}', '${await generatePasswordHash(_password)}', '${_accountType}')`);
    }
}