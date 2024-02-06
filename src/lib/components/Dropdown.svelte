<script lang="ts">
    import Select from 'svelte-select';

    export let id: string;
    export let label = '';
    export let error = '';
</script>

<div class="dropdown {error ? 'error' : ''}" id={`${id}-container`}>
    {#if label}
        <label for={id}>
            {label}
        </label>
    {/if}
    <Select
        on:change
        on:clear
        {id}
        {...$$restProps}
    />
    {#if error}
        <p class="error" data-testid={`${id}-error`}>{error}</p>
    {/if}
</div>

<style>
    .dropdown {
        --padding: 0.5rem;
        --font-size: 0.875rem;
        --border: 1px solid var(--dark-600);
        --border-focused: 1px solid var(--dark-600);
        --border-hover: 1px solid var(--dark-600);
        --background: var(--dark-200);
        
        --clear-select-width: 1.5rem;
        --clear-select-focus-outline: 1px dashed var(--light-500);

        --list-background: var(--dark-400);
        --list-max-height: 10rem;
        
        --item-is-active-bg: var(--secondary-500);
        --item-hover-bg: var(--dark-500);
        --placeholder-color: var(--dark-700);

        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        width: 100%;

        &.error {
            --border: 1px solid var(--danger-500);
            --border-focused: 1px solid var(--danger-500);
            --border-hover: 1px solid var(--danger-500);
        }

        & .focused {
            outline: 1px dashed var(--light-500);
		    outline-offset: 2px;
        }

        & .clear-select {
            border-radius: 0.25rem;
        }

        & label {
            font-weight: 500;

            & span {
                color: var(--dark-900);
            }
        }
    }
</style>