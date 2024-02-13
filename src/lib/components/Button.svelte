<script lang="ts">
    type ButtonKind = 'primary' | 
                      'primary-transparent' | 
                      'secondary' | 
                      'secondary-transparent' | 
                      'tertiary' | 
                      'tertiary-transparent' | 
                      'neutral' |
                      'danger' |
                      'danger-transparent' |
                      'transparent';

    export let type: 'button' | 'submit' | 'reset' = 'button';
    export let kind: ButtonKind = 'primary';
    export let processing: boolean = false;
</script>

<button
    {type}
    class={`${kind} ${processing ? 'processing' : ''}`}
    {...$$restProps}
    on:click
>
    {#if processing}
        <div class="spinner-container">
            <div class="spinner"></div>
        </div>
    {:else}
        <slot />
    {/if}
</button>

<style>
    button {
        padding: 0.5rem 0.75rem;
        border-radius: 0.25rem;
        font-weight: 500;
        
        &:not(:disabled):not(.processing):hover {
            cursor: pointer;
        }

        &:not(.processing):disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        &.primary {
            background-color: var(--primary-100);
            border: 1px solid var(--primary-500);
            color: var(--light-500);

            &:hover:not(:disabled),
            &:focus:not(:disabled) {
                background-color: var(--primary-300);
                border: 1px solid var(--primary-700);
            }
        }

        &.primary-transparent {
            padding: 0.25rem 0.5rem;
            background-color: transparent;
            border: none;
            color: var(--primary-500);

            &:hover:not(:disabled),
            &:focus:not(:disabled) {
                color: var(--primary-700);
            }
        }

        &.secondary {
            background-color: var(--secondary-100);
            border: 1px solid var(--secondary-500);
            color: var(--light-500);

            &:hover:not(:disabled),
            &:focus:not(:disabled) {
                background-color: var(--secondary-200);
                border: 1px solid var(--secondary-700);
            }
        }

        &.secondary-transparent {
            padding: 0.25rem 0.5rem;
            background-color: transparent;
            border: none;
            color: var(--secondary-500);

            &:hover:not(:disabled),
            &:focus:not(:disabled) {
                color: var(--secondary-700);
            }
        }

        &.tertiary {
            background-color: var(--tertiary-100);
            border: 1px solid var(--tertiary-500);
            color: var(--light-500);

            &:hover:not(:disabled),
            &:focus:not(:disabled) {
                background-color: var(--tertiary-300);
                border: 1px solid var(--tertiary-700);
            }
        }

        &.tertiary-transparent {
            padding: 0.25rem 0.5rem;
            background-color: transparent;
            border: none;
            color: var(--tertiary-500);

            &:hover:not(:disabled),
            &:focus:not(:disabled) {
                color: var(--tertiary-700);
            }
        }

        &.neutral {
            background-color: var(--dark-300);
            border: 1px solid var(--dark-500);
            color: var(--light-500);

            &:hover:not(:disabled),
            &:focus:not(:disabled) {
                background-color: var(--dark-400);
                border: 1px solid var(--dark-600);
            }
        }

        &.danger {
            background-color: var(--danger-100);
            border: 1px solid var(--danger-500);
            color: var(--light-500);

            &:hover:not(:disabled),
            &:focus:not(:disabled) {
                background-color: var(--danger-300);
                border: 1px solid var(--danger-700);
            }
        }

        &.danger-transparent {
            padding: 0.25rem 0.5rem;
            background-color: transparent;
            border: none;
            color: var(--danger-500);

            &:hover:not(:disabled),
            &:focus:not(:disabled) {
                color: var(--danger-700);
            }
        }

        &.transparent {
            padding: 0.25rem 0.5rem;
            background-color: transparent;
            border: none;
            color: var(--light-500);

            &:hover:not(:disabled),
            &:focus:not(:disabled) {
                color: var(--light-200);
            }
        }
    }

    .spinner-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-width: 3rem;
        width: 100%;
        min-height: 1rem;
        height: 100%;
    }

    .spinner {
        width: 1rem;;
        height: 1rem;
        border: 2px solid var(--light-500);
        border-top-color: transparent;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }

        100% {
            transform: rotate(360deg);
        }
    }
</style>