<script lang="ts">
    import Icon from "./Icon.svelte";

    type CheckboxType = 'primary' | 'secondary' | 'tertiary' | 'neutral' | 'danger';

    export let id: string;
    export let name: string;
    export let checked = false;
    export let type: CheckboxType = 'primary';
</script>

<div class="container">
    <label for={id}>
        <input
            {id}
            {name}
            type="checkbox"
            aria-labelledby="{id}-label"
            value="{checked}"
            bind:checked={checked}
            {...$$restProps}
        />
        
        <div class="checkbox {type}">
            <Icon data-testid="" name="checkmark" />
        </div>
    
        <div id="{id}-label">
            <slot></slot>
        </div>
    </label>
</div>

<style>
    .container {
        padding: var(--outline-offset);
    }

    label {
        position: relative;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding-right: 0.25rem;
        border-radius: 0.25rem;
        overflow: hidden;

        &:hover {
            cursor: pointer;
        }
    }

    input {
        position: absolute;
        top: -9px;
        left: -9px;
        width: 0;
        height: 0;
        opacity: 0;

        &:checked {
            & + .checkbox svg {
                display: block;
            }
        }
    }

    .checkbox {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 1.75rem;
        height: 1.75rem;
        border-radius: 0.25rem;
        
        &.primary {
            border: 1px solid var(--primary-500);
        }

        &.secondary {
            border: 1px solid var(--secondary-500);
        }

        &.tertiary {
            border: 1px solid var(--tertiary-500);
        }

        &.neutral {
            border: 1px solid var(--dark-700);
        }

        &.danger {
            border: 1px solid var(--danger-500);
        }

        & svg {
            display: none;
            font-size: 1.25rem;
        }
    }
</style>