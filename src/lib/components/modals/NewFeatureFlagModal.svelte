<script lang="ts">
	import NewFeatureFlag from "../forms/NewFeatureFlag.svelte";
    import Modal from "./Modal.svelte";

    let open = false;
    
    function onCancel() {
        open = false;
    }

    function onModalChange(e: CustomEvent<{ id: string; open: boolean }>) {
        open = e.detail.open;
    }

    function openNewFeatureFlagModal() {
        open = true;
    }
</script>

<slot {openNewFeatureFlagModal} />

<Modal
    id="new-feature-flag-modal"
    bind:open
    title="New Feature Flag"
    on:modal-change={onModalChange}
    style="--modal-max-width: 30rem"
>
    <NewFeatureFlag {onCancel} />
</Modal>
