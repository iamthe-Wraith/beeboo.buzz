import type { Page, Locator } from '@playwright/test';
import { AuthFixture } from './auth';

interface ISignInRequest {
    emailOrUsername: string;
    password: string;
}

export class SignInFixture extends AuthFixture {
    public form: Locator;
    public trigger: Locator;

    public emailOrUsername: Locator;
    public password: Locator;

    public emailOrUsernameError: Locator;
    public passwordError: Locator;

    public genError: Locator;

    public toSignUpButton: Locator;
    public submitButton: Locator;

    constructor(public readonly page: Page) {
        super(page);

        this.form = this.page.getByTestId('signin-form');
        this.trigger = this.page.getByTestId('global-header').getByRole('button', { name: 'Sign in' });

        this.emailOrUsername = this.form.getByLabel('Email or username');
        this.password = this.form.getByLabel('Password', { exact: true });

        this.emailOrUsernameError = this.form.getByTestId('email_or_username-error');
        this.passwordError = this.form.getByTestId('password-error');

        this.genError = this.form.getByTestId('gen-error');

        this.toSignUpButton = this.form.getByRole('button', { name: 'Sign up' });
        this.submitButton = this.form.getByRole('button', { name: 'Sign in' });
    }

    public async fillForm({ emailOrUsername, password }: ISignInRequest): Promise<void> {
        await this.emailOrUsername.fill(emailOrUsername);
        await this.password.fill(password);
    }

    public async signIn({ emailOrUsername, password }: ISignInRequest): Promise<void> {
        await this.trigger.click();
        
        await this.fillForm({ emailOrUsername, password });

        await this.submitButton.click({force: true});
    }
}