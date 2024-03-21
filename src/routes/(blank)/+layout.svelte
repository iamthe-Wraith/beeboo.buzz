<script lang="ts">
    import { PUBLIC_APP_ENV } from '$env/static/public';
    import '../global.css';
    import Auth from '$lib/components/Auth.svelte';
    import type { LayoutData } from './$types';
    import { user } from '$lib/stores/user';
    import Signout from '$lib/components/forms/Signout.svelte';
	import Logo from '$lib/components/Logo.svelte';
	
    export let data: LayoutData;

    $: if (data?.user) user.set(data.user);
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

<header data-testid="global-header">
    <Logo />

    <div>
        {#if $user}
            <Signout />
        {:else}
            <Auth allowOpenFromQueryParams />
        {/if}
    </div>
</header>

<main data-testid="global-main" class="no-scrollbar">
    <slot></slot>  
</main>

<footer data-testid="global-footer">
    <div></div>
    <div>
        Copyright {new Date().getFullYear()}
    </div>
</footer>

<style>
    header,
    footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 1rem;
        background-color: var(--dark-100);
        color: #fff;
    }

    header {
        height: 4rem;
    }

    footer {
        height: 3rem;
    }

    main {
        min-height: calc(100vh - 7rem);
        padding: 0.5rem;
        background-color: var(--dark-300);

        @media (min-width: 1100px) {
            padding: 1rem;
        }
    }
</style>