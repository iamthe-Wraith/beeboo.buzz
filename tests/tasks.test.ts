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
                await quickActions.taskTitle.fill(task.title);
                if (task.notes) await quickActions.taskNotes.fill(task.notes);
                await quickActions.taskCreateButton.click();
                await expect(quickActions.taskModal).not.toBeVisible();
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
            await quickActions.taskTitle.fill(taskData.title);
            await quickActions.taskCreateButton.click();
            await expect(quickActions.taskModal).not.toBeVisible();

            await nav.openMobileNav();
            await nav.contextLinks.inbox.click();

            await page.waitForURL('/inbox', {waitUntil: 'networkidle'});

            await expect(contextPage.tasks).toHaveCount(1);

            const task = new TaskFixture(contextPage.tasks.nth(0), viewport);

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
            await quickActions.taskTitle.fill(taskData.title);
            await quickActions.taskNotes.fill(taskData.notes);
            await quickActions.taskCreateButton.click();
            await expect(quickActions.taskModal).not.toBeVisible();

            await nav.openMobileNav();
            await nav.contextLinks.inbox.click();

            await page.waitForURL('/inbox', {waitUntil: 'networkidle'});

            await expect(contextPage.tasks).toHaveCount(1);

            const task = new TaskFixture(contextPage.tasks.nth(0), viewport);

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
            await quickActions.taskTitle.fill(taskData.title);
            await quickActions.taskCreateButton.click();
            await expect(quickActions.taskModal).not.toBeVisible();

            await nav.openMobileNav();
            await nav.contextLinks.inbox.click();

            await page.waitForURL('/inbox', {waitUntil: 'networkidle'});

            await expect(contextPage.tasks).toHaveCount(1);

            const task = new TaskFixture(contextPage.tasks.nth(0), viewport);

            await expect(task.icons.notes).not.toBeVisible();

            await signup.cleanup(email, database);
        });
    });

    test.describe('update', () => {
        
    });
});