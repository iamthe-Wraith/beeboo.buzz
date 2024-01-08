<script>
	import Modal from '$lib/components/modals/Modal.svelte';

    let modalOpen = false;

    function toggleModal() {
        modalOpen = !modalOpen;
    }
</script>
<p>
    A simple todo app built for the GTD system.
</p>

<button on:click={toggleModal}>
    Open Modal
</button>

<Modal bind:open={modalOpen} title="Test Modal">
    <p>
        This is a modal.
    </p>
</Modal>