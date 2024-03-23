import type { FeatureFlag } from '@prisma/client';
import { writable } from 'svelte/store';

function createFeatureFlagsStore() {
    const { subscribe, set } = writable<FeatureFlag[]>([]);

    return {
        subscribe,
        set: (featureFlags: FeatureFlag[]) => set(featureFlags),
        reset: () => set([])
    };
}

export const featureFlags = createFeatureFlagsStore();