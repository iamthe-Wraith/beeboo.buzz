<script lang="ts">
	import type { Project } from "@prisma/client";
	import ProjectList from "./ProjectsList.svelte";

    export let projects: Project[] = [];
</script>

<div class="container" data-testid="projects-layout">
    <div class="header">
        <div>
            <h1 data-testid="projects-title">Projects</h1>
            <span class="projects-count" data-testid="projects-count">
                {projects.length} projects
            </span>
        </div>

        <div>
            <!-- left empty intentionally for now -->
        </div>
    </div>
    <div class="main-content">
        <ProjectList {projects} />
    </div>
</div>

<style>
    .container {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
    }

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
        padding: 0 0 1rem;
        border-bottom: 1px solid var(--dark-500);

        & h1 {
            font-size: 2rem;
        }

        & .projects-count {
            font-size: 0.85rem;
            color: var(--dark-900);
        }
    }

    .main-content {
        flex-grow: 1;
        overflow: auto;
    }
</style>