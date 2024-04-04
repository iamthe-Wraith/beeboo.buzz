<script lang="ts">
    import { createEventDispatcher, onMount } from 'svelte'
    import { navigating } from '$app/stores';
	import { clickOutside } from '$lib/actions/click-outside';
	import Icon from '../Icon.svelte';
	import { OPEN_MODAL_EVENT } from '$lib/constants/custom-events';

    export let id: string;
    export let open: boolean;
    export let title = '';

    let modal: HTMLDialogElement;

    const dispatch = createEventDispatcher()

    $: if($navigating) open = false;

    $: if (open) {
        openModal();
    } else {
        closeModal();
    }

    onMount(() => {
        modal.addEventListener('close', onClose);
        modal.addEventListener('cancel', onClose);
        modal.addEventListener('show', onShow);

        document.addEventListener(OPEN_MODAL_EVENT, enhancedOpenModal);

        return () => {
            modal.removeEventListener('close', onClose);
            modal.removeEventListener('cancel', onClose);
            modal.removeEventListener('show', onShow);

            document.removeEventListener(OPEN_MODAL_EVENT, enhancedOpenModal);
        }
    });

    function closeModal() {
        modal?.close();
    }

    function enhancedOpenModal(e: Event) {
        if (e instanceof CustomEvent) {
            if (e.detail.id === id) {
                dispatch('modal-change', { ...(e.detail.data || {}), id, open: true });
            }
        }
    }

    function onClose() {
        dispatch('modal-change', { id, open: false });
    }

    function onShow() {
        dispatch('modal-change', { id, open: true });
    }

    function openModal() {
        modal?.showModal();
    }
</script>

<dialog
    {id}
    data-testid={id}
    bind:this={modal}
    use:clickOutside
    on:click-outside={closeModal}
    {...$$restProps}
>
    <div class="modal-contents">
        <button
            class="close" 
            on:click={closeModal}
            data-testid="close-modal-button"
        >
            <Icon name="close" />
        </button>

        {#if title}
            <div class="modal-header">
                <h3 class="h5">{title}</h3>
            </div>
        {/if}

        <section>
            <slot />
        </section>
    </div>
</dialog>

<style>
    dialog {
        position: fixed;
        top: 50%;
        left: 50%;
        width: 90vw;
        max-width: var(--modal-max-width, 40rem);
        background-color: var(--dark-200);
        border: 1px solid var(--dark-600);
        border-radius: 0.5rem;
        transform: translate(-50%, -50%);
        z-index: 1002;
    }
    
    /* https://svelte.dev/examples/modal */
    dialog::backdrop {
		background: rgba(0, 0, 0, 0.3);
	}

    dialog[open] {
		animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	@keyframes zoom {
		from {
			transform: translate(-50%, -50%) scale(0.95);
		}
		to {
			transform: translate(-50%, -50%) scale(1);
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

    .modal-contents {
        position: relative;
    }

    .close {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: var(--dark-500);
        border: none;
        border-radius: 0.25rem;
        color: var(--light-500);
        z-index: 10;
        
        & svg {
            font-size: 1.5rem;
        }

        &:hover {
            background-color: var(--dark-700);
            cursor: pointer;
        }
    }

    .modal-header {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding: 0.5rem 2.5rem 0 1rem;

        & h3 {
            margin-right: 1rem;
            color: var(--light-900);
        }
    }

    section {
        padding: 1rem 1rem 0.75rem 1rem;
    }
</style>