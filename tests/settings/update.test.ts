import dayjs from 'dayjs';
import { test, expect } from '../custom-test';
import { NavFixture } from '../fixtures/nav';
import { SettingsFixture } from '../fixtures/settings';
import { SignUpFixture } from '../fixtures/signup';
import { getEmail, getUsername } from '../helpers';

test.describe('settings - update', () => {
    test.describe('user info', () => {
        test('user should be able to update their username', async ({ page, viewport, database }) => {
            const email = getEmail();
            const username = getUsername();
            const password = 'Password123!';

            const signup = new SignUpFixture(page);
            const nav = new NavFixture(page, viewport);
            const settings = new SettingsFixture(page, viewport);

            await page.goto('/');
            await signup.signUp({
                email,
                username,
                password,
                confirmPassword: password,
            });
            await page.waitForURL('/dashboard', { waitUntil: 'networkidle' });

            await nav.openMobileNav();
            await nav.settingsLink.scrollIntoViewIfNeeded();
            await nav.settingsLink.click();

            await page.waitForURL('/settings', { waitUntil: 'networkidle' });

            // Update username
            await settings.userInfoUsername.fill('new-username');
            await settings.userInfoUsername.blur();

            await expect(settings.userInfoUsername).toHaveValue('new-username');
            await expect(settings.userInfoUpdateButton).toBeEnabled();
            await settings.userInfoUpdateButton.click();

            await expect(settings.userInfoUpdateButton).toBeDisabled();

            await expect(settings.lastUpdated).toHaveText(`Your account was last updated on ${dayjs().format('MMMM DD, YYYY')}`);

            await signup.cleanup(email, database);
        });
    });
});