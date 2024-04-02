import dayjs from 'dayjs';
import { test, expect } from '../../custom-test';
import { NavFixture } from '../../fixtures/nav';
import { SettingsFixture } from '../../fixtures/settings';
import { SignInFixture } from '../../fixtures/signin';
import { SignUpFixture } from '../../fixtures/signup';
import { getEmail, getUsername } from '../../helpers';
import { SignOutFixture } from '../../fixtures/signout';

test.describe('change-password', () => {
    test('user should be able to change their password', async ({ page, viewport, database }) => {
        const email = getEmail();
        const username = getUsername();
        const password = 'Password123!';
        const updatedPassword = 'NewPassword123!';
        const createdAt = dayjs().subtract(3, 'days');
        const updatedAt = dayjs().subtract(3, 'days');

        const signup = new SignUpFixture(page);
        const signin = new SignInFixture(page);
        const nav = new NavFixture(page, viewport);
        const settings = new SettingsFixture(page, viewport);

        try {
            await signup.createUser(
                {
                    email, 
                    username, 
                    password, 
                    createdAt: createdAt.toDate(),
                    updatedAt: updatedAt.toDate()
                }, 
                database
            );

            await page.goto('/');
            await signin.signIn({ emailOrUsername: username, password });
            await page.waitForURL('/dashboard', { waitUntil: 'networkidle' });

            await settings.navigateToSettings(nav);
            await page.waitForURL('/settings', { waitUntil: 'networkidle' });

            await settings.fillOutChangePasswordForm(password, updatedPassword, updatedPassword);

            await expect(settings.currentPasswordError).not.toBeVisible();
            await expect(settings.newPasswordError).not.toBeVisible();
            await expect(settings.confirmPasswordError).not.toBeVisible();

            await expect(settings.changePasswordButton).toBeEnabled();
            await settings.changePasswordButton.click();

            await expect(settings.changePasswordSuccessMessage).toBeVisible();
            await expect(settings.changePasswordSuccessMessage).toHaveText('Your password has been changed successfully!');

            await expect(settings.lastUpdated).toBeVisible();
            await expect(settings.lastUpdated).toHaveText(`Your account information was last updated ${Math.abs(updatedAt.diff(dayjs(), 'day'))} days ago.`);

            const signout = new SignOutFixture(page, viewport);
            await signout.signOut();

            await page.waitForURL('/', { waitUntil: 'networkidle' });

            await signin.signIn({ emailOrUsername: username, password: updatedPassword });
            await page.waitForURL('/dashboard', { waitUntil: 'networkidle' });
        } finally {
            await signup.cleanup(email, database);
        }
    });

    test('user should not be able to change their password if they do not provide their current password', async ({ page, viewport, database }) => {
        const email = getEmail();
        const username = getUsername();
        const password = 'Password123!';
        const updatedPassword = 'NewPassword123!';
        const createdAt = dayjs().subtract(3, 'days');
        const updatedAt = dayjs().subtract(3, 'days');

        const signup = new SignUpFixture(page);
        const signin = new SignInFixture(page);
        const nav = new NavFixture(page, viewport);
        const settings = new SettingsFixture(page, viewport);

        try {
            await signup.createUser(
                {
                    email, 
                    username, 
                    password, 
                    createdAt: createdAt.toDate(),
                    updatedAt: updatedAt.toDate()
                }, 
                database
            );

            await page.goto('/');
            await signin.signIn({ emailOrUsername: username, password });
            await page.waitForURL('/dashboard', { waitUntil: 'networkidle' });

            await settings.navigateToSettings(nav);
            await page.waitForURL('/settings', { waitUntil: 'networkidle' });

            await settings.fillOutChangePasswordForm('', updatedPassword, updatedPassword);

            await expect(settings.currentPasswordError).toBeVisible();
            await expect(settings.currentPasswordError).toHaveText('Current password is required.');

            await expect(settings.changePasswordButton).toBeDisabled();
        } finally {
            await signup.cleanup(email, database);
        }
    });

    test('user should not be able to change their password if they provide the incorrect current password', async ({ page, viewport, database }) => {
        const email = getEmail();
        const username = getUsername();
        const password = 'Password123!';
        const updatedPassword = 'NewPassword123!';
        const createdAt = dayjs().subtract(3, 'days');
        const updatedAt = dayjs().subtract(3, 'days');

        const signup = new SignUpFixture(page);
        const signin = new SignInFixture(page);
        const nav = new NavFixture(page, viewport);
        const settings = new SettingsFixture(page, viewport);

        try {
            await signup.createUser(
                {
                    email, 
                    username, 
                    password, 
                    createdAt: createdAt.toDate(),
                    updatedAt: updatedAt.toDate()
                }, 
                database
            );

            await page.goto('/');
            await signin.signIn({ emailOrUsername: username, password });
            await page.waitForURL('/dashboard', { waitUntil: 'networkidle' });

            await settings.navigateToSettings(nav);
            await page.waitForURL('/settings', { waitUntil: 'networkidle' });

            await settings.fillOutChangePasswordForm('incorrectPassword', updatedPassword, updatedPassword);

            await expect(settings.currentPasswordError).not.toBeVisible();
            await expect(settings.newPasswordError).not.toBeVisible();
            await expect(settings.confirmPasswordError).not.toBeVisible();

            await expect(settings.changePasswordButton).toBeEnabled();
            await settings.changePasswordButton.click();

            await expect(settings.currentPasswordError).toBeVisible();
            await expect(settings.currentPasswordError).toHaveText('That\'s not your current password');

            await expect(settings.changePasswordSuccessMessage).not.toBeVisible();
        } finally {
            await signup.cleanup(email, database);
        }
    });

    test('user should not be able to change their password if the new password is the same as the old one', async ({ page, viewport, database }) => {
        const email = getEmail();
        const username = getUsername();
        const password = 'Password123!';
        const createdAt = dayjs().subtract(3, 'days');
        const updatedAt = dayjs().subtract(3, 'days');

        const signup = new SignUpFixture(page);
        const signin = new SignInFixture(page);
        const nav = new NavFixture(page, viewport);
        const settings = new SettingsFixture(page, viewport);

        try {
            await signup.createUser(
                {
                    email, 
                    username, 
                    password, 
                    createdAt: createdAt.toDate(),
                    updatedAt: updatedAt.toDate()
                }, 
                database
            );

            await page.goto('/');
            await signin.signIn({ emailOrUsername: username, password });
            await page.waitForURL('/dashboard', { waitUntil: 'networkidle' });

            await settings.navigateToSettings(nav);
            await page.waitForURL('/settings', { waitUntil: 'networkidle' });

            await settings.fillOutChangePasswordForm(password, password, password);

            await expect(settings.currentPasswordError).not.toBeVisible();
            await expect(settings.confirmPasswordError).not.toBeVisible();
            
            await expect(settings.newPasswordError).toBeVisible();
            await expect(settings.newPasswordError).toHaveText('New password must be different from the current password.');

            await expect(settings.changePasswordButton).toBeDisabled();
        } finally {
            await signup.cleanup(email, database);
        }
    });

    test('user should not be able to change their password if the new password is not provided', async ({ page, viewport, database }) => {
        const email = getEmail();
        const username = getUsername();
        const password = 'Password123!';
        const createdAt = dayjs().subtract(3, 'days');
        const updatedAt = dayjs().subtract(3, 'days');

        const signup = new SignUpFixture(page);
        const signin = new SignInFixture(page);
        const nav = new NavFixture(page, viewport);
        const settings = new SettingsFixture(page, viewport);

        try {
            await signup.createUser(
                {
                    email, 
                    username, 
                    password, 
                    createdAt: createdAt.toDate(),
                    updatedAt: updatedAt.toDate()
                }, 
                database
            );

            await page.goto('/');
            await signin.signIn({ emailOrUsername: username, password });
            await page.waitForURL('/dashboard', { waitUntil: 'networkidle' });

            await settings.navigateToSettings(nav);
            await page.waitForURL('/settings', { waitUntil: 'networkidle' });

            await settings.fillOutChangePasswordForm(password, '', '');

            await expect(settings.currentPasswordError).not.toBeVisible();
            await expect(settings.confirmPasswordError).not.toBeVisible();
            
            await expect(settings.newPasswordError).toBeVisible();
            await expect(settings.newPasswordError).toHaveText('Password is required');

            await expect(settings.changePasswordButton).toBeDisabled();
        } finally {
            await signup.cleanup(email, database);
        }
    });

    test('user should not be able to change their password if the new password does not include a lowercase letter', async ({ page, viewport, database }) => {
        const email = getEmail();
        const username = getUsername();
        const password = 'Password123!';
        const updatedPassword = 'NEWPASSWORD123456!';
        const createdAt = dayjs().subtract(3, 'days');
        const updatedAt = dayjs().subtract(3, 'days');

        const signup = new SignUpFixture(page);
        const signin = new SignInFixture(page);
        const nav = new NavFixture(page, viewport);
        const settings = new SettingsFixture(page, viewport);

        try {
            await signup.createUser(
                {
                    email, 
                    username, 
                    password, 
                    createdAt: createdAt.toDate(),
                    updatedAt: updatedAt.toDate()
                }, 
                database
            );

            await page.goto('/');
            await signin.signIn({ emailOrUsername: username, password });
            await page.waitForURL('/dashboard', { waitUntil: 'networkidle' });

            await settings.navigateToSettings(nav);
            await page.waitForURL('/settings', { waitUntil: 'networkidle' });

            await settings.fillOutChangePasswordForm(password, updatedPassword, updatedPassword);

            await expect(settings.currentPasswordError).not.toBeVisible();
            await expect(settings.confirmPasswordError).not.toBeVisible();
            
            await expect(settings.newPasswordError).toBeVisible();
            await expect(settings.newPasswordError).toHaveText('Password must contain at least one lowercase letter');

            await expect(settings.changePasswordButton).toBeDisabled();
        } finally {
            await signup.cleanup(email, database);
        }
    });

    test('user should not be able to change their password if the new password does not include an uppercase letter', async ({ page, viewport, database }) => {
        const email = getEmail();
        const username = getUsername();
        const password = 'Password123!';
        const updatedPassword = 'newpassword123456!';
        const createdAt = dayjs().subtract(3, 'days');
        const updatedAt = dayjs().subtract(3, 'days');

        const signup = new SignUpFixture(page);
        const signin = new SignInFixture(page);
        const nav = new NavFixture(page, viewport);
        const settings = new SettingsFixture(page, viewport);

        try {
            await signup.createUser(
                {
                    email, 
                    username, 
                    password, 
                    createdAt: createdAt.toDate(),
                    updatedAt: updatedAt.toDate()
                }, 
                database
            );

            await page.goto('/');
            await signin.signIn({ emailOrUsername: username, password });
            await page.waitForURL('/dashboard', { waitUntil: 'networkidle' });

            await settings.navigateToSettings(nav);
            await page.waitForURL('/settings', { waitUntil: 'networkidle' });

            await settings.fillOutChangePasswordForm(password, updatedPassword, updatedPassword);

            await expect(settings.currentPasswordError).not.toBeVisible();
            await expect(settings.confirmPasswordError).not.toBeVisible();
            
            await expect(settings.newPasswordError).toBeVisible();
            await expect(settings.newPasswordError).toHaveText('Password must contain at least one uppercase letter');

            await expect(settings.changePasswordButton).toBeDisabled();
        } finally {
            await signup.cleanup(email, database);
        }
    });

    test('user should not be able to change their password if the new password does not include a number', async ({ page, viewport, database }) => {
        const email = getEmail();
        const username = getUsername();
        const password = 'Password123!';
        const updatedPassword = 'newPassword!';
        const createdAt = dayjs().subtract(3, 'days');
        const updatedAt = dayjs().subtract(3, 'days');

        const signup = new SignUpFixture(page);
        const signin = new SignInFixture(page);
        const nav = new NavFixture(page, viewport);
        const settings = new SettingsFixture(page, viewport);

        try {
            await signup.createUser(
                {
                    email, 
                    username, 
                    password, 
                    createdAt: createdAt.toDate(),
                    updatedAt: updatedAt.toDate()
                }, 
                database
            );

            await page.goto('/');
            await signin.signIn({ emailOrUsername: username, password });
            await page.waitForURL('/dashboard', { waitUntil: 'networkidle' });

            await settings.navigateToSettings(nav);
            await page.waitForURL('/settings', { waitUntil: 'networkidle' });

            await settings.fillOutChangePasswordForm(password, updatedPassword, updatedPassword);

            await expect(settings.currentPasswordError).not.toBeVisible();
            await expect(settings.confirmPasswordError).not.toBeVisible();
            
            await expect(settings.newPasswordError).toBeVisible();
            await expect(settings.newPasswordError).toHaveText('Password must contain at least one number');

            await expect(settings.changePasswordButton).toBeDisabled();
        } finally {
            await signup.cleanup(email, database);
        }
    });

    test('user should not be able to change their password if the new password does not include a special character', async ({ page, viewport, database }) => {
        const email = getEmail();
        const username = getUsername();
        const password = 'Password123!';
        const updatedPassword = 'newPassword123';
        const createdAt = dayjs().subtract(3, 'days');
        const updatedAt = dayjs().subtract(3, 'days');

        const signup = new SignUpFixture(page);
        const signin = new SignInFixture(page);
        const nav = new NavFixture(page, viewport);
        const settings = new SettingsFixture(page, viewport);

        try {
            await signup.createUser(
                {
                    email, 
                    username, 
                    password, 
                    createdAt: createdAt.toDate(),
                    updatedAt: updatedAt.toDate()
                }, 
                database
            );

            await page.goto('/');
            await signin.signIn({ emailOrUsername: username, password });
            await page.waitForURL('/dashboard', { waitUntil: 'networkidle' });

            await settings.navigateToSettings(nav);
            await page.waitForURL('/settings', { waitUntil: 'networkidle' });

            await settings.fillOutChangePasswordForm(password, updatedPassword, updatedPassword);

            await expect(settings.currentPasswordError).not.toBeVisible();
            await expect(settings.confirmPasswordError).not.toBeVisible();
            
            await expect(settings.newPasswordError).toBeVisible();
            await expect(settings.newPasswordError).toHaveText('Password must contain at least one special character: !@#$%^&*()_-+={[}]|:;"\'<,>.');

            await expect(settings.changePasswordButton).toBeDisabled();
        } finally {
            await signup.cleanup(email, database);
        }
    });

    test('user should not be able to change their password if they do not confirm their password', async ({ page, viewport, database }) => {
        const email = getEmail();
        const username = getUsername();
        const password = 'Password123!';
        const updatedPassword = 'newPassword123!';
        const createdAt = dayjs().subtract(3, 'days');
        const updatedAt = dayjs().subtract(3, 'days');

        const signup = new SignUpFixture(page);
        const signin = new SignInFixture(page);
        const nav = new NavFixture(page, viewport);
        const settings = new SettingsFixture(page, viewport);

        try {
            await signup.createUser(
                {
                    email, 
                    username, 
                    password, 
                    createdAt: createdAt.toDate(),
                    updatedAt: updatedAt.toDate()
                }, 
                database
            );

            await page.goto('/');
            await signin.signIn({ emailOrUsername: username, password });
            await page.waitForURL('/dashboard', { waitUntil: 'networkidle' });

            await settings.navigateToSettings(nav);
            await page.waitForURL('/settings', { waitUntil: 'networkidle' });

            await settings.fillOutChangePasswordForm(password, updatedPassword, '');

            await expect(settings.currentPasswordError).not.toBeVisible();
            await expect(settings.newPasswordError).not.toBeVisible();
            
            await expect(settings.confirmPasswordError).toBeVisible();
            await expect(settings.confirmPasswordError).toHaveText('Please confirm your password.');

            await expect(settings.changePasswordButton).toBeDisabled();
        } finally {
            await signup.cleanup(email, database);
        }
    });

    test('user should not be able to change their password if they confirm their new password, but the confirmation does not match the new password', async ({ page, viewport, database }) => {
        const email = getEmail();
        const username = getUsername();
        const password = 'Password123!';
        const updatedPassword = 'newPassword123!';
        const createdAt = dayjs().subtract(3, 'days');
        const updatedAt = dayjs().subtract(3, 'days');

        const signup = new SignUpFixture(page);
        const signin = new SignInFixture(page);
        const nav = new NavFixture(page, viewport);
        const settings = new SettingsFixture(page, viewport);

        try {
            await signup.createUser(
                {
                    email, 
                    username, 
                    password, 
                    createdAt: createdAt.toDate(),
                    updatedAt: updatedAt.toDate()
                }, 
                database
            );

            await page.goto('/');
            await signin.signIn({ emailOrUsername: username, password });
            await page.waitForURL('/dashboard', { waitUntil: 'networkidle' });

            await settings.navigateToSettings(nav);
            await page.waitForURL('/settings', { waitUntil: 'networkidle' });

            await settings.fillOutChangePasswordForm(password, updatedPassword, password);

            await expect(settings.currentPasswordError).not.toBeVisible();
            await expect(settings.newPasswordError).not.toBeVisible();
            
            await expect(settings.confirmPasswordError).toBeVisible();
            await expect(settings.confirmPasswordError).toHaveText('Passwords do not match.');

            await expect(settings.changePasswordButton).toBeDisabled();
        } finally {
            await signup.cleanup(email, database);
        }
    });
});