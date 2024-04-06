<script lang="ts">
    import type { ActionResult } from "@sveltejs/kit";
    import { onMount } from "svelte";
    import { enhance } from "$app/forms";
    import type { Task } from "@prisma/client";
    import { contexts } from '$lib/stores/contexts';
    import TextInput from "$lib/components/TextInput.svelte";
    import Button from "$lib/components/Button.svelte";
    import type { IApiError } from "$lib/utils/api-error";
    import { MAX_TASK_DESCRIPTION_LENGTH, MAX_TASK_TITLE_LENGTH } from "$lib/constants/task";
    import Dropdown from "$lib/components/Dropdown.svelte";
	import MarkdownEditor from "../MarkdownEditor.svelte";

    type FormField = 'title' | 'description';

    export let task: Task;
    export let onCancel: () => void = () => {};
    export let onSave: (task: Task) => void = () => {};

    const context = $contexts?.find(c => c.id === task?.contextId);

    let title: string;
    let description: string;
    let contextValue = context ? { label: context.name, value: context.id } : null;

    let contextItems = $contexts ? $contexts.map(c => ({ label: c.name, value: c.id })) : [];

    let processing = false;
    let titleError: string;
    let descriptionError: string;
    let contextError = '';
    let genError: string;
    let disableUpdating = true;
    let changesDetected = false;

    $: disableUpdating = !!titleError || !!descriptionError || !!contextError || !!genError || !changesDetected || processing;

    onMount(() => {
        if (task) {
            if (!title) title = task.title;
            if (!description) description = task.description || '';
        }
    })

    function detectChanges() {
        changesDetected = false;

        if (
            task &&
            (
                task.title !== title ||
                (task.description || '') !== description ||
                task.contextId !== contextValue?.value
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
                    } else if (title.length > MAX_TASK_TITLE_LENGTH) {
                        titleError = `Title must be less than ${MAX_TASK_TITLE_LENGTH} characters.`;
                    } else {
                        titleError = '';
                    }
                    break;
                case 'description':
                    description = description.trim();
                    if (description && description.length > MAX_TASK_DESCRIPTION_LENGTH) {
                        descriptionError = `Description must be less than ${MAX_TASK_DESCRIPTION_LENGTH} characters.`;
                    } else {
                        descriptionError = '';
                    }
                    break;
            }

            detectChanges();
        }
    }

    function onCancelClick() {
        reset();
        onCancel();
    }

    function onContextChange(e: CustomEvent<{ label: string; value: number }>) {
        contextError = '';
        contextValue = e.detail;
        detectChanges();
    }

    function onContextClear() {
        contextError = 'A context is required.';
        contextValue = null;
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
                            case 'description':
                                descriptionError = e.message;
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
                onSave?.(task);
                window.location.reload();
            }

            processing = false;
        }
    };

    function reset() {
        title = task.title;
        description = task.description || '';
        titleError = '';
        descriptionError = '';
        disableUpdating = true;
    }
</script>

<form
    method="POST"
    action="/tasks?/update"
    data-testid="edit-task-form"
    class="no-scrollbar"
    use:enhance={onSaveResponse}
>
    <div>
        <h2>Edit Task</h2>

        <div class="buttons-container">
            <div>
                <!-- left empty intentionally -->
            </div>

            <div class="row-reverse">
                <Button
                    {processing}
                    type="submit"
                    data-testid="update-task-button"
                    disabled={disableUpdating}
                >
                    Save Changes
                </Button>

                <Button
                    disabled={processing}
                    data-testid="cancel-edit-task-button"
                    kind="transparent"
                    on:click={onCancelClick}
                >
                    Cancel
                </Button>
            </div>
        </div>
    </div>

    <input type="hidden" name="id" value={task.id} />

    <div class="row">
        <TextInput
            required
            id="title"
            label="Title"
            data-testid="edit-task-title"
            placeholder="Task Title"
            error={titleError}
            bind:value={title}
            on:blur={onBlur('title')}
        />
    </div>

    <div class="row col-2">
        <Dropdown
            id="context"
            label="Context"
            name="contextId"
            items={contextItems}
            placeholder="Select a Context"
            value={contextValue}
            error={contextError}
            on:change={onContextChange}
            on:clear={onContextClear}
        />

        <div></div>
    </div>

    <div class="description-container">
        <MarkdownEditor
            id="description"
            label="Description"
            placeholder="Task Description"
            error={descriptionError}
            bind:value={description}
            on:blur={onBlur('description')}
        />
    </div>

    {#if genError}
        <p class="error" data-testid="edit--task-gen-error">{genError}</p>
    {/if}
</form>

<style>
    form {
        --textarea-height: 10rem;

        display: flex;
        flex-direction: column;
        gap: 1rem;
        overflow: auto;
    }

    .description-container {
        --markdown-editor-flex-grow: 1;

        display: flex;
        flex-direction: column;
        flex-grow: 1;
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

    .row {
        display: flex;
        flex-direction: row;
        gap: 1rem;
        padding: 0 var(--outline-offset);

        & > * {
            flex: 1;
        }
    }

    @media (min-width: 1100px) {
        form {
            flex: 1;
        }
    }
</style>