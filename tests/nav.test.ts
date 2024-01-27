import { test, expect } from './custom-test';
import { getEmail } from './helpers';
import { SignInFixture } from './fixtures/signin';
import { NavFixture } from './fixtures/nav';

test.describe('nav', () => {
    test.describe('mobile nav', () => {
        test('should display a menu button when the user is signed in', async ({ page, database, viewport }) => {
            if (viewport && viewport.width >= 768) test.skip();

            const email = getEmail();
            const password = 'Password123!';
            const signin = new SignInFixture(page);
            const nav = new NavFixture(page, viewport);
        
            await signin.createUser({ email, password }, database);

            await page.goto('/');

            await signin.signIn({ emailOrUsername: email, password });

            const dashboard = await page.getByTestId('dashboard');
            await expect(dashboard).toBeVisible();

            await expect(nav.menuButton).toBeVisible();

            await signin.cleanup(email, database);
        });

        test('touching the menu button should open the mobile navigation', async ({ page, viewport, database }) => {
            if (viewport && viewport.width >= 768) test.skip();

            const email = getEmail();
            const password = 'Password123!';
            const signin = new SignInFixture(page);
            const nav = new NavFixture(page, viewport);

            await signin.createUser({ email, password }, database);

            await page.goto('/');

            await signin.signIn({ emailOrUsername: email, password });

            await expect(nav.menuButton).toBeVisible();
            await nav.openMobileNav();

            await expect(nav.nav).toBeVisible();

            await signin.cleanup(email, database);
        });

        test('nav should have links', async ({ page, viewport, database }) => {
            if (viewport && viewport.width >= 768) test.skip();

            const email = getEmail();
            const password = 'Password123!';
            const signin = new SignInFixture(page);
            const nav = new NavFixture(page, viewport);

            await signin.createUser({ email, password }, database);

            await page.goto('/');

            await signin.signIn({ emailOrUsername: email, password });

            await expect(nav.menuButton).toBeVisible();
            await nav.openMobileNav();

            await expect(nav.dashboardLink).toBeVisible();
            await expect(nav.settingsLink).toBeVisible();
            await expect(nav.userAvatar).toBeVisible();
            await expect(nav.userEmail).toBeVisible();
            await expect(nav.signoutButton).toBeVisible();

            await signin.cleanup(email, database);
        });

        test('nav should have copyright', async ({ page, viewport, database }) => {
            if (viewport && viewport.width >= 768) test.skip();

            const email = getEmail();
            const password = 'Password123!';
            const signin = new SignInFixture(page);
            const nav = new NavFixture(page, viewport);

            await signin.createUser({ email, password }, database);

            await page.goto('/');

            await signin.signIn({ emailOrUsername: email, password });

            await expect(nav.menuButton).toBeVisible();
            await nav.openMobileNav();

            await expect(nav.copyright).toBeVisible();

            await signin.cleanup(email, database);
        });
    });

    test.describe('desktop nav', () => {
        test('nav should have links', async ({ page, viewport, database }) => {
            if (viewport && viewport.width < 768) test.skip();

            const email = getEmail();
            const password = 'Password123!';
            const signin = new SignInFixture(page);
            const nav = new NavFixture(page, viewport);

            await signin.createUser({ email, password }, database);

            await page.goto('/');

            await signin.signIn({ emailOrUsername: email, password });

            await expect(nav.menuButton).not.toBeVisible();

            await expect(nav.dashboardLink).toBeVisible();
            await expect(nav.settingsLink).toBeVisible();
            await expect(nav.userAvatar).toBeVisible();
            await expect(nav.userEmail).toBeVisible();
            await expect(nav.signoutButton).toBeVisible();

            await signin.cleanup(email, database);
        });

        test('nav should have copyright', async ({ page, viewport, database }) => {
            if (viewport && viewport.width < 768) test.skip();

            const email = getEmail();
            const password = 'Password123!';
            const signin = new SignInFixture(page);
            const nav = new NavFixture(page, viewport);

            await signin.createUser({ email, password }, database);

            await page.goto('/');

            await signin.signIn({ emailOrUsername: email, password });

            await expect(nav.menuButton).not.toBeVisible();
            await nav.openMobileNav();

            await expect(nav.copyright).toBeVisible();

            await signin.cleanup(email, database);
        });
    });
});
