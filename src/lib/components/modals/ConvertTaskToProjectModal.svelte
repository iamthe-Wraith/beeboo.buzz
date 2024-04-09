<script lang="ts">
	import ConvertTaskToProject from "../forms/ConvertTaskToProject.svelte";
    import Modal from "./Modal.svelte";

    const modalId = 'convert-task-to-project-modal';

    let open = false;
    let taskId: number;
    
    function onCancel() {
        open = false;
    }

    function onModalChange(e: CustomEvent<{ id: string; open: boolean, taskId: number }>) {
        taskId = e.detail.taskId;
        open = e.detail.open;
    }
</script>

<Modal
    id="{modalId}"
    bind:open
    on:modal-change={onModalChange}
    style="--modal-max-width: 30rem"
>
    <ConvertTaskToProject id={taskId} {onCancel} />
</Modal>
