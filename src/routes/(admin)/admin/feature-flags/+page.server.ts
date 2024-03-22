import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from "./$types";
import type { Actions } from './$types';
import { FeatureFlagService } from "$lib/services/feature-flag";
import { HttpStatus } from '$lib/constants/error';
import { UserRole } from '@prisma/client';

export const actions: Actions = {
    create: async ({ request, locals }) => {
        if (
            !locals.session.user || 
            !locals.session.user.role || 
            (
                locals.session.user.role !== UserRole.ADMIN &&
                locals.session.user.role !== UserRole.SUPER_ADMIN
            )
        ) {
            return fail(HttpStatus.UNAUTHORIZED, { errors: ['Unauthorized'] });
        }

        const data = await request.formData();

        const name = data.get('name')! as string;
        const description = data.get('description')! as string;
        const isEnabled = data.get('isEnabled')! as string === 'true';

        const featureFlagService = new FeatureFlagService({ user: locals.session.user });
        const featureFlag = await featureFlagService.createFeatureFlag({ name, description, isEnabled });

        console.log('Feature flag created:', featureFlag);

        redirect(303, `/admin/feature-flags`);
    },
};

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.session.user) redirect(303, '/?signin=true');

    const featureFlagService = new FeatureFlagService({ user: locals.session.user });
    const featureFlags = featureFlagService.getFeatureFlags();

    return {
        featureFlags,
    };
};