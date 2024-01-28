import type { Context } from '@prisma/client';
import { writable } from 'svelte/store';

function createContextsStore() {
    const { subscribe, set } = writable<Context[] | null>(null);

    return {
        subscribe,
        set: (contexts: Context[]) => set(contexts),
        reset: () => set(null)
    };
}

export const contexts = createContextsStore();