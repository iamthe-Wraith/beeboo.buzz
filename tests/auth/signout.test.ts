import { faker } from '@faker-js/faker';
import { test, expect } from '../custom-test';

test('sign out button exists in header when user is signed in', async ({ page, database }) => {
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

    const signoutButton = await page.getByTestId('global-header').getByTestId('signout-button');
    await expect(signoutButton).toBeVisible();

    await database.executeQuery(`DELETE FROM "User" WHERE email = '${email}'`);
});

test('sign out button does not exist when user is not signed in', async ({ page }) => {
    await page.goto('/');

    const signUpButton = await page.getByTestId('global-header').getByRole('button', { name: 'Sign up' });
    await expect(signUpButton).toBeVisible();

    const signoutButton = await page.getByTestId('global-header').getByTestId('signout-button');
    await expect(signoutButton).toBeHidden();
});

test('clicking the sign out button signs the user out', async ({ page, database }) => {
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

    const signoutButton = await page.getByTestId('global-header').getByTestId('signout-button');
    await expect(signoutButton).toBeVisible();
    await signoutButton.click();

    await page.waitForURL('/', {waitUntil: 'networkidle'});

    await expect(signoutButton).toBeHidden();

    await database.executeQuery(`DELETE FROM "User" WHERE email = '${email}'`);
});