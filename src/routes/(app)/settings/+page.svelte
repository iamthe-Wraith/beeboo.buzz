<script lang="ts">
    import { type Context } from '@prisma/client';
	import dayjs from "dayjs";
    import { user } from "$lib/stores/user";
	import { contexts } from "$lib/stores/contexts";
	import Link from "$lib/components/Link.svelte";
	import TextInput from "$lib/components/TextInput.svelte";
	import Button from "$lib/components/Button.svelte";
	import { ContextRole } from "../../../types/contexts";
	import Icon from '$lib/components/Icon.svelte';
	import UpdateUserInfo from '$lib/components/forms/UpdateUserInfo.svelte';

    let contextsWithoutRoles: Context[] = [];

    $: if ($contexts && $contexts.length) {
            contextsWithoutRoles = $contexts.filter(c => c.role === ContextRole.NONE);
        }
</script>

<div class="settings-container no-scrollbar">
    {#if $user}
        <div data-testid="settings-header">
            <h1>Account Settings</h1>

            <div class="plan-container">
                <div data-testid="plan" class="plan">
                    <span>Plan</span>
                    <span class="{$user.accountType.toLowerCase()}">
                        {$user.accountType.toLowerCase()}
                    </span>
                </div>
            </div>
        </div>

        <div class="sections-container">
            <section data-testid="user-info-section" class="user-info-section">
                <div data-testid="user-info-header" class="h4">User information</div>
                <p>Manage your personal information.</p>
                <UpdateUserInfo />
            </section>
    
            <section data-testid="change-password-section" class="change-password-section">
                <div data-testid="change-password-header" class="h4">Change Password</div>
                <p>It's always a good idea to change your password from time to time.</p>
                <form
                    data-testid="change-password-form"
                    class="change-password-form"
                >
                    <div class="current-password-inputs-container">
                        <div class="current-password">
                            <TextInput
                                id="current-password"
                                data-testid="current-password"
                                label="Current Password"
                                type="password"
                                placeholder="Enter your current password"
                                required
                            />
                        </div>
        
                        <div class="new-password">
                            <TextInput
                                id="new-password"
                                data-testid="new-password"
                                label="New Password"
                                type="password"
                                placeholder="Enter your new password"
                                required
                            />
                        </div>
        
                        <div class="confirm-password">
                            <TextInput
                                id="confirm-password"
                                data-testid="confirm-password"
                                label="Confirm Password"
                                type="password"
                                placeholder="Confirm your new password"
                                required
                            />
                        </div>
                    </div>
    
                    <div class="section-actions">
                        <Button
                            kind="primary"
                            data-testid="change-password-button"
                            disabled
                        >
                            Change Password
                        </Button>
                    </div>
                </form>
            </section>
    
            <section data-testid="contexts-section" class="contexts-section">
                <div data-testid="contexts-header" class="h4">Contexts</div>
                <p>Manager the contexts that matter to you.</p>
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
                                    <Button
                                        kind="neutral"
                                        data-testid="edit-context-button"
                                    >
                                        Edit
                                    </Button>
    
                                    <Button
                                        kind="danger-transparent"
                                        data-testid="delete-context-button"
                                    >
                                        <Icon name="trash" />
                                    </Button>
                                </div>
                            </div>
                        {/each}
                    {:else}
                        <div data-testid="no-contexts" class="no-contexts">
                            <span>No contexts found</span>
                        </div>
                    {/if}
                </div>
    
                <div class="section-actions">
                    <Button
                        kind="neutral"
                        data-testid="add-context-button"
                    >
                        + Add Context
                    </Button>
                </div>
            </section>
        </div>

        <div data-testid="metadata-container" class="metadata-container">
            {#if $user.updatedAt !== $user.createdAt}
                <div data-testid="last-updated" class="metadata last-updated">
                    Your account was last updated on {dayjs($user.updatedAt).format('MMM DD, YYYY')}
                </div>
            {/if}

            <div data-testid="member-since" class="metadata member-since">
                You created your account on {dayjs($user.createdAt).format('MMM DD, YYYY')}
            </div>
        </div>
    {:else}
        <div class="uh-oh-container">
            <div class="uh-oh">
                <h1>Uh oh...</h1>
                <p>We were unable to load your information. Try refreshing the page. If that doesn't work, please <Link href="#" inline>contact us</Link>.</p>
            </div>
        </div>
    {/if}
</div>

<style>
    .settings-container {
        container-type: inline-size;
        container-name: settings-container;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        height: 100%;
        padding-top: 1rem;
        overflow: auto;
    }

    .plan-container {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 0.5rem;
    }

    .plan {
        display: flex;
        justify-content: stretch;
        align-items: center;
        border-radius: 10rem;
        overflow: hidden;

        & span {
            padding: 0.2rem 0.5rem;
            text-transform: capitalize;
        }

        & span:first-child {
            background-color: var(--dark-900);
        }

        & span.free {
            background-color: var(--tertiary-300);
        }

        & span.pro {
            background-color: var(--primary-300);
        }

        & span.trial {
            background-color: var(--secondary-300);
        }
    }

    .sections-container {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1.5rem;
    }

    section {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        padding: 0.7rem 1rem 1rem;
        border: 1px solid var(--dark-600);
        border-radius: 0.5rem;
        background: var(--dark-200);

        & .h4 {
            margin-bottom: 0.25rem;
            text-align: left;
        }

        & > p {
            margin-bottom: 0.5rem;
            padding-bottom: 0.5rem;
            border-bottom: 1px solid var(--dark-400);
            color: var(--dark-900);
        }

        & form {
            display: flex;
            flex-direction: column;
            flex-grow: 1;
            gap: 1rem;

            &.user-info-container-form {
                justify-content: space-between;
            }
        }

        & footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 1rem;
            margin-top: 1rem;
        }
    }

    .current-password-inputs-container {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .section-actions {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: 1rem;
        padding: 0 var(--outline-offset);
    }

    .user-info-section {
        container-type: inline-size;
        container-name: user-info-section;
    }

    .user-info-container {
        display: grid;
        grid-template-columns: 1fr;
        gap: 0.5rem;
    }

    .user-info {
        & span:first-child {
            margin-right: 0.5rem;
            color: var(--secondary-500);
        }
    }

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

    .metadata-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        padding: 1rem 0.5rem;
        border-top: 1px solid var(--dark-400);
    }

    .metadata {
        color: var(--dark-900);
        font-size: 0.75rem;
    }

    .uh-oh-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: 5rem;
    }

    .uh-oh {
        width: 100%;
        max-width: 30rem;

        & h1 {
            margin-bottom: 1rem;
        }
    }

    @container settings-container (min-width: 900px) {
        .sections-container {
            grid-template-columns: 1fr 1fr;
        }

        .contexts-section {
            grid-column: span 2;
        }
    }

    @container user-info-section (min-width: 600px) {
        .user-info-container {
            grid-template-columns: 1fr 1fr;
        }
    }
</style>