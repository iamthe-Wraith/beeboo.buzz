
import { FeatureFlagService } from '$lib/services/feature-flag';
import { Logger } from '$lib/services/logger';
import { type SessionUser } from '$lib/services/session';
import type { FeatureFlag } from '@prisma/client';
import type { Handle } from '@sveltejs/kit';

export const loadFeatureFlags: Handle = async ({ event, resolve }) => {
    try {
        const featureFlagService = new FeatureFlagService({
            user: event.locals.session.user as SessionUser
        });

        const featureFlags: Record<string, FeatureFlag> = {};

        (await featureFlagService.getAll()).forEach((flag) => {
            featureFlags[flag.slug] = flag;
        });

        event.locals.featureFlags = featureFlags;
    } catch (err) {
        event.locals.session.delete(event.cookies);
        Logger.error('Error loading feature flags: ', err);
    }

    return resolve(event);
};
