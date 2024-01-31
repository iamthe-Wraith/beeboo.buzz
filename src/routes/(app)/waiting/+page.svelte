<script lang="ts">
    import ContextLayout from "$lib/components/ContextLayout.svelte";
    import type { PageData } from "./$types";

    export let data: PageData;
</script>

<ContextLayout context={data.context} tasks={data.tasks} />