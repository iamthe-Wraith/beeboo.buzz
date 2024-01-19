import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import { JWT_SESSION_SECRET } from '$env/static/private';
import { ApiError } from '$lib/utils/api-error';
import { Logger } from '$lib/services/logger';

dayjs.extend(utc);

export class JWT {
    static read = (token: string) => {
        return jwt.verify(token, JWT_SESSION_SECRET) as JwtPayload;
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
