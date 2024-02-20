import { getEmail } from "../helpers";
import { SignUpFixture } from "../fixtures/signup";
import { QuickActionsFixture } from "../fixtures/quick-actions";
import { test, expect } from "../custom-test";
import { NavFixture } from "../fixtures/nav";
import { TaskPageFixture } from "../fixtures/task-page";
import { ContextPageFixture } from "../fixtures/context-page";
import { MAX_TASK_DESCRIPTION_LENGTH, MAX_TASK_TITLE_LENGTH } from "$lib/constants/task";

test.describe('task - update', () => {
    test('user should be able to complete the task', async ({ page, viewport, database }) => {
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

        await expect(taskPage.taskInfo.status).toBeVisible();
        await expect(taskPage.taskInfo.status).toHaveText('In Progress');

        await expect(taskPage.taskInfo.completeButton).toBeVisible();

        await expect(taskPage.taskInfo.completeButton).toHaveText('Complete');
        await taskPage.taskInfo.completeButton.click();

        await expect(taskPage.taskInfo.completeButton).toHaveText('Reopen');
        await expect(taskPage.taskInfo.status).toHaveText('Completed');

        await signup.cleanup(email, database);
    });

    test.describe('edit task info', () => {
        test('clicking the edit button displays the task edit form', async ({ page, viewport, database }) => {
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
    
            await expect(taskPage.taskInfo.editButton).toBeVisible();
            await taskPage.taskInfo.editButton.click();
    
            // edit task
            await expect(taskPage.editTaskForm).toBeVisible();
    
            await expect(taskPage.edit.title).toHaveValue(tasks[0].title);
            await expect(taskPage.edit.description).toHaveValue(tasks[0].description);
            await expect(taskPage.edit.submitButton).toBeVisible();
            await expect(taskPage.edit.submitButton).toBeDisabled();
            await expect(taskPage.edit.cancelButton).toBeVisible();
    
            await signup.cleanup(email, database);
        });
    
        test('clicking the cancel button returns user to task details page', async ({ page, viewport, database }) => {
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
    
            await expect(taskPage.taskInfo.editButton).toBeVisible();
            await taskPage.taskInfo.editButton.click();
    
            await expect(taskPage.editTaskForm).toBeVisible();
            await expect(taskPage.taskInfoContainer).not.toBeVisible();
    
            await expect(taskPage.edit.cancelButton).toBeVisible();
            await taskPage.edit.cancelButton.click();
            
            await expect(taskPage.taskInfoContainer).toBeVisible();
    
            await signup.cleanup(email, database);
        });
    
        test('user should be able to update the task title', async ({ page, viewport, database }) => {
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
    
            await taskPage.taskInfo.editButton.click();
    
            await taskPage.edit.title.clear();
            await taskPage.edit.title.fill('Updated Title');
            await taskPage.edit.title.blur();
    
            await taskPage.edit.submitButton.click();
            
            await expect(taskPage.taskInfoContainer).toBeVisible();
    
            await expect(taskPage.taskInfo.title).toHaveText('Updated Title');
    
            await signup.cleanup(email, database);
        });
    
        test('user should be able to update the task description', async ({ page, viewport, database }) => {
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
    
            await taskPage.taskInfo.editButton.click();
    
            await taskPage.edit.description.clear();
            await taskPage.edit.description.fill('Updated description');
            await taskPage.edit.description.blur();
    
            await taskPage.edit.submitButton.click();
            
            await expect(taskPage.taskInfoContainer).toBeVisible();
    
            await expect(taskPage.taskInfo.description).toHaveText('Updated description');
    
            await signup.cleanup(email, database);
        });
    
        test('user should not be able to submit the form if the title is empty', async ({ page, viewport, database }) => {
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
    
            await taskPage.taskInfo.editButton.click();
    
            await taskPage.edit.title.clear();
            await taskPage.edit.title.blur();
    
            await expect(taskPage.edit.titleError).toBeVisible();
            await expect(taskPage.edit.titleError).toHaveText('Title is required.');
            await expect(taskPage.edit.submitButton).toBeDisabled();
    
            await signup.cleanup(email, database);
        });
    
        test('user should not be able to submit the form if the title is too long', async ({ page, viewport, database }) => {
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
    
            await taskPage.taskInfo.editButton.click();
    
            await taskPage.edit.title.clear();
            await taskPage.edit.title.fill('a'.repeat(MAX_TASK_TITLE_LENGTH + 1));
            await taskPage.edit.title.blur();
    
            await expect(taskPage.edit.titleError).toBeVisible();
            await expect(taskPage.edit.titleError).toHaveText(`Title must be less than ${MAX_TASK_TITLE_LENGTH} characters.`);
            await expect(taskPage.edit.submitButton).toBeDisabled();
    
            await signup.cleanup(email, database);
        });

        test('user should not be able to submit the form if the description is too long', async ({ page, viewport, database }) => {
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
    
            await taskPage.taskInfo.editButton.click();
    
            await taskPage.edit.description.clear();
            await taskPage.edit.description.fill('a'.repeat(MAX_TASK_DESCRIPTION_LENGTH + 1));
            await taskPage.edit.description.blur();
    
            await expect(taskPage.edit.descriptionError).toBeVisible();
            await expect(taskPage.edit.descriptionError).toHaveText(`Description must be less than ${MAX_TASK_DESCRIPTION_LENGTH} characters.`);
            await expect(taskPage.edit.submitButton).toBeDisabled();
    
            await signup.cleanup(email, database);
        });
    
        test('user should not be able to submit the form if no changes have been made', async ({ page, viewport, database }) => {
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
    
            await taskPage.taskInfo.editButton.click();
    
            await taskPage.edit.title.clear();
            await taskPage.edit.title.blur();
    
            await taskPage.edit.title.fill(tasks[0].title);
            await taskPage.edit.title.blur();
    
            await expect(taskPage.edit.titleError).not.toBeVisible();
    
            await expect(taskPage.edit.submitButton).toBeDisabled();
    
            await signup.cleanup(email, database);
        });
    })
});