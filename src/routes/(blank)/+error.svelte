<script lang="ts">
	import { page } from "$app/stores";
	import Awkward from "$lib/components/Awkward.svelte";
</script>

{#if $page.status === 403}
    <Awkward
        message={
            !$page.error?.message || $page.error.message === 'Error: 403'
                ? 'You are\'t authorized to be here.'
                : $page.error.message
        }
    />
{:else if $page.status === 404}
    <Awkward
        message={
            !$page.error?.message || $page.error.message === 'Not Found'
                ? 'We couldn\'t find the resource you were looking for.'
                : $page.error.message
        }
    />
{:else}
    <Awkward message={ $page.error?.message || 'Something went wrong. Please try again later.'} />
{/if}
