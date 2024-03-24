<script lang="ts">
	import type { ActionResult } from "@sveltejs/kit";
    import { enhance } from "$app/forms";
	import { goto } from "$app/navigation";
    import type { PageData } from "./$types";
	import type { FeatureFlag } from "@prisma/client";
	import { user } from "$lib/stores/user";
    import Button from "$lib/components/Button.svelte";
	import NewFeatureFlagModal from "$lib/components/modals/NewFeatureFlagModal.svelte";
	import Icon from "$lib/components/Icon.svelte";
	import type { IApiError } from "$lib/utils/api-error";

    export let data: PageData;

    let featureFlags: FeatureFlag[] = [];
    let processing = false;
    let error = '';

    $: featureFlags = Object.values(data.featureFlags);

    function onSubmitResponse() {
        processing = true;

        return ({ result }: { result: ActionResult<{ message: string }> }) => {
            if (result.type === 'redirect') {
                goto(result.location);
            }
            
            if (result.type === 'failure') {
                if (result.data?.errors) {
                    result.data.errors.map((e: IApiError) => {
                        error = e.message;
                    });
                } else {
                    error = 'Something went wrong. Please try again later.';    
                }
            }

            if (result.type === 'success') {             
                window.location.reload();
            }

            processing = false;
        }
    };
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
    {#if featureFlags.length === 0}
        <p>No feature flags found.</p>
    {:else}
        {#if error}
            <div class="error-container">
                <p class="error">{error}</p>
            </div>
        {/if}
        <ul class="feature-flags">
            {#each featureFlags as featureFlag}
                <li class="feature-flag">
                    <div>
                        <div class="enabled">
                            <form
                                method="POST"
                                action="/admin/feature-flags?/toggleEnabled"
                                use:enhance={onSubmitResponse}
                            >
                                <input type="hidden" name="id" value="{featureFlag.id}" />
                                <button
                                    class="{ featureFlag.isEnabled ? 'enabled' : '' }"
                                    disabled={processing}
                                >
                                    <Icon name="checkmark" />
                                </button>
                            </form>
                        </div>
    
                        <div class="name">
                            {featureFlag.name}
                        </div>
                    </div>

                    <div class="description">
                        {featureFlag.description}
                    </div>

                    <div class="delete">
                        <form
                            method="POST"
                            action="/admin/feature-flags?/delete"
                            use:enhance={onSubmitResponse}
                        >
                            <input type="hidden" name="id" value="{featureFlag.id}" />
                            <button disabled={processing}>
                                <Icon name="trash" />
                            </button>
                        </form>
                    </div>
                </li>
            {/each}
        </ul>
    {/if}
</div>

<style>
    header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
    }

    h1 {
        font-size: 1.5rem;
        font-weight: 500;
    }

    .error-container {
        margin-bottom: 0.5rem;
        text-align: center;
    }

    .feature-flags {
        container-type: inline-size;
        padding: 1rem 0;
    }

    .feature-flag {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding: 0.5rem;
        border: 1px solid var(--dark-500);
        border-radius: 0.25rem;

        &:not(:last-child) {
            margin-bottom: 0.5rem;
        }

        & p {
            margin: 0;
        }

        & > div:first-child {
            display: flex;
            align-items: center;
            gap: 1rem;
            width: 100%;
            flex-shrink: 0;
        }

        & .enabled button {
            border: 1px solid var(--dark-500);

            & svg {
                display: none;
                font-size: 1.5rem;
            }

            &.enabled {
                border: 1px solid var(--primary-500);

                & svg {
                    display: block;
                    color: var(--success-500);
                }
            }
        }
    }

    .enabled,
    .delete {
        width: 2rem;

        & button {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 1.75rem;
            height: 1.75rem;
            background: none;
            border-radius: 0.25rem;
        }
    }

    .description {
        flex-grow: 1;
        color: var(--dark-700);
    }

    .delete {
        display: flex;
        width: 100%;
        justify-content: flex-end;

        & button {
            border: none;
            background: none;

            &:hover {
                cursor: pointer;
                
                & svg {
                    color: var(--danger-400);
                }
            }

            & svg {
                font-size: 1.25rem;
                color: var(--dark-600);
            }
        }
    }

    @container (min-width: 580px) {
        .feature-flag {
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
            gap: 1rem;
        }

        .feature-flag > div:first-child {
            width: 15rem;
        }

        .delete {
            width: auto;
            justify-content: center;
        }
    }
</style>