<script lang="ts">
    import { PUBLIC_APP_ENV } from '$env/static/public';
    import '../global.css';
    import Logo from '$lib/components/Logo.svelte';
    import AdminNav from '$lib/components/AdminNav.svelte';
    import MobileAdminNav from '$lib/components/MobileAdminNav.svelte';
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

<div class="container">
    <header data-testid="global-header">
        <div class="logo-container">
            <Logo />
        </div>
    
        <div data-testid="mobile-nav-container" class="mobile-nav-container">
            <MobileAdminNav />
        </div>

        <div data-testid="desktop-nav-container" class="desktop-nav-container">
            <AdminNav />
        </div>
    </header>
    
    <main data-testid="global-main" class="no-scrollbar">
        <slot></slot>  
    </main>
</div>

<style>
    .container {
        display: grid;
        grid-template-rows: 4rem 1fr;
        grid-template-columns: 1fr;
        grid-template-areas: 
            "header"
            "main";
        height: 100vh;
        width: 100vw;
        padding-bottom: 4rem;

        @media (min-width: 768px) {
            grid-template-rows: 1fr;
            grid-template-columns: 16rem 1fr;
            grid-template-areas: "header main";
            padding-bottom: 0;
        }
    }

    header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 4rem;
        padding: 0 1rem;
        background-color: var(--dark-200);

        @media (min-width: 768px) {
            flex-direction: column;
            align-items: flex-start;
            justify-content: flex-start;
            grid-area: header;
            width: 100%;
            height: 100%;
            padding: 0 0 1rem;
            overflow: hidden;
        }
    }

    .logo-container {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        width: auto;
        height: 100%;
        margin-right: 1rem;

        @media (min-width: 768px) {
            justify-content: center;
            width: 100%;
            height: 4rem;
            margin-right: 0;
            border-bottom: 1px solid var(--dark-400);
        }
    }

    .mobile-nav-container {
        display: block;

        @media (min-width: 768px) {
            display: none;
        }
    }

    .desktop-nav-container {
        display: none;
        overflow: hidden;

        @media (min-width: 768px) {
            display: block;
            width: 100%;
            height: calc(100% - 4rem);
            overflow: auto;
        }
    }

    main {
        min-height: calc(100vh - 7rem);
        padding: 0.5rem;

        @media (min-width: 1100px) {
            padding: 1rem;
        }
    }
</style>