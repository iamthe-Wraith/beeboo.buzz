import { test, expect } from '../custom-test';
import { getEmail } from '../helpers';
import { SignInFixture } from '../fixtures/signin';
import { SignUpFixture } from '../fixtures/signup';
import { NavFixture } from '../fixtures/nav';

test('sign in button exists in header', async ({ page }) => {
    const signin = new SignInFixture(page);

    await page.goto('/');

    await expect(signin.trigger).toBeVisible();
    await expect(signin.modal).not.toBeVisible();
});

test('clicking sign in button opens auth modal with sign in form displayed', async ({ page }) => {
    const signin = new SignInFixture(page);

    await page.goto('/');

    await expect(signin.modal).not.toBeVisible();

    await signin.trigger.click();

    await expect(signin.modal).toBeVisible();
    await expect(signin.form).toBeVisible();
})

test('sign in form has email or username, and password fields', async ({ page }) => {
    const signin = new SignInFixture(page);

    await page.goto('/');

    await expect(signin.modal).not.toBeVisible();

    await signin.trigger.click();

    await expect(signin.modal).toBeVisible();
    await expect(signin.form).toBeVisible();
    await expect(signin.emailOrUsername).toBeVisible();
    await expect(signin.password).toBeVisible();
})

test('sign in form has submit button', async ({ page }) => {
    const signin = new SignInFixture(page);

    await page.goto('/');

    await expect(signin.modal).not.toBeVisible();

    await signin.trigger.click();

    await expect(signin.modal).toBeVisible();
    await expect(signin.form).toBeVisible();
    await expect(signin.submitButton).toBeVisible();
    await expect(signin.submitButton).toBeDisabled();
})

test('sign in form has button that will take user to sign up form', async ({ page }) => {
    const signin = new SignInFixture(page);
    const signup = new SignUpFixture(page);

    await page.goto('/');

    await signin.trigger.click();

    await expect(signin.form).toBeVisible();

    await expect(signin.toSignUpButton).toBeVisible();
    await signin.toSignUpButton.click();

    await expect(signup.form).toBeVisible();
    await expect(signin.form).not.toBeVisible();
})

test('sign in modal can be closed', async ({ page }) => {
    const signin = new SignInFixture(page);

    await page.goto('/');

    await expect(signin.modal).not.toBeVisible();

    await signin.trigger.click();

    await expect(signin.modal).toBeVisible();

    await signin.modalCloseButton.click();

    await expect(signin.modal).not.toBeVisible();
})

test('sign in form resets on close', async ({ page }) => {
    const signin = new SignInFixture(page);

    await page.goto('/');

    await expect(signin.modal).not.toBeVisible();

    await signin.trigger.click();

    await expect(signin.modal).toBeVisible();
    await expect(signin.form).toBeVisible();

    await signin.fillForm({ emailOrUsername: 'testuser', password: 'Password123!' });

    await signin.modalCloseButton.click();

    await expect(signin.modal).not.toBeVisible();

    await signin.trigger.click();

    await expect(signin.form).toBeVisible();

    await expect(signin.emailOrUsername).toHaveValue('');
    await expect(signin.password).toHaveValue('');
})

test.describe('email or username field', () => {
    test('sign in form email or username field should not show error message when valid email is entered', async ({ page }) => {
        const signin = new SignInFixture(page);

        await page.goto('/');
    
        await expect(signin.modal).not.toBeVisible();
    
        await signin.trigger.click();
    
        await expect(signin.modal).toBeVisible();
        await expect(signin.form).toBeVisible();
    
        await signin.emailOrUsername.fill('testuser@example.com');
        await signin.emailOrUsername.press('Tab');

        await expect(signin.emailOrUsernameError).not.toBeVisible();
    })

    test('sign in form email or username field should not show error message when valid username is entered', async ({ page }) => {
        const signin = new SignInFixture(page);

        await page.goto('/');
    
        await expect(signin.modal).not.toBeVisible();
    
        await signin.trigger.click();
    
        await expect(signin.modal).toBeVisible();
        await expect(signin.form).toBeVisible();
    
        await signin.emailOrUsername.fill('testuser');
        await signin.emailOrUsername.press('Tab');
    
        await expect(signin.emailOrUsernameError).not.toBeVisible();
    })

    test('sign in form email or username field shows error if left empty', async ({ page }) => {
        const signin = new SignInFixture(page);

        await page.goto('/');
    
        await expect(signin.modal).not.toBeVisible();
    
        await signin.trigger.click();
    
        await expect(signin.modal).toBeVisible();
        await expect(signin.form).toBeVisible();
    
        await signin.emailOrUsername.focus();
        await signin.emailOrUsername.press('Tab');
    
        await expect(signin.emailOrUsernameError).toBeVisible();
        await expect(signin.emailOrUsernameError).toHaveText('Email or username is required');
    })
});

