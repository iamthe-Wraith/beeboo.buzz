
import { Logger } from '$lib/services/logger';
import { Session } from '$lib/services/session';
import type { Handle } from '@sveltejs/kit';

export const authenticate: Handle = async ({ event, resolve }) => {
    const sessionToken = event.cookies.get('session');

    event.locals.session = new Session(sessionToken);

    if (sessionToken) {
        try {
            await event.locals.session.loadUser();
        } catch (err) {
            event.locals.session.delete(event.cookies);
            Logger.error('Authentication error: ', err);
        }
    }

    return resolve(event);
};
