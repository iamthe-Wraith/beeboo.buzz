import dayjs from 'dayjs';
import { test, expect } from '../../custom-test';
import { NavFixture } from '../../fixtures/nav';
import { SettingsFixture } from '../../fixtures/settings';
import { SignUpFixture } from '../../fixtures/signup';
import { getEmail, getUsername } from '../../helpers';
import { SignInFixture } from '../../fixtures/signin';

test.describe('user-info', () => {
    test.describe('username', () => {
        test('user should be able to update their username', async ({ page, viewport, database }) => {
            const email = getEmail();
            const username = getUsername();
            const updatedUsername = getUsername();
            const password = 'Password123!';

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
                        createdAt: dayjs().subtract(3, 'days').toDate(),
                        updatedAt: dayjs().subtract(3, 'days').toDate()
                    }, 
                    database
                );

                await page.goto('/');
                await signin.signIn({ emailOrUsername: username, password });

                await page.waitForURL('/dashboard', { waitUntil: 'networkidle' });

                await settings.navigateToSettings(nav);
                await page.waitForURL('/settings', { waitUntil: 'networkidle' });

                // Update username
                await settings.userInfoUsername.fill(updatedUsername);
                await settings.userInfoUsername.press('Tab');

                await expect(settings.userInfoUsernameError).not.toBeVisible();

                await expect(settings.userInfoUpdateButton).toBeEnabled();
                await settings.userInfoUpdateButton.click();

                await expect(settings.userInfoUpdateButton).toBeDisabled();
                await expect(settings.userInfoSuccessMessage).toBeVisible();
                await expect(settings.userInfoSuccessMessage).toHaveText('Your information has been updated successfully!');

                await expect(settings.lastUpdated).toHaveText(`Your account information was updated today.`);
            } finally {
                await signup.cleanup(email, database);
            }
        });

        test('user should not able to update their username if username is too short', async ({ page, viewport, database }) => {
            const email = getEmail();
            const username = getUsername();
            const updatedUsername = 'a';
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

                // Update username
                await settings.userInfoUsername.fill(updatedUsername);
                await settings.userInfoUsername.press('Tab');

                await expect(settings.userInfoUsernameError).toBeVisible();
                await expect(settings.userInfoUsernameError).toHaveText('Username must be at least 3 characters');

                await expect(settings.userInfoUpdateButton).toBeDisabled();

                await expect(settings.lastUpdated).toBeVisible();
                await expect(settings.lastUpdated).toHaveText(`Your account information was last updated ${Math.abs(updatedAt.diff(dayjs(), 'day'))} days ago.`);
            } finally {
                await signup.cleanup(email, database);
            }
        });

        test('user should not able to update their username if username is too long', async ({ page, viewport, database }) => {
            const email = getEmail();
            const username = getUsername();
            const updatedUsername = '1nv@lidusern@meth@t1slongerth@neightycharacterslong1nv@lidusern@meth@t1slongerth@neightycharacterslong1nv@lidusern@meth@t1slongerth@neightycharacterslong1nv@lidusern@m';
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

                // Update username
                await settings.userInfoUsername.fill(updatedUsername);
                await settings.userInfoUsername.press('Tab');

                await expect(settings.userInfoUsernameError).toBeVisible();
                await expect(settings.userInfoUsernameError).toHaveText('Username must be less than 80 characters');

                await expect(settings.userInfoUpdateButton).toBeDisabled();

                await expect(settings.lastUpdated).toBeVisible();
                await expect(settings.lastUpdated).toHaveText(`Your account information was last updated ${Math.abs(updatedAt.diff(dayjs(), 'day'))} days ago.`);
            } finally {
                await signup.cleanup(email, database);
            }
        });

        test('user should not able to update their username if username contains invalid characters', async ({ page, viewport, database }) => {
            const email = getEmail();
            const username = getUsername();
            const updatedUsername = 'invalid-username!@#';
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

                // Update username
                await settings.userInfoUsername.fill(updatedUsername);
                await settings.userInfoUsername.press('Tab');

                await expect(settings.userInfoUsernameError).toBeVisible();
                await expect(settings.userInfoUsernameError).toHaveText('Username must contain only letters, numbers, underscores and hyphens');

                await expect(settings.userInfoUpdateButton).toBeDisabled();

                await expect(settings.lastUpdated).toBeVisible();
                await expect(settings.lastUpdated).toHaveText(`Your account information was last updated ${Math.abs(updatedAt.diff(dayjs(), 'day'))} days ago.`);
            } finally {
                await signup.cleanup(email, database);
            }
        });

        test('user should not able to update their username if username is already in use', async ({ page, viewport, database }) => {
            const existingEmail = getEmail();
            const existingUsername = getUsername();
            const existingPassword = 'Password123!';

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
                await signup.createUser({ email: existingEmail, username: existingUsername, password: existingPassword }, database);
                await signup.createUser({ email, username, password, createdAt: createdAt.toDate(), updatedAt: updatedAt.toDate() }, database);

                await page.goto('/');
                await signin.signIn({ emailOrUsername: username, password }); 
                await page.waitForURL('/dashboard', { waitUntil: 'networkidle' });

                await settings.navigateToSettings(nav);
                await page.waitForURL('/settings', { waitUntil: 'networkidle' });

                // Update username
                await settings.userInfoUsername.fill(existingUsername);
                await settings.userInfoUsername.press('Tab');

                await expect(settings.userInfoUsernameError).not.toBeVisible();
                
                await expect(settings.userInfoUpdateButton).toBeEnabled();
                await settings.userInfoUpdateButton.click();
                
                await expect(settings.userInfoUsernameError).toHaveText('Username already in use.');

                await expect(settings.lastUpdated).toBeVisible();
                await expect(settings.lastUpdated).toHaveText(`Your account information was last updated ${Math.abs(updatedAt.diff(dayjs(), 'day'))} days ago.`);
            } finally {
                await signup.cleanup(email, database);
            }
        });
    });

    test.describe('email', () => {
        test('user should be able to update their email', async ({ page, viewport, database }) => {
            const email = getEmail();
            const updatedEmail = `updated-${email}`;
            const username = getUsername();
            const password = 'Password123!';

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
                        createdAt: dayjs().subtract(3, 'days').toDate(),
                        updatedAt: dayjs().subtract(3, 'days').toDate()
                    }, 
                    database
                );

                await page.goto('/');
                await signin.signIn({ emailOrUsername: username, password });

                await page.waitForURL('/dashboard', { waitUntil: 'networkidle' });

                await settings.navigateToSettings(nav);
                await page.waitForURL('/settings', { waitUntil: 'networkidle' });

                // Update username
                await settings.userInfoEmail.fill(updatedEmail);
                await settings.userInfoEmail.press('Tab');

                await expect(settings.userInfoEmailError).not.toBeVisible();

                await expect(settings.userInfoUpdateButton).toBeEnabled();
                await settings.userInfoUpdateButton.click();

                await expect(settings.userInfoUpdateButton).toBeDisabled();
                await expect(settings.userInfoSuccessMessage).toBeVisible();
                await expect(settings.userInfoSuccessMessage).toHaveText('Your information has been updated successfully!');

                await expect(nav.userEmail).toHaveText(updatedEmail);

                await expect(settings.lastUpdated).toHaveText(`Your account information was updated today.`);
            } finally {
                await signup.cleanup(email, database);
            }
        });
        
        test('user should not be able to update their email when email is invalid', async ({ page, viewport, database }) => {
            const email = getEmail();
            const updatedEmail = `invalid-email`;
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

                // Update username
                await settings.userInfoEmail.fill(updatedEmail);
                await settings.userInfoEmail.press('Tab');

                await expect(settings.userInfoEmailError).toBeVisible();
                await expect(settings.userInfoEmailError).toHaveText('Invalid email');

                await expect(settings.userInfoUpdateButton).toBeDisabled();

                await expect(nav.userEmail).toHaveText(email);

                await expect(settings.lastUpdated).toBeVisible();
                await expect(settings.lastUpdated).toHaveText(`Your account information was last updated ${Math.abs(updatedAt.diff(dayjs(), 'day'))} days ago.`);
            } finally {
                await signup.cleanup(email, database);
            }
        });

        test('user should not able to update their email if email is already in use', async ({ page, viewport, database }) => {
            const existingEmail = getEmail();
            const existingUsername = getUsername();
            const existingPassword = 'Password123!';

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
                await signup.createUser({ email: existingEmail, username: existingUsername, password: existingPassword }, database);
                await signup.createUser({ email, username, password, createdAt: createdAt.toDate(), updatedAt: updatedAt.toDate() }, database);

                await page.goto('/');
                await signin.signIn({ emailOrUsername: username, password }); 
                await page.waitForURL('/dashboard', { waitUntil: 'networkidle' });

                await settings.navigateToSettings(nav);
                await page.waitForURL('/settings', { waitUntil: 'networkidle' });

                // Update username
                await settings.userInfoEmail.fill(existingEmail);
                await settings.userInfoEmail.press('Tab');

                await expect(settings.userInfoEmailError).not.toBeVisible();
                
                await expect(settings.userInfoUpdateButton).toBeEnabled();
                await settings.userInfoUpdateButton.click();
                
                await expect(settings.userInfoEmailError).toHaveText('Email already in use.');

                await expect(settings.lastUpdated).toBeVisible();
                await expect(settings.lastUpdated).toHaveText(`Your account information was last updated ${Math.abs(updatedAt.diff(dayjs(), 'day'))} days ago.`);
            } finally {
                await signup.cleanup(email, database);
            }
        });
    });
});