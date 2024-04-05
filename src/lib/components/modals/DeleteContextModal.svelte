<script lang="ts">
    import DeleteContext from "../forms/DeleteContext.svelte";
    import Modal from "./Modal.svelte";

    const modalId = 'delete-context-modal';

    let open = false;
    let contextId: number;
    
    function onCancel() {
        open = false;
    }

    function onModalChange(e: CustomEvent<{ id: string; open: boolean, contextId: number }>) {
        contextId = e.detail.contextId;
        open = e.detail.open;
    }
</script>

<Modal
    id="{modalId}"
    bind:open
    on:modal-change={onModalChange}
    style="--modal-max-width: 30rem"
>
    <DeleteContext id={contextId} {onCancel} />
</Modal>
