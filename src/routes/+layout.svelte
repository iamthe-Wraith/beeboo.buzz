<script lang="ts">
    import { PUBLIC_APP_ENV } from '$env/static/public';
    import './global.css';
    import type { LayoutData } from './$types';
    import { user } from '$lib/stores/user';
    import { featureFlags } from '$lib/stores/featureFlags';
	
    export let data: LayoutData;

    $: if (data?.user) user.set(data.user);
    $: if (data?.featureFlags) featureFlags.set(data.featureFlags);
</script>

<svelte:head>
    {#if PUBLIC_APP_ENV === 'production'}
        <meta
            http-equiv="Content-Security-Policy"
            content="
                default-src 'self' 'unsafe-inline';
                style-src 'self' 'unsafe-inline';
                font-src 'self'; 
                connect-src https://ohmygtd.wraithcode.io ws://ohmygtd.wraithcode.io https://api.unisvg.com https://*.sentry.io https://*.ingest.sentry.io blob:; 
                img-src https://ohmygtd.wraithcode.io blob:; 
                child-src blob:; 
                worker-src blob:;"
        />
    {/if}

    {#if PUBLIC_APP_ENV === 'test'}
        <meta
            http-equiv="Content-Security-Policy"
            content="
                default-src 'self' 'unsafe-inline';
                style-src 'self' 'unsafe-inline';
                font-src 'self'; 
                connect-src http://localhost:5173 http://localhost:4173 ws://localhost:5173 ws://localhost:4173 https://api.unisvg.com https://*.sentry.io https://*.ingest.sentry.io blob:; 
                img-src http://localhost:5173 http://localhost:4173 blob:; 
                child-src blob:; 
                worker-src blob:;"
        />
    {/if}
</svelte:head>

<slot></slot>
