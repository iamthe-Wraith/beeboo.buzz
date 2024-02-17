<script lang="ts">
    import type { ActionResult } from "@sveltejs/kit";
    import { enhance } from "$app/forms";
    import type { Project } from "@prisma/client";
    import TextInput from "$lib/components/TextInput.svelte";
    import Button from "$lib/components/Button.svelte";
    import Textarea from "$lib/components/Textarea.svelte";
    import type { IApiError } from "$lib/utils/api-error";
	import { onMount } from "svelte";

    type FormField = 'title' | 'description';

    export let project: Project;
    export let onCancel: () => void = () => {};
    export let onSave: (project: Project) => void = () => {};

    let title: string;
    let description: string;

    let processing = false;
    let titleError: string;
    let descriptionError: string;
    let genError: string;
    let disableUpdating = true;
    let changesDetected = false;

    $: disableUpdating = !!titleError || !!descriptionError || !!genError || !changesDetected || processing;

    onMount(() => {
        if (project) {
            if (!title) title = project.title;
            if (!description) description = project.notes || '';
        }
    })

    function detectChanges() {
        changesDetected = false;

        if (
            project &&
            (
                project.title !== title ||
                (project.notes || '') !== description
            )
        ) {
            changesDetected = true;
        }
    }

    function onBlur(field: FormField) {
        return function() {
            switch (field) {
                case 'title':
                    title = title.trim();
                    if (!title) {
                        titleError = 'Title is required.';
                    } else {
                        titleError = '';
                    }
                    break;
                case 'description':
                    description = description.trim();
                    break;
            }

            detectChanges();
        }
    }

    function onCancelClick() {
        reset();
        onCancel();
    }

    function onSaveResponse() {
        processing = true;

        return ({ result }: { result: ActionResult<{ message: string }> }) => {
            if (result.type === 'failure') {
                if (result.data?.errors) {
                    result.data.errors.map((e: IApiError) => {
                        switch (e.field) {
                            case 'title':
                                titleError = e.message;
                                break;
                            case 'notes':
                                description = e.message;
                                break;
                            default:
                                genError = e.message;
                                break;
                        }
                    })
                } else {
                    genError = 'Something went wrong. Please try again later.';    
                }
            }

            if (result.type === 'success') {
                reset();                
                onSave?.(project);
                window.location.reload();
            }

            processing = false;
        }
    };

    function reset() {
        title = project.title;
        description = project.notes || '';
        titleError = '';
        descriptionError = '';
        disableUpdating = true;
    }
</script>

<form
    method="POST"
    action="/projects?/update"
    data-testid="edit-project-form"
    use:enhance={onSaveResponse}
>
    <h2>Edit Project</h2>

    <input type="hidden" name="projectId" value={project.id} />

    <TextInput
        required
        id="title"
        label="Title"
        data-testid="edit-project-title"
        placeholder="Project Title"
        error={titleError}
        bind:value={title}
        on:blur={onBlur('title')}
    />

    <Textarea
        id="description"
        label="Description"
        data-testid="edit-project-description"
        placeholder="Project Description"
        error={descriptionError}
        bind:value={description}
        on:blur={onBlur('description')}
    />

    {#if genError}
        <p class="error" data-testid="edit--project-gen-error">{genError}</p>
    {/if}

    <div class="buttons-container">
        <div>
            <!-- left empty intentionally -->
        </div>

        <div class="row-reverse">
            <Button
                {processing}
                type="submit"
                data-testid="update-project-button"
                disabled={disableUpdating}
            >
                Save Changes
            </Button>

            <Button
                disabled={processing}
                data-testid="cancel-edit-project-button"
                kind="transparent"
                on:click={onCancelClick}
            >
                Cancel
            </Button>
        </div>
    </div>
</form>

<style>
    form {
        --textarea-height: 10rem;

        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .buttons-container {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
        padding: 0.25rem var(--outline-offset) 0;

        & > div {
            display: flex;
            align-items: center;
            gap: 0.25rem;
            padding: 0 var(--outline-offset);

            &.row-reverse {
                flex-direction: row-reverse;
            }
        }
    }

    @media (min-width: 1100px) {
        form {
            flex: 1;
            padding-right: 1rem;
        }
    }
</style>