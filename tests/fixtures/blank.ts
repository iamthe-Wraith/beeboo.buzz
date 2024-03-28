import type { Locator, Page, ViewportSize } from "@playwright/test";

export class BlankFixture {
    public header: Locator;

    public logo: Locator;

    public signInButton: Locator;
    public signUpButton: Locator;

    public dashboardLink: Locator;
    public signoutButton: Locator;

    constructor(public readonly page: Page, public readonly viewport?: ViewportSize | null) {
        this.header = this.page.getByTestId('global-header');

        this.logo = this.header.getByTestId('logo');

        this.signInButton = this.header.getByTestId('signin-button');
        this.signUpButton = this.header.getByTestId('signup-button');

        this.dashboardLink = this.header.getByTestId('dashboard-link');
        this.signoutButton = this.header.getByTestId('signout-button');
    }
}