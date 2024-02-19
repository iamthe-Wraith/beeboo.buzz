import { MAX_TASK_DESCRIPTION_LENGTH, MAX_TASK_TITLE_LENGTH } from '$lib/constants/task';
import { test, expect } from '../../custom-test';
import { QuickActionsFixture } from '../../fixtures/quick-actions';
import { SignUpFixture } from '../../fixtures/signup';
import { getEmail } from '../../helpers';

test.describe('desktop quick actions - new task', () => {
    test('clicking new task quick action should open new task modal with new task form', async ({ page, viewport, database }) => {
        if (viewport && viewport.width < 768) test.skip();

        const email = getEmail();
        const password = 'Password123!';
        const signup = new SignUpFixture(page);
        const quickActions = new QuickActionsFixture(page, viewport);

        await page.goto('/');

        await signup.signUp({ email, password, confirmPassword: password });

        await page.waitForURL('/dashboard', {waitUntil: 'networkidle'});

        await quickActions.desktopQuickActions.newTask.click();

        await expect(quickActions.task.modal).toBeVisible();
        await expect(quickActions.task.modalClose).toBeVisible();

        await expect(quickActions.task.form).toBeVisible();

        await expect(quickActions.task.title).toBeVisible();
        await expect(quickActions.task.description).toBeVisible();
        await expect(quickActions.task.cancelButton).toBeVisible();
        await expect(quickActions.task.createButton).toBeVisible();
        await expect(quickActions.task.createButton).toBeDisabled();

        await signup.cleanup(email, database);
    });

    test('clicking close button should close new task modal', async ({ page, viewport, database }) => {
        if (viewport && viewport.width < 768) test.skip();

        const email = getEmail();
        const password = 'Password123!';
        const signup = new SignUpFixture(page);
        const quickActions = new QuickActionsFixture(page, viewport);

        await page.goto('/');

        await signup.signUp({ email, password, confirmPassword: password });

        await page.waitForURL('/dashboard', {waitUntil: 'networkidle'});

        await quickActions.desktopQuickActions.newTask.click();

        await expect(quickActions.task.modal).toBeVisible();
        await expect(quickActions.task.modalClose).toBeVisible();

        await quickActions.task.modalClose.click();

        await expect(quickActions.task.modal).not.toBeVisible();

        await signup.cleanup(email, database);
    });

    test('clicking cancel button should close new task modal', async ({ page, viewport, database }) => {
        if (viewport && viewport.width < 768) test.skip();

        const email = getEmail();
        const password = 'Password123!';
        const signup = new SignUpFixture(page);
        const quickActions = new QuickActionsFixture(page, viewport);

        await page.goto('/');

        await signup.signUp({ email, password, confirmPassword: password });

        await page.waitForURL('/dashboard', {waitUntil: 'networkidle'});

        await quickActions.desktopQuickActions.newTask.click();

        await expect(quickActions.task.modal).toBeVisible();
        await expect(quickActions.task.modalClose).toBeVisible();

        await quickActions.task.cancelButton.click();

        await expect(quickActions.task.modal).not.toBeVisible();

        await signup.cleanup(email, database);
    });

    test.describe('creating new task', () => {
        test('should create new task when only a title is provided', async ({ page, viewport, database }) => {
            if (viewport && viewport.width < 768) test.skip();
    
            const email = getEmail();
            const password = 'Password123!';
            const signup = new SignUpFixture(page);
            const quickActions = new QuickActionsFixture(page, viewport);
    
            await page.goto('/');
    
            await signup.signUp({ email, password, confirmPassword: password });
    
            await page.waitForURL('/dashboard', {waitUntil: 'networkidle'});
    
            await quickActions.desktopQuickActions.newTask.click();
    
            await expect(quickActions.task.modal).toBeVisible();

            await quickActions.task.title.fill('Test Task');
            await quickActions.task.createButton.click();

            await expect(quickActions.task.modal).not.toBeVisible();
    
            await signup.cleanup(email, database);
        });

        test('should create new task when title and description are provided', async ({ page, viewport, database }) => {
            if (viewport && viewport.width < 768) test.skip();
    
            const email = getEmail();
            const password = 'Password123!';
            const signup = new SignUpFixture(page);
            const quickActions = new QuickActionsFixture(page, viewport);
    
            await page.goto('/');
    
            await signup.signUp({ email, password, confirmPassword: password });
    
            await page.waitForURL('/dashboard', {waitUntil: 'networkidle'});
    
            await quickActions.desktopQuickActions.newTask.click();
    
            await expect(quickActions.task.modal).toBeVisible();

            await quickActions.task.title.fill('Test Task');
            await quickActions.task.description.fill('Test description');

            await quickActions.task.createButton.click();

            await expect(quickActions.task.modal).not.toBeVisible();
    
            await signup.cleanup(email, database);
        });

        test('should show error if title is empty', async ({ page, viewport, database }) => {
            if (viewport && viewport.width < 768) test.skip();
    
            const email = getEmail();
            const password = 'Password123!';
            const signup = new SignUpFixture(page);
            const quickActions = new QuickActionsFixture(page, viewport);
    
            await page.goto('/');
    
            await signup.signUp({ email, password, confirmPassword: password });
    
            await page.waitForURL('/dashboard', {waitUntil: 'networkidle'});
    
            await quickActions.desktopQuickActions.newTask.click();
    
            await expect(quickActions.task.modal).toBeVisible();

            await quickActions.task.title.focus();
            await page.keyboard.press('Tab');

            await expect(quickActions.task.titleError).toBeVisible();
            await expect(quickActions.task.titleError).toHaveText('Title is required.');

            await expect(quickActions.task.createButton).toBeDisabled();
    
            await signup.cleanup(email, database);
        });

        test('should show error if title is too long', async ({ page, viewport, database }) => {
            if (viewport && viewport.width < 768) test.skip();
    
            const email = getEmail();
            const password = 'Password123!';
            const signup = new SignUpFixture(page);
            const quickActions = new QuickActionsFixture(page, viewport);
    
            await page.goto('/');
    
            await signup.signUp({ email, password, confirmPassword: password });
    
            await page.waitForURL('/dashboard', {waitUntil: 'networkidle'});
    
            await quickActions.desktopQuickActions.newTask.click();
    
            await expect(quickActions.task.modal).toBeVisible();

            await quickActions.task.title.fill('a'.repeat(MAX_TASK_TITLE_LENGTH + 1));
            await page.keyboard.press('Tab');

            await expect(quickActions.task.titleError).toBeVisible();
            await expect(quickActions.task.titleError).toHaveText(`Title must be less than ${MAX_TASK_TITLE_LENGTH} characters.`);

            await expect(quickActions.task.createButton).toBeDisabled();
    
            await signup.cleanup(email, database);
        });

        test('should show error if description is too long', async ({ page, viewport, database }) => {
            if (viewport && viewport.width < 768) test.skip();
    
            const email = getEmail();
            const password = 'Password123!';
            const signup = new SignUpFixture(page);
            const quickActions = new QuickActionsFixture(page, viewport);
    
            await page.goto('/');
    
            await signup.signUp({ email, password, confirmPassword: password });
    
            await page.waitForURL('/dashboard', {waitUntil: 'networkidle'});
    
            await quickActions.desktopQuickActions.newTask.click();
    
            await expect(quickActions.task.modal).toBeVisible();

            await quickActions.task.description.fill('a'.repeat(MAX_TASK_DESCRIPTION_LENGTH + 1));
            await page.keyboard.press('Tab');

            await expect(quickActions.task.descriptionError).toBeVisible();
            await expect(quickActions.task.descriptionError).toHaveText(`Description must be less than ${MAX_TASK_DESCRIPTION_LENGTH} characters.`);

            await expect(quickActions.task.createButton).toBeDisabled();
    
            await signup.cleanup(email, database);
        });
    });
});