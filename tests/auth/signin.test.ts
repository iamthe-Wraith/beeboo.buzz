import { AccountType } from '@prisma/client';
import { test, expect } from '../custom-test';
import { getEmail } from '../helpers';
import { generatePasswordHash } from '$lib/utils/auth';

test('sign in button exists in header', async ({ page }) => {
    await page.goto('/');

    const signInButton = await page.getByTestId('global-header').getByRole('button', { name: 'Sign in' });
    await expect(signInButton).toBeVisible();

    const authModal = await page.getByTestId('auth-modal');
    await expect(authModal).not.toBeVisible();
});

test('clicking sign in button opens auth modal with sign in form displayed', async ({ page }) => {
    await page.goto('/');

    const authModal = await page.getByTestId('auth-modal');
    await expect(authModal).not.toBeVisible();

    const signInButton = await page.getByTestId('global-header').getByRole('button', { name: 'Sign in' });
    await signInButton.click();

    await expect(authModal).toBeVisible();

    const signInForm = await authModal.getByTestId('signin-form');
    await expect(signInForm).toBeVisible();
})

test('sign in form has email or username, and password fields', async ({ page }) => {
    await page.goto('/');

    const authModal = await page.getByTestId('auth-modal');
    await expect(authModal).not.toBeVisible();

    const signInButton = await page.getByTestId('global-header').getByRole('button', { name: 'Sign in' });
    await signInButton.click();

    await expect(authModal).toBeVisible();

    const signInForm = await page.getByTestId('signin-form');
    await expect(signInForm).toBeVisible();

    const emailField = await signInForm.getByLabel('Email or username');
    await expect(emailField).toBeVisible();

    const passwordField = await signInForm.getByLabel('Password', { exact: true });
    await expect(passwordField).toBeVisible();
})

test('sign in form has submit button', async ({ page }) => {
    await page.goto('/');

    const authModal = await page.getByTestId('auth-modal');
    await expect(authModal).not.toBeVisible();

    const signInButton = await page.getByTestId('global-header').getByRole('button', { name: 'Sign in' });
    await signInButton.click();

    await expect(authModal).toBeVisible();

    const signInForm = await authModal.getByTestId('signin-form');
    await expect(signInForm).toBeVisible();

    const submitButton = await signInForm.getByRole('button', { name: 'Sign in' });
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toBeDisabled();
})

test('sign in form has button that will take user to sign up form', async ({ page }) => {
    await page.goto('/');

    const signInButton = await page.getByTestId('global-header').getByRole('button', { name: 'Sign in' });
    await signInButton.click();

    const signInForm = await page.getByTestId('signin-form');
    await expect(signInForm).toBeVisible();

    const toSignUpButton = await signInForm.getByRole('button', { name: 'Sign up' });
    await expect(toSignUpButton).toBeVisible();
    await toSignUpButton.click();

    const signUpForm = await page.getByTestId('signup-form');
    await expect(signUpForm).toBeVisible();

    await expect(signInForm).not.toBeVisible();
})

test('sign in modal can be closed', async ({ page }) => {
    await page.goto('/');

    const authModal = await page.getByTestId('auth-modal');
    await expect(authModal).not.toBeVisible();

    const signInButton = await page.getByTestId('global-header').getByRole('button', { name: 'Sign in' });
    await signInButton.click();

    await expect(authModal).toBeVisible();

    const closeButton = await authModal.getByTestId('close-modal-button');
    await closeButton.click();

    await expect(authModal).not.toBeVisible();
})

test('sign in form resets on close', async ({ page }) => {
    await page.goto('/');

    const authModal = await page.getByTestId('auth-modal');
    await expect(authModal).not.toBeVisible();

    const signInButton = await page.getByTestId('global-header').getByRole('button', { name: 'Sign in' });
    await signInButton.click();

    await expect(authModal).toBeVisible();

    const signInForm = await authModal.getByTestId('signin-form');
    await expect(signInForm).toBeVisible();

    const emailOrUsernameField = await signInForm.getByLabel('Email or username');
    await emailOrUsernameField.fill('testuser');

    const passwordField = await signInForm.getByLabel('Password', { exact: true });
    await passwordField.fill('Password123!');

    const closeButton = await authModal.getByTestId('close-modal-button');
    await closeButton.click();

    await expect(authModal).not.toBeVisible();

    await signInButton.click();

    await expect(signInForm).toBeVisible();

    await expect(emailOrUsernameField).toHaveValue('');
    await expect(passwordField).toHaveValue('');
})

