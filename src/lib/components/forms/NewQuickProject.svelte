<script lang="ts">
    import { onMount } from "svelte";
    import Button from "../Button.svelte";
    import TextInput from "../TextInput.svelte";
    import Textarea from "../Textarea.svelte";
    import { enhance } from "$app/forms";
    import type { ActionResult } from "@sveltejs/kit";
    import type { IApiError } from "$lib/utils/api-error";
    import { goto } from "$app/navigation";

    type FormField = 'title' | 'notes';

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
                    } else {
                        titleError = '';
                    }
                    break;
                case 'notes':
                    notes = notes.trim();
                    break;
            }
        }
    }

    function reset() {
        title = '';
        notes = '';
    }
</script>

<form
    data-testid="new-quick-project-form"
    method="POST" 
    action="/projects?/quickCreate"
    use:enhance={onSubmitResponse}
>
    <TextInput
        required
        id="title"
        data-testid="new-quick-project-title"
        label="Title"
        placeholder="Project Title"
        error={titleError}
        bind:value={title}
        on:blur={onBlur('title')}
    />

    <Textarea
        id="notes"
        data-testid="new-quick-project-notes"
        label="Notes"
        placeholder="Project Notes"
        error={notesError}
        bind:value={notes}
        on:blur={onBlur('notes')}
    />

    {#if genError}
        <p class="error" data-testid="new-quick-project-gen-error">{genError}</p>
    {/if}

    <div class="buttons-container">
        <Button
            id="new-quick-project-create"
            data-testid="new-quick-project-create"
            kind="primary"
            type="submit"
            {disabled}
            {processing}
        >
            Create
        </Button>
    
        <Button
            id="new-quick-project-cancel"
            data-testid="new-quick-project-cancel"
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