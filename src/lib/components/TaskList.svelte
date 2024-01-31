<script lang="ts">
	import type { Task } from "@prisma/client";

    export let tasks: Task[] = [];
</script>

<div class="task-list-container">
    <div>{ tasks.length } tasks...</div>
</div>

<style>
    .task-list-container {
        display: flex;
        flex-direction: column;
    }
</style>