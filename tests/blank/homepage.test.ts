import { test, expect } from '../custom-test';
import { BlankFixture } from '../fixtures/blank';
import { NavFixture } from '../fixtures/nav';
import { SignUpFixture } from '../fixtures/signup';
import { getEmail } from '../helpers';

test.describe('homepage', () => {
    test('should have a header when user is not signed in', async ({ page }) => {
        await page.goto('/');

        const blank = new BlankFixture(page);

        await expect(blank.header).toBeVisible();

        await expect(blank.logo).toBeVisible();
        await expect(blank.signInButton).toBeVisible();
        await expect(blank.signUpButton).toBeVisible();
    });

    test('should have a header when user is signed in', async ({ page }) => {
        const email = getEmail();
        const password = 'Password123!';
    
        const signup = new SignUpFixture(page);
        const blank = new BlankFixture(page);

        await page.goto('/');
        
        await signup.signUp({
            email, 
            password, 
            confirmPassword: password,
        });

        await page.waitForURL('/dashboard', {waitUntil: 'networkidle'});

        await page.goto('/');
        await page.waitForURL('/', {waitUntil: 'networkidle'});

        await expect(blank.header).toBeVisible();

        await expect(blank.dashboardLink).toBeVisible();
        await expect(blank.signoutButton).toBeVisible();
    });

    test('user should be able to sign out', async ({ page, viewport }) => {
        const email = getEmail();
        const password = 'Password123!';
    
        const blank = new BlankFixture(page);
        const signup = new SignUpFixture(page);
        const nav = new NavFixture(page, viewport);

        await page.goto('/');
        
        await signup.signUp({
            email, 
            password, 
            confirmPassword: password,
        });

        await page.waitForURL('/dashboard', {waitUntil: 'networkidle'});

        if (viewport && viewport.width < 768) {
            await nav.openMobileNav();
        }

        await expect(nav.dashboardLink).toBeVisible();

        await page.goto('/');
        
        await expect(blank.header).toBeVisible();

        await blank.signoutButton.click();

        await expect(blank.header).toBeVisible();
        await expect(blank.signInButton).toBeVisible();
        await expect(blank.signUpButton).toBeVisible();
    });

    test('user should be able to navigate to their dashboard when signed in', async ({ page, viewport }) => {
        const email = getEmail();
        const password = 'Password123!';

        const blank = new BlankFixture(page);
        const signup = new SignUpFixture(page);
        const nav = new NavFixture(page, viewport);
    
        await page.goto('/');
        
        await signup.signUp({
            email, 
            password, 
            confirmPassword: password,
        });

        await page.waitForURL('/dashboard', {waitUntil: 'networkidle'});

        if (viewport && viewport.width < 768) {
            await nav.openMobileNav();
        }

        await expect(nav.dashboardLink).toBeVisible();
;
        await page.goto('/');

        await expect(blank.header).toBeVisible();

        await blank.dashboardLink.click();

        await page.waitForURL('/dashboard', {waitUntil: 'networkidle'});
    });
});