<script>
    import { browser } from '$app/environment';
    import { user } from "$lib/stores/user";
    import { featureFlags } from "$lib/stores/featureFlags";
    import JoinWaitlist from "$lib/components/forms/JoinWaitlist.svelte";

    let canJoinWaitlist = false;

    $: canJoinWaitlist = browser && !$user && $featureFlags['waitlist']?.isEnabled;
</script>

<section>
    <p>
        A personal productivity app...
    </p>
</section>

{#if canJoinWaitlist}
    <section>
        <JoinWaitlist />
    </section>
{/if}

<style>
    section {
        padding: 2rem 1rem;
    }
</style>
