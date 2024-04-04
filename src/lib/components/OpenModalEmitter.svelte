<script lang="ts">
    function openModal(id: string, data: Record<string, unknown> = {}) {
        const event = new CustomEvent('open-modal', { detail: { id, data } });
        document.dispatchEvent(event);
    }    
</script>

<slot {openModal} />
