<script lang="ts">
    export let id: string;
    export let value = '';
    export let label = '';
    export let text = '';
    export let error = '';
    export let type: HTMLInputElement['type'] = 'text';
    export let required = false;

	function typeAction(node: HTMLInputElement) {
		node.type = type || 'text';
	}
</script>

<div class="input-container">
    {#if label}
        <label for={id}>
            {label}
            {#if !required}
                <span>- Optional</span>
            {/if}
        </label>
    {/if}

    <input
        {id}
        {required}
        name={id}
        class={error ? 'error' : ''}
        bind:value
        use:typeAction
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
    .input-container {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        width: 100%;
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

    input {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid var(--dark-600);
        border-radius: 0.25rem;
        color: var(--light-500);
        background-color: var(--dark-200);

        &.error {
            border-color: var(--danger-500);
        }

        &::placeholder {
            color: var(--dark-700);
        }
    }
</style>