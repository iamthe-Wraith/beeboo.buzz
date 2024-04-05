import { getEmail } from "../helpers";
import { SignUpFixture } from "../fixtures/signup";
import { QuickActionsFixture } from "../fixtures/quick-actions";
import { test, expect } from "../custom-test";
import { NavFixture } from "../fixtures/nav";
import { ContextPageFixture } from "../fixtures/context-page";
import { TaskFixture } from "../fixtures/task";

test.describe('tasks - read', () => {
    test('should display messaging when no tasks are found', async ({ page, viewport, database }) => {
        const email = getEmail();
        const password = 'Password123!';

        const signup = new SignUpFixture(page);
        const nav = new NavFixture(page, viewport);
        const inbox = new ContextPageFixture(page, viewport);

        await page.goto('/');

        await signup.signUp({ email, password, confirmPassword: password });

        await page.waitForURL('/dashboard', {waitUntil: 'networkidle'});

        await nav.openMobileNav();
        await expect(nav.contextLinks.inbox).toBeInViewport();
        await nav.contextLinks.inbox.click({ force: true });

        await page.waitForURL('/inbox', {waitUntil: 'networkidle'});

        await expect(inbox.layout).toBeVisible();
        await expect(inbox.title).toHaveText('Inbox');
        await expect(inbox.count).toHaveText(`${0} tasks`);
        await expect(inbox.tasks).toHaveCount(0);
        await expect(inbox.noTasks).toBeVisible();
        await expect(inbox.noTasks).toHaveText('No tasks found');

        await signup.cleanup(email, database);
    });

    test('should display all tasks for the current context', async ({ page, viewport, database }) => {
        const email = getEmail();
        const password = 'Password123!';
        const tasks = [
            {
                title: 'Test Task 1',
                description: 'Test Description 1',
            },
            {
                title: 'Test Task 2',
                description: 'Test Description 2',
            },
            {
                title: 'Test Task 3',
            },
            {
                title: 'Test Task 4',
            },
            {
                title: 'Test Task 5',
                description: 'Test Description 5',
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
            if (task.description) await quickActions.task.description.fill(task.description);
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
});
