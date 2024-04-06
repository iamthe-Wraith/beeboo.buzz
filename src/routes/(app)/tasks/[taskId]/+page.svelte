<script lang="ts">
	import { marked } from "marked";
    import type { Context, Task } from "@prisma/client";
    import type { PageData } from "./$types";
    import dayjs from "dayjs";
    import { contexts } from '$lib/stores/contexts';
    import Button from "$lib/components/Button.svelte";
    import Link from "$lib/components/Link.svelte";
    import Icon from "$lib/components/Icon.svelte";
    import Status from "$lib/components/Status.svelte";
	import UpdateTask from "$lib/components/forms/UpdateTask.svelte";
	import CompleteTask from "$lib/components/forms/CompleteTask.svelte";
	import DeleteTask from "$lib/components/forms/DeleteTask.svelte";
	import MarkdownEditor from "$lib/components/MarkdownEditor.svelte";

    export let data: PageData;
    
    let task: Task;
    let editing = false;
    let parentContext: Context;

    $: if (data?.task) task = data.task;
    $: if ($contexts) parentContext = $contexts.find(c => c.id === task.contextId)!;

    function getBackLink() {
        if (parentContext) {
            if (parentContext.role === 'NONE') {
                return `/contexts/${parentContext.id}`;
            } else {
                return `/${parentContext.role.toLocaleLowerCase()}`;
            }
        }

        return '/inbox';
    }

    function getStatus() {
        if (task.completed) {
            return 'completed';
        }

        if (task.dueDate) {
            const daysUntilDue = dayjs(task.dueDate).diff(dayjs(), "day");

            if (daysUntilDue < 0) {
                return 'past-due';
            }
        }

        return 'in-progress';
    }

    function onCancelEdit() {
        editing = false;
    }

    function onSave() {
        editing = false;
    }
</script>

<div class="task-container no-scrollbar">
    {#if editing}
        <div>
            <UpdateTask
                {task}
                onCancel={onCancelEdit}
                onSave={onSave}
            />
        </div>
    {:else}
        <div data-testid="task-info-container" class="task-info-container no-scrollbar">
            <div class="buttons-container">
                <div>
                    <Link
                        href={getBackLink()}
                        data-testid="back-to-tasks-link"
                        type="neutral"
                    >
                        <Icon name="chevron-back" />
                        { parentContext ? parentContext.name : 'Inbox' }
                    </Link>
                </div>

                <div>
                    <Button
                        data-testid="edit-task-button"
                        kind="transparent"
                        on:click={() => editing = true}
                    >
                        Edit
                    </Button>

                    <CompleteTask {task}>
                        <Button
                            type="submit" 
                            kind="transparent"
                            data-testid="complete-task-button"
                        >
                            {task.completed ? 'Reopen' : 'Complete'}
                        </Button>
                    </CompleteTask>

                    <DeleteTask taskId={task.id} />
                </div>
            </div>

            <h1 data-testid="title">{task.title}</h1>

            <div class="meta-container">
                <Status status={getStatus()} data-testid="task-status" />
            </div>

            {#if task.description}
                <div data-testid="description">
                    <MarkdownEditor
                        hideControls
                        disableEditing
                        id="description"
                        bind:value={task.description}
                    />
                </div>
            {/if}
        </div>
    {/if}

    <div data-testid="task-notes-container">
        <h2 data-testid="notes-title">Notes</h2>
    </div>
</div>

<style>
    .task-container {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        gap: 3rem;
        width: 100%;
        height: 100%;

        & > div {
            flex: unset;

            &:first-child {
                display: flex;
                flex-direction: column;
                padding-right: 0;
            }

            &:last-child {
                padding-left: 0;
                border-left: 0 solid var(--dark-400);
            }
        }

        @media (max-width: 1100px) {
            overflow: auto;
        }

        @media (min-width: 1100px) {
            flex-direction: row;
            justify-content: space-between;
            align-items: stretch;
            gap: 0;
            overflow: hidden;
            
            & > div {
                flex: 1;
                overflow: auto;

                &.hidden {
                    display: block;
                }

                &:first-child {
                    padding-right: 0.5rem;
                }

                &:last-child {
                    padding-left: 0.5rem;
                    border-left: 1px solid var(--dark-400);
                }

                & .buttons-container {
                    gap: 0;
                }
            }
        }
    }

    .task-info-container {
        @media (min-width: 1100px) {
            overflow: auto;
        }
    }

    .buttons-container {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1rem;
        padding-top: 0.25rem;

        & > div {
            display: flex;
            align-items: center;
            gap: 0.25rem;
            padding: 0 var(--outline-offset);

            &.row-reverse {
                flex-direction: row-reverse;
            }
        }
    }

    .meta-container {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 0.5rem;
        margin-bottom: 1rem;
        padding: 0.7rem 0.5rem;
        border-top: 1px solid var(--dark-400);
        border-bottom: 1px solid var(--dark-400);
    }
</style>