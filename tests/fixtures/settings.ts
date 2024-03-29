import { expect, type Locator, type Page, type ViewportSize } from "@playwright/test";
import type { Context } from "@prisma/client";

export class SettingsFixture {
    public pageHeader: Locator;
    public header: Locator;
    public plan: Locator;

    public userInfoSection: Locator;
    public userInfoUsername: Locator;
    public userInfoEmail: Locator;
    public userInfoUpdateButton: Locator;

    public changePasswordSection: Locator;
    public changePasswordCurrentPassword: Locator;
    public changePasswordNewPassword: Locator;
    public changePasswordConfirmPassword: Locator;
    public changePasswordButton: Locator;

    public contextsSection: Locator;
    public contexts: Locator;
    public addContextButton: Locator;

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
        this.userInfoEmail = this.userInfoSection.getByTestId('user-info-email');
        this.userInfoUpdateButton = this.userInfoSection.getByTestId('user-info-update-button');

        this.changePasswordSection = page.getByTestId('change-password-section');
        this.changePasswordCurrentPassword = this.changePasswordSection.getByTestId('current-password');
        this.changePasswordNewPassword = this.changePasswordSection.getByTestId('new-password');
        this.changePasswordConfirmPassword = this.changePasswordSection.getByTestId('confirm-password');
        this.changePasswordButton = this.changePasswordSection.getByTestId('change-password-button');

        this.contextsSection = page.getByTestId('contexts-section');
        this.contexts = this.contextsSection.locator('.context');
        this.addContextButton = this.contextsSection.getByTestId('add-context-button');

        this.metadataContainer = page.getByTestId('metadata-container');
        this.lastUpdated = this.metadataContainer.getByTestId('last-updated');
        this.memberSince = this.metadataContainer.getByTestId('member-since');
    }

    public async assertContextExists(ctx: Context) {
        const context = this.contextsSection.getByTestId(`${ctx.id}`);

        await expect(context).toBeVisible();
        await expect(context.getByTestId('context-name')).toHaveText(ctx.name);
        await expect(context.getByTestId('context-description')).toHaveText(ctx.description || '');
        await expect(context.getByTestId('edit-context-button')).toBeVisible();
        await expect(context.getByTestId('delete-context-button')).toBeVisible();
    }
}