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

    <textarea
        {id}
        {required}
        name={id}
        class={error ? 'error' : ''}
        bind:value
        {...$$restProps}
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
    .textarea-container {
        --textarea-width: 100%;
        --textarea-height: 6rem;

        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        width: var(--textarea-width);
        height: var(--textarea-height);
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
        width: 100%;
        padding: 0.5rem;
        border: 1px solid var(--dark-600);
        border-radius: 0.25rem;
        color: var(--color-text-primary);
        background-color: var(--color-bg-secondary);

        &.error {
            border-color: var(--danger-500);
        }
    }
</style>