<script lang="ts">
    import { onMount } from "svelte";
    import Button from "../Button.svelte";
    import TextInput from "../TextInput.svelte";
    import Textarea from "../Textarea.svelte";
    import { enhance } from "$app/forms";
    import type { ActionResult } from "@sveltejs/kit";
    import type { IApiError } from "$lib/utils/api-error";
    import { goto } from "$app/navigation";

    export let onCancel: () => void = () => {};

    let processing = false;
    let title = '';
    let notes = '';
    let disabled = true;

    let titleError = '';
    let notesError = '';
    let genError = '';

    $: disabled = title === '';
    
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
                            case 'notes':
                                notes = e.message;
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

                console.log('success!', result);
                
                onCancel?.();
            }

            processing = false;
        }
    };

    function reset() {
        title = '';
        notes = '';
    }
</script>

<form
    data-testid="new-quick-task-form"
    method="POST" 
    action="/tasks?/create"
    use:enhance={onSubmitResponse}
>
    <TextInput
        id="title"
        data-testid="new-quick-task-title"
        label="Title"
        placeholder="Task Title"
        error={titleError}
        bind:value={title}
        required
    />

    <Textarea
        id="notes"
        data-testid="new-quick-task-notes"
        label="Notes"
        placeholder="Task Notes"
        error={notesError}
        bind:value={notes}
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
            {disabled}
            on:click={onCancelClick}
        >
            Cancel
        </Button>
</form>

<style>
    form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        width: 80vw;
        max-width: 30rem;
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
    }
</style>