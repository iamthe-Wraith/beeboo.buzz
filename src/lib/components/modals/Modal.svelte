<script lang="ts">
    import Icon from '@iconify/svelte';
	import { clickOutside } from '$lib/actions/click-outside';

    export let open: boolean;
    export let title = '';

    let modal: HTMLDialogElement;

    $: if (open) {
        modal?.showModal();
    } else {
        modal?.close();
    }

    function close() {
        modal.close();
    }
</script>

<dialog
    bind:this={modal}
    use:clickOutside
    on:click-outside={close}
>
    <header>
        <button class="close" on:click={close}>
            <Icon icon="ion:close" />
        </button>
        <h3 class="h5">{title}</h3>
    </header>

    <section>
        <slot />
    </section>
</dialog>

<style>
    dialog {
        position: fixed;
        top: 50%;
        left: 50%;
        background-color: var(--dark-100);
        border-radius: 0.5rem;
        transform: translate(-50%, -50%);
        z-index: 1002;
    }

    header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-direction: row-reverse;
        margin-bottom: 1rem;
        padding: 0.25rem 0.25rem 0 1rem;

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
            outline: none;
            color: var(--light-500);
            font-size: 1.5rem;
            cursor: pointer;

            &:hover {
                background-color: var(--dark-700);
            }
        }
    }

    section {
        padding: 0 1rem 0.5rem 1rem;
    }
</style>