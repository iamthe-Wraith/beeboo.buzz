<script lang="ts">
	import { page } from "$app/stores";
	import Awkward from "$lib/components/Awkward.svelte";

    $: console.log($page);
</script>

{#if $page.status === 404}
    <Awkward message={ $page.error?.message || 'We couldn\'t find the resource you were looking for.' } />
{:else}
    <Awkward message={ $page.error?.message || 'Something went wrong. Please try again later.'} />
{/if}
