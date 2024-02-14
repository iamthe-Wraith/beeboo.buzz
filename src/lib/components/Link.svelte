<script lang="ts">
    export let href: string;
    export let type: 'primary' | 'secondary' | 'tertiary' | 'neutral' | 'danger' = 'primary';
</script>

<a {href} {...$$restProps} class={`${$$restProps.class} ${type}`}>
    <slot></slot>
</a>

<style>
    a {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        border-radius: 0.25rem;
        text-decoration: none;

        &.primary {
            color: var(--primary-500);

            &:hover {
                color: var(--primary-700);
            }
        }

        &.secondary {
            color: var(--secondary-500);

            &:hover {
                color: var(--secondary-700);
            }
        }

        &.tertiary {
            color: var(--tertiary-500);

            &:hover {
                color: var(--tertiary-700);
            }
        }

        &.neutral {
            color: var(--neutral-500);

            &:hover {
                color: var(--neutral-700);
            }
        }

        &.danger {
            color: var(--danger-500);

            &:hover {
                color: var(--danger-700);
            }
        }

        &:hover {
            text-decoration: underline;
        }
    }
</style>