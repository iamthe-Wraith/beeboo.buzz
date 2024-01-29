import type { Locator, Page, ViewportSize } from "@playwright/test";

export class NavFixture {
    public isMobile: boolean;

    public menuButton: Locator;
    public menuButtonIcon: Locator;

    public nav: Locator;

    public dashboardLink: Locator;
    public settingsLink: Locator;
    public userAvatar: Locator;
    public userEmail: Locator;

    public contextLinks: Record<string, Locator>;

    public signoutButton: Locator;

    public copyright: Locator;

    constructor(public readonly page: Page, public readonly viewport?: ViewportSize | null) {
        this.isMobile = !!viewport && viewport.width < 768;

        if (this.isMobile) {
            this.nav = this.page.getByTestId('mobile-global-nav');
        } else {
            this.nav = this.page.getByTestId('desktop-nav-container');
        }

        this.menuButton = this.page.getByTestId('mobile-global-nav-trigger');
        this.menuButtonIcon = this.menuButton.getByTestId('mobile-global-nav-trigger-icon');

        this.dashboardLink = this.nav.getByRole('link', { name: 'Dashboard' });
        this.settingsLink = this.nav.getByTestId('settings-link');
        this.userAvatar = this.settingsLink.getByTestId('user-avatar');
        this.userEmail = this.settingsLink.getByTestId('user-email');

        this.contextLinks = {
            inbox: this.nav.getByRole('link', { name: 'Inbox' }),
            projects: this.nav.getByRole('link', { name: 'Projects' }),
            waitingFor: this.nav.getByRole('link', { name: 'Waiting For' }),
            atHome: this.nav.getByRole('link', { name: 'At Home' }),
            atWork: this.nav.getByRole('link', { name: 'At Work' }),
            atComputer: this.nav.getByRole('link', { name: 'At Computer' }),
            anywhere: this.nav.getByRole('link', { name: 'Anywhere' }),
            phoneCalls: this.nav.getByRole('link', { name: 'Phone Calls' }),
        };

        this.signoutButton = this.nav.getByTestId('signout-button');

        this.copyright = this.nav.getByText(`Copyright ${new Date().getFullYear()}`);
    }

    public async openMobileNav(): Promise<void> {
        if (!this.isMobile) return;
        
        await this.menuButton?.click({ force: true });
    }
}