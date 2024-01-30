<script lang="ts">
    import { page } from '$app/stores';
</script>

{#if $page.url.search.includes('create')}
    <div>Task created successfully!</div>
{:else}
    <div>Tasks page</div>
{/if}