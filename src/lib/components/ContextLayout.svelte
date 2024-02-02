<script lang="ts">
	import type { Context, Task } from "@prisma/client";
	import TaskList from "./TaskList.svelte";

    export let context: Context;
    export let tasks: Task[];
</script>

<div class="container" data-testid="context-layout">
    <div class="header">
        <div>
            <h1 data-testid="context-title">{ context?.name }</h1>
            <span class="tasks-count" data-testid="tasks-count">
                {tasks.length} tasks
            </span>
        </div>

        <div>
            <!-- left empty intentionally for now -->
        </div>
    </div>
    <div class="main-content">
        <TaskList { tasks } />
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

        & .tasks-count {
            font-size: 0.85rem;
            color: var(--dark-900);
        }
    }

    .main-content {
        flex-grow: 1;
        overflow: auto;
    }
</style>