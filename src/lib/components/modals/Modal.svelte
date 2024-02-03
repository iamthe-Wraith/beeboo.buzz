<script lang="ts">
    import { createEventDispatcher, onMount } from 'svelte'
    import { navigating } from '$app/stores';
    import Icon from '@iconify/svelte';
	import { clickOutside } from '$lib/actions/click-outside';

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

        return () => {
            modal.removeEventListener('close', onClose);
            modal.removeEventListener('cancel', onClose);
            modal.removeEventListener('show', onShow);
        }
    });

    function closeModal() {
        modal?.close();
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
>
    <div class="modal-header">
        <button
            class="close" 
            on:click={closeModal}
            data-testid="close-modal-button"
        >
            <Icon icon="ion:close" />
        </button>
        <h3 class="h5">{title}</h3>
    </div>

    <section>
        <slot />
    </section>
</dialog>

<style>
    dialog {
        position: fixed;
        top: 50%;
        left: 50%;
        background-color: var(--dark-200);
        border: 1px solid var(--dark-600);
        border-radius: 0.5rem;
        transform: translate(-50%, -50%);
        overflow: hidden;
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

    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-direction: row-reverse;
        padding: 0.5rem 0.5rem 1rem 1rem;

        & h3 {
            margin-right: 1rem;
            color: var(--light-900);
        }

        & .close {
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: var(--dark-500);
            border: none;
            border-radius: 0.25rem;
            color: var(--light-500);
            
            & svg {
                font-size: 1.5rem;
            }

            &:hover {
                background-color: var(--dark-700);
                cursor: pointer;
            }
        }
    }

    section {
        padding: 0 1rem 0.75rem 1rem;
    }
</style>