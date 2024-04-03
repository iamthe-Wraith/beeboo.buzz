<script lang="ts">
	import type { Context } from "@prisma/client";
    import ContextForm from "../forms/Context.svelte";
    import Modal from "./Modal.svelte";

    const modalId = 'context-modal';

    let open = false;
    let context: Context | null;
    
    function onCancel() {
        open = false;
    }

    function onModalChange(e: CustomEvent<{ id: string; open: boolean, context: Context }>) {
        if (e.detail.open) {
            context = e.detail.context || null;
        } else {
            context = null;
        }
        
        open = e.detail.open;
    }

    function openContextModal(ctx?: Context) {
        open = true;
        context = context;
    }
</script>

<slot {openContextModal} />

<Modal
    id="{modalId}"
    bind:open
    title="{context ? 'Edit' : 'Add New'} Context"
    on:modal-change={onModalChange}
    style="--modal-max-width: 30rem"
>
    <ContextForm {onCancel} {context} />
</Modal>
