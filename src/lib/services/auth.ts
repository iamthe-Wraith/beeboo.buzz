import { prisma } from "$lib/storage/db";
import { emailSchema, passwordSchema, usernameSchema } from "$lib/utils/schemas";
import { $Enums, type FeatureFlag, type User } from "@prisma/client";
import { generatePasswordHash, isValidPassword } from "../utils/auth";
import type { SafeParseSuccess } from "zod";
import { ApiError } from "$lib/utils/api-error";
import { HttpStatus } from "$lib/constants/error";
import { Logger } from "./logger";
import type { Cookies } from "@sveltejs/kit";
import { Session } from "./session";
import { ContextService } from "./context";
import { FeatureFlagService } from "./feature-flag";

export interface ISigninRequest {
    emailOrUsername: string;
    password: string;
}

export interface ISignupRequest {
    email: string;
    username: string;
    password: string;
}

export class AuthService {
    private user: User | null = null;

    constructor(
        private readonly cookies: Cookies,
    ) {}

    public signin = async ({ emailOrUsername, password }: ISigninRequest) => {
        const errors: ApiError[] = [];

        if (!emailOrUsername) {
            errors.push(new ApiError('Email or username is required.', HttpStatus.UNPROCESSABLE, 'email_or_username', { emailOrUsername }));
        }

        if (!password) {
            errors.push(new ApiError('Password is required.', HttpStatus.UNPROCESSABLE, 'password'));
        }

        if (Object.keys(errors).length) throw errors;

        try {
            this.user = await prisma.user.findFirst({
                where: {
                    OR: [
                        { email: emailOrUsername },
                        { username: emailOrUsername },
                    ]
                },
            });

            if (!this.user) {
                throw new ApiError('Invalid credentials.', HttpStatus.UNAUTHORIZED, undefined, { emailOrUsername });
            }

            await isValidPassword(password, this.user.password);

            await this.setSession();

            return this.user;
        } catch (err: unknown) {
            throw ApiError.parse(err);
        }
    }

    public signup = async ({ email, username, password }: ISignupRequest, featureFlags: FeatureFlag[]) => {
        if (!FeatureFlagService.featureIsEnabled('allow-new-users', featureFlags)) {
            throw new ApiError('Sorry, we\'re not accepting new users at this time.', HttpStatus.FORBIDDEN);
        }

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
    
            return await prisma.$transaction(async (tx) => {
                this.user = await prisma.user.create({
                    data: {
                        email: (validatedEmail as SafeParseSuccess<string>).data,
                        username: (validatedUsername as SafeParseSuccess<string>).data,
                        password: hash,
                        accountType: $Enums.AccountType.FREE,
                    },
                });

                const contextService = new ContextService({ user: this.user, tx });
    
                await contextService.createDefaultUserContexts();
                // TODO: create user settings
                // TODO: send email verification

                await this.setSession();

                return this.user;
            });
        } catch (err: unknown) {
            Logger.error(err);
            throw ApiError.parse(err);
        }
    }

    private setSession = async () => {
        if (!this.user) throw new Error('User not found.');

        const session = new Session();
        await session.save(this.user);
        session.setCookie(this.cookies);
    }
}
