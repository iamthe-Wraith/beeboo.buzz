<script>
	import Button from "./Button.svelte";
	import NewQuickTask from "./modals/NewQuickTask.svelte";

</script>
<div class="mobile-quick-actions">
    <NewQuickTask let:openNewQuickTaskModal>
        <Button
            kind="secondary"
            on:click={() => console.log('test1')}
        >
            New Project
        </Button>

        <Button
            kind="primary"
            on:click={openNewQuickTaskModal}
        >
            New Task
        </Button>
    </NewQuickTask>
</div>

<style>
    .mobile-quick-actions {
        position: fixed;
        bottom: 0;
        left: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        width: 100%;
        height: 4rem;
        padding: 0 1rem;
        background-color: var(--dark-200);
        border-top: 1px solid var(--dark-400);
        z-index: 1;

        @media (min-width: 768px) {
            display: none;
        }
    }
</style>