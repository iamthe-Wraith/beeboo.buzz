<script lang="ts">
	import { onMount } from 'svelte';
    import type { PageData } from './$types';
	
	export let data: PageData;

    onMount(() => {
        console.log('dashboard data', data);
    })
</script>

<div data-testid="dashboard">dashboard</div>