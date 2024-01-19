import { faker } from '@faker-js/faker';
import { test, expect } from './custom-test';
import { generatePasswordHash } from '$lib/utils/auth';
import { AccountType } from '@prisma/client';

//#region signup
test('sign up button exists in header', async ({ page }) => {
    await page.goto('/');

    const signUpButton = await page.getByTestId('global-header').getByRole('button', { name: 'Sign up' });
    await expect(signUpButton).toBeVisible();

    const authModal = await page.getByTestId('auth-modal');
    await expect(authModal).not.toBeVisible();
});

test('clicking sign up button opens auth modal with sign up form displayed', async ({ page }) => {
    await page.goto('/');

    const authModal = await page.getByTestId('auth-modal');
    await expect(authModal).not.toBeVisible();

    const signUpButton = await page.getByTestId('global-header').getByRole('button', { name: 'Sign up' });
    await signUpButton.click();

    await expect(authModal).toBeVisible();

    const signUpForm = await authModal.getByTestId('signup-form');
    await expect(signUpForm).toBeVisible();
})

test('sign up form has username, email, password, and confirm password fields', async ({ page }) => {
    await page.goto('/');

    const authModal = await page.getByTestId('auth-modal');
    await expect(authModal).not.toBeVisible();

    const signUpButton = await page.getByTestId('global-header').getByRole('button', { name: 'Sign up' });
    await signUpButton.click();

    await expect(authModal).toBeVisible();

    const signUpForm = await page.getByTestId('signup-form');
    await expect(signUpForm).toBeVisible();

    const usernameField = await signUpForm.getByLabel('Username');
    await expect(usernameField).toBeVisible();

    const emailField = await signUpForm.getByLabel('Email');
    await expect(emailField).toBeVisible();

    const passwordField = await signUpForm.getByLabel('Password', { exact: true });
    await expect(passwordField).toBeVisible();

    const confirmPasswordField = await signUpForm.getByLabel('Confirm password');
    await expect(confirmPasswordField).toBeVisible();
})

test('sign up form has submit button', async ({ page }) => {
    await page.goto('/');

    const authModal = await page.getByTestId('auth-modal');
    await expect(authModal).not.toBeVisible();

    const signUpButton = await page.getByTestId('global-header').getByRole('button', { name: 'Sign up' });
    await signUpButton.click();

    await expect(authModal).toBeVisible();

    const signUpForm = await authModal.getByTestId('signup-form');
    await expect(signUpForm).toBeVisible();

    const submitButton = await signUpForm.getByRole('button', { name: 'Sign up' });
    await expect(submitButton).toBeVisible();
})

test('sign up form has link to login form', async ({ page }) => {
    await page.goto('/');

    const signUpButton = await page.getByTestId('global-header').getByRole('button', { name: 'Sign up' });
    await signUpButton.click();

    const signUpForm = await page.getByTestId('signup-form');
    await expect(signUpForm).toBeVisible();

    const loginLink = await signUpForm.getByRole('button', { name: 'Sign in' });
    await expect(loginLink).toBeVisible();
})

test('sign up modal can be closed', async ({ page }) => {
    await page.goto('/');

    const authModal = await page.getByTestId('auth-modal');
    await expect(authModal).not.toBeVisible();

    const signUpButton = await page.getByTestId('global-header').getByRole('button', { name: 'Sign up' });
    await signUpButton.click();

    await expect(authModal).toBeVisible();

    const closeButton = await authModal.getByTestId('close-modal-button');
    await closeButton.click();

    await expect(authModal).not.toBeVisible();
})

test('sign up form resets on close', async ({ page }) => {
    await page.goto('/');

    const authModal = await page.getByTestId('auth-modal');
    await expect(authModal).not.toBeVisible();

    const signUpButton = await page.getByTestId('global-header').getByRole('button', { name: 'Sign up' });
    await signUpButton.click();

    await expect(authModal).toBeVisible();

    const signUpForm = await authModal.getByTestId('signup-form');
    await expect(signUpForm).toBeVisible();

    const usernameField = await signUpForm.getByLabel('Username');
    await usernameField.fill('testuser');

    const emailField = await signUpForm.getByLabel('Email');
    await emailField.fill('test@test.com');

    const passwordField = await signUpForm.getByLabel('Password', { exact: true });
    await passwordField.fill('Password123!');

    const confirmPasswordField = await signUpForm.getByLabel('Confirm password');
    await confirmPasswordField.fill('Password123!');

    const closeButton = await authModal.getByTestId('close-modal-button');
    await closeButton.click();

    await expect(authModal).not.toBeVisible();

    await signUpButton.click();

    await expect(signUpForm).toBeVisible();

    await expect(usernameField).toHaveValue('');
    await expect(emailField).toHaveValue('');
    await expect(passwordField).toHaveValue('');
    await expect(confirmPasswordField).toHaveValue('');
})