//#region email or username
test('sign in form email or username field should not show error message when valid email is entered', async ({ page }) => {
    await page.goto('/');

    const authModal = await page.getByTestId('auth-modal');
    await expect(authModal).not.toBeVisible();

    const signInButton = await page.getByTestId('global-header').getByRole('button', { name: 'Sign in' });
    await signInButton.click();

    await expect(authModal).toBeVisible();

    const signInForm = await authModal.getByTestId('signin-form');
    await expect(signInForm).toBeVisible();

    const emailField = await signInForm.getByLabel('Email or username');
    await emailField.fill('testuser@example.com');
    await emailField.press('Tab');

    const emailOrUsernameError = await signInForm.getByTestId('email_or_username-error');
    await expect(emailOrUsernameError).not.toBeVisible();
})

test('sign in form email or username field should not show error message when valid username is entered', async ({ page }) => {
    await page.goto('/');

    const authModal = await page.getByTestId('auth-modal');
    await expect(authModal).not.toBeVisible();

    const signInButton = await page.getByTestId('global-header').getByRole('button', { name: 'Sign in' });
    await signInButton.click();

    await expect(authModal).toBeVisible();

    const signInForm = await authModal.getByTestId('signin-form');
    await expect(signInForm).toBeVisible();

    const emailField = await signInForm.getByLabel('Email or username');
    await emailField.fill('testuser');
    await emailField.press('Tab');

    const emailOrUsernameError = await signInForm.getByTestId('email_or_username-error');
    await expect(emailOrUsernameError).not.toBeVisible();
})

test('sign in form email or username field shows error if left empty', async ({ page }) => {
    await page.goto('/');

    const authModal = await page.getByTestId('auth-modal');
    await expect(authModal).not.toBeVisible();

    const signInButton = await page.getByTestId('global-header').getByRole('button', { name: 'Sign in' });
    await signInButton.click();

    await expect(authModal).toBeVisible();

    const signInForm = await authModal.getByTestId('signin-form');
    await expect(signInForm).toBeVisible();

    const emailOrUsernameField = await signInForm.getByLabel('Email or username');
    await emailOrUsernameField.focus();
    await emailOrUsernameField.press('Tab');

    const emailOrUsernameError = await signInForm.getByTestId('email_or_username-error');
    await expect(emailOrUsernameError).toBeVisible();
    await expect(emailOrUsernameError).toHaveText('Email or username is required');
})
//#endregion

//#region password
test('sign in form password field should not show error message when password is entered', async ({ page }) => {
    await page.goto('/');

    const authModal = await page.getByTestId('auth-modal');
    await expect(authModal).not.toBeVisible();
    
    const signInButton = await page.getByTestId('global-header').getByRole('button', { name: 'Sign in' });
    await signInButton.click();
    
    await expect(authModal).toBeVisible();
    
    const signInForm = await authModal.getByTestId('signin-form');
    await expect(signInForm).toBeVisible();
    
    const passwordField = await signInForm.getByLabel('Password', { exact: true });
    await passwordField.fill('Password123!');
    await passwordField.press('Tab');
    
    const passwordError = await signInForm.getByTestId('password-error');
    await expect(passwordError).not.toBeVisible();
})

test('sign in form password field should show error message when no password is entered', async ({ page }) => {
    await page.goto('/');

    const authModal = await page.getByTestId('auth-modal');
    await expect(authModal).not.toBeVisible();
    
    const signInButton = await page.getByTestId('global-header').getByRole('button', { name: 'Sign in' });
    await signInButton.click();
    
    await expect(authModal).toBeVisible();
    
    const signInForm = await authModal.getByTestId('signin-form');
    await expect(signInForm).toBeVisible();
    
    const passwordField = await signInForm.getByLabel('Password', { exact: true });
    await passwordField.focus();
    await passwordField.press('Tab');
    
    const passwordError = await signInForm.getByTestId('password-error');
    await expect(passwordError).toBeVisible();
    await expect(passwordError).toHaveText('Password is required');
})
//#endregion

