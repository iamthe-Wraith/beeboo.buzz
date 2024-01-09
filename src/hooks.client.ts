import { PUBLIC_APP_ENV, PUBLIC_SENTRY_DSN } from "$env/static/public";
import { getTracesSampleRate } from "$lib/utils/sentry";
import { handleErrorWithSentry, Replay } from "@sentry/sveltekit";
import * as Sentry from '@sentry/sveltekit';

const getIntegrations = () => {
	if (PUBLIC_APP_ENV === 'production') return [new Replay()];
	return [];
};

const getReplaysOnErrorSampleRate = () => {
	return 1.0;
};

const getReplaysSessionSampleRate = () => {
	if (PUBLIC_APP_ENV === 'production') return 0.1;
	if (PUBLIC_APP_ENV === 'test') return 0;
	return 1.0;
};

Sentry.init({
  dsn: PUBLIC_SENTRY_DSN,
  tracesSampleRate: getTracesSampleRate(),

  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: getReplaysSessionSampleRate(),

  // If the entire session is not sampled, use the below sample rate to sample
  // sessions when an error occurs.
  replaysOnErrorSampleRate: getReplaysOnErrorSampleRate(),
  
  // If you don't want to use Session Replay, just remove the line below:
  integrations: getIntegrations(),
});

// If you have a custom error handler, pass it to `handleErrorWithSentry`
export const handleError = handleErrorWithSentry();
