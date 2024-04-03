<script lang="ts">
	import dayjs from "dayjs";
    import { user } from "$lib/stores/user";
	import Link from "$lib/components/Link.svelte";
	import UpdateUserInfo from '$lib/components/forms/UpdateUserInfo.svelte';
	import ChangePassword from '$lib/components/forms/ChangePassword.svelte';
	import ContextSettings from '$lib/components/ContextSettings.svelte';

    let lastUpdated = '';

    $: {
        const now = dayjs();
        const createdAt = dayjs($user?.createdAt);
        const updatedAt = dayjs($user?.updatedAt);
            
        if (updatedAt.diff(createdAt, 'second') < 10) lastUpdated = '';

        const daysAgo = Math.abs(updatedAt.diff(now, 'day'));

        if (daysAgo === 0) {
            lastUpdated = `Your account information was updated today.`;
        } else if (daysAgo === 1) {
            lastUpdated = `Your account information was updated yesterday.`;
        } else {
            lastUpdated = `Your account information was last updated ${daysAgo} days ago.`;
        }
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
                <ChangePassword />
            </section>
    
            <section data-testid="contexts-section" class="contexts-section">
                <div data-testid="contexts-header" class="h4">Contexts</div>
                <p>Manager the contexts that matter to you.</p>
                <ContextSettings />
            </section>
        </div>

        <div data-testid="metadata-container" class="metadata-container">
            <div data-testid="last-updated" class="metadata last-updated">
                {lastUpdated}
            </div>

            <div data-testid="member-since" class="metadata member-since">
                You created your account on {dayjs($user.createdAt).format('MMM DD, YYYY')}.
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

        & footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 1rem;
            margin-top: 1rem;
        }
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
</style>