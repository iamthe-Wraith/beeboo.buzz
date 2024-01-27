import { test, expect } from '../custom-test';
import { getEmail } from '../helpers';
import { SignOutFixture } from '../fixtures/signout';
import { SignInFixture } from '../fixtures/signin';
import { SignUpFixture } from '../fixtures/signup';
import { NavFixture } from '../fixtures/nav';

test('sign out button exists in nav when user is signed in', async ({ page, database, viewport }) => {
    const emailOrUsername = getEmail();
    const password = 'Password123!';
    const signin = new SignInFixture(page);
    const signout = new SignOutFixture(page, viewport);
    const nav = new NavFixture(page, viewport);
    
    await page.goto('/');

    signin.createUser({ email: emailOrUsername, password }, database);

    await signin.signIn({ emailOrUsername, password });

    await page.waitForURL('/dashboard', {waitUntil: 'networkidle'});

    nav.openMobileNav();
    
    await expect(signout.button).toBeVisible();

    await signin.cleanup(emailOrUsername, database);
});

test('user cannot access sign out button when not signed in', async ({ page }) => {
    await page.goto('/');

    const signup = new SignUpFixture(page);
    const signout = new SignOutFixture(page);

    await expect(signup.trigger).toBeVisible();
    await expect(signout.button).toBeHidden();
});

test('clicking the sign out button signs the user out', async ({ page, database, viewport }) => {
    await page.goto('/');

    const email = getEmail();
    const password = 'Password123!';

    const signin = new SignInFixture(page);
    const signout = new SignOutFixture(page, viewport);

    signin.createUser({ email, password }, database);
    signin.signIn({ emailOrUsername: email, password });

    await page.waitForURL('/dashboard', {waitUntil: 'networkidle'});

    await signout.signOut();   

    await page.waitForURL('/', {waitUntil: 'networkidle'});

    await expect(signout.button).toBeHidden();

    await signout.cleanup(email, database);
});