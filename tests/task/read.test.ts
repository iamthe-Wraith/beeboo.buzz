import { getEmail } from "../helpers";
import { SignUpFixture } from "../fixtures/signup";
import { QuickActionsFixture } from "../fixtures/quick-actions";
import { test, expect } from "../custom-test";
import { NavFixture } from "../fixtures/nav";
import { ContextPageFixture } from "../fixtures/context-page";
import { TaskPageFixture } from "../fixtures/task-page";

test.describe('task - read', () => {
    test('should display the task info', async ({ page, viewport, database }) => {
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
        await nav.contextLinks.inbox.click({ force: true });

        await page.waitForURL('/inbox', {waitUntil: 'networkidle'});

        await expect(inboxPage.tasks).toHaveCount(1);

        const [owner] = await database.executeQuery(`SELECT "id" FROM "User" WHERE "email" = '${email}'`);
        const [task] = await database.executeQuery(`SELECT "id" FROM "Task" WHERE "owner_id" = '${owner.id}'`);

        inboxPage.tasks.nth(0).click();

        await page.waitForURL(`/tasks/${task.id}`, {waitUntil: 'networkidle'});

        const taskPage = new TaskPageFixture(page, viewport);

        // task info
        await expect(taskPage.taskInfoContainer).toBeVisible();

        await expect(taskPage.taskInfo.backLink).toBeVisible();
        await expect(taskPage.taskInfo.editButton).toBeVisible();
        await expect(taskPage.taskInfo.completeButton).toBeVisible();
        await expect(taskPage.delete.trigger).toBeVisible();

        await expect(taskPage.taskInfo.title).toHaveText(tasks[0].title);
        await expect(taskPage.taskInfo.description).toHaveText(tasks[0].description);

        // task notes
        await expect(taskPage.taskNotesContainer).toBeVisible();

        await expect(taskPage.notes.title).toHaveText('Notes');
        await expect(taskPage.notes.notes).toHaveCount(0);

        // edit task
        await expect(taskPage.editTaskForm).not.toBeVisible();

        await signup.cleanup(email, database);
    });

    test('clicking tasks link should redirect to /tasks', async ({ page, viewport, database }) => {
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
        await nav.contextLinks.inbox.click({ force: true });

        await page.waitForURL('/inbox', {waitUntil: 'networkidle'});

        await expect(inboxPage.tasks).toHaveCount(1);

        const [owner] = await database.executeQuery(`SELECT "id" FROM "User" WHERE "email" = '${email}'`);
        const [task] = await database.executeQuery(`SELECT "id" FROM "Task" WHERE "owner_id" = '${owner.id}'`);

        inboxPage.tasks.nth(0).click();

        await page.waitForURL(`/tasks/${task.id}`, {waitUntil: 'networkidle'});

        const taskPage = new TaskPageFixture(page, viewport);

        // task info
        await expect(taskPage.taskInfoContainer).toBeVisible();

        await expect(taskPage.taskInfo.backLink).toBeVisible();

        await taskPage.taskInfo.backLink.click();

        await page.waitForURL('/inbox', {waitUntil: 'networkidle'});

        await expect(inboxPage.layout).toBeVisible();

        await signup.cleanup(email, database);
    });
});