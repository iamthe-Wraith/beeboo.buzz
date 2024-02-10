<script lang="ts">
	import Icon, { type IconifyIcon } from "@iconify/svelte";

    export let testid: string;
    export let icon: string | IconifyIcon;
    export let text: string;
</script>

<div class="icon-with-tooltip no-default-color" data-testid={testid}>
    <span>
        <Icon {icon} aria-label={text} />
    </span>
    <span>{text}</span>
</div>

<style>
    .icon-with-tooltip {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 0.5rem;
        
        & span:first-child {
            color: var(--dark-900);
            
            & svg {
                font-size: 1.1rem;            
            }
        }

        &:hover span:last-child {
            display: block;
        }

        & span:last-child {
            position: absolute;
            right: 0;
            bottom: 100%;
            display: none;
            padding: 0.25rem 0.5rem;
            background: var(--dark-100);
            border: 1px solid var(--dark-500);
            border-radius: 0.25rem;
            font-size: 0.75rem;
            white-space: nowrap;
        }
    }
</style>