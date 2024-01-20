import { sequence } from "@sveltejs/kit/hooks";
import { handleErrorWithSentry, sentryHandle } from "@sentry/sveltekit";
import * as Sentry from '@sentry/sveltekit';
import { PUBLIC_SENTRY_DSN, PUBLIC_APP_ENV } from "$env/static/public";
import { getDenyUrls, getTracesSampleRate } from "$lib/utils/sentry";
import { authenticate } from "$lib/hooks/authenticate";

Sentry.init({
  dsn: PUBLIC_SENTRY_DSN,
	environment: PUBLIC_APP_ENV,

	// Sets a uniform sample rate for all transactions
	tracesSampleRate: getTracesSampleRate(),

	// ignore the following urls
	// https://docs.sentry.io/platforms/javascript/guides/sveltekit/configuration/filtering/
	denyUrls: getDenyUrls(),
});

// If you have custom handlers, make sure to place them after `sentryHandle()` in the `sequence` function.
export const handle = sequence(sentryHandle(), authenticate);

// If you have a custom error handler, pass it to `handleErrorWithSentry`
export const handleError = handleErrorWithSentry();
