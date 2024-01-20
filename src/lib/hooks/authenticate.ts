
import { Logger } from '$lib/services/logger';
import { Session } from '$lib/services/session';
import type { Handle } from '@sveltejs/kit';

export const authenticate: Handle = async ({ event, resolve }) => {
    const sessionToken = event.cookies.get('session');

    if (sessionToken) {
        try {
            const session = new Session(sessionToken);
            await session.loadUser();
            event.locals.session = session;
        } catch (err) {
            Session.deleteCookie(event.cookies);
            Logger.error('Authentication error: ', err);
        }
    } else {
        event.locals.session = new Session();
    }

    return resolve(event);
};