//#region email
test('sign up form email field should not show error message when valid email is entered', async ({ page }) => {
    await page.goto('/');

    const authModal = await page.getByTestId('auth-modal');
    await expect(authModal).not.toBeVisible();

    const signUpButton = await page.getByTestId('global-header').getByRole('button', { name: 'Sign up' });
    await signUpButton.click();

    await expect(authModal).toBeVisible();

    const signUpForm = await authModal.getByTestId('signup-form');
    await expect(signUpForm).toBeVisible();

    const emailField = await signUpForm.getByLabel('Email');
    await emailField.fill('testuser@example.com');
    await emailField.press('Tab');

    const emailError = await signUpForm.getByTestId('email-error');
    await expect(emailError).not.toBeVisible();
})

test('sign up form email field shows error if left empty', async ({ page }) => {
    await page.goto('/');

    const authModal = await page.getByTestId('auth-modal');
    await expect(authModal).not.toBeVisible();

    const signUpButton = await page.getByTestId('global-header').getByRole('button', { name: 'Sign up' });
    await signUpButton.click();

    await expect(authModal).toBeVisible();

    const signUpForm = await authModal.getByTestId('signup-form');
    await expect(signUpForm).toBeVisible();

    const emailField = await signUpForm.getByLabel('Email');
    await emailField.focus();
    await emailField.press('Tab');

    const emailError = await signUpForm.getByTestId('email-error');
    await expect(emailError).toBeVisible();
    await expect(emailError).toHaveText('Email is required');
})

test('sign up form email field shows error if an invalid email is entered', async ({ page }) => {
    await page.goto('/');

    const authModal = await page.getByTestId('auth-modal');
    await expect(authModal).not.toBeVisible();

    const signUpButton = await page.getByTestId('global-header').getByRole('button', { name: 'Sign up' });
    await signUpButton.click();

    await expect(authModal).toBeVisible();

    const signUpForm = await authModal.getByTestId('signup-form');
    await expect(signUpForm).toBeVisible();

    const emailField = await signUpForm.getByLabel('Email');
    await emailField.fill('invalid');
    await emailField.press('Tab');

    const emailError = await signUpForm.getByTestId('email-error');
    await expect(emailError).toBeVisible();
    await expect(emailError).toHaveText('Invalid email');
})

test('sign up form email field should auto populate the username field when no username has been entered', async ({ page }) => {
    await page.goto('/');

    const authModal = await page.getByTestId('auth-modal');
    await expect(authModal).not.toBeVisible();

    const signUpButton = await page.getByTestId('global-header').getByRole('button', { name: 'Sign up' });
    await signUpButton.click();

    await expect(authModal).toBeVisible();

    const signUpForm = await authModal.getByTestId('signup-form');
    await expect(signUpForm).toBeVisible();

    const emailField = await signUpForm.getByLabel('Email');
    await emailField.fill('testuser@example.com');
    await emailField.press('Tab');

    const emailError = await signUpForm.getByTestId('email-error');
    await expect(emailError).not.toBeVisible();
    
    const usernameField = await signUpForm.getByLabel('Username');
    await expect(usernameField).toHaveValue('testuser');
})
//#endregion

//#region password
test('sign up form password field should not show error message when valid password is entered', async ({ page }) => {
    await page.goto('/');

    const authModal = await page.getByTestId('auth-modal');
    await expect(authModal).not.toBeVisible();
    
    const signUpButton = await page.getByTestId('global-header').getByRole('button', { name: 'Sign up' });
    await signUpButton.click();
    
    await expect(authModal).toBeVisible();
    
    const signUpForm = await authModal.getByTestId('signup-form');
    await expect(signUpForm).toBeVisible();
    
    const passwordField = await signUpForm.getByLabel('Password', { exact: true });
    await passwordField.fill('Password123!');
    await passwordField.press('Tab');
    
    const passwordError = await signUpForm.getByTestId('password-error');
    await expect(passwordError).not.toBeVisible();
})

