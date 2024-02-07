<script lang="ts">
	import type { Task as TaskModal } from "@prisma/client";
    import Modal from "./Modal.svelte";
	import Task from "../forms/Task.svelte";

    export let task: TaskModal | null = null;

    let open = false;
    
    function onCancel() {
        open = false;
    }

    function onModalChange(e: CustomEvent<{ id: string; open: boolean }>) {
        open = e.detail.open;
    }

    function openTaskModal() {
        open = true;
    }
</script>

<slot {openTaskModal} />

<Modal
    id="task-modal"
    bind:open
    title={!!task ? "Edit Task" : "New Task"}
    on:modal-change={onModalChange}
>
    <Task {task} {onCancel} />
</Modal>
