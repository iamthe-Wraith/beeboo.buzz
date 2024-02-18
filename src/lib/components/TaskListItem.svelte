<script lang="ts">
    import type { Task } from "@prisma/client";
	import IconWithTooltip from "./IconWithTooltip.svelte";
	import dayjs from "dayjs";
	import TaskModal from "./modals/TaskModal.svelte";
	import CompleteTask from "./forms/CompleteTask.svelte";

    export let task: Task;

    const daysUntilDue = dayjs(task.dueDate).diff(dayjs(), "day");
    const hasTags = false;
</script>

<TaskModal {task} let:openTaskModal>
    <div class="task-container {daysUntilDue < 0 ? 'past-due' : ''}">
        <div class="complete-task-container {daysUntilDue < 0 ? 'past-due' : ''}">
            <CompleteTask {task} />
        </div>
        <button
            class="task {daysUntilDue < 0 ? 'past-due' : ''}"
            on:click={openTaskModal}
        >
            <div class="task-main">
                <div>
                    <p class="title">{task.title}</p>
                </div>
    
                {#if task.dueDate}
                    <div class="due-date">
                        {#if daysUntilDue < 0}
                            <p class="past-due">Was due {Math.abs(daysUntilDue)} days ago</p>
                        {:else if daysUntilDue === 0}
                            <p class="due-today">Due Today</p>
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
            <div class="task-icons-container">
                <div class="task-icons">
                    {#if daysUntilDue < 0}
                        <IconWithTooltip
                            icon="alert-circle" 
                            text="Past Due"
                            testid="past-due-icon"
                        />
                    {/if}
                </div>
            </div>
        </button>
    </div>
</TaskModal>

<style>
    .task-container {
        container-type: inline-size;
        display: flex;
        justify-content: space-between;
        align-items: stretch;
        border-radius: 0.25rem;
        transition: 0.25s ease-in-out transform, 0.25s ease-in-out border;

        &:has(.task:hover),
        &:has(.task:focus-visible) {
            /* border: 1px solid var(--primary-200); */
            transform: scale(1.01);
        }

        &:has(.task:focus-visible) {
            outline: 1px dashed var(--light-500);
		    outline-offset: 2px;
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
            background: var(--danger-400);
        }

        & form {
            display: flex;
            justify-content: center;
            align-items: flex-start;
            width: 100%;
            height: 100%;
        }

        & button {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 1.75rem;
            height: 1.75rem;
            border: none;
            border-radius: 0.25rem;
            background: var(--dark-300);

            & svg {
                font-size: 3rem;
                transition: 0.25s ease-in-out opacity;
                opacity: 0;
            }

            &:hover {
                cursor: pointer;

                & svg {
                    opacity: 0.75;
                }
            }
        }
    }

    .task {
        display: flex;
        justify-content: flex-start;
        align-items: stretch;
        flex-grow: 1;
        gap: 1rem;
        min-height: 3.5rem;
        padding: 0.5rem 1rem;
        border: 1px solid transparent;
        border-left: none;
        border-top-right-radius: 0.25rem;
        border-bottom-right-radius: 0.25rem;
        background: var(--dark-400);
        outline: none;
        transition: 0.25s ease-in-out border;
        
        &:hover {
            border: 1px solid var(--primary-200);
            border-left: none; 
            cursor: pointer;
        }

        &.past-due:hover {
            border: 1px solid var(--danger-400);
            border-left: none;
        }
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
            text-align: left;
        }

        & .due-date {
            & p {
                font-size: 0.8rem;
                color: var(--dark-900);

                &.past-due {
                    color: var(--danger-400);
                }

                &.due-today {
                    color: var(--primary-500);
                }
            }
        }
    }

    .task-icons-container {
        display: flex;
        justify-content: flex-end;
        align-items: flex-end;
        flex-grow: 0;
        flex-shrink: 0;
        gap: 0.5rem;
    }

    .task-icons {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        align-items: end;
        direction: rtl;
        gap: 0.5rem;
        width: 4rem;
    }

    @container (width < 475px) {
        .task {
            flex-direction: column;
            gap: 0.5rem;
            padding: 0.5rem;
        }

        .task-icons {
            display: flex;
            flex-direction: row-reverse;
            align-items: center;
            justify-content: flex-start;
            gap: 0.5rem;
            width: 100%;
            direction: unset;
        }
    }
</style>