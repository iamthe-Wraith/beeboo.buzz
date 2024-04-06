<script lang="ts">
    export let id: string;
    export let value = '';
    export let label = '';
    export let text = '';
    export let error = '';
    export let required = false;
</script>

<div class="textarea-container">
    {#if label}
        <label for={id}>
            {label}
            {#if !required}
                <span>- Optional</span>
            {/if}
        </label>
    {/if}

    <slot />

    <textarea
        {id}
        {required}
        name={id}
        bind:value
        {...$$restProps}
        class="{error ? 'error' : ''} {$$restProps.class ?? ''}"
        on:change
        on:click
        on:focus
        on:blur
        on:keydown
        on:keypress
        on:keyup
    />
    
    {#if text && !error}
        <p class="input-text" data-testid={`${id}-text`}>{text}</p>
    {/if}

    {#if error}
        <p class="error" data-testid={`${id}-error`}>{error}</p>
    {/if}
</div>

<style>
    :global(:root) {
        --textarea-container-flex-grow: 0;
        --textarea-width: 100%;
        --textarea-height: 6rem;
    }

    .textarea-container {
        display: flex;
        flex-direction: column;
        flex-grow: var(--textarea-container-flex-grow);
        gap: 0.5rem;
        padding: var(--outline-offset);
    }

    label {
        font-weight: 500;

        & span {
            color: var(--dark-900);
        }
    }

    p {
        margin: 0;

        &.input-text {
            color: var(--dark-900);
            line-height: 1rem;
            text-align: left;
        }
    }

    textarea {
        flex-grow: 1;
        width: var(--textarea-width, 100%);
        height: var(--textarea-height, 6rem);
        padding: 0.5rem;
        border: 1px solid var(--dark-600);
        border-radius: 0.25rem;
        color: var(--light-500);
        background-color: var(--dark-200);
        resize: none;

        &.error {
            border-color: var(--danger-500);
        }

        &::placeholder {
            color: var(--dark-700);
        }
    }
</style>