// import { sleep } from '$lib/utils/gen';
import { test, expect } from '../custom-test';
import { NavFixture } from '../fixtures/nav';
import { SignUpFixture } from '../fixtures/signup';
import { getEmail } from '../helpers';

test.describe('main settings page', () => {
    test('should display', async ({ page, database }) => {
        const email = getEmail();
        const password = 'Password123!';

        const signup = new SignUpFixture(page);
        const nav = new NavFixture(page);

        await page.goto('/');

        await signup.signUp({
            email,
            password,
            confirmPassword: password,
        });

        await page.waitForURL('/dashboard', { waitUntil: 'networkidle' });

        await nav.openMobileNav();
        await nav.settingsLink.click();

        await page.waitForURL('/settings', { waitUntil: 'networkidle' });

        await expect()

        await signup.cleanup(email, database);
    });
});