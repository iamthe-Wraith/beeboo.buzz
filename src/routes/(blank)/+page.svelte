<script>
    import { user } from "$lib/stores/user";
    import { featureFlags } from "$lib/stores/featureFlags";
    import JoinWaitlist from "$lib/components/forms/JoinWaitlist.svelte";
</script>

<section>
    <p>
        A personal productivity app...
    </p>
</section>

    <!-- {#if !$user && $featureFlags['allow-new-users']?.isEnabled} -->
    {#if $featureFlags['waitlist']?.isEnabled}
        <section>
            <JoinWaitlist />
        </section>
    {/if}

<style>
    section {
        padding: 2rem 1rem;
    }
</style>
