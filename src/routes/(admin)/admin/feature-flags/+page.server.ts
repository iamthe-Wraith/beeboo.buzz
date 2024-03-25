import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from "./$types";
import type { Actions } from './$types';
import { FeatureFlagService } from "$lib/services/feature-flag";
import { HttpStatus } from '$lib/constants/error';
import { ApiResponse } from '$lib/utils/api-response';
import { ApiError } from '$lib/utils/api-error';

export const actions: Actions = {
    create: async ({ request, locals }) => {
        if (!locals.session.user || !locals.session.user.role) {
            return fail(HttpStatus.UNAUTHORIZED, { errors: ['Unauthorized'] });
        }

        try {
            const featureFlagService = new FeatureFlagService({ user: locals.session.user });

            featureFlagService.authorize();

            const data = await request.formData();

            const name = data.get('name')! as string;
            const description = data.get('description')! as string;
            const isEnabled = data.get('isEnabled')! as string === 'true';

            const featureFlag = await featureFlagService.create({ name, description, isEnabled });
            return { featureFlag };
        } catch (err) {
            const response = new ApiResponse({ errors: ApiError.parse(err) });
            return fail(response.statusCode, { errors: response.errors });
        }
    },
    delete: async ({ request, locals }) => {
        if (!locals.session.user || !locals.session.user.role) {
            return fail(HttpStatus.UNAUTHORIZED, { errors: ['Unauthorized'] });
        }

        try {
            const featureFlagService = new FeatureFlagService({ user: locals.session.user });

            featureFlagService.authorize();

            const data = await request.formData();
            const id = parseInt(data.get('id')! as string);

            const featureFlag = await featureFlagService.delete(id);

            if (!featureFlag) {
                return fail(HttpStatus.NOT_FOUND, { errors: ['Feature flag not found.'] });
            }

            return { featureFlag };
        } catch (err) {
            const response = new ApiResponse({ errors: ApiError.parse(err) });
            return fail(response.statusCode, { errors: response.errors });
        }
    },
    toggleEnabled: async ({ request, locals }) => {
        if (!locals.session.user || !locals.session.user.role) {
            return fail(HttpStatus.UNAUTHORIZED, { errors: ['Unauthorized'] });
        }

        try {
            const featureFlagService = new FeatureFlagService({ user: locals.session.user });

            featureFlagService.authorize();

            const data = await request.formData();
            const id = parseInt(data.get('id')! as string);

            let featureFlag = await featureFlagService.getById(id);

            if (!featureFlag) {
                return fail(HttpStatus.NOT_FOUND, { errors: ['Feature flag not found.'] });
            }

            featureFlag = await featureFlagService.update({ ...featureFlag, isEnabled: !featureFlag.isEnabled });
            return { featureFlag };
        } catch (err) {
            const response = new ApiResponse({ errors: ApiError.parse(err) });
            return fail(response.statusCode, { errors: response.errors });
        }
    }
};

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.session.user) redirect(303, '/?signin=true');

    return {
        featureFlags: locals.featureFlags || [],
    };
};