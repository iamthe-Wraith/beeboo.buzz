<script lang="ts">
    import Icon from "@iconify/svelte";
    import type { Task } from "@prisma/client";
	import TaskIcon from "./TaskIcon.svelte";
	import dayjs from "dayjs";

    export let task: Task;

    const daysUntilDue = dayjs(task.dueDate).diff(dayjs(), "day");
    const hasTags = false;

    function onTaskClick() {
        console.log('task clicked: ', task);
    }
</script>

<div class="task-container {daysUntilDue < 0 ? 'past-due' : ''}">
    <div class="complete-task-container {daysUntilDue < 0 ? 'past-due' : ''}">
        <form>
            <button type="submit" />
        </form>
    </div>
    <button
        class="task"
        on:click={onTaskClick}
    >
        <div class="task-main">
            <div>
                <p class="title">{task.title}</p>
            </div>

            {#if task.dueDate}
                <div class="due-date">
                    {#if daysUntilDue < 0}
                        <p class="error">Was due {Math.abs(daysUntilDue)} days ago</p>
                    {:else if daysUntilDue === 0}
                        <p>Due Today</p>
                    {:else if daysUntilDue === 1}
                        <p>Due Tomorrow</p>
                    {:else}
                        <p>Due in {daysUntilDue} days</p>
                    {/if}
                </div>
            {/if}
            
            {#if hasTags}
                <div class="task-tags"></div>
            {/if}
        </div>
        <div class="task-icons">
            {#if daysUntilDue < 0}
                <TaskIcon
                    icon="ion:alert-circle-outline" 
                    text="Past Due"
                />
            {/if}

            {#if task.notes}
                <TaskIcon
                    icon="ion:document-text-outline" 
                    text="Has Notes"
                />
            {/if}
        </div>
    </button>
</div>

<style>
    .task-container {
        display: flex;
        justify-content: space-between;
        align-items: stretch;
        border: 1px solid transparent;
        border-radius: 0.25rem;

        &:has(.task:hover) {
            border: 1px solid var(--primary-500);
            cursor: pointer;
        }

        &.past-due:has(.task:hover) {
            border: 1px solid var(--danger-100);
        }
    }

    .complete-task-container {
        display: flex;
        justify-content: center;
        align-items: flex-start;
        flex-grow: 0;
        flex-shrink: 0;
        width: 3.5rem;
        padding: 0.5rem 0;
        border-top-left-radius: 0.25rem;
        border-bottom-left-radius: 0.25rem;
        background: var(--primary-200);

        &.past-due {
            background: var(--danger-100);
        }

        & form {
            display: flex;
            justify-content: center;
            align-items: flex-start;
            width: 100%;
            height: 100%;
        }

        & button {
            width: 1.75rem;
            height: 1.75rem;
            border: 1px solid var(--dark-500);
            border-radius: 0.25rem;
            background: var(--dark-300);
            outline: none;

            &:hover {
                border: 1px solid var(--primary-500);
                cursor: pointer;
            }
        }
    }

    .task {
        display: flex;
        justify-content: flex-start;
        flex-grow: 1;
        gap: 1rem;
        padding: 0.5rem 1rem;
        border: none;
        border-top-right-radius: 0.25rem;
        border-bottom-right-radius: 0.25rem;
        background: var(--dark-400);
        outline: none;
    }

    .task-main {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        justify-content: flex-start;
        align-items: flex-start;
        gap: 0.25rem;

        & .title {
            font-size: 1.1rem;
            font-weight: bold;
        }

        & .due-date {
            & p {
                font-size: 0.9rem;
                color: var(--dark-900);

                &.error {
                    color: var(--danger-100);
                }
            }
        }
    }

    .task-icons {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        direction: rtl;
        gap: 0.5rem;
        width: 4rem;
    }
</style>