<script lang="ts">
	import type { ActionResult } from "@sveltejs/kit";
	import { enhance } from "$app/forms";
	import { goto } from "$app/navigation";
	import Button from "../Button.svelte";
	import type { IApiError } from "$lib/utils/api-error";
	import type { Project } from "@prisma/client";

    export let id: number;
    export let onCancel: () => void = () => {};

    let processing = false;
    let genError = '';

    function onCancelClick() {
        reset();
        onCancel?.();
    }

    function onSubmitResponse() {
        processing = true;

        return ({ result }: { result: ActionResult<{ message: string, project?: Project }> }) => {
            if (result.type === 'redirect') {
                goto(result.location);
            }
            
            if (result.type === 'failure') {
                if (result.data?.errors) {
                    result.data.errors.map((e: IApiError) => {
                        genError = e.message;
                    })
                } else {
                    genError = 'Something went wrong. Please try again later.';    
                }
            }

            if (result.type === 'success') {
                onCancel?.();

                if (result.data?.project) {
                    goto(`/projects/${result.data.project.id}`);
                } else {
                    goto('/projects');
                }
            }

            processing = false;
        }
    };

    function reset() {
        processing = false;
    }
</script>

<form
    data-testid="convert-task-to-project-form"
    method="POST" 
    action="/tasks?/convertToProject"
    use:enhance={onSubmitResponse}
>
    <h2 data-testid="convert-task-to-project-modal-header">Turn this task into a project?</h2>

    <div class="message-container" data-testid="convert-task-to-project-modal-message">
        <p>This task will be deleted, and a new project will be created from it.</p>
    </div>

    <input type="hidden" name="id" value={id} />

    {#if genError}
        <p class="danger">{genError}</p>
    {/if}

    <div class="buttons-container">
        <Button
            id="convert-task-to-project-submit"
            data-testid="convert-task-to-project-submit"
            kind="primary"
            type="submit"
            {processing}
        >
            Yes, Convert It
        </Button>
    
        <Button
            id="cancel-convert-task-to-project"
            data-testid="cancel-convert-task-to-project"
            kind="transparent"
            type="button"
            on:click={onCancelClick}
        >
            Cancel
        </Button>
    </div>
</form>

<style>
    .message-container {
        padding: 1rem 0 1.5rem;
    }

    p {
        margin: 0.5rem 0;
        text-align: center;

        &.danger {
            color: var(--danger-500);
        }
    }

    .buttons-container {
        display: flex;
        flex-direction: row-reverse;
        justify-content: flex-start;
        align-items: center;
        gap: 1rem;
    }
</style>