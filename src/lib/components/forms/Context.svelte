<script lang="ts">
    import { onMount } from "svelte";
    import Button from "../Button.svelte";
    import TextInput from "../TextInput.svelte";
    import Textarea from "../Textarea.svelte";
    import { enhance } from "$app/forms";
    import type { ActionResult } from "@sveltejs/kit";
    import type { IApiError } from "$lib/utils/api-error";
    import { goto } from "$app/navigation";
	import { MAX_CONTEXT_DESCRIPTION_LENGTH, MAX_CONTEXT_NAME_LENGTH } from "$lib/constants/context";
	import type { Context } from "@prisma/client";
	import { contexts } from "$lib/stores/contexts";

    type FormField = 'name' | 'description';

    export let context: Context | null = null;
    export let onCancel: () => void = () => {};

    let processing = false;
    let name = '';
    let description = '';
    let disabled = true;
    let initialized = false;

    let nameError = '';
    let descriptionError = '';
    let genError = '';

    $: disabled = !name || !!nameError || !!descriptionError || !!genError || processing;

    $: {
        if (context && !initialized) {
            name = context.name;
            description = context.description || '';
            initialized = true;
        }
    }
    
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

        return ({ result }: { result: ActionResult<{ message: string, context: Context }> }) => {
            if (result.type === 'redirect') {
                goto(result.location);
            }
            
            if (result.type === 'failure') {
                if (result.data?.errors) {
                    result.data.errors.map((e: IApiError) => {
                        switch (e.field) {
                            case 'name':
                                nameError = e.message;
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
                if (result.data?.context) {
                    if (!!context) {
                        contexts.replace(result.data.context);
                    } else {
                        contexts.add(result.data.context);
                    }
                }

                reset();

                onCancel?.();
            }

            processing = false;
        }
    };

    function onBlur(field: FormField) {
        return function() {
            switch (field) {
                case 'name':
                    name = name.trim();
                    if (!name) {
                        nameError = 'Name is required.';
                    } else if (name.length > MAX_CONTEXT_NAME_LENGTH) {
                        nameError = `Name must be less than ${MAX_CONTEXT_NAME_LENGTH} characters.`;
                    } else {
                        nameError = '';
                    }
                    break;
                case 'description':
                    description = description.trim();
                    if (description && description.length > MAX_CONTEXT_DESCRIPTION_LENGTH) {
                        descriptionError = `Description must be less than ${MAX_CONTEXT_DESCRIPTION_LENGTH} characters.`;
                    } else {
                        descriptionError = '';
                    }
                    break;
            }
        }
    }

    function reset() {
        name = '';
        description = '';
        nameError = '';
        descriptionError = '';
        genError = '';
        disabled = true;
        context = null;
        initialized = false;
    }
</script>

<form
    data-testid="context-form"
    method="POST" 
    action="{ !!context ? '/settings?/updateContext' : '/settings?/createContext' }"
    use:enhance={onSubmitResponse}
>
    {#if !!context}
        <input type="hidden" name="id" value="{context.id}" />
    {/if}

    <TextInput
        required
        id="name"
        data-testid="context-name"
        label="Name"
        placeholder="Context Name"
        error={nameError}
        bind:value={name}
        on:blur={onBlur('name')}
    />

    <Textarea
        id="description"
        data-testid="context-description"
        label="Description"
        placeholder="Context Description"
        error={descriptionError}
        bind:value={description}
        on:blur={onBlur('description')}
    />

    {#if genError}
        <p class="error" data-testid="gen-error">{genError}</p>
    {/if}

    <div class="buttons-container">
        <Button
            id="context-submit"
            data-testid="context-submit"
            kind="primary"
            type="submit"
            {disabled}
            {processing}
        >
            Create
        </Button>
    
        <Button
            id="context-cancel"
            data-testid="context-cancel"
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