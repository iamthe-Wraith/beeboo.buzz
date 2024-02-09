import { getEmail } from "./helpers";
import { SignUpFixture } from "./fixtures/signup";
import { QuickActionsFixture } from "./fixtures/quick-actions";
import { test, expect } from "./custom-test";
import { NavFixture } from "./fixtures/nav";
import { ContextPageFixture } from "./fixtures/context-page";
import { TaskFixture } from "./fixtures/task";

test.describe('tasks', () => {
    test.describe('read', () => {
        test('should display all tasks for the current context', async ({ page, viewport, database }) => {
            const email = getEmail();
            const password = 'Password123!';
            const tasks = [
                {
                    title: 'Test Task 1',
                    notes: 'Test Notes 1',
                },
                {
                    title: 'Test Task 2',
                    notes: 'Test Notes 2',
                },
                {
                    title: 'Test Task 3',
                },
                {
                    title: 'Test Task 4',
                },
                {
                    title: 'Test Task 5',
                    notes: 'Test Notes 5',
                },
            ];

            const signup = new SignUpFixture(page);
            const nav = new NavFixture(page, viewport);
            const quickActions = new QuickActionsFixture(page, viewport);
            const contextPage = new ContextPageFixture(page, viewport);
    
            await page.goto('/');
    
            await signup.signUp({ email, password, confirmPassword: password });
    
            await page.waitForURL('/dashboard', {waitUntil: 'networkidle'});

            for (let i = 0; i < tasks.length; i++) {
                const task = tasks[i];
                await quickActions.openTaskModal();
                await quickActions.task.title.fill(task.title);
                if (task.notes) await quickActions.task.notes.fill(task.notes);
                await quickActions.task.createButton.click();
                await expect(quickActions.task.modal).not.toBeVisible();
            }

            await nav.openMobileNav();
            await nav.contextLinks.inbox.click();

            await page.waitForURL('/inbox', {waitUntil: 'networkidle'});

            await expect(contextPage.layout).toBeVisible();
            await expect(contextPage.title).toHaveText('Inbox');
            await expect(contextPage.count).toHaveText(`${tasks.length} tasks`);
            await expect(contextPage.tasks).toHaveCount(tasks.length);

            await signup.cleanup(email, database);
        });

        test('task should display a completion button, and a title', async ({ page, viewport, database }) => {
            const email = getEmail();
            const password = 'Password123!';

            const taskData = { title: 'Test Task 1' }

            const signup = new SignUpFixture(page);
            const nav = new NavFixture(page, viewport);
            const quickActions = new QuickActionsFixture(page, viewport);
            const contextPage = new ContextPageFixture(page, viewport);
    
            await page.goto('/');
    
            await signup.signUp({ email, password, confirmPassword: password });
    
            await page.waitForURL('/dashboard', {waitUntil: 'networkidle'});

            await quickActions.openTaskModal();
            await quickActions.task.title.fill(taskData.title);
            await quickActions.task.createButton.click();
            await expect(quickActions.task.modal).not.toBeVisible();

            await nav.openMobileNav();
            await nav.contextLinks.inbox.click();

            await page.waitForURL('/inbox', {waitUntil: 'networkidle'});

            await expect(contextPage.tasks).toHaveCount(1);

            const task = new TaskFixture(contextPage.tasks.nth(0), page, viewport);

            await expect(task.completeButton).toBeVisible();
            await expect(task.completeButtonIcon).toHaveCSS('opacity', '0');
            await expect(task.title).toHaveText(taskData.title);

            await signup.cleanup(email, database);
        });

        test('task should display a notes icon if task has notes', async ({ page, viewport, database }) => {
            const email = getEmail();
            const password = 'Password123!';

            const taskData = {
                title: 'Test Task 1',
                notes: 'Test Notes 1',
            }

            const signup = new SignUpFixture(page);
            const nav = new NavFixture(page, viewport);
            const quickActions = new QuickActionsFixture(page, viewport);
            const contextPage = new ContextPageFixture(page, viewport);
    
            await page.goto('/');
    
            await signup.signUp({ email, password, confirmPassword: password });
    
            await page.waitForURL('/dashboard', {waitUntil: 'networkidle'});

            await quickActions.openTaskModal();
            await quickActions.task.title.fill(taskData.title);
            await quickActions.task.notes.fill(taskData.notes);
            await quickActions.task.createButton.click();
            await expect(quickActions.task.modal).not.toBeVisible();

            await nav.openMobileNav();
            await nav.contextLinks.inbox.click();

            await page.waitForURL('/inbox', {waitUntil: 'networkidle'});

            await expect(contextPage.tasks).toHaveCount(1);

            const task = new TaskFixture(contextPage.tasks.nth(0), page, viewport);

            await expect(task.icons.notes).toBeVisible();

            await signup.cleanup(email, database);
        });

        test('task should not display a notes icon if task does not have any notes', async ({ page, viewport, database }) => {
            const email = getEmail();
            const password = 'Password123!';

            const taskData = { title: 'Test Task 1' }

            const signup = new SignUpFixture(page);
            const nav = new NavFixture(page, viewport);
            const quickActions = new QuickActionsFixture(page, viewport);
            const contextPage = new ContextPageFixture(page, viewport);
    
            await page.goto('/');
    
            await signup.signUp({ email, password, confirmPassword: password });
    
            await page.waitForURL('/dashboard', {waitUntil: 'networkidle'});

            await quickActions.openTaskModal();
            await quickActions.task.title.fill(taskData.title);
            await quickActions.task.createButton.click();
            await expect(quickActions.task.modal).not.toBeVisible();

            await nav.openMobileNav();
            await nav.contextLinks.inbox.click();

            await page.waitForURL('/inbox', {waitUntil: 'networkidle'});

            await expect(contextPage.tasks).toHaveCount(1);

            const task = new TaskFixture(contextPage.tasks.nth(0), page, viewport);

            await expect(task.icons.notes).not.toBeVisible();

            await signup.cleanup(email, database);
        });
    });

    test.describe('update', () => {
        test('should be able to complete a task', async ({ page, viewport, database }) => {
            const email = getEmail();
            const password = 'Password123!';

            const taskData = { title: 'Test Task 1' }

            const signup = new SignUpFixture(page);
            const nav = new NavFixture(page, viewport);
            const quickActions = new QuickActionsFixture(page, viewport);
            const contextPage = new ContextPageFixture(page, viewport);

            await page.goto('/');

            await signup.signUp({ email, password, confirmPassword: password });

            await page.waitForURL('/dashboard', {waitUntil: 'networkidle'});

            await quickActions.openTaskModal();
            await quickActions.task.title.fill(taskData.title);
            await quickActions.task.createButton.click();
            await expect(quickActions.task.modal).not.toBeVisible();

            await nav.openMobileNav();
            await nav.contextLinks.inbox.click();

            await page.waitForURL('/inbox', {waitUntil: 'networkidle'});

            await expect(contextPage.tasks).toHaveCount(1);

            const task = new TaskFixture(contextPage.tasks.nth(0), page, viewport);

            await task.completeButton.click();

            await expect(contextPage.tasks).toHaveCount(0);

            await signup.cleanup(email, database);
        });

        test('should be able to open the task editor', async ({ page, viewport, database }) => {
            const email = getEmail();
            const password = 'Password123!';

            const taskData = { title: 'Test Task 1' }

            const signup = new SignUpFixture(page);
            const nav = new NavFixture(page, viewport);
            const quickActions = new QuickActionsFixture(page, viewport);
            const contextPage = new ContextPageFixture(page, viewport);

            await page.goto('/');

            await signup.signUp({ email, password, confirmPassword: password });

            await page.waitForURL('/dashboard', {waitUntil: 'networkidle'});

            await quickActions.openTaskModal();
            await quickActions.task.title.fill(taskData.title);
            await quickActions.task.createButton.click();
            await expect(quickActions.task.modal).not.toBeVisible();

            await nav.openMobileNav();
            await nav.contextLinks.inbox.click();

            await page.waitForURL('/inbox', {waitUntil: 'networkidle'});

            await expect(contextPage.tasks).toHaveCount(1);

            const task = new TaskFixture(contextPage.tasks.nth(0), page, viewport);

            await task.task.click();

            await expect(task.modal).toBeVisible();
            await expect(task.form).toBeVisible();

            await expect(task.editable.title).toHaveValue(taskData.title);
            await expect(task.editable.notes).toHaveValue('');

            await expect(JSON.parse(await task.editable.contextValue.inputValue()).label).toEqual('Inbox');

            await signup.cleanup(email, database);
        });
       
        test('should be able to edit the title', async ({ page, viewport, database }) => {
            const email = getEmail();
            const password = 'Password123!';

            const taskData = { title: 'Test Task 1' };
            const updatedTaskData = { title: 'Updated Task 1' };

            const signup = new SignUpFixture(page);
            const nav = new NavFixture(page, viewport);
            const quickActions = new QuickActionsFixture(page, viewport);
            const contextPage = new ContextPageFixture(page, viewport);

            await page.goto('/');

            await signup.signUp({ email, password, confirmPassword: password });

            await page.waitForURL('/dashboard', {waitUntil: 'networkidle'});

            await quickActions.openTaskModal();
            await quickActions.task.title.fill(taskData.title);
            await quickActions.task.createButton.click();
            await expect(quickActions.task.modal).not.toBeVisible();

            await nav.openMobileNav();
            await nav.contextLinks.inbox.click();

            await page.waitForURL('/inbox', {waitUntil: 'networkidle'});

            await expect(contextPage.tasks).toHaveCount(1);

            const task = new TaskFixture(contextPage.tasks.nth(0), page, viewport);

            await task.task.click();

            await expect(task.modal).toBeVisible();
            await expect(task.form).toBeVisible();

            await task.editable.title.clear();
            await task.editable.title.fill(updatedTaskData.title);

            await task.updateButton.click();

            await expect(task.modal).not.toBeVisible();
            await expect(contextPage.tasks).toHaveCount(1);
            await expect(task.title).toHaveText(updatedTaskData.title);

            await signup.cleanup(email, database);
        });

        test('should be able to edit the notes', async ({ page, viewport, database }) => {
            const email = getEmail();
            const password = 'Password123!';

            const taskData = { title: 'Test Task 1' };
            const updatedTaskData = { title: 'Updated Task 1', notes: 'These are some updated notes.' };

            const signup = new SignUpFixture(page);
            const nav = new NavFixture(page, viewport);
            const quickActions = new QuickActionsFixture(page, viewport);
            const contextPage = new ContextPageFixture(page, viewport);

            await page.goto('/');

            await signup.signUp({ email, password, confirmPassword: password });

            await page.waitForURL('/dashboard', {waitUntil: 'networkidle'});

            await quickActions.openTaskModal();
            await quickActions.task.title.fill(taskData.title);
            await quickActions.task.createButton.click();
            await expect(quickActions.task.modal).not.toBeVisible();

            await nav.openMobileNav();
            await nav.contextLinks.inbox.click();

            await page.waitForURL('/inbox', {waitUntil: 'networkidle'});

            await expect(contextPage.tasks).toHaveCount(1);

            const task = new TaskFixture(contextPage.tasks.nth(0), page, viewport);

            await expect(task.icons.notes).not.toBeVisible();

            await task.task.click();

            await expect(task.modal).toBeVisible();
            await expect(task.form).toBeVisible();

            await task.editable.notes.clear();
            await task.editable.notes.fill(updatedTaskData.notes);

            await task.updateButton.click();

            await expect(task.modal).not.toBeVisible();
            await expect(contextPage.tasks).toHaveCount(1);
            await expect(task.icons.notes).toBeVisible();

            await task.task.click();

            await expect(task.modal).toBeVisible();
            await expect(task.form).toBeVisible();
            await expect(task.editable.notes).toHaveValue(updatedTaskData.notes);

            await signup.cleanup(email, database);
        });

        // can edit the context
        test('should be able to edit the context', async ({ page, viewport, database }) => {
            const email = getEmail();
            const password = 'Password123!';

            const taskData = { title: 'Test Task 1' }

            const signup = new SignUpFixture(page);
            const nav = new NavFixture(page, viewport);
            const quickActions = new QuickActionsFixture(page, viewport);
            const contextPage = new ContextPageFixture(page, viewport);

            await page.goto('/');

            await signup.signUp({ email, password, confirmPassword: password });

            await page.waitForURL('/dashboard', {waitUntil: 'networkidle'});

            const [user] = await database.executeQuery(`SELECT * FROM "User" WHERE "email" = '${email}'`);

            await quickActions.openTaskModal();
            await quickActions.task.title.fill(taskData.title);
            await quickActions.task.createButton.click();
            await expect(quickActions.task.modal).not.toBeVisible();

            await nav.openMobileNav();
            await nav.contextLinks.inbox.click();

            await page.waitForURL('/inbox', {waitUntil: 'networkidle'});

            await expect(contextPage.tasks).toHaveCount(1);

            const task = new TaskFixture(contextPage.tasks.nth(0), page, viewport);

            await task.task.click();

            await task.editable.contextTrigger.click();

            await expect(task.editable.context).toBeVisible();
            const option = await task.editable.context.getByText('At Work');
            await option.scrollIntoViewIfNeeded();
            await option.click();

            await task.updateButton.click();

            await expect(task.modal).not.toBeVisible();
            await expect(contextPage.tasks).toHaveCount(0);

            await nav.openMobileNav();
            await nav.contextLinks.atWork.click();

            const [atWorkContext] = await database.executeQuery(`SELECT * FROM "Context" WHERE "owner_id" = '${user.id}' AND "name" = 'At Work'`);

            await page.waitForURL(`/contexts/${atWorkContext.id}`, {waitUntil: 'networkidle'});

            await expect(contextPage.tasks).toHaveCount(1);

            await signup.cleanup(email, database);
        });

        test('should be able to cancel edit', async ({ page, viewport, database }) => {
            const email = getEmail();
            const password = 'Password123!';

            const taskData = { title: 'Test Task 1' }

            const signup = new SignUpFixture(page);
            const nav = new NavFixture(page, viewport);
            const quickActions = new QuickActionsFixture(page, viewport);
            const contextPage = new ContextPageFixture(page, viewport);

            await page.goto('/');

            await signup.signUp({ email, password, confirmPassword: password });

            await page.waitForURL('/dashboard', {waitUntil: 'networkidle'});

            await quickActions.openTaskModal();
            await quickActions.task.title.fill(taskData.title);
            await quickActions.task.createButton.click();
            await expect(quickActions.task.modal).not.toBeVisible();

            await nav.openMobileNav();
            await nav.contextLinks.inbox.click();

            await page.waitForURL('/inbox', {waitUntil: 'networkidle'});

            await expect(contextPage.tasks).toHaveCount(1);

            const task = new TaskFixture(contextPage.tasks.nth(0), page, viewport);

            await task.task.click();

            await expect(task.modal).toBeVisible();
            await expect(task.form).toBeVisible();

            await task.editable.title.clear();
            await task.editable.title.fill('Updated Task 1');

            await task.cancelButton.click();

            await expect(task.modal).not.toBeVisible();

            await expect(contextPage.tasks).toHaveCount(1);
            await expect(task.title).toHaveText(taskData.title);

            await signup.cleanup(email, database);
        });
    });
});