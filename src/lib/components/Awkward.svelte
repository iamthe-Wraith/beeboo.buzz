<script lang="ts">
	import { user } from "$lib/stores/user";
    import Link from "./Link.svelte";

    export let message: string;
</script>

<div class="awkward-container">
    <div>
        <p>Well this is awkward...</p>
        <p>{ message }</p>
        
        {#if $user}
            <div class="links-container">
                <Link type="neutral" href="/dashboard">Back to Dashboard</Link>
            </div>
        {/if}
    </div>
</div>

<style>
    .awkward-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;

        & div {
            max-width: 400px;
            text-align: center;
        }

        & p {
            &:first-child {
                font-size: 1.5rem;
                font-weight: 600;
                margin-bottom: 1rem;
                color: var(--secondary-700);
            }
        }
    }

    .links-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        margin-top: 1.5rem;
        padding-top: 1.5rem;
        border-top: 1px solid var(--dark-400);
    }
</style>