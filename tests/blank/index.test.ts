import { sleep } from '$lib/utils/gen';
import { test, expect } from '../custom-test';
import { BlankFixture } from '../fixtures/blank';
import { SignUpFixture } from '../fixtures/signup';
import { getEmail } from '../helpers';

test.describe('homepage', () => {
    test('should have a header when user is not signed in', async ({ page }) => {
        await page.goto('/');
        await page.waitForURL('/', {waitUntil: 'networkidle'});

        const blank = new BlankFixture(page);

        expect(blank.header).toBeVisible();

        expect(blank.signInButton).toBeVisible();
        expect(blank.signUpButton).toBeVisible();
    });

    test('should have a header when user is signed in', async ({ page }) => {
        const email = getEmail();
        const password = 'Password123!';
    
        await page.goto('/');
    
        const signup = new SignUpFixture(page);
        const blank = new BlankFixture(page);
        
        await signup.signUp({
            email, 
            password, 
            confirmPassword: password,
        });

        await page.waitForURL('/dashboard', {waitUntil: 'networkidle'});

        await page.goto('/');
        await page.waitForURL('/', {waitUntil: 'networkidle'});

        expect(blank.header).toBeVisible();

        expect(blank.dashboardLink).toBeVisible();
        expect(blank.signoutButton).toBeVisible();
    });

    test('user should be able to sign out', async ({ page }) => {
        const email = getEmail();
        const password = 'Password123!';
    
        await page.goto('/');
        await page.waitForURL('/', {waitUntil: 'networkidle'});
    
        const signup = new SignUpFixture(page);
        const blank = new BlankFixture(page);
        
        await signup.signUp({
            email, 
            password, 
            confirmPassword: password,
        });

        await page.waitForURL('/dashboard', {waitUntil: 'networkidle'});

        await page.goto('/');

        expect(blank.header).toBeVisible();

        blank.signoutButton.click();

        await sleep(500);

        expect(blank.header).toBeVisible();

        expect(blank.signInButton).toBeVisible();
        expect(blank.signUpButton).toBeVisible();
    });

    test('user should be able to navigate to their dashboard when signed in', async ({ page }) => {
        const email = getEmail();
        const password = 'Password123!';
    
        await page.goto('/');
        await page.waitForURL('/', {waitUntil: 'networkidle'});
    
        const signup = new SignUpFixture(page);
        const blank = new BlankFixture(page);
        
        await signup.signUp({
            email, 
            password, 
            confirmPassword: password,
        });

        await page.waitForURL('/dashboard', {waitUntil: 'networkidle'});

        await page.goto('/');

        expect(blank.header).toBeVisible();

        blank.dashboardLink.click();

        await page.waitForURL('/dashboard', {waitUntil: 'networkidle'});
    });
});