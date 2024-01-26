import { prisma } from "$lib/storage/db";
import { emailSchema, passwordSchema, usernameSchema } from "$lib/utils/schemas";
import { $Enums } from "@prisma/client";
import { generatePasswordHash, isValidPassword } from "../utils/auth";
import type { SafeParseSuccess } from "zod";
import { ApiError } from "$lib/utils/api-error";
import { HttpStatus } from "$lib/constants/error";

export interface ISigninRequest {
    emailOrUsername: string;
    password: string;
}

export interface ISignupRequest {
    email: string;
    username: string;
    password: string;
}

export const signin = async ({ emailOrUsername, password }: ISigninRequest) => {
    const errors: ApiError[] = [];

    if (!emailOrUsername) {
        errors.push(new ApiError('Email or username is required.', HttpStatus.UNPROCESSABLE, 'email_or_username', { emailOrUsername }));
    }

    if (!password) {
        errors.push(new ApiError('Password is required.', HttpStatus.UNPROCESSABLE, 'password'));
    }

    if (Object.keys(errors).length) throw errors;

    try {
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: emailOrUsername },
                    { username: emailOrUsername },
                ]
            },
        });

        if (!user) {
            throw new ApiError('Invalid credentials.', HttpStatus.UNAUTHORIZED, undefined, { emailOrUsername });
        }

        await isValidPassword(password, user.password);

        return user;
    } catch (err: unknown) {
        throw ApiError.parse(err);
    }
};

export const signup = async ({ email, username, password }: ISignupRequest) => {
    const validatedEmail = emailSchema.safeParse(email.trim());
    const validatedUsername = usernameSchema.safeParse(username.trim());
    const validatedPassword = passwordSchema.safeParse(password.trim());

    const errors: ApiError[] = [];

    if (!validatedEmail.success) {
        const formatted = validatedEmail.error.format();
        errors.push(new ApiError(formatted._errors[0], HttpStatus.UNPROCESSABLE, 'email', { email }));
    }

    if (!validatedUsername.success) {
        const formatted = validatedUsername.error.format();
        errors.push(new ApiError(formatted._errors[0], HttpStatus.UNPROCESSABLE, 'username', { username }));
    }

    if (!validatedPassword.success) {
        const formatted = validatedPassword.error.format();
        errors.push(new ApiError(formatted._errors[0], HttpStatus.UNPROCESSABLE, 'password', { password }));
    }

    if (Object.keys(errors).length) throw errors;

    try {
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: (validatedEmail as SafeParseSuccess<string>).data },
                    { username: (validatedUsername as SafeParseSuccess<string>).data },
                ]
            },
        });

        if (existingUser) {
            const errors: ApiError[] = [];
            
            if (existingUser.email === (validatedEmail as SafeParseSuccess<string>).data) {
                errors.push(new ApiError('Email is already in use.', HttpStatus.CONFLICT, 'email', { email }));
            }
            
            if (existingUser.username === (validatedUsername as SafeParseSuccess<string>).data) {
                errors.push(new ApiError('Username is already in use.', HttpStatus.CONFLICT, 'username', { username }));
            }

            throw errors;
        }

        const hash = await generatePasswordHash((validatedPassword as SafeParseSuccess<string>).data);
        const user = await prisma.user.create({
            data: {
                email: (validatedEmail as SafeParseSuccess<string>).data,
                username: (validatedUsername as SafeParseSuccess<string>).data,
                password: hash,
                accountType: $Enums.AccountType.FREE,
            },
        });

        return user;
    } catch (err: unknown) {
        throw ApiError.parse(err);
    }
};