test('sign up form password field should show error message when no password is entered', async ({ page }) => {
    await page.goto('/');

    const authModal = await page.getByTestId('auth-modal');
    await expect(authModal).not.toBeVisible();
    
    const signUpButton = await page.getByTestId('global-header').getByRole('button', { name: 'Sign up' });
    await signUpButton.click();
    
    await expect(authModal).toBeVisible();
    
    const signUpForm = await authModal.getByTestId('signup-form');
    await expect(signUpForm).toBeVisible();
    
    const passwordField = await signUpForm.getByLabel('Password', { exact: true });
    await passwordField.focus();
    await passwordField.press('Tab');
    
    const passwordError = await signUpForm.getByTestId('password-error');
    await expect(passwordError).toBeVisible();
    await expect(passwordError).toHaveText('Password is required');
})

test('sign up form password field should show error message when password is too short', async ({ page }) => {
    await page.goto('/');

    const authModal = await page.getByTestId('auth-modal');
    await expect(authModal).not.toBeVisible();
    
    const signUpButton = await page.getByTestId('global-header').getByRole('button', { name: 'Sign up' });
    await signUpButton.click();
    
    await expect(authModal).toBeVisible();
    
    const signUpForm = await authModal.getByTestId('signup-form');
    await expect(signUpForm).toBeVisible();
    
    const passwordField = await signUpForm.getByLabel('Password', { exact: true });
    await passwordField.fill('Pa1#');
    await passwordField.press('Tab');
    
    const passwordError = await signUpForm.getByTestId('password-error');
    await expect(passwordError).toBeVisible();
    await expect(passwordError).toHaveText('Password must be at least 8 characters');
})

test('sign up form password field should show error message when password is too long', async ({ page }) => {
    await page.goto('/');

    const authModal = await page.getByTestId('auth-modal');
    await expect(authModal).not.toBeVisible();
    
    const signUpButton = await page.getByTestId('global-header').getByRole('button', { name: 'Sign up' });
    await signUpButton.click();
    
    await expect(authModal).toBeVisible();
    
    const signUpForm = await authModal.getByTestId('signup-form');
    await expect(signUpForm).toBeVisible();
    
    const passwordField = await signUpForm.getByLabel('Password', { exact: true });
    await passwordField.fill('Pa1#987asdfjbajJHSJHGjhbuyfg27657ghjbadsfjhavsdjhbT&^%$^%#jahsdgjfhadvfadfhuagdjvba&^%ghvasjdgJHGJHvjasbvdjhagdkljdasjbfajsd');
    await passwordField.press('Tab');

    const passwordError = await signUpForm.getByTestId('password-error');
    await expect(passwordError).toBeVisible();
    await expect(passwordError).toHaveText('Password must be less than 100 characters');
})

test('sign up form password field should show error message when password does not contain a lowercase letter', async ({ page }) => {
    await page.goto('/');

    const authModal = await page.getByTestId('auth-modal');
    await expect(authModal).not.toBeVisible();
    
    const signUpButton = await page.getByTestId('global-header').getByRole('button', { name: 'Sign up' });
    await signUpButton.click();
    
    await expect(authModal).toBeVisible();
    
    const signUpForm = await authModal.getByTestId('signup-form');
    await expect(signUpForm).toBeVisible();
    
    const passwordField = await signUpForm.getByLabel('Password', { exact: true });
    await passwordField.fill('PASSWORD123!');
    await passwordField.press('Tab');
    
    const passwordError = await signUpForm.getByTestId('password-error');
    await expect(passwordError).toBeVisible();
    await expect(passwordError).toHaveText('Password must contain at least one lowercase letter');
})

test('sign up form password field should show error message when password does not contain an uppercase letter', async ({ page }) => {
    await page.goto('/');

    const authModal = await page.getByTestId('auth-modal');
    await expect(authModal).not.toBeVisible();
    
    const signUpButton = await page.getByTestId('global-header').getByRole('button', { name: 'Sign up' });
    await signUpButton.click();
    
    await expect(authModal).toBeVisible();
    
    const signUpForm = await authModal.getByTestId('signup-form');
    await expect(signUpForm).toBeVisible();
    
    const passwordField = await signUpForm.getByLabel('Password', { exact: true });
    await passwordField.fill('password123!');
    await passwordField.press('Tab');
    
    const passwordError = await signUpForm.getByTestId('password-error');
    await expect(passwordError).toBeVisible();
    await expect(passwordError).toHaveText('Password must contain at least one uppercase letter');
})

