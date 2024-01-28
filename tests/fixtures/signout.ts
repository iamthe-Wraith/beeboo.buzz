import type { Locator, Page, ViewportSize } from "@playwright/test";
import { AuthFixture } from "./auth";
import { NavFixture } from "./nav";

export class SignOutFixture extends AuthFixture {
    private nav: NavFixture

    constructor(public readonly page: Page, public readonly viewport?: ViewportSize | null) {
        super(page);

        this.nav = new NavFixture(page, viewport);
    }

    public get menuButton(): Locator | null {
        return this.nav.menuButton;
    }

    public get button(): Locator {
        return this.nav.signoutButton;
    }

    public async signOut(): Promise<void> {
        this.nav.openMobileNav();
        this.nav.signoutButton.click();
    }
}