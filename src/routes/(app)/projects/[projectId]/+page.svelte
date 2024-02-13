<script lang="ts">
	import type { Project } from "@prisma/client";
	import type { PageData } from "./$types";
	import TextInput from "$lib/components/TextInput.svelte";
	import Button from "$lib/components/Button.svelte";
	import Textarea from "$lib/components/Textarea.svelte";

    type FormField = 'title' | 'description';

    export let data: PageData;
    let project: Project;
    
    let title: string;
    let description: string;

    let titleError: string;
    let descriptionError: string;
    let disableUpdating = true;

    let editing = false;

    $: if (data?.project) {
        project = data.project;
        if (!title) title = project.title;
        if (!description) description = project.notes || '';
    }

    /**
     * Checks for changes in the project data.
     * 
     * @returns {boolean} - Whether or not the project data has changed.
     */
    function detectChanges() {
        let changesDetected = false;

        if (
            project &&
            (
                project.title !== title ||
                (project.notes || '') !== description
            )
        ) {
            changesDetected = true;
        }

        disableUpdating = !changesDetected;
    }

    function onBlur(field: FormField) {
        return function() {
            switch (field) {
                case 'title':
                    title = title.trim();
                    if (!title) {
                        titleError = 'Title is required.';
                    } else {
                        titleError = '';
                    }
                    break;
                case 'description':
                    description = description.trim();
                    break;
            }

            detectChanges();
        }
    }

    function reset() {
        title = project.title;
        description = project.notes || '';
        titleError = '';
        descriptionError = '';
        disableUpdating = true;
        editing = false;
    }
</script>

<div class="project-container">
    {#if editing}
        <form>
            <TextInput
                required
                id="title"
                label="Title"
                data-testid="project-title"
                placeholder="Project Title"
                error={titleError}
                bind:value={title}
                on:blur={onBlur('title')}
            />

            <Textarea
                id="description"
                label="Description"
                data-testid="project-description"
                placeholder="Project Description"
                error={descriptionError}
                bind:value={description}
                on:blur={onBlur('description')}
            />

            <div class="buttons-container">
                <Button
                    data-testid="update-project-button"
                    disabled={disableUpdating}
                >
                    Save
                </Button>

                <Button
                    data-testid="cancel-edit-project-button"
                    kind="transparent"
                    on:click={reset}
                >
                    Cancel
                </Button>
            </div>
        </form>
    {:else}
        <div>
            <div class="buttons-container">
                <Button
                    data-testid="delete-project-button"
                    kind="danger-transparent"
                    on:click={() => console.log('Deleting project...')}
                >
                    Delete
                </Button>

                <Button
                    data-testid="complete-project-button"
                    kind="transparent"
                    on:click={() => console.log('Completing project...')}
                >
                    Complete
                </Button>

                <Button
                    data-testid="edit-project-button"
                    kind="transparent"
                    on:click={() => editing = true}
                >
                    Edit
                </Button>
            </div>

            <h1>{project.title}</h1>

            <p>{project.notes}</p>
        </div>
    {/if}

    <div class={editing ? 'hidden' : ''}>
        <h2>Notes</h2>
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

            & .buttons-container {
                gap: 0;
            }
        }

        & form {
            --textarea-height: 10rem;

            display: flex;
            flex-direction: column;
            gap: 1rem;

            & .buttons-container {
                gap: 0;
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
        padding-top: 0.25rem;
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
        font-size: 1.5rem;
    }

    .buttons-container {
        display: flex;
        flex-direction: row-reverse;
        justify-content: flex-start;
        align-items: center;
        gap: 1rem;
    }
</style>