import { test, expect } from './custom-test';
import { QuickActionsFixture } from './fixtures/quick-actions';
import { SignInFixture } from './fixtures/signin';
import { SignUpFixture } from './fixtures/signup';
import { getEmail } from './helpers';

test.describe('quick actions', () => {
    test.describe('mobile quick actions', () => {
        test('should have quick action buttons', async ({ page, viewport, database }) => {
            if (viewport && viewport.width >= 768) test.skip();
    
            const email = getEmail();
            const password = 'Password123!';
            const signin = new SignInFixture(page);
            const quickActions = new QuickActionsFixture(page, viewport);
    
            await signin.createUser({ email, password }, database);
    
            await page.goto('/');
    
            await signin.signIn({ emailOrUsername: email, password });
    
            await page.waitForURL('/dashboard', {waitUntil: 'networkidle'});
    
            await expect(quickActions.mobileQuickActions.container).toBeVisible();
            await expect(quickActions.mobileQuickActions.newProject).toBeVisible();
            await expect(quickActions.mobileQuickActions.newTask).toBeVisible();
    
            await signin.cleanup(email, database);
        });

        test.describe('new project', () => {
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

        test.describe('new task', () => {
            test('clicking new task quick action should open new task modal with new task form', async ({ page, viewport, database }) => {
                if (viewport && viewport.width >= 768) test.skip();
        
                const email = getEmail();
                const password = 'Password123!';
                const signup = new SignUpFixture(page);
                const quickActions = new QuickActionsFixture(page, viewport);
        
                await page.goto('/');
        
                await signup.signUp({ email, password, confirmPassword: password });
        
                await page.waitForURL('/dashboard', {waitUntil: 'networkidle'});
        
                await quickActions.mobileQuickActions.newTask.click();
        
                await expect(quickActions.task.modal).toBeVisible();
                await expect(quickActions.task.modalClose).toBeVisible();

                await expect(quickActions.task.form).toBeVisible();

                await expect(quickActions.task.title).toBeVisible();
                await expect(quickActions.task.notes).toBeVisible();
                await expect(quickActions.task.cancelButton).toBeVisible();
                await expect(quickActions.task.createButton).toBeVisible();
                await expect(quickActions.task.createButton).toBeDisabled();
        
                await signup.cleanup(email, database);
            });

            test('clicking close button should close new task modal', async ({ page, viewport, database }) => {
                if (viewport && viewport.width >= 768) test.skip();
        
                const email = getEmail();
                const password = 'Password123!';
                const signup = new SignUpFixture(page);
                const quickActions = new QuickActionsFixture(page, viewport);
        
                await page.goto('/');
        
                await signup.signUp({ email, password, confirmPassword: password });
        
                await page.waitForURL('/dashboard', {waitUntil: 'networkidle'});
        
                await quickActions.mobileQuickActions.newTask.click();
        
                await expect(quickActions.task.modal).toBeVisible();
                await expect(quickActions.task.modalClose).toBeVisible();

                await quickActions.task.modalClose.click();

                await expect(quickActions.task.modal).not.toBeVisible();
        
                await signup.cleanup(email, database);
            });

            test('clicking cancel button should close new task modal', async ({ page, viewport, database }) => {
                if (viewport && viewport.width >= 768) test.skip();
        
                const email = getEmail();
                const password = 'Password123!';
                const signup = new SignUpFixture(page);
                const quickActions = new QuickActionsFixture(page, viewport);
        
                await page.goto('/');
        
                await signup.signUp({ email, password, confirmPassword: password });
        
                await page.waitForURL('/dashboard', {waitUntil: 'networkidle'});
        
                await quickActions.mobileQuickActions.newTask.click();
        
                await expect(quickActions.task.modal).toBeVisible();
                await expect(quickActions.task.modalClose).toBeVisible();

                await quickActions.task.cancelButton.click();

                await expect(quickActions.task.modal).not.toBeVisible();
        
                await signup.cleanup(email, database);
            });

            test.describe('creating new task', () => {
                test('should create new task when only a title is provided', async ({ page, viewport, database }) => {
                    if (viewport && viewport.width >= 768) test.skip();
            
                    const email = getEmail();
                    const password = 'Password123!';
                    const signup = new SignUpFixture(page);
                    const quickActions = new QuickActionsFixture(page, viewport);
            
                    await page.goto('/');
            
                    await signup.signUp({ email, password, confirmPassword: password });
            
                    await page.waitForURL('/dashboard', {waitUntil: 'networkidle'});
            
                    await quickActions.mobileQuickActions.newTask.click();
            
                    await expect(quickActions.task.modal).toBeVisible();

                    await quickActions.task.title.fill('Test Task');
                    await quickActions.task.createButton.click();
    
                    await expect(quickActions.task.modal).not.toBeVisible();
            
                    await signup.cleanup(email, database);
                });

                test('should create new task when title and notes are provided', async ({ page, viewport, database }) => {
                    if (viewport && viewport.width >= 768) test.skip();
            
                    const email = getEmail();
                    const password = 'Password123!';
                    const signup = new SignUpFixture(page);
                    const quickActions = new QuickActionsFixture(page, viewport);
            
                    await page.goto('/');
            
                    await signup.signUp({ email, password, confirmPassword: password });
            
                    await page.waitForURL('/dashboard', {waitUntil: 'networkidle'});
            
                    await quickActions.mobileQuickActions.newTask.click();
            
                    await expect(quickActions.task.modal).toBeVisible();

                    await quickActions.task.title.fill('Test Task');
                    await quickActions.task.notes.fill('Test notes');

                    await quickActions.task.createButton.click();
    
                    await expect(quickActions.task.modal).not.toBeVisible();
            
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
            
                    await quickActions.mobileQuickActions.newTask.click();
            
                    await expect(quickActions.task.modal).toBeVisible();

                    await quickActions.task.title.focus();
                    await page.keyboard.press('Tab');

                    await expect(quickActions.task.titleError).toBeVisible();
                    await expect(quickActions.task.titleError).toHaveText('Title is required.');

                    await expect(quickActions.task.createButton).toBeDisabled();
            
                    await signup.cleanup(email, database);
                });
            });
        });
    })

    test.describe('desktop quick actions', () => {
        // note: testing for buttons to exist is done in nav tests as
        // quick actions buttons are in the global nav on desktop.

        test.describe('new project', () => {
            test('clicking new project quick action should open new project modal with new project form', async ({ page, viewport, database }) => {
                if (viewport && viewport.width < 768) test.skip();
        
                const email = getEmail();
                const password = 'Password123!';
                const signup = new SignUpFixture(page);
                const quickActions = new QuickActionsFixture(page, viewport);
        
                await page.goto('/');
        
                await signup.signUp({ email, password, confirmPassword: password });
        
                await page.waitForURL('/dashboard', {waitUntil: 'networkidle'});
        
                await quickActions.desktopQuickActions.newProject.click();
        
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
                if (viewport && viewport.width < 768) test.skip();
        
                const email = getEmail();
                const password = 'Password123!';
                const signup = new SignUpFixture(page);
                const quickActions = new QuickActionsFixture(page, viewport);
        
                await page.goto('/');
        
                await signup.signUp({ email, password, confirmPassword: password });
        
                await page.waitForURL('/dashboard', {waitUntil: 'networkidle'});
        
                await quickActions.desktopQuickActions.newProject.click();
        
                await expect(quickActions.project.modal).toBeVisible();
                await expect(quickActions.project.modalClose).toBeVisible();

                await quickActions.project.modalClose.click();

                await expect(quickActions.project.modal).not.toBeVisible();
        
                await signup.cleanup(email, database);
            });

            test('clicking cancel button should close new project modal', async ({ page, viewport, database }) => {
                if (viewport && viewport.width < 768) test.skip();
        
                const email = getEmail();
                const password = 'Password123!';
                const signup = new SignUpFixture(page);
                const quickActions = new QuickActionsFixture(page, viewport);
        
                await page.goto('/');
        
                await signup.signUp({ email, password, confirmPassword: password });
        
                await page.waitForURL('/dashboard', {waitUntil: 'networkidle'});
        
                await quickActions.desktopQuickActions.newProject.click();
        
                await expect(quickActions.project.modal).toBeVisible();
                await expect(quickActions.project.modalClose).toBeVisible();

                await quickActions.project.cancelButton.click();

                await expect(quickActions.project.modal).not.toBeVisible();
        
                await signup.cleanup(email, database);
            });

            test.describe('creating new project', () => {
                test('should create new project when only a title is provided', async ({ page, viewport, database }) => {
                    if (viewport && viewport.width < 768) test.skip();
            
                    const email = getEmail();
                    const password = 'Password123!';
                    const signup = new SignUpFixture(page);
                    const quickActions = new QuickActionsFixture(page, viewport);
            
                    await page.goto('/');
            
                    await signup.signUp({ email, password, confirmPassword: password });
            
                    await page.waitForURL('/dashboard', {waitUntil: 'networkidle'});
            
                    await quickActions.desktopQuickActions.newProject.click();
            
                    await expect(quickActions.project.modal).toBeVisible();

                    await quickActions.project.title.fill('Test Project');
                    await quickActions.project.createButton.click();
    
                    await expect(quickActions.project.modal).not.toBeVisible();
            
                    await signup.cleanup(email, database);
                });

                test('should create new project when title and notes are provided', async ({ page, viewport, database }) => {
                    if (viewport && viewport.width < 768) test.skip();
            
                    const email = getEmail();
                    const password = 'Password123!';
                    const signup = new SignUpFixture(page);
                    const quickActions = new QuickActionsFixture(page, viewport);
            
                    await page.goto('/');
            
                    await signup.signUp({ email, password, confirmPassword: password });
            
                    await page.waitForURL('/dashboard', {waitUntil: 'networkidle'});
            
                    await quickActions.desktopQuickActions.newProject.click();
            
                    await expect(quickActions.project.modal).toBeVisible();

                    await quickActions.project.title.fill('Test Project');
                    await quickActions.project.notes.fill('Test notes');

                    await quickActions.project.createButton.click();
    
                    await expect(quickActions.project.modal).not.toBeVisible();
            
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
            
                    await quickActions.desktopQuickActions.newProject.click();
            
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

        test.describe('new task', () => {
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
                await expect(quickActions.task.notes).toBeVisible();
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

                test('should create new task when title and notes are provided', async ({ page, viewport, database }) => {
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
                    await quickActions.task.notes.fill('Test notes');

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
            });
        });
    });
});
