<script lang="ts">
	import type { Context, Task } from "@prisma/client";
	import TaskList from "./TaskList.svelte";

    export let context: Context;
    export let tasks: Task[];
</script>

<div class="container">
    <div>
        <h1>{ context?.name }</h1>
    </div>
    <div>
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
</style>