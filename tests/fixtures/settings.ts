import { expect, type Locator, type Page, type ViewportSize } from "@playwright/test";
import type { Context, User } from "@prisma/client";
import type { NavFixture } from "./nav";
import type { Database } from "../db";

export class SettingsFixture {
    public pageHeader: Locator;
    public header: Locator;
    public plan: Locator;

    public userInfoSection: Locator;
    public userInfoUsername: Locator;
    public userInfoUsernameError: Locator;
    public userInfoEmail: Locator;
    public userInfoEmailError: Locator;
    public userInfoUpdateButton: Locator;
    public userInfoSuccessMessage: Locator;

    public changePasswordSection: Locator;
    public currentPassword: Locator;
    public currentPasswordError: Locator;
    public newPassword: Locator;
    public newPasswordError: Locator;
    public confirmPassword: Locator;
    public confirmPasswordError: Locator;
    public changePasswordButton: Locator;
    public changePasswordSuccessMessage: Locator;

    public contextsSection: Locator;
    public contexts: Locator;
    public addContextButton: Locator;
    public contextModal: Locator;
    public contextName: Locator;
    public contextNameError: Locator;
    public contextDescription: Locator;
    public contextDescriptionError: Locator;
    public contextModalSubmitButton: Locator;
    public contextModalCancelButton: Locator;

    public metadataContainer: Locator;
    public lastUpdated: Locator;
    public memberSince: Locator;

    constructor(
        public readonly page: Page, 
        public readonly viewport?: ViewportSize | null
    ) {
        this.pageHeader = page.getByTestId('settings-header');
        this.header = this.pageHeader.locator('h1');
        this.plan = this.pageHeader.getByTestId('plan');

        this.userInfoSection = page.getByTestId('user-info-section');
        this.userInfoUsername = this.userInfoSection.getByTestId('user-info-username');
        this.userInfoUsernameError = this.userInfoSection.getByTestId('username-error');
        this.userInfoEmail = this.userInfoSection.getByTestId('user-info-email');
        this.userInfoEmailError = this.userInfoSection.getByTestId('email-error');
        this.userInfoUpdateButton = this.userInfoSection.getByTestId('user-info-update-button');
        this.userInfoSuccessMessage = this.userInfoSection.getByTestId('success-message');

        this.changePasswordSection = page.getByTestId('change-password-section');
        this.currentPassword = this.changePasswordSection.getByTestId('current-password');
        this.currentPasswordError = this.changePasswordSection.getByTestId('current-error');
        this.newPassword = this.changePasswordSection.getByTestId('new-password');
        this.newPasswordError = this.changePasswordSection.getByTestId('password-error');
        this.confirmPassword = this.changePasswordSection.getByTestId('confirm-password');
        this.confirmPasswordError = this.changePasswordSection.getByTestId('confirm-password-error');
        this.changePasswordButton = this.changePasswordSection.getByTestId('change-password-button');
        this.changePasswordSuccessMessage = this.changePasswordSection.getByTestId('success-message');

        this.contextsSection = page.getByTestId('contexts-section');
        this.contexts = this.contextsSection.locator('.context');
        this.addContextButton = this.contextsSection.getByTestId('add-context-button');
        this.contextModal = page.getByTestId('context-modal');
        this.contextName = this.contextModal.getByTestId('context-name');
        this.contextNameError = this.contextModal.getByTestId('name-error');
        this.contextDescription = this.contextModal.getByTestId('context-description');
        this.contextDescriptionError = this.contextModal.getByTestId('description-error');
        this.contextModalSubmitButton = this.contextModal.getByTestId('context-submit');
        this.contextModalCancelButton = this.contextModal.getByTestId('context-cancel');

        this.metadataContainer = page.getByTestId('metadata-container');
        this.lastUpdated = this.metadataContainer.getByTestId('last-updated');
        this.memberSince = this.metadataContainer.getByTestId('member-since');
    }

    public assertContextExists = async (ctx: Context) => {
        const context = this.contextsSection.getByTestId(`${ctx.id}`);

        await expect(context).toBeVisible();
        await expect(context.getByTestId('context-name')).toHaveText(ctx.name);
        await expect(context.getByTestId('context-description')).toHaveText(ctx.description || '');
        await expect(context.getByTestId('edit-context-button')).toBeVisible();
        await expect(context.getByTestId('delete-context-button')).toBeVisible();
    }

    public fillOutChangePasswordForm = async (currentPassword: string, newPassword: string, confirmPassword: string = '') => {
        await this.currentPassword.fill(currentPassword);
        await this.userInfoUsername.press('Tab');

        await this.newPassword.fill(newPassword);
        await this.userInfoUsername.press('Tab');

        await this.confirmPassword.fill(confirmPassword);
        await this.userInfoUsername.press('Tab');
    }

    public getContexts = async (userEmail: string, database: Database): Promise<Context[]> => {
        const [user] = await database.executeQuery<User>(`SELECT * FROM "User" WHERE "email" = '${userEmail}'`);
        return database.executeQuery<Context>(`SELECT * FROM "Context" WHERE "owner_id" = '${user.id}' ORDER BY "order" DESC`);
    }

    public navigateToSettings = async (nav: NavFixture) => {
        await nav.openMobileNav();
        await nav.settingsLink.scrollIntoViewIfNeeded();
        await nav.settingsLink.click();
    }
}