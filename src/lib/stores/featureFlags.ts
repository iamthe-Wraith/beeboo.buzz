import type { FeatureFlag } from '@prisma/client';
import { writable } from 'svelte/store';

function createFeatureFlagsStore() {
    const { subscribe, set } = writable<Record<string, FeatureFlag>>({});

    return {
        subscribe,
        set: (featureFlags: Record<string, FeatureFlag>) => set(featureFlags),
        reset: () => set({})
    };
}

export const featureFlags = createFeatureFlagsStore();