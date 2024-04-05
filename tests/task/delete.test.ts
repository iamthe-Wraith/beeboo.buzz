import { getEmail } from "../helpers";
import { SignUpFixture } from "../fixtures/signup";
import { QuickActionsFixture } from "../fixtures/quick-actions";
import { test, expect } from "../custom-test";
import { NavFixture } from "../fixtures/nav";
import { TaskPageFixture } from "../fixtures/task-page";
import { ContextPageFixture } from "../fixtures/context-page";

test.describe('task - delete', () => {
    test('clicking the delete button should display a confirmation modal', async ({ page, viewport, database }) => {
        const email = getEmail();
        const password = 'Password123!';
        const tasks = [
            {
                title: 'Test Task 1',
                description: 'Test description 1',
            },
        ];

        const signup = new SignUpFixture(page);
        const nav = new NavFixture(page, viewport);
        const quickActions = new QuickActionsFixture(page, viewport);
        const inboxPage = new ContextPageFixture(page, viewport);

        await page.goto('/');

        await signup.signUp({ email, password, confirmPassword: password });

        await page.waitForURL('/dashboard', {waitUntil: 'networkidle'});

        for (let i = 0; i < tasks.length; i++) {
            const task = tasks[i];
            await quickActions.openTaskModal();
            await quickActions.task.title.fill(task.title);
            if (task.description) await quickActions.task.description.fill(task.description);
            await quickActions.task.createButton.click();
            await expect(quickActions.task.modal).not.toBeVisible();
        }

        await nav.openMobileNav();
        await expect(nav.contextLinks.inbox).toBeInViewport();
        await nav.contextLinks.inbox.click({ force: true });

        await page.waitForURL('/inbox', {waitUntil: 'networkidle'});

        await expect(inboxPage.tasks).toHaveCount(1);

        const [owner] = await database.executeQuery(`SELECT "id" FROM "User" WHERE "email" = '${email}'`);
        const [task] = await database.executeQuery(`SELECT "id" FROM "Task" WHERE "owner_id" = '${owner.id}'`);

        inboxPage.tasks.nth(0).click();

        await page.waitForURL(`/tasks/${task.id}`, {waitUntil: 'networkidle'});

        const taskPage = new TaskPageFixture(page, viewport);

        await expect(taskPage.delete.trigger).toBeVisible();
        await taskPage.delete.trigger.click();

        await expect(taskPage.delete.modal).toBeVisible();
        await expect(taskPage.delete.header).toHaveText('Are you sure?');
        await expect(taskPage.delete.text).toHaveText('Are you sure you want to delete this task? This cannot be undone.');
        await expect(taskPage.delete.confirmButton).toBeVisible();
        await expect(taskPage.delete.cancelButton).toBeVisible();

        await signup.cleanup(email, database);
    });

    test('clicking the cancel button within the confirmation modal should close the modal and cancel the deletion', async ({ page, viewport, database }) => {
        const email = getEmail();
        const password = 'Password123!';
        const tasks = [
            {
                title: 'Test Task 1',
                description: 'Test description 1',
            },
        ];

        const signup = new SignUpFixture(page);
        const nav = new NavFixture(page, viewport);
        const quickActions = new QuickActionsFixture(page, viewport);
        const inboxPage = new ContextPageFixture(page, viewport);

        await page.goto('/');

        await signup.signUp({ email, password, confirmPassword: password });

        await page.waitForURL('/dashboard', {waitUntil: 'networkidle'});

        for (let i = 0; i < tasks.length; i++) {
            const task = tasks[i];
            await quickActions.openTaskModal();
            await quickActions.task.title.fill(task.title);
            if (task.description) await quickActions.task.description.fill(task.description);
            await quickActions.task.createButton.click();
            await expect(quickActions.task.modal).not.toBeVisible();
        }

        await nav.openMobileNav();
        await expect(nav.contextLinks.inbox).toBeInViewport();
        await nav.contextLinks.inbox.click({ force: true });

        await page.waitForURL('/inbox', {waitUntil: 'networkidle'});

        await expect(inboxPage.tasks).toHaveCount(1);

        const [owner] = await database.executeQuery(`SELECT "id" FROM "User" WHERE "email" = '${email}'`);
        const [task] = await database.executeQuery(`SELECT "id" FROM "Task" WHERE "owner_id" = '${owner.id}'`);

        inboxPage.tasks.nth(0).click();

        await page.waitForURL(`/tasks/${task.id}`, {waitUntil: 'networkidle'});

        const taskPage = new TaskPageFixture(page, viewport);

        await taskPage.delete.trigger.click();

        await expect(taskPage.delete.cancelButton).toBeVisible();
        await taskPage.delete.cancelButton.click();

        await expect(taskPage.delete.modal).not.toBeVisible();

        await signup.cleanup(email, database);
    });

    test('clicking the delete button within the confirmation modal should delete the task', async ({ page, viewport, database }) => {
        const email = getEmail();
        const password = 'Password123!';
        const tasks = [
            {
                title: 'Test Task 1',
                description: 'Test description 1',
            },
        ];

        const signup = new SignUpFixture(page);
        const nav = new NavFixture(page, viewport);
        const quickActions = new QuickActionsFixture(page, viewport);
        const inboxPage = new ContextPageFixture(page, viewport);

        await page.goto('/');

        await signup.signUp({ email, password, confirmPassword: password });

        await page.waitForURL('/dashboard', {waitUntil: 'networkidle'});

        for (let i = 0; i < tasks.length; i++) {
            const task = tasks[i];
            await quickActions.openTaskModal();
            await quickActions.task.title.fill(task.title);
            if (task.description) await quickActions.task.description.fill(task.description);
            await quickActions.task.createButton.click();
            await expect(quickActions.task.modal).not.toBeVisible();
        }

        await nav.openMobileNav();
        await expect(nav.contextLinks.inbox).toBeInViewport();
        await nav.contextLinks.inbox.click({ force: true });

        await page.waitForURL('/inbox', {waitUntil: 'networkidle'});

        await expect(inboxPage.tasks).toHaveCount(1);

        const [owner] = await database.executeQuery(`SELECT "id" FROM "User" WHERE "email" = '${email}'`);
        const [task] = await database.executeQuery(`SELECT "id" FROM "Task" WHERE "owner_id" = '${owner.id}'`);

        inboxPage.tasks.nth(0).click();

        await page.waitForURL(`/tasks/${task.id}`, {waitUntil: 'networkidle'});

        const taskPage = new TaskPageFixture(page, viewport);

        await taskPage.delete.trigger.click();

        await expect(taskPage.delete.confirmButton).toBeVisible();
        await taskPage.delete.confirmButton.click();

        await page.waitForURL('/inbox', {waitUntil: 'networkidle'});

        await expect(inboxPage.tasks).toHaveCount(0);

        await expect(taskPage.delete.modal).not.toBeVisible();

        await signup.cleanup(email, database);
    });
});