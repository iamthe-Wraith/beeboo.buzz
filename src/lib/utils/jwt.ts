import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import { JWT_SESSION_SECRET } from '$env/static/private';
import { ApiError } from '$lib/utils/api-error';
import { Logger } from '$lib/services/logger';

dayjs.extend(utc);

export class JWT {
    static read = (token: string) => {
        try {
            return jwt.verify(token, JWT_SESSION_SECRET) as JwtPayload;
        } catch (err) {
            Logger.error('Error reading session token: ', err);
            throw new ApiError('Error reading session token.', 500);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static sign = (payload: Record<string, any>, options?: jwt.SignOptions) => {
        try {
            return jwt.sign(
                payload, 
                JWT_SESSION_SECRET, 
                (options || {})
            );
        } catch (err) {
            Logger.error('Error creating session token: ', err);
            throw new ApiError('Error creating session token.', 500);
        }
    }
}
