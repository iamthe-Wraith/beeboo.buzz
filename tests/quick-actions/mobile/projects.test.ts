import { test, expect } from '../../custom-test';
import { QuickActionsFixture } from '../../fixtures/quick-actions';
import { SignUpFixture } from '../../fixtures/signup';
import { getEmail } from '../../helpers';

test.describe('mobile quick actions - new project', () => {
    test('clicking new project quick action should open new project modal with new project form', async ({ page, viewport, database }) => {
        if (viewport && viewport.width >= 768) test.skip();

        const email = getEmail();
        const password = 'Password123!';
        const signup = new SignUpFixture(page);
        const quickActions = new QuickActionsFixture(page, viewport);

        await page.goto('/');

        await signup.signUp({ email, password, confirmPassword: password });

        await page.waitForURL('/dashboard', {waitUntil: 'networkidle'});

        await quickActions.mobileQuickActions.newProject.click();

        await expect(quickActions.project.modal).toBeVisible();
        await expect(quickActions.project.modalClose).toBeVisible();

        await expect(quickActions.project.form).toBeVisible();

        await expect(quickActions.project.title).toBeVisible();
        await expect(quickActions.project.notes).toBeVisible();
        await expect(quickActions.project.cancelButton).toBeVisible();
        await expect(quickActions.project.createButton).toBeVisible();
        await expect(quickActions.project.createButton).toBeDisabled();

        await signup.cleanup(email, database);
    });

    test('clicking close button should close new project modal', async ({ page, viewport, database }) => {
        if (viewport && viewport.width >= 768) test.skip();

        const email = getEmail();
        const password = 'Password123!';
        const signup = new SignUpFixture(page);
        const quickActions = new QuickActionsFixture(page, viewport);

        await page.goto('/');

        await signup.signUp({ email, password, confirmPassword: password });

        await page.waitForURL('/dashboard', {waitUntil: 'networkidle'});

        await quickActions.mobileQuickActions.newProject.click();

        await expect(quickActions.project.modal).toBeVisible();
        await expect(quickActions.project.modalClose).toBeVisible();

        await quickActions.project.modalClose.click();

        await expect(quickActions.project.modal).not.toBeVisible();

        await signup.cleanup(email, database);
    });

    test('clicking cancel button should close new project modal', async ({ page, viewport, database }) => {
        if (viewport && viewport.width >= 768) test.skip();

        const email = getEmail();
        const password = 'Password123!';
        const signup = new SignUpFixture(page);
        const quickActions = new QuickActionsFixture(page, viewport);

        await page.goto('/');

        await signup.signUp({ email, password, confirmPassword: password });

        await page.waitForURL('/dashboard', {waitUntil: 'networkidle'});

        await quickActions.mobileQuickActions.newProject.click();

        await expect(quickActions.project.modal).toBeVisible();
        await expect(quickActions.project.modalClose).toBeVisible();

        await quickActions.project.cancelButton.click();

        await expect(quickActions.project.modal).not.toBeVisible();

        await signup.cleanup(email, database);
    });

    test.describe('creating new project', () => {
        test('should create new project when only a title is provided', async ({ page, viewport, database }) => {
            if (viewport && viewport.width >= 768) test.skip();
    
            const email = getEmail();
            const password = 'Password123!';
            const signup = new SignUpFixture(page);
            const quickActions = new QuickActionsFixture(page, viewport);
    
            await page.goto('/');
    
            await signup.signUp({ email, password, confirmPassword: password });
    
            await page.waitForURL('/dashboard', {waitUntil: 'networkidle'});
    
            await quickActions.mobileQuickActions.newProject.click();
    
            await expect(quickActions.project.modal).toBeVisible();

            await quickActions.project.title.fill('Test Project');
            await quickActions.project.createButton.click();

            await expect(quickActions.project.modal).not.toBeVisible();
    
            await signup.cleanup(email, database);
        });

        test('should create new project when title and notes are provided', async ({ page, viewport, database }) => {
            if (viewport && viewport.width >= 768) test.skip();
    
            const email = getEmail();
            const password = 'Password123!';
            const signup = new SignUpFixture(page);
            const quickActions = new QuickActionsFixture(page, viewport);
    
            await page.goto('/');
    
            await signup.signUp({ email, password, confirmPassword: password });
    
            await page.waitForURL('/dashboard', {waitUntil: 'networkidle'});
    
            await quickActions.mobileQuickActions.newProject.click();
    
            await expect(quickActions.project.modal).toBeVisible();

            await quickActions.project.title.fill('Test Project');
            await quickActions.project.notes.fill('Test notes');

            await quickActions.project.createButton.click();

            await expect(quickActions.project.modal).not.toBeVisible();
    
            await signup.cleanup(email, database);
        });

        test('should show error if title is empty', async ({ page, viewport, database }) => {
            if (viewport && viewport.width >= 768) test.skip();
    
            const email = getEmail();
            const password = 'Password123!';
            const signup = new SignUpFixture(page);
            const quickActions = new QuickActionsFixture(page, viewport);
    
            await page.goto('/');
    
            await signup.signUp({ email, password, confirmPassword: password });
    
            await page.waitForURL('/dashboard', {waitUntil: 'networkidle'});
    
            await quickActions.mobileQuickActions.newProject.click();
    
            await expect(quickActions.project.modal).toBeVisible();

            await quickActions.project.title.focus();
            await page.keyboard.press('Tab');

            await expect(quickActions.project.titleError).toBeVisible();
            await expect(quickActions.project.titleError).toHaveText('Title is required.');

            await expect(quickActions.project.createButton).toBeDisabled();
    
            await signup.cleanup(email, database);
        });
    });
});