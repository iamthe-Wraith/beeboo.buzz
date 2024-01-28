<script lang="ts">
	import type { Context } from "@prisma/client";
	import type { PageData } from "./$types";
	import { contexts } from "$lib/stores/contexts";

    export let data: PageData;

    let context: Context | null;

    $: context = $contexts?.find(c => c.id === data.contextId) || null;
    $: console.log(data);
</script>

{#if context}
    <div>Context - {context.name}</div>
{:else}
    <div class="no-context">
        <div>
            <p>Well this is awkward...</p>
            <p>We were unable to load the data for your context. Please try again later.</p>
        </div>
    </div>
{/if}

<style>
    .no-context {
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
</style>
