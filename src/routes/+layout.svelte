<script lang="ts">
    import { PUBLIC_APP_ENV } from '$env/static/public';
    import './global.css';
    import Auth from '$lib/components/Auth.svelte';
</script>

<svelte:head>
	{#if PUBLIC_APP_ENV === 'production'}
		<meta
			http-equiv="Content-Security-Policy"
			content="
                default-src 'self' 'unsafe-inline';
                style-src 'self' 'unsafe-inline';
                font-src 'self'; 
                connect-src https://ohmygtd.app ws://ohmygtd.app https://api.unisvg.com/ https://api.iconify.design/ *.sentry.io blob:; 
                img-src https://ohmygtd.app blob:; 
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
                connect-src http://localhost:5173 http://localhost:4173 ws://localhost:5173 ws://localhost:4173 https://api.unisvg.com/ https://api.iconify.design/ *.sentry.io blob:; 
                img-src http://localhost:5173 http://localhost:4173 blob:; 
                child-src blob:; 
                worker-src blob:;"
		/>
	{/if}
</svelte:head>

<header data-testid="global-header">
    <div class="logo">Oh My GTD</div>

    <div>
        <Auth allowOpenFromQueryParams />
    </div>
</header>

<main data-testid="global-main">
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

        & .logo {
            font-size: 1.5rem;
            font-weight: bold;
        }
    }

    footer {
        height: 3rem;
    }

    main {
        min-height: calc(100vh - 7rem);
        padding: 1rem;
        background-color: var(--dark-300);
    }
</style>