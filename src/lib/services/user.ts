import { prisma } from "$lib/db/client";
import { emailSchema, passwordSchema, usernameSchema } from "$lib/utils/schemas";
import { $Enums } from "@prisma/client";
import { generatePasswordHash } from "./auth";
import type { IServiceResponse } from "../../types/services";
import type { SafeParseSuccess } from "zod";

export interface ISignupRequest {
    email: string;
    username: string;
    password: string;
}

export const signup = async ({ email, username, password }: ISignupRequest): Promise<IServiceResponse> => {
    const validatedEmail = emailSchema.safeParse(email.trim());
    const validatedUsername = usernameSchema.safeParse(username.trim());
    const validatedPassword = passwordSchema.safeParse(password.trim());

    const errors = {} as Record<string, string>;

    if (!validatedEmail.success) {
        const formatted = validatedEmail.error.format();
        errors.email = formatted._errors[0];
    }

    if (!validatedUsername.success) {
        const formatted = validatedUsername.error.format();
        errors.username = formatted._errors[0];
    }

    if (!validatedPassword.success) {
        const formatted = validatedPassword.error.format();
        errors.password = formatted._errors[0];
    }

    if (Object.keys(errors).length) {
        return { success: false, errors };
    }

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
            const data = { success: false, errors: ({} as { email?: string; username?: string }) };
            
            if (existingUser.email === (validatedEmail as SafeParseSuccess<string>).data) {
                data.errors.email = 'Email is already in use.';
            }
            
            if (existingUser.username === (validatedUsername as SafeParseSuccess<string>).data) {
                data.errors.username = 'Username is already in use.';
            }

            return data;
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

        return { success: true, data: { user } };
    } catch (err: unknown) {
        return { success: false, errors: { general: (err as Error).message } };
    }
};