test('sign up form password field should show error message when password does not contain a number', async ({ page }) => {
    await page.goto('/');

    const authModal = await page.getByTestId('auth-modal');
    await expect(authModal).not.toBeVisible();
    
    const signUpButton = await page.getByTestId('global-header').getByRole('button', { name: 'Sign up' });
    await signUpButton.click();
    
    await expect(authModal).toBeVisible();
    
    const signUpForm = await authModal.getByTestId('signup-form');
    await expect(signUpForm).toBeVisible();
    
    const passwordField = await signUpForm.getByLabel('Password', { exact: true });
    await passwordField.fill('Password!');
    await passwordField.press('Tab');
    
    const passwordError = await signUpForm.getByTestId('password-error');
    await expect(passwordError).toBeVisible();
    await expect(passwordError).toHaveText('Password must contain at least one number');
})

test('sign up form password field should show error message when password does not contain a special character', async ({ page }) => {
    await page.goto('/');

    const authModal = await page.getByTestId('auth-modal');
    await expect(authModal).not.toBeVisible();
    
    const signUpButton = await page.getByTestId('global-header').getByRole('button', { name: 'Sign up' });
    await signUpButton.click();
    
    await expect(authModal).toBeVisible();
    
    const signUpForm = await authModal.getByTestId('signup-form');
    await expect(signUpForm).toBeVisible();
    
    const passwordField = await signUpForm.getByLabel('Password', { exact: true });
    await passwordField.fill('Password123');
    await passwordField.press('Tab');
    
    const passwordError = await signUpForm.getByTestId('password-error');
    await expect(passwordError).toBeVisible();
    await expect(passwordError).toHaveText('Password must contain at least one special character: !@#$%^&*()_-+={[}]|:;"\'<,>.');
})
//#endregion

//#region confirm password
test('sign up form confirm password field should not show error message when passwords do not match', async ({ page }) => {
    await page.goto('/');

    const authModal = await page.getByTestId('auth-modal');
    await expect(authModal).not.toBeVisible();
    
    const signUpButton = await page.getByTestId('global-header').getByRole('button', { name: 'Sign up' });
    await signUpButton.click();
    
    await expect(authModal).toBeVisible();
    
    const signUpForm = await authModal.getByTestId('signup-form');
    await expect(signUpForm).toBeVisible();
    
    const password = 'Password123!';

    const passwordField = await signUpForm.getByLabel('Password', { exact: true });
    await passwordField.fill(password);
    await passwordField.press('Tab');

    const passwordError = await signUpForm.getByTestId('password-error');
    await expect(passwordError).not.toBeVisible();

    const confirmPasswordField = await signUpForm.getByLabel('Confirm password');
    await confirmPasswordField.fill(password);
    await confirmPasswordField.press('Tab');
    
    const confirmPasswordError = await signUpForm.getByTestId('confirm-password-error');
    await expect(confirmPasswordError).not.toBeVisible();
})

test('sign up form confirm password field should show error message when passwords do not match', async ({ page }) => {
    await page.goto('/');

    const authModal = await page.getByTestId('auth-modal');
    await expect(authModal).not.toBeVisible();
    
    const signUpButton = await page.getByTestId('global-header').getByRole('button', { name: 'Sign up' });
    await signUpButton.click();
    
    await expect(authModal).toBeVisible();
    
    const signUpForm = await authModal.getByTestId('signup-form');
    await expect(signUpForm).toBeVisible();
    
    const password = 'Password123!';

    const passwordField = await signUpForm.getByLabel('Password', { exact: true });
    await passwordField.fill(password);
    await passwordField.press('Tab');

    const passwordError = await signUpForm.getByTestId('password-error');
    await expect(passwordError).not.toBeVisible();

    const confirmPasswordField = await signUpForm.getByLabel('Confirm password');
    await confirmPasswordField.fill('Paaaassword123');
    await confirmPasswordField.press('Tab');
    
    const confirmPasswordError = await signUpForm.getByTestId('confirm-password-error');
    await expect(confirmPasswordError).toBeVisible();
    await expect(confirmPasswordError).toHaveText('Passwords do not match');
})
//#endregion

