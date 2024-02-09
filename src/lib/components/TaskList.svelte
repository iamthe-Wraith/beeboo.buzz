<script lang="ts">
    import type { Task as TaskModel } from "@prisma/client";
    import TaskListItem from "./TaskListItem.svelte";

    export let tasks: TaskModel[] = [];
</script>

<div class="task-list-container">
    {#each tasks as task (task.id)}
        <TaskListItem {task} />
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