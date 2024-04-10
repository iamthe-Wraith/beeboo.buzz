<script lang="ts">
    import NewQuickProject from "../forms/NewQuickProject.svelte";
    import Modal from "./Modal.svelte";

    let open = false;
    
    function close() {
        open = false;
    }

    function onModalChange(e: CustomEvent<{ id: string; open: boolean }>) {
        open = e.detail.open;
    }

    function openNewQuickProjectModal() {
        open = true;
    }
</script>

<slot {openNewQuickProjectModal} />

<Modal
    id="new-quick-project-modal"
    bind:open
    title="New Project"
    on:modal-change={onModalChange}
    style="--modal-max-width: 30rem"
>
    <NewQuickProject onCancel={close} onComplete={close} />
</Modal>
