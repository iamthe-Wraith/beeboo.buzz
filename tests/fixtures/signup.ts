import type { Page, Locator } from '@playwright/test';
import { AuthFixture } from './auth';

interface ISignUpRequest {
    email: string;
    username?: string;
    password: string;
    confirmPassword?: string;
}

export class SignUpFixture extends AuthFixture {
    public modal: Locator;
    public modalCloseButton: Locator;

    public form: Locator;
    public trigger: Locator;

    public email: Locator;
    public username: Locator;
    public password: Locator;
    public passwordText: Locator;
    public confirmPassword: Locator;

    public emailError: Locator;
    public usernameError: Locator;
    public passwordError: Locator;
    public confirmPasswordError: Locator;

    public toSignInButton: Locator;
    public submitButton: Locator;

    constructor(public readonly page: Page) {
        super(page);

        this.modal = this.page.getByTestId('auth-modal');
        this.modalCloseButton = this.modal.getByTestId('close-modal-button');

        this.form = this.page.getByTestId('signup-form');
        this.trigger = this.page.getByTestId('global-header').getByRole('button', { name: 'Sign up' });

        this.email = this.form.getByLabel('Email');
        this.username = this.form.getByLabel('Username');
        this.password = this.form.getByLabel('Password', { exact: true });
        this.passwordText = this.form.getByText('Must be at least 8 characters long and contain at least one number, one uppercase letter, one lowercase letter, and one special character.', { exact: true });
        this.confirmPassword = this.form.getByLabel('Confirm password');

        this.emailError = this.form.getByTestId('email-error');
        this.usernameError = this.form.getByTestId('username-error');
        this.passwordError = this.form.getByTestId('password-error');
        this.confirmPasswordError = this.form.getByTestId('confirm-password-error');

        this.toSignInButton = this.form.getByRole('button', { name: 'Sign in' });
        this.submitButton = this.form.getByRole('button', { name: 'Sign up' });
    }

    public async fillForm({ email, username, password, confirmPassword }: ISignUpRequest): Promise<void> {
        await this.email.fill(email);
        
        if (username) {
            await this.username.clear();
            await this.username.fill(username);
        }

        await this.password.fill(password);

        if (confirmPassword) {
            await this.confirmPassword.fill(confirmPassword);
        }
    }

    public async signUp({ email, username, password, confirmPassword }: ISignUpRequest): Promise<void> {
        await this.trigger.click();
        
        await this.fillForm({ email, username, password, confirmPassword });

        await this.submitButton.click({force: true});
    }
}