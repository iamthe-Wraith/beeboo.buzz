import { emailSchema, usernameSchema } from "./schemas";

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