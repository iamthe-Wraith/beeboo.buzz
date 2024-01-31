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

        // quick project tests go here...

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
        
                await expect(quickActions.taskModal).toBeVisible();
                await expect(quickActions.taskModalClose).toBeVisible();

                await expect(quickActions.taskForm).toBeVisible();

                await expect(quickActions.taskTitle).toBeVisible();
                await expect(quickActions.taskNotes).toBeVisible();
                await expect(quickActions.taskCancelButton).toBeVisible();
                await expect(quickActions.taskCreateButton).toBeVisible();
                await expect(quickActions.taskCreateButton).toBeDisabled();
        
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
        
                await expect(quickActions.taskModal).toBeVisible();
                await expect(quickActions.taskModalClose).toBeVisible();

                await quickActions.taskModalClose.click();

                await expect(quickActions.taskModal).not.toBeVisible();
        
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
        
                await expect(quickActions.taskModal).toBeVisible();
                await expect(quickActions.taskModalClose).toBeVisible();

                await quickActions.taskCancelButton.click();

                await expect(quickActions.taskModal).not.toBeVisible();
        
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
            
                    await expect(quickActions.taskModal).toBeVisible();

                    await quickActions.taskTitle.fill('Test Task');
                    await quickActions.taskCreateButton.click();
    
                    await expect(quickActions.taskModal).not.toBeVisible();
            
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
            
                    await expect(quickActions.taskModal).toBeVisible();

                    await quickActions.taskTitle.fill('Test Task');
                    await quickActions.taskNotes.fill('Test notes');

                    await quickActions.taskCreateButton.click();
    
                    await expect(quickActions.taskModal).not.toBeVisible();
            
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
            
                    await expect(quickActions.taskModal).toBeVisible();

                    await quickActions.taskTitle.focus();
                    await page.keyboard.press('Tab');

                    await expect(quickActions.taskTitleError).toBeVisible();
                    await expect(quickActions.taskTitleError).toHaveText('Title is required.');

                    await expect(quickActions.taskCreateButton).toBeDisabled();
            
                    await signup.cleanup(email, database);
                });
            });
        });
    })

    test.describe('desktop quick actions', () => {
        // note: testing for buttons to exist is done in nav tests as
        // quick actions buttons are in the global nav on desktop.

        // quick project tests go here...

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
        
                await expect(quickActions.taskModal).toBeVisible();
                await expect(quickActions.taskModalClose).toBeVisible();

                await expect(quickActions.taskForm).toBeVisible();

                await expect(quickActions.taskTitle).toBeVisible();
                await expect(quickActions.taskNotes).toBeVisible();
                await expect(quickActions.taskCancelButton).toBeVisible();
                await expect(quickActions.taskCreateButton).toBeVisible();
                await expect(quickActions.taskCreateButton).toBeDisabled();
        
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
        
                await expect(quickActions.taskModal).toBeVisible();
                await expect(quickActions.taskModalClose).toBeVisible();

                await quickActions.taskModalClose.click();

                await expect(quickActions.taskModal).not.toBeVisible();
        
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
        
                await expect(quickActions.taskModal).toBeVisible();
                await expect(quickActions.taskModalClose).toBeVisible();

                await quickActions.taskCancelButton.click();

                await expect(quickActions.taskModal).not.toBeVisible();
        
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
            
                    await expect(quickActions.taskModal).toBeVisible();

                    await quickActions.taskTitle.fill('Test Task');
                    await quickActions.taskCreateButton.click();
    
                    await expect(quickActions.taskModal).not.toBeVisible();
            
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
            
                    await expect(quickActions.taskModal).toBeVisible();

                    await quickActions.taskTitle.fill('Test Task');
                    await quickActions.taskNotes.fill('Test notes');

                    await quickActions.taskCreateButton.click();
    
                    await expect(quickActions.taskModal).not.toBeVisible();
            
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
            
                    await expect(quickActions.taskModal).toBeVisible();

                    await quickActions.taskTitle.focus();
                    await page.keyboard.press('Tab');

                    await expect(quickActions.taskTitleError).toBeVisible();
                    await expect(quickActions.taskTitleError).toHaveText('Title is required.');

                    await expect(quickActions.taskCreateButton).toBeDisabled();
            
                    await signup.cleanup(email, database);
                });
            });
        });
    });
});
