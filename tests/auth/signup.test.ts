import { test, expect } from '../custom-test';
import { getEmail, getUsername } from '../helpers';
import { SignUpFixture } from '../fixtures/signup';
import { SignInFixture } from '../fixtures/signin';

test.describe('sign up', () => {
    test('sign up button exists in header', async ({ page }) => {
        await page.goto('/');
    
        const signup = new SignUpFixture(page);
    
        await expect(signup.trigger).toBeVisible();
        await expect(signup.modal).not.toBeVisible();
    });

    test('clicking sign up button opens auth modal with sign up form displayed', async ({ page }) => {
        await page.goto('/');
    
        const signup = new SignUpFixture(page);
    
        await expect(signup.modal).not.toBeVisible();
    
        await signup.trigger.click();
    
        await expect(signup.modal).toBeVisible();
        await expect(signup.form).toBeVisible();
    })
    
    test('sign up form has username, email, password, and confirm password fields', async ({ page }) => {
        await page.goto('/');
    
        const signup = new SignUpFixture(page);
    
        await expect(signup.modal).not.toBeVisible();
    
        await signup.trigger.click();
    
        await expect(signup.modal).toBeVisible();
        await expect(signup.form).toBeVisible();
        await expect(await signup.email).toBeVisible();
        await expect(await signup.username).toBeVisible();
        await expect(await signup.password).toBeVisible();
        await expect(await signup.passwordText).toBeVisible();
        await expect(await signup.confirmPassword).toBeVisible();
    })

    test('sign up form has submit button', async ({ page }) => {
        await page.goto('/');
    
        const signup = new SignUpFixture(page);
    
        await expect(signup.modal).not.toBeVisible();
    
        await signup.trigger.click();
    
        await expect(signup.modal).toBeVisible();
        await expect(signup.form).toBeVisible();
        await expect(signup.submitButton).toBeVisible();
        await expect(signup.submitButton).toBeDisabled();
    })
    
    test('sign up form has button that will take user to sign in form', async ({ page }) => {
        await page.goto('/');
    
        const signup = new SignUpFixture(page);
        const signin = new SignInFixture(page);
    
        await signup.trigger.click();
    
        await expect(signup.form).toBeVisible();
    
        await expect(signup.toSignInButton).toBeVisible();
        await signup.toSignInButton.click();
    
        await expect(signin.form).toBeVisible();
        await expect(signup.form).not.toBeVisible();
    })

    test('sign up modal can be closed', async ({ page }) => {
        await page.goto('/');
    
        const signup = new SignUpFixture(page);
    
        await expect(signup.modal).not.toBeVisible();
    
        await signup.trigger.click();
    
        await expect(signup.modal).toBeVisible();
        await signup.modalCloseButton.click();
        await expect(signup.modal).not.toBeVisible();
    })
    
    test('sign up form resets on close', async ({ page }) => {
        await page.goto('/');
    
        const signup = new SignUpFixture(page);
    
        await expect(signup.modal).not.toBeVisible();
    
        await signup.trigger.click();
    
        await expect(signup.modal).toBeVisible();
        await expect(signup.form).toBeVisible();
    
        signup.fillForm({
            email: 'test@test.com',
            username: 'testuser',
            password: 'Password123!',
            confirmPassword: 'Password123!',
        });
    
        await signup.modalCloseButton.click();
    
        await expect(signup.modal).not.toBeVisible();
    
        await signup.trigger.click();
    
        await expect(signup.form).toBeVisible();
        await expect(signup.email).toHaveValue('');
        await expect(signup.username).toHaveValue('');
        await expect(signup.password).toHaveValue('');
        await expect(signup.confirmPassword).toHaveValue('');
    })

    test.describe('email', () => {
        test('sign up form email field should not show error message when valid email is entered', async ({ page }) => {
            await page.goto('/');
        
            const signup = new SignUpFixture(page);
        
            await expect(signup.modal).not.toBeVisible();
        
            await signup.trigger.click();
        
            await expect(signup.modal).toBeVisible();
            await expect(signup.form).toBeVisible();
            
            await signup.email.fill('testuser@example.com');
            await signup.email.press('Tab');
            
            await expect(signup.emailError).not.toBeVisible();
        })

        test('sign up form email field shows error if left empty', async ({ page }) => {
            await page.goto('/');
        
            const signup = new SignUpFixture(page);
        
            await expect(signup.modal).not.toBeVisible();
        
            await signup.trigger.click();
        
            await expect(signup.modal).toBeVisible();
            await expect(signup.form).toBeVisible();
            
            await signup.email.focus();
            await signup.email.press('Tab');
            
            await expect(signup.emailError).toBeVisible();
            await expect(signup.emailError).toHaveText('Email is required');
        })

        test('sign up form email field shows error if an invalid email is entered', async ({ page }) => {
            await page.goto('/');
        
            const signup = new SignUpFixture(page);
        
            await expect(signup.modal).not.toBeVisible();
        
            await signup.trigger.click();
        
            await expect(signup.modal).toBeVisible();
            await expect(signup.form).toBeVisible();
            
            await signup.email.fill('invalid');
            await signup.email.press('Tab');
            
            await expect(signup.emailError).toBeVisible();
            await expect(signup.emailError).toHaveText('Invalid email');
        })

        test('sign up form email field should auto populate the username field when no username has been entered', async ({ page }) => {
            await page.goto('/');
        
            const signup = new SignUpFixture(page);
        
            await expect(signup.modal).not.toBeVisible();
        
            await signup.trigger.click();
        
            await expect(signup.modal).toBeVisible();
            await expect(signup.form).toBeVisible();
            
            await signup.email.fill('testuser@example.com');
            await signup.email.press('Tab');
            
            await expect(signup.emailError).not.toBeVisible();
            await expect(signup.username).toHaveValue('testuser');
        })
    })

    test.describe('password', () => {
        test('sign up form password field should not show error message when valid password is entered', async ({ page }) => {
            await page.goto('/');
        
            const signup = new SignUpFixture(page);
        
            await expect(signup.modal).not.toBeVisible();
            
            await signup.trigger.click();
            
            await expect(signup.modal).toBeVisible();
            await expect(signup.form).toBeVisible();
            
            await signup.password.fill('Password123!');
            await signup.password.press('Tab');
            
            await expect(signup.passwordError).not.toBeVisible();
        })

        test('sign up form password field should show error message when no password is entered', async ({ page }) => {
            await page.goto('/');
        
            const signup = new SignUpFixture(page);
        
            await expect(signup.modal).not.toBeVisible();
            
            await signup.trigger.click();
            
            await expect(signup.modal).toBeVisible();
            await expect(signup.form).toBeVisible();
            
            await signup.password.focus();
            await signup.password.press('Tab');
            
            await expect(signup.passwordError).toBeVisible();
            await expect(signup.passwordError).toHaveText('Password is required');
        })

        test('sign up form password field should show error message when password is too short', async ({ page }) => {
            await page.goto('/');
        
            const signup = new SignUpFixture(page);
        
            await expect(signup.modal).not.toBeVisible();
            
            await signup.trigger.click();
            
            await expect(signup.modal).toBeVisible();
            await expect(signup.form).toBeVisible();
            
            await signup.password.fill('Pa1#');
            await signup.password.press('Tab');
            
            await expect(signup.passwordError).toBeVisible();
            await expect(signup.passwordError).toHaveText('Password must be at least 8 characters');
        })

        test('sign up form password field should show error message when password is too long', async ({ page }) => {
            await page.goto('/');
        
            const signup = new SignUpFixture(page);
        
            await expect(signup.modal).not.toBeVisible();
            
            await signup.trigger.click();
            
            await expect(signup.modal).toBeVisible();
            await expect(signup.form).toBeVisible();
            
            await signup.password.fill('Pa1#987asdfjbajJHSJHGjhbuyfg27657ghjbadsfjhavsdjhbT&^%$^%#jahsdgjfhadvfadfhuagdjvba&^%ghvasjdgJHGJHvjasbvdjhagdkljdasjbfajsd');
            await signup.password.press('Tab');
            
            await expect(signup.passwordError).toBeVisible();
            await expect(signup.passwordError).toHaveText('Password must be less than 100 characters');
        })

        test('sign up form password field should show error message when password does not contain a lowercase letter', async ({ page }) => {
            await page.goto('/');
        
            const signup = new SignUpFixture(page);
        
            await expect(signup.modal).not.toBeVisible();
            
            await signup.trigger.click();
            
            await expect(signup.modal).toBeVisible();
            await expect(signup.form).toBeVisible();
            
            await signup.password.fill('PASSWORD123!');
            await signup.password.press('Tab');
            
            await expect(signup.passwordError).toBeVisible();
            await expect(signup.passwordError).toHaveText('Password must contain at least one lowercase letter');
        })

        test('sign up form password field should show error message when password does not contain an uppercase letter', async ({ page }) => {
            await page.goto('/');
        
            const signup = new SignUpFixture(page);
        
            await expect(signup.modal).not.toBeVisible();
            
            await signup.trigger.click();
            
            await expect(signup.modal).toBeVisible();
            await expect(signup.form).toBeVisible();
            
            await signup.password.fill('password123!');
            await signup.password.press('Tab');
            
            await expect(signup.passwordError).toBeVisible();
            await expect(signup.passwordError).toHaveText('Password must contain at least one uppercase letter');
        })

        test('sign up form password field should show error message when password does not contain a number', async ({ page }) => {
            await page.goto('/');
        
            const signup = new SignUpFixture(page);
        
            await expect(signup.modal).not.toBeVisible();
        
            await signup.trigger.click();
            
            await expect(signup.modal).toBeVisible();
            await expect(signup.form).toBeVisible();
            
            await signup.password.fill('Password!');
            await signup.password.press('Tab');
            
            await expect(signup.passwordError).toBeVisible();
            await expect(signup.passwordError).toHaveText('Password must contain at least one number');
        })

        test('sign up form password field should show error message when password does not contain a special character', async ({ page }) => {
            await page.goto('/');
        
            const signup = new SignUpFixture(page);
        
            await expect(signup.modal).not.toBeVisible();
            
            await signup.trigger.click();
            
            await expect(signup.modal).toBeVisible();
            await expect(signup.form).toBeVisible();
        
            await signup.password.fill('Password123');
            await signup.password.press('Tab');
            
            await expect(signup.passwordError).toBeVisible();
            await expect(signup.passwordError).toHaveText('Password must contain at least one special character: !@#$%^&*()_-+={[}]|:;"\'<,>.');
        })
    })

    test.describe('confirm password', () => {
        test('sign up form confirm password field should not show error message when passwords do not match', async ({ page }) => {
            const password = 'Password123!';
        
            await page.goto('/');
        
            const signup = new SignUpFixture(page);
        
            await expect(signup.modal).not.toBeVisible();
            
            await signup.trigger.click();
            
            await expect(signup.modal).toBeVisible();
            await expect(signup.form).toBeVisible();
        
            await signup.password.fill(password);
            await signup.password.press('Tab');
            
            await expect(signup.passwordError).not.toBeVisible();
            
            await signup.confirmPassword.fill(password);
            await signup.confirmPassword.press('Tab');
            
            await expect(signup.confirmPasswordError).not.toBeVisible();
        })

        test('sign up form confirm password field should show error message when passwords do not match', async ({ page }) => {
            const password = 'Password123!';
        
            await page.goto('/');
        
            const signup = new SignUpFixture(page);
        
            await expect(signup.modal).not.toBeVisible();
            
            await signup.trigger.click();
            
            await expect(signup.modal).toBeVisible();
            await expect(signup.form).toBeVisible();
        
            await signup.password.fill(password);
            await signup.password.press('Tab');
        
            await expect(signup.passwordError).not.toBeVisible();
        
            await signup.confirmPassword.fill(`${password}invalid`);
            await signup.confirmPassword.press('Tab');
            
            await expect(signup.confirmPasswordError).toBeVisible();
            await expect(signup.confirmPasswordError).toHaveText('Passwords do not match');
        })
    })

    test.describe('username', () => {
        test('sign up form username field should not show error message when valid username is entered', async ({ page }) => {
            await page.goto('/');
        
            const signup = new SignUpFixture(page);
        
            await expect(signup.modal).not.toBeVisible();
        
            await signup.trigger.click();
        
            await expect(signup.modal).toBeVisible();
            await expect(signup.form).toBeVisible();
        
            await signup.username.fill('testuser');
            await signup.username.press('Tab');
            
            await expect(signup.usernameError).not.toBeVisible();
        })

        test('sign up form username field should show error message when no username is entered', async ({ page }) => {
            await page.goto('/');
        
            const signup = new SignUpFixture(page);
        
            await expect(signup.modal).not.toBeVisible();
        
            await signup.trigger.click();
        
            await expect(signup.modal).toBeVisible();
            await expect(signup.form).toBeVisible();
        
            await signup.username.focus();
            await signup.username.press('Tab');
        
            await expect(signup.usernameError).toBeVisible();
            await expect(signup.usernameError).toHaveText('Username is required');
        })

        test('sign up form username field should show error message when username is too short', async ({ page }) => {
            await page.goto('/');
        
            const signup = new SignUpFixture(page);
        
            await expect(signup.modal).not.toBeVisible();
        
            await signup.trigger.click();
        
            await expect(signup.modal).toBeVisible();
            await expect(signup.form).toBeVisible();
        
            await signup.username.fill('te');
            await signup.username.press('Tab');
        
            await expect(signup.usernameError).toBeVisible();
            await expect(signup.usernameError).toHaveText('Username must be at least 3 characters');
        })
    })

    test.describe('submit', () => {
        test('the submit button should become enabled when all fields are filled in, and there are no errors', async ({ page }) => {
            await page.goto('/');
        
            const signup = new SignUpFixture(page);
        
            await signup.trigger.click();
        
            await expect(signup.form).toBeVisible();
            await expect(signup.submitButton).toBeDisabled();
        
            await signup.fillForm({
                email: 'testuser@test.com',
                username: 'testuser',
                password: 'Password123!',
                confirmPassword: 'Password123!',
            });
        
            await expect(signup.submitButton).toBeEnabled();
        })

        test('the submit button should become disabled when all fields are filled in, but there are errors', async ({ page }) => {
            await page.goto('/');
        
            const signup = new SignUpFixture(page);
        
            await signup.trigger.click();
        
            await expect(signup.form).toBeVisible();
            await expect(signup.submitButton).toBeDisabled();
        
            await signup.fillForm({
                email: 'invalid',
                password: 'Password123!',
                confirmPassword: 'Password123!',
            });
        
            await expect(signup.submitButton).toBeDisabled();
        })

        test('clicking submit button should submit form and redirect user to /dashboard when sign up is successful', async ({ page, database }) => {
            const email = getEmail();
            const password = 'Password123!';
        
            await page.goto('/');
        
            const signup = new SignUpFixture(page);
            await signup.signUp({
                email, 
                password, 
                confirmPassword: password,
            });
        
            await page.waitForURL('/dashboard', {waitUntil: 'networkidle'});
        
            const dashboard = await page.getByTestId('dashboard');
            await expect(dashboard).toBeVisible();
        
            await expect(signup.trigger).not.toBeVisible();
        
            await signup.cleanup(email, database);
        })

        test('signup submission should fail if email is already in use', async ({ page, database }) => {
            const email = getEmail();
            const password = 'Password123!';
        
            const signup = new SignUpFixture(page);
        
            try {
                await signup.createUser({ email, password }, database);
        
                await page.goto('/');
                
                await signup.signUp({
                    email, 
                    username: getUsername(),
                    password,
                    confirmPassword: password,
                });
        
                await expect(signup.emailError).toBeVisible();
                await expect(signup.emailError).toHaveText('Email is already in use.');
            } finally {
                await signup.cleanup(email, database);
            }
        })

        test('signup submission should fail if username is already in use', async ({ page, database }) => {
            const email = getEmail();
            const username = getUsername();
            const password = 'Password123!';
            const signup = new SignUpFixture(page);
        
            try {
                await signup.createUser({ email, username, password }, database);
        
                await page.goto('/');
        
                await signup.signUp({
                    email, 
                    username,
                    password,
                    confirmPassword: password,
                });
        
                await expect(signup.usernameError).toBeVisible();
                await expect(signup.usernameError).toHaveText('Username is already in use.');
            } finally {
                await signup.cleanup(email, database);
            }
        })
    })
})
