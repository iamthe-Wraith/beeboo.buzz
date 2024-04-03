import type { Context } from '@prisma/client';
import { writable } from 'svelte/store';

function createContextsStore() {
    const { subscribe, set, update } = writable<Context[] | null>(null);

    return {
        subscribe,
        set: (contexts: Context[]) => set(contexts),
        add: (context: Context) => update((contexts) => contexts ? [...contexts, context] : [context]),
        replace: (context: Context) => update((contexts) => contexts ? contexts.map(c => c.id === context.id ? context : c) : [context]),
        reset: () => set(null)
    };
}

export const contexts = createContextsStore();