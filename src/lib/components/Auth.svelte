<script lang="ts">
    import AuthModal from '$lib/components/modals/AuthModal.svelte';
	import type { AuthMethod } from '$lib/types/modal';
	import { onMount } from 'svelte';

    export let triggerType: 'both' | 'signin' | 'signup' = 'both';
    export let allowOpenFromQueryParams = false;

    const id  = 'auth-modal';
    let open = false;

    let method: AuthMethod = 'signin';

    onMount(() => {
        if (allowOpenFromQueryParams) {
            const url = new URL(window.location.href);
            const params = new URLSearchParams(url.search);
            const signinFromQuery = params.get('signin');
            const signupFromQuery = params.get('signup');

            if (signinFromQuery || signupFromQuery) {
                method = signinFromQuery ? 'signin' : 'signup';
                open = true;
            }
        }
    
    })

    function onModalChange(e: CustomEvent<{ id: string, open: boolean }>) {
        if (e.detail.id === id) {
            open = e.detail.open;
        }
    }

    function onTriggerClick(m: AuthMethod) {
        return function() {
            method = m;
            open = true;
        }
    }
</script>

<div class="button-container">
    {#if triggerType === 'both' || triggerType === 'signup'}
        <button on:click={onTriggerClick('signup')}>Sign up</button>
    {/if}
    {#if triggerType === 'both' || triggerType === 'signin'}
        <button on:click={onTriggerClick('signin')}>Sign in</button>
    {/if}
</div>

<AuthModal
    {id}
    bind:open={open}
    method={method}
    on:modal-change={onModalChange}
/>

<style>
    .button-container {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1rem;
    }

    button {
        background: none;
        border: none;
    }
</style>