<script lang="ts">
    import type { Task as TaskModel } from "@prisma/client";
    import Task from "./Task.svelte";

    export let tasks: TaskModel[] = [];
</script>

<div class="task-list-container">
    {#each tasks as task (task.id)}
        <Task {task} />
    {/each}
</div>

<style>
    .task-list-container {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        padding: 0.5rem;
    }
</style>