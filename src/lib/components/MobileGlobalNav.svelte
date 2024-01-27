<script lang="ts">
	import Icon from "@iconify/svelte";
	import GlobalNav from "./GlobalNav.svelte";
	import { clickOutside } from "$lib/actions/click-outside";

    let mobileGlobalNav: HTMLDialogElement;
    let open = false;

    function closeNav() {
        mobileGlobalNav?.close();
        open = false;
    }

    function openNav() {
        mobileGlobalNav?.showModal();
        open = true;
    }
</script>

{#if !open}
    <button
        class="mobile-global-nav-trigger"
        data-testid="mobile-global-nav-trigger"
        aria-label="Menu"
        on:click={openNav}
    >
        <Icon data-testid="mobile-global-nav-trigger-icon" icon="ion:menu-outline" />
    </button>
{/if}

<dialog
    id="mobile-global-nav"
    data-testid="mobile-global-nav"
    bind:this={mobileGlobalNav}
    use:clickOutside
    on:click-outside={closeNav}
>
    <GlobalNav />
</dialog>

<style>
    dialog {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        max-width: 16rem;
        height: 100%;
        padding: 1rem 0;
        background-color: var(--dark-200);
        border: none;
        overflow: auto;
        z-index: 1002;
    }

    dialog:-internal-dialog-in-top-layer {
        max-height: 100%;
    }

    /* https://svelte.dev/examples/modal */
    dialog::backdrop {
		background: rgba(0, 0, 0, 0.3);
	}

    dialog[open] {
		animation: slide 0.3s;
	}

	@keyframes slide {
		from {
			transform: translate3d(-16rem, 0, 0);
		}
		to {
			transform: translate3d(0);
		}
	}

	dialog[open]::backdrop {
		animation: fade 0.2s ease-out;
	}

	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

    .mobile-global-nav-trigger {
        background: none;
        border: none;

        & svg {
            font-size: 2rem;
        }
    }
</style>