<script lang="ts">
	import { goto } from '$app/navigation';
    import { page } from '$app/stores';
	import { onMount } from 'svelte';

    onMount(() => {
        if (!$page.url.search.includes('create')) {
            goto('/dashboard');
        }
    });
</script>

{#if $page.url.search.includes('create')}
    <div>Task created successfully!</div>
{/if}