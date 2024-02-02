<script lang="ts">
	import { page } from "$app/stores";
	import Awkward from "$lib/components/Awkward.svelte";
</script>

{#if $page.status === 404}
    <Awkward message="We couldn't find the resource you were looking for." />
{:else}
    <Awkward message="Something went wrong. Please try again later." />
{/if}
