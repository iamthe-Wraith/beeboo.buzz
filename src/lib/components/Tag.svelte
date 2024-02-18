<script lang="ts">
    import type { IconName } from "./Icon.svelte";
    import Icon from "./Icon.svelte";

    type TagType = 'primary' |
        'secondary' | 
        'tertiary' | 
        'neutral' |
        'danger';

    export let icon: IconName | null = null;
    export let text: string = '';
    export let type: TagType = 'neutral';
</script>

<div class="tag {type}">
    {#if icon}
        <div class="tag-icon">
            <Icon name={icon} />
        </div>
    {/if}
    
    {#if text}
        <p>{text}</p>
    {/if}
</div>

<style>
    .tag {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.2rem;
        flex-grow: 0;
        flex-shrink: 0;
        flex-wrap: nowrap;
        padding: 0.2rem 0.4rem 0.2rem 0.3rem;
        border-radius: 1rem;
        line-height: 1.25rem;
        overflow: hidden;

        &.primary {
            background: var(--primary-200);
            color: var(--primary-900);
        }

        &.secondary {
            background: var(--secondary-200);
            color: var(--secondary-900);
        }

        &.tertiary {
            background: var(--tertiary-200);
            color: var(--tertiary-900);
        }

        &.neutral {
            background: var(--neutral-200);
            color: var(--neutral-900);
        }

        &.danger {
            background: var(--danger-200);
            color: var(--danger-900);
        }
    }

    .tag-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        
        & svg {
            font-size: 1.1rem;
        }
    }

    p {
        font-size: 0.75rem;
    }
</style>
