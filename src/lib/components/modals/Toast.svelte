<script lang="ts">
    import { flip } from 'svelte/animate';
    import { fade } from 'svelte/transition';
    import Icon from '../Icon.svelte';
    import { toast } from '$lib/stores/toast';

    let open: boolean;

    let dialog: HTMLDialogElement;

    $: {
        if ($toast.length)  {
            openToastDialog();
        } else {
            closeToastDialog();
        }
    }

    function closeToastDialog() {
        dialog?.close();
        open = false;
    }

    function closeToastMessage(toastId: string) {
        return function() {
            toast.remove(toastId);
        }
    }

    function openToastDialog() {
        if (open) return;

        dialog?.show();
        open = true;
    }
</script>

<dialog
    data-testid="toast-messages-dialog"
    bind:this={dialog}
    {...$$restProps}
>
    <ul class="toast-messages">
        {#each $toast as toast (toast.id)}
            <li
                class="toast-message {toast.type}"
                data-testid="toast-message"
                out:fade
                animate:flip
            >
                <p class="toast-message-text" data-testid="toast-message-text">{ toast.message }</p>

                <button
                    class="close" 
                    on:click={closeToastMessage(toast.id)}
                    data-testid="close-toast-message-button"
                >
                    <Icon name="close" />
                </button>
            </li>
        {/each}
    </ul>
</dialog>

<style>
    dialog {
        position: fixed;
        top: 2rem;
        right: unset;
        left: 50%;
        width: 80vw;
        max-width: 20rem;
        border: none;
        border-radius: 0.5rem;
        background: transparent;
        transform: translate(-50%, 0);
        outline: none;
        z-index: 1005;

        @media (min-width: 768px) {
            top: 1rem;
            right: 1rem;
            left: auto;
            width: 90vw;
            transform: translate(0, 0);
        }
    }

    .toast-message {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem;
        border-radius: 0.25rem;

        &:not(:last-child) {
            margin-bottom: 0.5rem;
        }

        &.success {
            background: var(--primary-100);
            border: 1px solid var(--primary-500);
        }

        &.error {
            background: var(--danger-100);
            border: 1px solid var(--danger-500);
        }

        @media (max-width: 768px) {
            top: 2rem;
            right: 1rem;
            left: 1rem;
            max-width: unset;
        }
    }

    .toast-message-text {
        margin: 0;
    }

    .close {
        display: flex;
        justify-content: center;
        align-items: center;
        background: transparent;
        border: none;
        border-radius: 0.25rem;
        color: var(--light-500);
        z-index: 10;
        
        & svg {
            font-size: 1.5rem;
        }

        &:hover {
            cursor: pointer;
        }
    }
</style>