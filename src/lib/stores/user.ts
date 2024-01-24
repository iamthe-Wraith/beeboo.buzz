import type { SessionUser } from '$lib/services/session';
import { writable } from 'svelte/store';

function createUserStore() {
    const { subscribe, set } = writable<SessionUser | null>(null);

    return {
        subscribe,
        set: (user: SessionUser) => set(user),
        reset: () => set(null)
    };
}

export const user = createUserStore();