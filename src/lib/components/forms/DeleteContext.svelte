<script lang="ts">
	import type { ActionResult } from "@sveltejs/kit";
	import { enhance } from "$app/forms";
	import { goto } from "$app/navigation";
	import Button from "../Button.svelte";
	import type { IApiError } from "$lib/utils/api-error";
	import { contexts } from "$lib/stores/contexts";

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

        return ({ result }: { result: ActionResult<{ message: string }> }) => {
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
                contexts.remove(id);
                reset();
                onCancel?.();
            }

            processing = false;
        }
    };

    function reset() {
        processing = false;
    }
</script>

<form
    data-testid="context-form"
    method="POST" 
    action="/settings?/deleteContext"
    use:enhance={onSubmitResponse}
>
    <h2>Are you sure?</h2>

    <div class="message-container">
        <p class="danger">This action cannot be undone!</p>
        <p>Any tasks assigned to this context will be moved to your inbox.</p>
    </div>

    <input type="hidden" name="id" value={id} />

    <div class="buttons-container">
        <Button
            id="confirm-delete-context-submit"
            data-testid="context-submit"
            kind="danger"
            type="submit"
            {processing}
        >
            Yes, Delete It
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