//#region username
test('sign up form username field should not show error message when valid username is entered', async ({ page }) => {
    await page.goto('/');

    const authModal = await page.getByTestId('auth-modal');
    await expect(authModal).not.toBeVisible();

    const signUpButton = await page.getByTestId('global-header').getByRole('button', { name: 'Sign up' });
    await signUpButton.click();

    await expect(authModal).toBeVisible();

    const signUpForm = await authModal.getByTestId('signup-form');
    await expect(signUpForm).toBeVisible();

    const usernameField = await signUpForm.getByLabel('Username');
    await usernameField.fill('testuser');
    await usernameField.press('Tab');

    const usernameError = await signUpForm.getByTestId('username-error');
    await expect(usernameError).not.toBeVisible();
})

test('sign up form username field should show error message when no username is entered', async ({ page }) => {
    await page.goto('/');

    const authModal = await page.getByTestId('auth-modal');
    await expect(authModal).not.toBeVisible();

    const signUpButton = await page.getByTestId('global-header').getByRole('button', { name: 'Sign up' });
    await signUpButton.click();

    await expect(authModal).toBeVisible();

    const signUpForm = await authModal.getByTestId('signup-form');
    await expect(signUpForm).toBeVisible();

    const usernameField = await signUpForm.getByLabel('Username');
    await usernameField.focus();
    await usernameField.press('Tab');

    const usernameError = await signUpForm.getByTestId('username-error');
    await expect(usernameError).toBeVisible();
    await expect(usernameError).toHaveText('Username is required');
})

test('sign up form username field should show error message when username is too short', async ({ page }) => {
    await page.goto('/');

    const authModal = await page.getByTestId('auth-modal');
    await expect(authModal).not.toBeVisible();

    const signUpButton = await page.getByTestId('global-header').getByRole('button', { name: 'Sign up' });
    await signUpButton.click();

    await expect(authModal).toBeVisible();

    const signUpForm = await authModal.getByTestId('signup-form');
    await expect(signUpForm).toBeVisible();

    const usernameField = await signUpForm.getByLabel('Username');
    await usernameField.fill('te');
    await usernameField.press('Tab');

    const usernameError = await signUpForm.getByTestId('username-error');
    await expect(usernameError).toBeVisible();
    await expect(usernameError).toHaveText('Username must be at least 3 characters');
})
//#endregion

//#region submit
test('the submit button should become enabled when all fields are filled in, and there are no errors', async ({ page }) => {
    await page.goto('/');

    const signUpButton = await page.getByTestId('global-header').getByRole('button', { name: 'Sign up' });
    await signUpButton.click();

    const signUpForm = await page.getByTestId('signup-form');
    await expect(signUpForm).toBeVisible();

    const submitButton = await signUpForm.getByRole('button', { name: 'Sign up' });
    await expect(submitButton).toBeDisabled();

    const emailField = await signUpForm.getByLabel('Email');
    await emailField.fill('testuser@test.com');

    const passwordField = await signUpForm.getByLabel('Password', { exact: true });
    await passwordField.fill('Password123!');

    const confirmPasswordField = await signUpForm.getByLabel('Confirm password');
    await confirmPasswordField.fill('Password123!');

    await expect(submitButton).toBeEnabled();
})

test('the submit button should become disabled when all fields are filled in, but there are errors', async ({ page }) => {
    await page.goto('/');

    const signUpButton = await page.getByTestId('global-header').getByRole('button', { name: 'Sign up' });
    await signUpButton.click();

    const signUpForm = await page.getByTestId('signup-form');
    await expect(signUpForm).toBeVisible();

    const submitButton = await signUpForm.getByRole('button', { name: 'Sign up' });
    await expect(submitButton).toBeDisabled();

    const emailField = await signUpForm.getByLabel('Email');
    await emailField.fill('invalid');

    const passwordField = await signUpForm.getByLabel('Password', { exact: true });
    await passwordField.fill('Password123!');

    const confirmPasswordField = await signUpForm.getByLabel('Confirm password');
    await confirmPasswordField.fill('Password123!');

    await expect(submitButton).toBeDisabled();
})

