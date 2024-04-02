import { emailSchema, passwordSchema, usernameSchema } from "./schemas";

export interface IValidator<T> {
    value: T;
    error: string;
}

export const validateEmail = (email: string): IValidator<string> => {
    const validated = emailSchema.safeParse(email.trim());

    let emailError = '';

    if (!validated.success) {
        const formatted = validated.error.format();
        emailError = formatted._errors[0];
    }

    return {
        value: email.trim(),
        error: emailError,
    }
}

export const validatePassword = (password: string): IValidator<string> => {
    const validated = passwordSchema.safeParse(password.trim());

    let passwordError = '';

    if (!validated.success) {
        const formatted = validated.error.format();
        passwordError = formatted._errors[0];
    }

    return {
        value: password.trim(),
        error: passwordError,
    }
}

export const validateUsername = (username: string): IValidator<string> => {
    const validated = usernameSchema.safeParse(username.trim());

    let usernameError = '';

    if (!validated.success) {
        const formatted = validated.error.format();
        usernameError = formatted._errors[0];
    }

    return {
        value: username.trim(),
        error: usernameError,
    }
}