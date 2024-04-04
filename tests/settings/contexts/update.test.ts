import { MAX_CONTEXT_DESCRIPTION_LENGTH, MAX_CONTEXT_NAME_LENGTH } from '$lib/constants/context';
import { test, expect } from '../../custom-test';
import { NavFixture } from '../../fixtures/nav';
import { SettingsFixture } from '../../fixtures/settings';
import { SignUpFixture } from '../../fixtures/signup';
import { getEmail, getUsername } from '../../helpers';

test.describe('contexts settings - create', () => {
    test('user should be able to update a context', async ({ page, viewport, database }) => {
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

            const [ctx] = await settings.getContexts(email, database);

            const context = settings.contextsSection.getByTestId(`${ctx.id}`);

            await expect(context.getByTestId('edit-context-button')).toBeVisible();
            await context.getByTestId('edit-context-button').click();

            await expect(settings.contextModal).toBeVisible();
            await expect(settings.contextName).toBeVisible();
            await expect(settings.contextName).toHaveValue(ctx.name);
            await expect(settings.contextDescription).toBeVisible();
            await expect(settings.contextDescription).toHaveValue(ctx.description || '');
            await expect(settings.contextModalSubmitButton).toBeVisible();

            await settings.contextName.fill('Updated Context');
            await settings.contextName.press('Tab');

            await settings.contextDescription.fill('This is an updated context');
            await settings.contextDescription.press('Tab');

            await expect(settings.contextModalSubmitButton).not.toBeDisabled();
            await settings.contextModalSubmitButton.click();

            const contexts = await settings.getContexts(email, database);
            const updatedCtx = contexts.find((c) => c.id === ctx.id);

            if (!updatedCtx) throw new Error('Context not found');

            await expect(updatedCtx.name).toBe('Updated Context');
            await expect(updatedCtx.description).toBe('This is an updated context');

            await settings.assertContextExists(updatedCtx);

            await nav.openMobileNav();
            await nav.assertCustomContextExists(updatedCtx);
        } finally {
            await signup.cleanup(email, database);
        }
    });

    test('user should not be able to update a context if they remove the name', async ({ page, viewport, database }) => {
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

            const [ctx] = await settings.getContexts(email, database);

            const context = settings.contextsSection.getByTestId(`${ctx.id}`);

            await expect(context.getByTestId('edit-context-button')).toBeVisible();
            await context.getByTestId('edit-context-button').click();

            await settings.contextName.fill('');
            await settings.contextName.press('Tab');
            await expect(settings.contextNameError).toBeVisible();
            await expect(settings.contextNameError).toHaveText('Name is required.');
            await expect(settings.contextModalSubmitButton).toBeDisabled();
        } finally {
            await signup.cleanup(email, database);
        }
    });

    test('user should not be able to update a context if the updated name is too long', async ({ page, viewport, database }) => {
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

            const [ctx] = await settings.getContexts(email, database);

            const context = settings.contextsSection.getByTestId(`${ctx.id}`);

            await expect(context.getByTestId('edit-context-button')).toBeVisible();
            await context.getByTestId('edit-context-button').click();

            await settings.contextName.fill('a'.repeat(MAX_CONTEXT_NAME_LENGTH + 1));
            await settings.contextName.press('Tab');
            await expect(settings.contextNameError).toBeVisible();
            await expect(settings.contextNameError).toHaveText(`Name must be less than ${MAX_CONTEXT_NAME_LENGTH} characters.`);
            await expect(settings.contextModalSubmitButton).toBeDisabled();
        } finally {
            await signup.cleanup(email, database);
        }
    });

    test('user should not be able to update a context if the updated description is too long', async ({ page, viewport, database }) => {
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

            const [ctx] = await settings.getContexts(email, database);

            const context = settings.contextsSection.getByTestId(`${ctx.id}`);

            await expect(context.getByTestId('edit-context-button')).toBeVisible();
            await context.getByTestId('edit-context-button').click();

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