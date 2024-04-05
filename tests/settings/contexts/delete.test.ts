import { ContextRole } from '../../../src/types/contexts';
import { test, expect } from '../../custom-test';
import { NavFixture } from '../../fixtures/nav';
import { SettingsFixture } from '../../fixtures/settings';
import { SignUpFixture } from '../../fixtures/signup';
import { getEmail, getUsername } from '../../helpers';

test.describe('contexts settings - delete', () => {
    test('user should be able to delete a context', async ({ page, viewport, database }) => {
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

            await expect(context.getByTestId('delete-context-button')).toBeVisible();
            await context.getByTestId('delete-context-button').click();

            await expect(settings.deleteContextModal).toBeVisible();
            await expect(settings.deleteContextModalHeader).toHaveText('Are you sure?');
            await expect(settings.deleteContextModalMessage).toContainText(/This action cannot be undone/);
            await expect(settings.deleteContextModalMessage).toContainText(/Any tasks assigned to this context will be moved to your inbox/);
            await expect(settings.deleteContextModalCancelButton).toBeVisible();
            await expect(settings.deleteContextModalDeleteButton).toBeVisible();

            await settings.deleteContextModalDeleteButton.click();

            await expect(settings.contextsSection.getByTestId(`${ctx.id}`)).not.toBeVisible();

            await nav.assertCustomContextDoesNotExist(ctx);
        } finally {
            await signup.cleanup(email, database);
        }
    });

    test('user should be able to delete a context that has tasks assigned to it', async ({ page, viewport, database }) => {
        const email = getEmail();
        const username = getUsername();
        const password = 'Password123!';
        const tasks = [
            { title: 'Test Task 1' },
            { title: 'Test Task 2' },
            { title: 'Test Task 3' },
            { title: 'Test Task 4' },
            { title: 'Test Task 5' },
        ];

        const signup = new SignUpFixture(page);
        const nav = new NavFixture(page, viewport);
        const settings = new SettingsFixture(page, viewport);

        try {
            await page.goto('/');
            await signup.signUp({ email, username, password, confirmPassword: password });

            await page.waitForURL('/dashboard', { waitUntil: 'networkidle' });

            const [ctx] = await settings.getContexts(email, database);

            const [user] = await database.executeQuery(`SELECT * FROM "User" WHERE "email" = '${email}'`);
            for (let i = 0; i < tasks.length; i++) {
                const task = tasks[i];
                await database.executeQuery(`
                    INSERT INTO "Task" ("title", "owner_id", "context_id")
                    VALUES ('${task.title}', ${user.id}, ${ctx.id})`
                );
            }

            await expect(database.executeQuery(`SELECT * FROM "Task" WHERE "context_id" = ${ctx.id}`)).resolves.toHaveLength(tasks.length);

            await settings.navigateToSettings(nav);
            await page.waitForURL('/settings', { waitUntil: 'networkidle' });

            const context = settings.contextsSection.getByTestId(`${ctx.id}`);

            await expect(context.getByTestId('delete-context-button')).toBeVisible();
            await context.getByTestId('delete-context-button').click();

            await expect(settings.deleteContextModal).toBeVisible();
            await expect(settings.deleteContextModalHeader).toHaveText('Are you sure?');
            await expect(settings.deleteContextModalMessage).toContainText(/This action cannot be undone/);
            await expect(settings.deleteContextModalMessage).toContainText(/Any tasks assigned to this context will be moved to your inbox/);
            await expect(settings.deleteContextModalCancelButton).toBeVisible();
            await expect(settings.deleteContextModalDeleteButton).toBeVisible();

            await settings.deleteContextModalDeleteButton.click();

            await expect(settings.contextsSection.getByTestId(`${ctx.id}`)).not.toBeVisible();

            await nav.assertCustomContextDoesNotExist(ctx);

            const inbox = (await settings.getContexts(email, database)).find(c => c.role === ContextRole.INBOX);
            if (!inbox) throw Error('Inbox not found');
            await expect(database.executeQuery(`SELECT * FROM "Task" WHERE "context_id" = ${inbox.id}`)).resolves.toHaveLength(tasks.length);
        } finally {
            await signup.cleanup(email, database);
        }
    });

    test('user should be able to cancel deleting a context', async ({ page, viewport, database }) => {
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

            await expect(context.getByTestId('delete-context-button')).toBeVisible();
            await context.getByTestId('delete-context-button').click();

            await expect(settings.deleteContextModal).toBeVisible();
            await expect(settings.deleteContextModalHeader).toHaveText('Are you sure?');
            await expect(settings.deleteContextModalMessage).toContainText(/This action cannot be undone/);
            await expect(settings.deleteContextModalMessage).toContainText(/Any tasks assigned to this context will be moved to your inbox/);
            await expect(settings.deleteContextModalCancelButton).toBeVisible();
            await expect(settings.deleteContextModalDeleteButton).toBeVisible();

            await settings.deleteContextModalCancelButton.click();

            await expect(settings.deleteContextModal).not.toBeVisible();

            await expect(settings.contextsSection.getByTestId(`${ctx.id}`)).toBeVisible();

            await nav.assertCustomContextExists(ctx);
        } finally {
            await signup.cleanup(email, database);
        }
    });
});
