<script lang="ts">
    import type { Project } from "@prisma/client";
    import type { PageData } from "./$types";
    import Button from "$lib/components/Button.svelte";
    import UpdateProject from "$lib/components/forms/UpdateProject.svelte";
    import Link from "$lib/components/Link.svelte";
    import Icon from "$lib/components/Icon.svelte";
    import DeleteProject from "$lib/components/forms/DeleteProject.svelte";
	import CompleteProject from "$lib/components/forms/CompleteProject.svelte";
	import Status from "$lib/components/Status.svelte";
	import dayjs from "dayjs";

    export let data: PageData;
    let project: Project;


    let editing = false;

    $: if (data?.project) project = data.project;

    function getStatus() {
        if (project.completed) {
            return 'completed';
        }

        if (project.dueDate) {
            const daysUntilDue = dayjs(project.dueDate).diff(dayjs(), "day");

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

<div class="project-container">
    {#if editing}
        <UpdateProject
            {project}
            onCancel={onCancelEdit}
            onSave={onSave}
        />
    {:else}
        <div data-testid="project-info-container">
            <div class="buttons-container">
                <div>
                    <Link
                        href="/projects"
                        data-testid="back-to-projects-link"
                        type="neutral"
                    >
                        <Icon name="chevron-back" />
                        Projects
                    </Link>
                </div>

                <div>
                    <Button
                        data-testid="edit-project-button"
                        kind="transparent"
                        on:click={() => editing = true}
                    >
                        Edit
                    </Button>

                    <CompleteProject {project}>
                        <Button
                            type="submit" 
                            kind="transparent"
                            data-testid="complete-project-button"
                        >
                            {project.completed ? 'Reopen' : 'Complete'}
                        </Button>
                    </CompleteProject>

                    <DeleteProject projectId={project.id} />
                </div>
            </div>

            <div class="meta-container">
                <Status status={getStatus()} data-testid="project-status" />
            </div>

            <h1 data-testid="title">{project.title}</h1>

            <p data-testid="description">{project.notes}</p>
        </div>
    {/if}

    <div class={editing ? 'hidden' : ''} data-testid="project-notes-container">
        <h2 data-testid="notes-title">Notes</h2>
    </div>
</div>

<style>
    .project-container {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        gap: 3rem;
        width: 100%;
        height: 100%;
        overflow: auto;

        & > div {
            flex: unset;

            &.hidden {
                display: none;
            }

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
                    padding-right: 1rem;
                }

                &:last-child {
                    padding-left: 1rem;
                    border-left: 1px solid var(--dark-400);
                }

                & .buttons-container {
                    gap: 0;
                }
            }
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
        margin-bottom: 0.5rem;
        padding: 1rem 0.5rem;
        border-top: 1px solid var(--dark-400);
        border-bottom: 1px solid var(--dark-400);
    }

    h1,
    h2 {
        margin-bottom: 1rem;
        font-weight: 700;
    }

    h1 {
        font-size: 2rem;
        text-align: left;
    }

    h2 {
        margin-bottom: 0;
        font-size: 1.5rem;
    }
</style>