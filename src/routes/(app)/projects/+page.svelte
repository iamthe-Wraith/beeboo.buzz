<script lang="ts">
    import ProjectsLayout from "$lib/components/ProjectsLayout.svelte";
    import type { PageData } from "./$types";

    export let data: PageData;
</script>

<ProjectsLayout projects={data.projects} />