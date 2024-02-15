<script lang="ts">
	import type { ActionResult } from "@sveltejs/kit";
    import { enhance } from "$app/forms";
	import { goto } from "$app/navigation";
	import Button from "../Button.svelte";
	import Icon from "../Icon.svelte";
	import Modal from "../modals/Modal.svelte";

    export let projectId: number;

    const id = 'delete-project-modal';
    let open = false;
    let processing = false;

    function onCancelClick() {
        open = false;
    }

    function onDelete() {
        processing = true;

        return ({ result }: { result: ActionResult<{ message: string }> }) => {
            if (result.type === 'failure') {
                // TODO: Show toast message that deletion failed
                console.log('Error deleting project', result);
            }

            if (result.type === 'redirect') {
                // TODO: Show toast message that project was deleted
                goto(result.location);
            }

            processing = false;
        }
    }

    function onModalChange(e: CustomEvent<{ id: string, open: boolean }>) {
        if (e.detail.id === id) {
            open = e.detail.open;
        }
    }

    function onTriggerDelete() {
        open = true;
    }

    // TODO: remove project from all tasks that are linked to it.
</script>

<Button
    data-testid={`${id}-trigger-button`}
    kind="danger-transparent"
    on:click={onTriggerDelete}
>
    Delete
</Button>

<Modal
    {id}
    bind:open
    on:modal-change={onModalChange}
    style="--modal-max-width: 25rem;"
>
    <div class="content-container" data-testid={`${id}-content-container`}>
        <div class="content-header" data-testid={`${id}-content-header`}>
            <div class="icon-container" data-testid={`${id}-icon-container`}>
                <Icon name="warning" />
            </div>

            <div>
                Are you sure?
            </div>
        </div>

        <p data-testid={`${id}-text`}>
            Are you sure you want to delete this project? Any tasks linked to this project will be unlinked. <span>This cannot be undone.</span>
        </p>
    </div>

    <div class="buttons-container">
        <Button
            data-testid="cancel-delete-project-button"
            kind="transparent"
            disabled={processing}
            on:click={onCancelClick}
        >
            Cancel
        </Button>

        <form
            method="POST"
            action="/projects?/delete"
            use:enhance={onDelete}
        >
            <input type="hidden" name="projectId" value={projectId} />

            <Button
                {processing}
                data-testid="delete-project-button"
                kind="danger"
                type="submit"
            >
                Delete
            </Button>
        </form>
    </div>
</Modal>

<style>
    .content-container {
        & p {
            padding: 2rem 0;
            text-align: center;

            & span {
                display: block;
                margin-top: 0.5rem;
                color: var(--danger-500);
            }
        }
    }

    .content-header {
        display: flex;
        align-items: center;
        justify-content: center;

        & div.icon-container {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 1rem;
            
            & svg {
                font-size: 2rem;
            }
        }

        & div:not(.icon-container) {
            font-size: 1.5rem;
            color: var(--danger-500);
        }
    }

    .buttons-container {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
    }
</style>