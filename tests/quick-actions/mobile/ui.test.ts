import { test, expect } from '../../custom-test';
import { QuickActionsFixture } from '../../fixtures/quick-actions';
import { SignInFixture } from '../../fixtures/signin';
import { getEmail } from '../../helpers';

test.describe('mobile quick actions - ui', () => {
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
})
