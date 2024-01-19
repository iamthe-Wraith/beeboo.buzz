import jwt from 'jsonwebtoken';
import { JWT } from "$lib/utils/jwt";
import type { User } from "@prisma/client";
import { Logger } from "./logger";
import { ApiError } from "$lib/utils/api-error";
import { HttpStatus } from "$lib/constants/error";
import type { Cookies } from "@sveltejs/kit";

export class Session {
    private _user: User | null = null;
    private _token = '';
    private _options: jwt.SignOptions = {
        expiresIn: 60 * 60 * 24 * 30, // 30 days
    }

    constructor(token?: string) {
        if (token) {
            this._token = token;
            const tokenPayload = JWT.read(token);
            Logger.info('>>>>> tokenPayload: ', tokenPayload);
        }
    }

    public get user(): User | null {
        return this._user;
    }

    public get token(): string {
        return this._token;
    }

    public get options(): jwt.SignOptions {
        return this._options;
    }

    public save = async (user: User): Promise<void> => {
        this._user = user;

        try {
            const tokenPayload = {
                id: this.user!.id,
                email: this.user!.email,
                username: this.user!.username
            };

            this._token = JWT.sign(tokenPayload, this.options);
    
            // write user data to Redis
            //   if already exists, update
            //   else create

            // const userCache = {
            //     id: this.user.id,
            //     email: this.user.email,
            //     username: this.user.username,
            //     accountType: this.user.accountType,
            //     createdAt: this.user.createdAt,
            //     updatedAt: this.user.updatedAt
            // };
        } catch (err) {
            Logger.error(err);
            throw new ApiError("Failed to create session token", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public setSessionCookie = async (cookies: Cookies): Promise<void> => {
        cookies.set(
            'session',
            this.token, 
            { 
                httpOnly: true, 
                secure: true, 
                sameSite: 'lax', 
                path: '/', 
                maxAge: (this.options.expiresIn as number)
            }
        );
    }
}