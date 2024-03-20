import Redis from 'ioredis';
import { REDIS_URL } from '$env/static/private';
import { Logger } from '$lib/services/logger';

class Cache {
    private _client: Redis | null = null;

    constructor() {
        this._client = new Redis(REDIS_URL);

        this._client.on('error', (error) => {
            Logger.error('Cache', error);
        });
    }

    public del(key: string): Promise<number> {
        if (!this._client) return Promise.resolve(0);

        return this._client.del(key);
    }

    public get(key: string): Promise<string | null> {
        if (!this._client) return Promise.resolve(null);

        return this._client.get(key);
    }

    public set(key: string, value: string, expiration?: number): Promise<'OK' | null> {
        if (!this._client) return Promise.resolve(null);

        if (expiration) {
            return this._client.set(key, value, 'EX', expiration);
        }

        return this._client.set(key, value);
    }
}

export const cache = new Cache();