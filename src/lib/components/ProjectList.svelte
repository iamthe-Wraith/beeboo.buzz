<script lang="ts">
    import type { Project as ProjectModel } from "@prisma/client";
    import ProjectListItem from "./ProjectListItem.svelte";

    export let projects: ProjectModel[] = [];
</script>

<div class="project-list-container">
    {#each projects as project (project.id)}
        <ProjectListItem {project} />
    {/each}
</div>

<style>
    .project-list-container {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        padding: 0.5rem;
    }
</style>