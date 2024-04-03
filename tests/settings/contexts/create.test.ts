// import dayjs from 'dayjs';
import { MAX_CONTEXT_DESCRIPTION_LENGTH, MAX_CONTEXT_NAME_LENGTH } from '$lib/constants/context';
import { test, expect } from '../../custom-test';
import { NavFixture } from '../../fixtures/nav';
import { SettingsFixture } from '../../fixtures/settings';
// import { SignInFixture } from '../../fixtures/signin';
import { SignUpFixture } from '../../fixtures/signup';
import { getEmail, getUsername } from '../../helpers';

test.describe('contexts settings - create', () => {
    test('user should be able to create a new context', async ({ page, viewport, database }) => {
        const email = getEmail();
        const username = getUsername();
        const password = 'Password123!';

        const signup = new SignUpFixture(page);
        const nav = new NavFixture(page, viewport);
        const settings = new SettingsFixture(page, viewport);

        try {
            await page.goto('/');
            await signup.signUp({ email, username, password, confirmPassword: password });

            await page.waitForURL('/dashboard', { waitUntil: 'networkidle' });

            await settings.navigateToSettings(nav);
            await page.waitForURL('/settings', { waitUntil: 'networkidle' });

            await settings.addContextButton.click();

            await expect(settings.contextModal).toBeVisible();
            await expect(settings.contextName).toBeVisible();
            await expect(settings.contextDescription).toBeVisible();
            await expect(settings.contextModalSubmitButton).toBeVisible();
            await expect(settings.contextModalSubmitButton).toBeDisabled();
            await expect(settings.contextModalCancelButton).toBeVisible();

            await settings.contextName.fill('Test Context');
            await settings.contextName.press('Tab');

            await settings.contextDescription.fill('This is a test context');
            await settings.contextDescription.press('Tab');

            await expect(settings.contextModalSubmitButton).not.toBeDisabled();
            await settings.contextModalSubmitButton.click();

            await expect(settings.contextModal).not.toBeVisible();

            const contexts = await settings.getContexts(email, database);

            await settings.assertContextExists(contexts[0]);

            await nav.openMobileNav();
            await nav.assertCustomContextExists(contexts[0]);
        } finally {
            await signup.cleanup(email, database);
        }
    });

    test('user should not be able to create a new context if a name is not provided', async ({ page, viewport, database }) => {
        const email = getEmail();
        const username = getUsername();
        const password = 'Password123!';

        const signup = new SignUpFixture(page);
        const nav = new NavFixture(page, viewport);
        const settings = new SettingsFixture(page, viewport);

        try {
            await page.goto('/');
            await signup.signUp({ email, username, password, confirmPassword: password });

            await page.waitForURL('/dashboard', { waitUntil: 'networkidle' });

            await settings.navigateToSettings(nav);
            await page.waitForURL('/settings', { waitUntil: 'networkidle' });

            await settings.addContextButton.click();

            await expect(settings.contextModal).toBeVisible();
            await expect(settings.contextName).toBeVisible();
            await expect(settings.contextDescription).toBeVisible();
            await expect(settings.contextModalSubmitButton).toBeVisible();
            await expect(settings.contextModalSubmitButton).toBeDisabled();
            await expect(settings.contextModalCancelButton).toBeVisible();

            await settings.contextName.fill('');
            await settings.contextName.press('Tab');
            await expect(settings.contextNameError).toBeVisible();
            await expect(settings.contextNameError).toHaveText('Name is required.');

            await expect(settings.contextModalSubmitButton).toBeDisabled();
        } finally {
            await signup.cleanup(email, database);
        }
    });

    test('user should not be able to create a new context if the name is too long', async ({ page, viewport, database }) => {
        const email = getEmail();
        const username = getUsername();
        const password = 'Password123!';

        const signup = new SignUpFixture(page);
        const nav = new NavFixture(page, viewport);
        const settings = new SettingsFixture(page, viewport);

        try {
            await page.goto('/');
            await signup.signUp({ email, username, password, confirmPassword: password });

            await page.waitForURL('/dashboard', { waitUntil: 'networkidle' });

            await settings.navigateToSettings(nav);
            await page.waitForURL('/settings', { waitUntil: 'networkidle' });

            await settings.addContextButton.click();

            await expect(settings.contextModal).toBeVisible();
            await expect(settings.contextName).toBeVisible();
            await expect(settings.contextDescription).toBeVisible();
            await expect(settings.contextModalSubmitButton).toBeVisible();
            await expect(settings.contextModalSubmitButton).toBeDisabled();
            await expect(settings.contextModalCancelButton).toBeVisible();

            await settings.contextName.fill('a'.repeat(MAX_CONTEXT_NAME_LENGTH + 1));
            await settings.contextName.press('Tab');
            await expect(settings.contextNameError).toBeVisible();
            await expect(settings.contextNameError).toHaveText(`Name must be less than ${MAX_CONTEXT_NAME_LENGTH} characters.`);

            await expect(settings.contextModalSubmitButton).toBeDisabled();
        } finally {
            await signup.cleanup(email, database);
        }
    });

    test('user should not be able to create a new context if the description is too long', async ({ page, viewport, database }) => {
        const email = getEmail();
        const username = getUsername();
        const password = 'Password123!';

        const signup = new SignUpFixture(page);
        const nav = new NavFixture(page, viewport);
        const settings = new SettingsFixture(page, viewport);

        try {
            await page.goto('/');
            await signup.signUp({ email, username, password, confirmPassword: password });

            await page.waitForURL('/dashboard', { waitUntil: 'networkidle' });

            await settings.navigateToSettings(nav);
            await page.waitForURL('/settings', { waitUntil: 'networkidle' });

            await settings.addContextButton.click();

            await expect(settings.contextModal).toBeVisible();
            await expect(settings.contextName).toBeVisible();
            await expect(settings.contextDescription).toBeVisible();
            await expect(settings.contextModalSubmitButton).toBeVisible();
            await expect(settings.contextModalSubmitButton).toBeDisabled();
            await expect(settings.contextModalCancelButton).toBeVisible();

            await settings.contextName.fill('Test Context');
            await settings.contextName.press('Tab');
            await expect(settings.contextNameError).not.toBeVisible();
            
            await settings.contextDescription.fill('a'.repeat(MAX_CONTEXT_DESCRIPTION_LENGTH + 1));
            await settings.contextDescription.press('Tab');
            await expect(settings.contextDescriptionError).toBeVisible();
            await expect(settings.contextDescriptionError).toHaveText(`Description must be less than ${MAX_CONTEXT_DESCRIPTION_LENGTH} characters.`);

            await expect(settings.contextModalSubmitButton).toBeDisabled();
        } finally {
            await signup.cleanup(email, database);
        }
    });
});