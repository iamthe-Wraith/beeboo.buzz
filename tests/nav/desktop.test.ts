import { test, expect } from '../custom-test';
import { getEmail } from '../helpers';
import { SignInFixture } from '../fixtures/signin';
import { NavFixture } from '../fixtures/nav';
import { SignUpFixture } from '../fixtures/signup';

test.describe('desktop nav', () => {
    test.describe('quick actions', () => {
        test('should have quick action buttons', async ({ page, viewport, database }) => {
            if (viewport && viewport.width < 768) test.skip();

            const email = getEmail();
            const password = 'Password123!';
            const signin = new SignInFixture(page);
            const nav = new NavFixture(page, viewport);

            await signin.createUser({ email, password }, database);

            await page.goto('/');

            await signin.signIn({ emailOrUsername: email, password });

            await page.waitForURL('/dashboard', {waitUntil: 'networkidle'});

            await expect(nav.menuButton).not.toBeVisible();

            await expect(nav.desktopQuickActions.container).toBeVisible();
            await expect(nav.desktopQuickActions.newProject).toBeVisible();
            await expect(nav.desktopQuickActions.newTask).toBeVisible();

            await signin.cleanup(email, database);
        });
    });

    test.describe('links', () => {
        test('nav should have default links', async ({ page, viewport, database }) => {
            if (viewport && viewport.width < 768) test.skip();

            const email = getEmail();
            const password = 'Password123!';
            const signin = new SignInFixture(page);
            const nav = new NavFixture(page, viewport);

            await signin.createUser({ email, password }, database);

            await page.goto('/');

            await signin.signIn({ emailOrUsername: email, password });

            await page.waitForURL('/dashboard', {waitUntil: 'networkidle'});

            await expect(nav.menuButton).not.toBeVisible();

            await expect(nav.dashboardLink).toBeVisible();
            await expect(nav.settingsLink).toBeVisible();
            await expect(nav.userAvatar).toBeVisible();
            await expect(nav.userEmail).toBeVisible();
            await expect(nav.signoutButton).toBeVisible();

            await signin.cleanup(email, database);
        });

        test('nav should have links for each default context created after signup', async ({ page, viewport, database }) => {
            if (viewport && viewport.width < 768) test.skip();

            const email = getEmail();
            const password = 'Password123!';
            const signup = new SignUpFixture(page);
            const nav = new NavFixture(page, viewport);

            await page.goto('/');

            await expect(nav.menuButton).not.toBeVisible();

            await signup.signUp({ email, password, confirmPassword: password });

            await page.waitForURL('/dashboard', {waitUntil: 'networkidle'});

            await expect(nav.contextLinks.inbox).toBeVisible();
            await expect(nav.contextLinks.projects).toBeVisible();
            await expect(nav.contextLinks.waitingFor).toBeVisible();
            await expect(nav.contextLinks.atHome).toBeVisible();
            await expect(nav.contextLinks.atWork).toBeVisible();
            await expect(nav.contextLinks.atComputer).toBeVisible();
            await expect(nav.contextLinks.anywhere).toBeVisible();
            await expect(nav.contextLinks.phoneCalls).toBeVisible();

            await signup.cleanup(email, database);
        });
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

        await page.waitForURL('/dashboard', {waitUntil: 'networkidle'});

        await expect(nav.menuButton).not.toBeVisible();
        await nav.openMobileNav();

        await expect(nav.copyright).toBeVisible();

        await signin.cleanup(email, database);
    });
});