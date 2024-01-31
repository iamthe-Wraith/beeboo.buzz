<script lang="ts">
	import NewQuickTask from "../forms/NewQuickTask.svelte";
    import Modal from "./Modal.svelte";

    let open = false;
    
    function onCancel() {
        open = false;
    }

    function onModalChange(e: CustomEvent<{ id: string; open: boolean }>) {
        open = e.detail.open;
    }

    function openNewQuickTaskModal() {
        open = true;
    }
</script>

<slot {openNewQuickTaskModal} />

<Modal
    id="new-quick-task-modal"
    bind:open
    title="New Task"
    on:modal-change={onModalChange}
>
    <NewQuickTask {onCancel} />
</Modal>
