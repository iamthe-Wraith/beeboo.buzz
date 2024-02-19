<script lang="ts">
    import { onMount } from "svelte";
    import Button from "../Button.svelte";
    import TextInput from "../TextInput.svelte";
    import Textarea from "../Textarea.svelte";
    import { enhance } from "$app/forms";
    import type { ActionResult } from "@sveltejs/kit";
    import type { IApiError } from "$lib/utils/api-error";
    import { goto } from "$app/navigation";
	import { MAX_TASK_DESCRIPTION_LENGTH, MAX_TASK_TITLE_LENGTH } from "$lib/constants/task";

    type FormField = 'title' | 'description';

    export let onCancel: () => void = () => {};

    let processing = false;
    let title = '';
    let description = '';
    let disabled = true;

    let titleError = '';
    let descriptionError = '';
    let genError = '';

    $: disabled = !title || !!titleError || !!descriptionError || !!genError || processing;
    
    onMount(() => {
        reset();

        return reset;
    })

    function onCancelClick() {
        reset();
        onCancel?.();
    }

    function onSubmitResponse() {
        processing = true;

        return ({ result }: { result: ActionResult<{ message: string }> }) => {
            if (result.type === 'redirect') {
                goto(result.location);
            }
            
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
                window.location.reload();
            }

            processing = false;
        }
    };

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
        }
    }

    function reset() {
        title = '';
        description = '';
        titleError = '';
        descriptionError = '';
        genError = '';
        disabled = true;
    }
</script>

<form
    data-testid="new-quick-task-form"
    method="POST" 
    action="/tasks?/quickCreate"
    use:enhance={onSubmitResponse}
>
    <TextInput
        required
        id="title"
        data-testid="new-quick-task-title"
        label="Title"
        placeholder="Task Title"
        error={titleError}
        bind:value={title}
        on:blur={onBlur('title')}
    />

    <Textarea
        id="description"
        data-testid="new-quick-task-description"
        label="Description"
        placeholder="Task Description"
        error={descriptionError}
        bind:value={description}
        on:blur={onBlur('description')}
    />

    {#if genError}
        <p class="error" data-testid="new-quick-task-gen-error">{genError}</p>
    {/if}

    <div class="buttons-container">
        <Button
            id="new-quick-task-create"
            data-testid="new-quick-task-create"
            kind="primary"
            type="submit"
            {disabled}
            {processing}
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
</form>

<style>
    form {
        display: flex;
        flex-direction: column;
        gap: 0.7rem;

        @media (min-width: 500px) {
            gap: 1rem;
        }
    }

    .error {
        margin: 0;
    }

    .buttons-container {
        display: flex;
        flex-direction: row-reverse;
        justify-content: flex-start;
        align-items: center;
        gap: 1rem;
        padding: 0 var(--outline-offset);
    }
</style>