test.describe('password field', () => {
    test('sign in form password field should not show error message when password is entered', async ({ page }) => {
        const signin = new SignInFixture(page);

        await page.goto('/');
    
        await expect(signin.modal).not.toBeVisible();
        
        await signin.trigger.click();
        
        await expect(signin.modal).toBeVisible();
        await expect(signin.form).toBeVisible();
        
        await signin.password.fill('Password123!');
        await signin.password.press('Tab');
        
        await expect(signin.passwordError).not.toBeVisible();
    })

    test('sign in form password field should show error message when no password is entered', async ({ page }) => {
        const signin = new SignInFixture(page);

        await page.goto('/');
    
        await expect(signin.modal).not.toBeVisible();
        
        await signin.trigger.click();
        
        await expect(signin.modal).toBeVisible();
        await expect(signin.form).toBeVisible();
        
        await signin.password.focus();
        await signin.password.press('Tab');
        
        await expect(signin.passwordError).toBeVisible();
        await expect(signin.passwordError).toHaveText('Password is required');
    })
});

test.describe('sign in button', () => {
    test('the sign in button should become enabled when all fields are filled in, and there are no errors', async ({ page }) => {
        const signin = new SignInFixture(page);
        
        await page.goto('/');
    
        await signin.trigger.click();
    
        await expect(signin.form).toBeVisible();
        await expect(signin.submitButton).toBeDisabled();
    
        await signin.fillForm({ emailOrUsername: 'testuser@test.com', password: 'Password123!' });
    
        await expect(signin.submitButton).toBeEnabled();
    })

    test('clicking sign in button should submit form and redirect user to /dashboard when sign in is successful', async ({ page, database, viewport }) => {
        const email = getEmail();
        const password = 'Password123!';
        const signin = new SignInFixture(page);
        const nav = new NavFixture(page, viewport);
    
        signin.createUser({ email, password }, database);
    
        await page.goto('/');
    
        await signin.trigger.click();
    
        await expect(signin.form).toBeVisible();
    
        await signin.fillForm({ emailOrUsername: email, password });
    
        await signin.submitButton.click();
    
        const dashboard = await page.getByTestId('dashboard');
        await expect(dashboard).toBeVisible();

        await expect(signin.trigger).not.toBeVisible();

        if (nav.isMobile) {
            await expect(nav.menuButton).toBeVisible();
            await expect(nav.menuButtonIcon).toBeVisible();
            await nav.openMobileNav();
        }
    
        await expect(nav.signoutButton).toBeVisible();
    
        await signin.cleanup(email, database);
    });

    test('sign in submission should fail if user with submitted email isn\'t found', async ({ page, database }) => {
        const signin = new SignInFixture(page);

        const email = getEmail();
    
        try {
            await page.goto('/');
    
            await signin.signIn({ emailOrUsername: email, password: 'Password123!' });
    
            await expect(signin.genError).toBeVisible();
            await expect(signin.genError).toHaveText('Invalid credentials.');
        } finally {
            signin.cleanup(email, database);
        }
    });

    test('sign in submission should fail if invalid credentials are submitted', async ({ page, database }) => {
        const signin = new SignInFixture(page);

        const email = getEmail();
    
        try {
            await signin.createUser({ email, password: 'Password123!' }, database);
    
            await page.goto('/');

            await signin.signIn({ emailOrUsername: email, password: 'WrongPassword' });
    
            await expect(signin.genError).toBeVisible();
            await expect(signin.genError).toHaveText('Invalid credentials.');
        } finally {
            await signin.cleanup(email, database);
        }
    });
})