//#region submit
test('the sign in button should become enabled when all fields are filled in, and there are no errors', async ({ page }) => {
    await page.goto('/');

    const signInButton = await page.getByTestId('global-header').getByRole('button', { name: 'Sign in' });
    await signInButton.click();

    const signInForm = await page.getByTestId('signin-form');
    await expect(signInForm).toBeVisible();

    const submitButton = await signInForm.getByRole('button', { name: 'Sign in' });
    await expect(submitButton).toBeDisabled();

    const emailOrUsernameField = await signInForm.getByLabel('Email or username');
    await emailOrUsernameField.fill('testuser@test.com');

    const passwordField = await signInForm.getByLabel('Password', { exact: true });
    await passwordField.fill('Password123!');

    await expect(submitButton).toBeEnabled();
})

test('clicking sign in button should submit form and redirect user to /dashboard when sign in is successful', async ({ page, database }) => {
    const email = getEmail();
    const password = 'Password123!';

    await database.executeQuery(`INSERT INTO "User" (email, username, password, account_type) VALUES ('${email}', '${email.split('@')[0]}', '${await generatePasswordHash(password)}', '${AccountType.FREE}')`);

    await page.goto('/');

    const signInButton = await page.getByTestId('global-header').getByRole('button', { name: 'Sign in' });
    await signInButton.click();

    const signInForm = await page.getByTestId('signin-form');
    await expect(signInForm).toBeVisible();

    const emailOrUsernameField = await signInForm.getByLabel('Email or username');
    await emailOrUsernameField.fill(email);

    const passwordField = await signInForm.getByLabel('Password', { exact: true });
    await passwordField.fill(password);

    const submitButton = await signInForm.getByRole('button', { name: 'Sign in' });
    await submitButton.click();

    const dashboard = await page.getByTestId('dashboard');
    await expect(dashboard).toBeVisible();

    await expect(signInButton).not.toBeVisible();

    const signOutButton = await page.getByTestId('global-header').getByRole('button', { name: 'Sign out' });
    await expect(signOutButton).toBeVisible();

    await database.executeQuery(`DELETE FROM "User" WHERE email = '${email}'`);
});

test('sign in submission should fail if user with submitted email isn\'t found', async ({ page, database }) => {
    const email = getEmail();

    try {
        await page.goto('/');

        const signInButton = await page.getByTestId('global-header').getByRole('button', { name: 'Sign in' });
        await signInButton.click();

        const signInForm = await page.getByTestId('signin-form');
        await expect(signInForm).toBeVisible();

        const submitButton = await signInForm.getByRole('button', { name: 'Sign in' });
        await expect(submitButton).toBeDisabled();

        const emailOrUsernameField = await signInForm.getByLabel('Email or username');
        await emailOrUsernameField.fill(email);

        const passwordField = await signInForm.getByLabel('Password', { exact: true });
        await passwordField.fill('Password123!');

        await expect(submitButton).toBeEnabled();

        await submitButton.click({force: true});

        const genError = await signInForm.getByTestId('gen-error');
        await expect(genError).toBeVisible();
        await expect(genError).toHaveText('Invalid credentials.');
    } finally {
        await database.executeQuery(`DELETE FROM "User" WHERE email = '${email}'`);
    }
});

test('sign in submission should fail if invalid credentials are submitted', async ({ page, database }) => {
    const email = getEmail();

    try {
        await database.executeQuery(`INSERT INTO "User" (email, username, password, account_type) VALUES ('${email}', '${email.split('@')[0]}', '${await generatePasswordHash('Password123!')}', '${AccountType.FREE}')`);

        await page.goto('/');

        const signInButton = await page.getByTestId('global-header').getByRole('button', { name: 'Sign in' });
        await signInButton.click();

        const signInForm = await page.getByTestId('signin-form');
        await expect(signInForm).toBeVisible();

        const submitButton = await signInForm.getByRole('button', { name: 'Sign in' });
        await expect(submitButton).toBeDisabled();

        const emailOrUsernameField = await signInForm.getByLabel('Email or username');
        await emailOrUsernameField.fill(email);

        const passwordField = await signInForm.getByLabel('Password', { exact: true });
        await passwordField.fill('WrongPassword');

        await expect(submitButton).toBeEnabled();

        await submitButton.click({force: true});

        const genError = await signInForm.getByTestId('gen-error');
        await expect(genError).toBeVisible();
        await expect(genError).toHaveText('Invalid credentials.');
    } finally {
        await database.executeQuery(`DELETE FROM "User" WHERE email = '${email}'`);
    }
});
//#endregion