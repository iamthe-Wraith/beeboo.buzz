<script lang="ts">
    import Button from "$lib/components/Button.svelte";
	import { user } from "$lib/stores/user";
	import { UserRole } from "@prisma/client";
import type { PageData } from "./$types";
	import NewFeatureFlagModal from "$lib/components/modals/NewFeatureFlagModal.svelte";

    export let data: PageData;
</script>

<header>
    <h1>Feature Flags</h1>

    <div class="actions">
        {#if $user?.role === 'SUPER_ADMIN'}
            <NewFeatureFlagModal let:openNewFeatureFlagModal>
                <Button
                    data-testid="create-feature-flag-button"
                    on:click={openNewFeatureFlagModal}
                >
                    Create Feature Flag
                </Button>
            </NewFeatureFlagModal>
        {/if}
    </div>
</header>

<div>
    Flags go here...
</div>

<style>
    header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1rem;
    }

    h1 {
        font-size: 1.5rem;
        font-weight: 500;
    }
</style>