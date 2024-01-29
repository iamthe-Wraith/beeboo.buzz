import type { IApiError } from '$lib/utils/api-error';
import { writable } from 'svelte/store';

function createErrorsStore() {
    const { subscribe, set } = writable<IApiError[] | null>(null);

    return {
        subscribe,
        set: (errors: IApiError[]) => set(errors),
        reset: () => set(null)
    };
}

export const errors = createErrorsStore();