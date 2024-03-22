import jwt from 'jsonwebtoken';
import { JWT } from "$lib/utils/jwt";
import type { User } from "@prisma/client";
import { Logger } from "./logger";
import { ApiError } from "$lib/utils/api-error";
import { HttpStatus } from "$lib/constants/error";
import type { Cookies } from "@sveltejs/kit";
import { cache } from '$lib/storage/cache';
import { PUBLIC_APP_ENV } from '$env/static/public';

interface ISessionMetadata {
    iat: number | undefined;
    exp: number | undefined;
}

export type SessionUser = Omit<User, 'password'>;

export class Session {
    private _user: SessionUser | null = null;
    private _metadata: ISessionMetadata | null = null;
    private _token = '';
    private _options: jwt.SignOptions = {
        expiresIn: 60 * 60 * 24 * 30, // 30 days
    }

    constructor(token?: string) {
        if (token) this._token = token;
    }

    //#region Getters
    public get metadata(): ISessionMetadata | null {
        return this._metadata;
    }

    public get options(): jwt.SignOptions {
        return this._options;
    }

    public get token(): string {
        return this._token;
    }

    public get user(): SessionUser | null {
        return this._user;
    }
    //#endregion

    //#region Public Methods
    public delete = async (cookies: Cookies): Promise<void> => {
        cookies.delete('session', { path: '/' });

        await cache.del(this.token);
        this._token = '';

        this._user = null;
    }

    public loadUser = async () => {
        if (!this.token) return;

        let payload: jwt.JwtPayload;

        try {
            payload = JWT.read(this.token);

            if (payload) {
                this._metadata = {
                    iat: payload.iat,
                    exp: payload.exp
                };
    
                const user = await cache.get(this.token);

                if (user) {
                    this._user = JSON.parse(user) as SessionUser;   
                }
            }
        } catch (err) {
            Logger.error('Failed to load user from cache', err);
        }
    }

    public save = async (user: User): Promise<void> => {
        this._user = user;

        try {
            const tokenPayload = {
                id: this.user!.id,
                email: this.user!.email,
            };

            this._token = JWT.sign(tokenPayload, this.options);
    
            await this.cacheUser();
        } catch (err) {
            Logger.error(err);
            throw new ApiError("Failed to create session token", HttpStatus.SERVER);
        }
    }

    public setCookie = (cookies: Cookies): void => {
        cookies.set(
            'session',
            this.token, 
            { 
                httpOnly: true, 
                secure: PUBLIC_APP_ENV === 'production', 
                sameSite: 'lax', 
                path: '/', 
                maxAge: (this.options.expiresIn as number)
            }
        );
    }
    //#endregion

    //#region Private Methods
    private cacheUser = async (): Promise<void> => {
        try {
            if (!this.user) return;

            const userCache: SessionUser = {
                id: this.user!.id,
                email: this.user!.email,
                username: this.user!.username,
                accountType: this.user!.accountType,
                role: this.user!.role,
                createdAt: this.user!.createdAt,
                updatedAt: this.user!.updatedAt
            };

            await cache.set(
                this.token,
                JSON.stringify(userCache),
                (this.options.expiresIn as number) / 1000,
            );
        } catch (err) {
            Logger.error('Failed to cache user', err);
        }
    }
    //#endregion
}