<script lang="ts">
    import Button from "../Button.svelte";
    import TextInput from "../TextInput.svelte";
    import Textarea from "../Textarea.svelte";
    import Modal from "./Modal.svelte";

    let open = false;
    let title = '';
    let notes = '';
    
    function onCancelClick() {
        reset();
        open = false;
    }

    function onModalChange(e: CustomEvent<{ id: string; open: boolean }>) {
        if (!e.detail.open) reset();

        open = e.detail.open;
    }

    function openNewQuickTaskModal() {
        open = true;
    }

    function reset() {
        title = '';
        notes = '';
    }
</script>

<slot {openNewQuickTaskModal} />

<Modal
    id="new-quick-task"
    bind:open
    title="New Task"
    on:modal-change={onModalChange}
>
    <form>
        <TextInput
            id="new-quick-task-title"
            data-testid="new-quick-task-title"
            label="Title"
            placeholder="Task Title"
            bind:value={title}
            required
        />

        <Textarea
            id="new-quick-task-notes"
            data-testid="new-quick-task-notes"
            label="Notes"
            placeholder="Task Notes"
            bind:value={notes}
            required
        />

        <div class="buttons-container">
            <Button
                id="new-quick-task-create"
                data-testid="new-quick-task-create"
                kind="primary"
                type="submit"
            >
                Create
            </Button>

            <Button
                id="new-quick-task-cancel"
                data-testid="new-quick-task-cancel"
                kind="transparent"
                type="button"
                on:click={onCancelClick}
            >
                Cancel
            </Button>
        </div>
    </form>
</Modal>

<style>
    form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        width: 80vw;
        max-width: 30rem;
    }

    .buttons-container {
        display: flex;
        flex-direction: row-reverse;
        justify-content: flex-start;
        align-items: center;
        gap: 1rem;
    }
</style>