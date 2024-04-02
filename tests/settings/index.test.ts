// import { sleep } from '$lib/utils/gen';
import { test, expect } from '../custom-test';
import { NavFixture } from '../fixtures/nav';
import { SettingsFixture } from '../fixtures/settings';
import { SignUpFixture } from '../fixtures/signup';
import { getEmail, getUsername } from '../helpers';

test.describe('main settings page', () => {
    test.describe('header', () => {
        test('should exist', async ({ page, viewport, database }) => {
            const email = getEmail();
            const password = 'Password123!';
    
            const signup = new SignUpFixture(page);
            const nav = new NavFixture(page, viewport);
            const settings = new SettingsFixture(page, viewport);
    
            await page.goto('/');
    
            await signup.signUp({
                email,
                password,
                confirmPassword: password,
            });
    
            await page.waitForURL('/dashboard', { waitUntil: 'networkidle' });
    
            await nav.openMobileNav();
            await nav.settingsLink.scrollIntoViewIfNeeded();
            await nav.settingsLink.click();
    
            await page.waitForURL('/settings', { waitUntil: 'networkidle' });
    
            await expect(settings.pageHeader).toBeVisible();
            await expect(settings.header).toHaveText('Account Settings');
            await expect(settings.plan).toBeVisible();
            await expect(settings.plan).toHaveText('Plan free');
    
            await signup.cleanup(email, database);
        });
    })

    test.describe('user info', () => {
        test('should exist', async ({ page, viewport, database }) => {
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
    
            await expect(settings.userInfoSection).toBeVisible();
            await expect(settings.userInfoUsername).toBeVisible();
            await expect(settings.userInfoUsername).toHaveValue(username);
            await expect(settings.userInfoEmail).toBeVisible();
            await expect(settings.userInfoEmail).toHaveValue(email);
            await expect(settings.userInfoUpdateButton).toBeVisible();
            await expect(settings.userInfoUpdateButton).toBeDisabled();
    
            await signup.cleanup(email, database);
        });
    })

    test.describe('change password', () => {
        test('should exist', async ({ page, viewport, database }) => {
            const email = getEmail();
            const password = 'Password123!';
    
            const signup = new SignUpFixture(page);
            const nav = new NavFixture(page, viewport);
            const settings = new SettingsFixture(page, viewport);
    
            await page.goto('/');
    
            await signup.signUp({
                email,
                password,
                confirmPassword: password,
            });
    
            await page.waitForURL('/dashboard', { waitUntil: 'networkidle' });
    
            await nav.openMobileNav();
            await nav.settingsLink.scrollIntoViewIfNeeded();
            await nav.settingsLink.click();
    
            await page.waitForURL('/settings', { waitUntil: 'networkidle' });
    
            await expect(settings.changePasswordSection).toBeVisible();
            await expect(settings.currentPassword).toBeVisible();
            await expect(settings.newPassword).toBeVisible();
            await expect(settings.confirmPassword).toBeVisible();
            await expect(settings.changePasswordButton).toBeVisible();
            await expect(settings.changePasswordButton).toBeDisabled();
    
            await signup.cleanup(email, database);
        });
    })

    test.describe('contexts', () => {
        test('should exist', async ({ page, viewport, database }) => {
            const email = getEmail();
            const password = 'Password123!';
    
            const signup = new SignUpFixture(page);
            const nav = new NavFixture(page, viewport);
            const settings = new SettingsFixture(page, viewport);
    
            await page.goto('/');
    
            await signup.signUp({
                email,
                password,
                confirmPassword: password,
            });
    
            await page.waitForURL('/dashboard', { waitUntil: 'networkidle' });
    
            await nav.openMobileNav();
            await nav.settingsLink.scrollIntoViewIfNeeded();
            await nav.settingsLink.click();
    
            await page.waitForURL('/settings', { waitUntil: 'networkidle' });
    
            await expect(settings.contextsSection).toBeVisible();

            const [owner] = await database.executeQuery(`SELECT "id" FROM "User" WHERE "email" = '${email}'`);
            const contexts = await database.executeQuery(`SELECT * FROM "Context" WHERE "owner_id" = '${owner.id}' AND "role" = 'NONE'`);

            await expect(await settings.contexts.count()).toBe(contexts.length);

            for (let i = 0; i < contexts.length; i++) {
                settings.assertContextExists(contexts[i]);
            }

            await expect(settings.addContextButton).toBeVisible();
    
            await signup.cleanup(email, database);
        });
    });
});