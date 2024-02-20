import { getEmail } from "../helpers";
import { SignUpFixture } from "../fixtures/signup";
import { QuickActionsFixture } from "../fixtures/quick-actions";
import { test, expect } from "../custom-test";
import { NavFixture } from "../fixtures/nav";
import { ContextPageFixture } from "../fixtures/context-page";
import { TaskFixture } from "../fixtures/task";

test.describe('tasks - update', () => {
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
});