test('clicking submit button should submit form and redirect user to /dashboard', async ({ page, database }) => {
    await page.goto('/');

    const email = faker.internet.email();

    const signUpButton = await page.getByTestId('global-header').getByRole('button', { name: 'Sign up' });
    await signUpButton.click();

    const signUpForm = await page.getByTestId('signup-form');
    await expect(signUpForm).toBeVisible();

    const submitButton = await signUpForm.getByRole('button', { name: 'Sign up' });
    await expect(submitButton).toBeDisabled();

    const emailField = await signUpForm.getByLabel('Email');
    await emailField.fill(email);

    const passwordField = await signUpForm.getByLabel('Password', { exact: true });
    await passwordField.fill('Password123!');

    const confirmPasswordField = await signUpForm.getByLabel('Confirm password');
    await confirmPasswordField.fill('Password123!');

    await expect(submitButton).toBeEnabled();

    await submitButton.click({force: true});
    await page.waitForURL('/dashboard', {waitUntil: 'networkidle'});

    const dashboard = await page.getByTestId('dashboard');
    await expect(dashboard).toBeVisible();

    await database.executeQuery(`DELETE FROM "User" WHERE email = '${email}'`);
});

test('signup submission should fail if email is already in use', async ({ page, database }) => {
    const email = faker.internet.email();

    try {
        await database.executeQuery(`INSERT INTO "User" (email, username, password, account_type) VALUES ('${email}', '${email.split('@')[0]}', '${await generatePasswordHash('Password123!')}', '${AccountType.FREE}')`);

        await page.goto('/');

        const signUpButton = await page.getByTestId('global-header').getByRole('button', { name: 'Sign up' });
        await signUpButton.click();

        const signUpForm = await page.getByTestId('signup-form');
        await expect(signUpForm).toBeVisible();

        const submitButton = await signUpForm.getByRole('button', { name: 'Sign up' });
        await expect(submitButton).toBeDisabled();

        const emailField = await signUpForm.getByLabel('Email');
        await emailField.fill(email);

        const usernameField = await signUpForm.getByLabel('Username');
        await usernameField.fill(faker.internet.userName());

        const passwordField = await signUpForm.getByLabel('Password', { exact: true });
        await passwordField.fill('Password123!');

        const confirmPasswordField = await signUpForm.getByLabel('Confirm password');
        await confirmPasswordField.fill('Password123!');

        await expect(submitButton).toBeEnabled();

        await submitButton.click({force: true});
        await page.waitForResponse('**/signup', {timeout: 10000});

        const emailError = await signUpForm.getByTestId('email-error');
        await expect(emailError).toBeVisible();
        await expect(emailError).toHaveText('Email is already in use.');
    } finally {
        await database.executeQuery(`DELETE FROM "User" WHERE email = '${email}'`);
    }
});

test('signup submission should fail if username is already in use', async ({ page, database }) => {
    const email = faker.internet.email();
    const username = faker.internet.userName();

    try {
        await database.executeQuery(`INSERT INTO "User" (email, username, password, account_type) VALUES ('${email}', '${username}', '${await generatePasswordHash('Password123!')}', '${AccountType.FREE}')`);

        await page.goto('/');

        const signUpButton = await page.getByTestId('global-header').getByRole('button', { name: 'Sign up' });
        await signUpButton.click();

        const signUpForm = await page.getByTestId('signup-form');
        await expect(signUpForm).toBeVisible();

        const submitButton = await signUpForm.getByRole('button', { name: 'Sign up' });
        await expect(submitButton).toBeDisabled();

        const emailField = await signUpForm.getByLabel('Email');
        await emailField.fill(faker.internet.email());

        const usernameField = await signUpForm.getByLabel('Username');
        await usernameField.clear();
        await usernameField.fill(username);

        const passwordField = await signUpForm.getByLabel('Password', { exact: true });
        await passwordField.fill('Password123!');

        const confirmPasswordField = await signUpForm.getByLabel('Confirm password');
        await confirmPasswordField.fill('Password123!');

        await expect(submitButton).toBeEnabled();

        await submitButton.click({force: true});
        await page.waitForResponse('**/signup', {timeout: 10000});

        const usernameError = await signUpForm.getByTestId('username-error');
        await expect(usernameError).toBeVisible();
        await expect(usernameError).toHaveText('Username is already in use.');
    } finally {
        await database.executeQuery(`DELETE FROM "User" WHERE email = '${faker.internet.email()}'`);
    }
});
//#endregion
//#endregion
