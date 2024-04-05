<script lang="ts">
    import { contexts } from "$lib/stores/contexts";
    import { type Context } from "@prisma/client";
    import Button from "./Button.svelte";
    import Icon from "./Icon.svelte";
    import ContextModal from "./modals/ContextModal.svelte";
	import { ContextRole } from "../../types/contexts";
	import OpenModalEmitter from "./OpenModalEmitter.svelte";
	import DeleteContextModal from "./modals/DeleteContextModal.svelte";

    let contextsWithoutRoles: Context[] = [];

    $: if ($contexts && $contexts.length) {
            contextsWithoutRoles = $contexts.filter(c => c.role === ContextRole.NONE);
        }
</script>

<div data-testid="contexts" class="contexts-container">
    {#if $contexts && $contexts.length > 0}
        {#each contextsWithoutRoles as context}
            <div data-testid="{context.id}" class="context">
                <div class="context-info">
                    <div data-testid="context-name" class="context-name">
                        {context.name}
                    </div>
                    <p data-testid="context-description" class="context-description">{context.description}</p>
                </div>
                <div class="context-actions">
                    <OpenModalEmitter let:openModal>
                        <Button
                            kind="neutral"
                            data-testid="edit-context-button"
                            on:click={() => openModal('context-modal', { context })}
                        >
                            Edit
                        </Button>
                    </OpenModalEmitter>

                    <OpenModalEmitter let:openModal>
                        <Button
                            kind="danger-transparent"
                            data-testid="delete-context-button"
                            on:click={() => openModal('delete-context-modal', { contextId: context.id })}
                        >
                            <Icon name="trash" />
                        </Button>
                    </OpenModalEmitter>
                </div>
            </div>
        {/each}
    {:else}
        <div data-testid="no-contexts" class="no-contexts">
            <span>No contexts found</span>
        </div>
    {/if}
</div>

<div class="contexts-footer">
    <OpenModalEmitter let:openModal>
        <Button
            kind="neutral"
            data-testid="add-context-button"
            on:click={() => openModal('context-modal')}
        >
            + Add Context
        </Button>
    </OpenModalEmitter>
</div>

<ContextModal />
<DeleteContextModal />

<style>
    .contexts-container {
        display: grid;
        grid-template-columns: 1fr;
        padding-bottom: 0.75rem;
    }

    .context {
        display: flex;
        justify-content: space-between;
        padding: 0.5rem;
        border-bottom: 1px solid var(--dark-400);
    }

    .context-info {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        gap: 0.3rem;
    }

    .context-name {
        font-size: 1rem;
    }

    .context-description {
        font-size: 0.875rem;
        color: var(--dark-900);
    }

    .context-actions {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: 0.5rem;
        width: 10rem;
    }

    .contexts-footer {
        display: flex;
        justify-content: flex-end;
        padding: 0.5rem;
    }
</style>