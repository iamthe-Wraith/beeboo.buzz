<script lang="ts">
    type ButtonKind = 'primary' | 
                      'primary-transparent' | 
                      'secondary' | 
                      'secondary-transparent' | 
                      'tertiary' | 
                      'tertiary-transparent' | 
                      'neutral' | 
                      'transparent';

    export let type: 'button' | 'submit' | 'reset' = 'button';
    export let kind: ButtonKind = 'primary';
</script>

<button
    {type}
    class={kind}
    {...$$restProps}
    on:click
>
    <slot />
</button>

<style>
    button {
        padding: 0.5rem 0.75rem;
        border-radius: 0.25rem;
        font-weight: 500;
        
        &:hover {
            cursor: pointer;
        }

        &:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        &.primary {
            background-color: var(--primary-100);
            border: 1px solid var(--primary-500);
            color: var(--light-500);

            &:hover,
            &:focus {
                background-color: var(--primary-300);
                border: 1px solid var(--primary-700);
            }
        }

        &.primary-transparent {
            padding: 0.25rem 0.5rem;
            background-color: transparent;
            border: none;
            color: var(--primary-500);

            &:hover,
            &:focus {
                color: var(--primary-700);
            }
        }

        &.secondary {
            background-color: var(--secondary-100);
            border: 1px solid var(--secondary-500);
            color: var(--light-500);

            &:hover,
            &:focus {
                background-color: var(--secondary-200);
                border: 1px solid var(--secondary-700);
            }
        }

        &.secondary-transparent {
            padding: 0.25rem 0.5rem;
            background-color: transparent;
            border: none;
            color: var(--secondary-500);

            &:hover,
            &:focus {
                color: var(--secondary-700);
            }
        }

        &.tertiary {
            background-color: var(--tertiary-100);
            border: 1px solid var(--tertiary-500);
            color: var(--light-500);

            &:hover,
            &:focus {
                background-color: var(--tertiary-300);
                border: 1px solid var(--tertiary-700);
            }
        }

        &.tertiary-transparent {
            padding: 0.25rem 0.5rem;
            background-color: transparent;
            border: none;
            color: var(--tertiary-500);

            &:hover,
            &:focus {
                color: var(--tertiary-700);
            }
        }

        &.neutral {
            background-color: var(--dark-300);
            border: 1px solid var(--dark-500);
            color: var(--light-500);

            &:hover,
            &:focus {
                background-color: var(--dark-400);
                border: 1px solid var(--dark-600);
            }
        }

        &.transparent {
            padding: 0.25rem 0.5rem;
            background-color: transparent;
            border: none;
            color: var(--light-500);

            &:hover,
            &:focus {
                color: var(--light-200);
            }
        }
    }
</style>