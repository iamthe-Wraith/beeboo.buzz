<script lang="ts">
    import { onMount } from "svelte";
    import Button from "../Button.svelte";
    import TextInput from "../TextInput.svelte";
    import Textarea from "../Textarea.svelte";
    import { enhance } from "$app/forms";
    import type { ActionResult } from "@sveltejs/kit";
    import type { IApiError } from "$lib/utils/api-error";
    import { goto } from "$app/navigation";
	import { MAX_FEATURE_FLAG_DESCRIPTION_LENGTH, MAX_FEATURE_FLAG_NAME_LENGTH } from "$lib/constants/feature-flag";
	import Checkbox from "../Checkbox.svelte";

    type FormField = 'name' | 'description';

    export let onCancel: () => void = () => {};

    let processing = false;
    let name = '';
    let description = '';
    let disabled = true;

    let nameError = '';
    let descriptionError = '';
    let genError = '';

    $: disabled = !name || !!nameError || !!descriptionError || !!genError || processing;
    
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
                reset();                
                window.location.reload();
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
                    } else if (name.length > MAX_FEATURE_FLAG_NAME_LENGTH) {
                        nameError = `Title must be less than ${MAX_FEATURE_FLAG_NAME_LENGTH} characters.`;
                    } else {
                        nameError = '';
                    }
                    break;
                case 'description':
                    description = description.trim();
                    if (description && description.length > MAX_FEATURE_FLAG_DESCRIPTION_LENGTH) {
                        descriptionError = `Description must be less than ${MAX_FEATURE_FLAG_DESCRIPTION_LENGTH} characters.`;
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
    }
</script>

<form
    data-testid="new-feature-flag-form"
    method="POST" 
    action="/admin/feature-flags?/create"
    use:enhance={onSubmitResponse}
>
    <TextInput
        required
        id="name"
        data-testid="new-feature-flag-title"
        label="Title"
        placeholder="Feature Flag Name"
        error={nameError}
        bind:value={name}
        on:blur={onBlur('name')}
    />

    <Textarea
        id="description"
        data-testid="new-feature-flag-description"
        label="Description"
        placeholder="Feature Flag Description"
        error={descriptionError}
        bind:value={description}
        on:blur={onBlur('description')}
    />

    <div class="options-container">
        <Checkbox
            id="feature-flag-enabled"
            name="isEnabled"
            type="neutral"
        >
            Enabled
        </Checkbox>
    </div>

    {#if genError}
        <p class="error" data-testid="new-feature-gen-error">{genError}</p>
    {/if}

    <div class="buttons-container">
        <Button
            id="feature-flag-create"
            data-testid="feature-flag-create"
            kind="primary"
            type="submit"
            {disabled}
            {processing}
        >
            Create
        </Button>
    
        <Button
            id="feature-flag-cancel"
            data-testid="feature-flag-cancel"
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

    .options-container {
        display: flex;
        gap: 1rem;
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