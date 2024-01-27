<script lang="ts">
    import { page } from '$app/stores';
    import { user } from '$lib/stores/user';
	import { onMount } from 'svelte';
    import Signout from './forms/Signout.svelte';
	import Avatar from './Avatar.svelte';

    let nav: HTMLElement;

    onMount(() => {
        nav.addEventListener('click', e => {
            e.stopPropagation();
        });

        nav.addEventListener('touchstart', e => {
            e.stopPropagation();
        });
    })
</script>

<nav
    data-testid="global-nav"
    bind:this={nav}
>
    <div class="upper-nav">
        <a
            href="/dashboard" 
            class={$page.url.pathname === '/dashboard' ? 'active' : ''}
        >
            Dashboard
        </a>
    </div>

    <div class="lower-nav">
        <a class="user-info-container" href="/settings">
            <div class="avatar-container">
                <Avatar size="medium" />
            </div>
            <div class="user-info">
                <div class="email">{ $user?.email }</div>
            </div>
        </a>

        <Signout />

        <p class="copyright">
            Copyright {new Date().getFullYear()}
        </p>
    </div>
</nav>

<style>
    nav {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: stretch;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

    .upper-nav {
        & a {
            display: block;
            width: 100%;
            padding: 0.5rem 1rem;
            font-size: 1.1rem;
            font-weight: 500;
            text-decoration: none;

            &:not(.active):hover {
                background-color: var(--dark-400);
            }

            &.active {
                border-right: 3px solid var(--primary-500);
                color: var(--primary-500);
                pointer-events: none;
            }

            @media (min-width: 768px) {
                padding: 0.5rem;
            }
        }
    }

    .lower-nav {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        width: 100%;
    }

    .user-info-container {
        display: flex;
        align-items: center;
        gap: 1rem;
        width: 100%;
        margin-bottom: 0.5rem;
        padding: 0.5rem;
        text-decoration: none;

        &:hover {
            background-color: var(--dark-400);
        }

        & .user-info {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 0.25rem;
        }
    }

    .copyright {
        font-size: 0.75rem;
        color: var(--dark-700);
    }
</style>