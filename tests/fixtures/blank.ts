import type { Locator, Page, ViewportSize } from "@playwright/test";

export class BlankFixture {
    public header: Locator;

    public signInButton: Locator;
    public signUpButton: Locator;

    public dashboardLink: Locator;
    public signoutButton: Locator;

    constructor(public readonly page: Page, public readonly viewport?: ViewportSize | null) {
        this.header = this.page.getByTestId('global-header');

        this.signInButton = this.header.getByRole('button', { name: 'Sign in' });
        this.signUpButton = this.header.getByRole('button', { name: 'Sign up' });

        this.dashboardLink = this.header.getByRole('link', { name: 'Dashboard' });
        this.signoutButton = this.header.getByRole('button', { name: 'Sign out' });
    }
}