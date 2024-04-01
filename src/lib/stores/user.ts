import type { SessionUser } from '$lib/services/session';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { writable } from 'svelte/store';

dayjs.extend(utc)

function createUserStore() {
    const { subscribe, set } = writable<SessionUser | null>(null);

    return {
        subscribe,
        set: (user: SessionUser) => set({
            ...user,
            createdAt: dayjs(user.createdAt).local().toDate(),
            updatedAt: dayjs(user.updatedAt).local().toDate(),
        }),
        reset: () => set(null)
    };
}

export const user = createUserStore();