// See https://kit.svelte.dev/docs/types#app

import type { Session } from "$lib/services/session";
import type { FeatureFlag } from "@prisma/client";

// for information about these interfaces
declare global {
	declare namespace svelteHTML {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		interface HTMLAttributes<T> {
			popover?: string | boolean | null;
			popovertarget?: string | null;
		}
	}
	
	namespace App {
		interface Locals {
			session: Session;
			featureFlags: FeatureFlag[];
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			metadata?: Record<string, any>;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
