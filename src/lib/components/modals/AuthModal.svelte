<script lang="ts">
    import { createEventDispatcher } from 'svelte'
	import type { AuthMethod } from "$lib/types/modal";
	import Button from "../Button.svelte";
	import TextInput from "../TextInput.svelte";
    import Modal from "./Modal.svelte";

    export let id: string;
    export let open: boolean;
    export let method: 'signin' | 'signup' = 'signin';

    const dispatch = createEventDispatcher()

    let email: string = '';
    let username: string = '';
    let password: string = '';
    let confirmPassword: string = '';
    let signupDisabled = true;

    $: if (!open) reset();

    $: (
        signupDisabled = email === '' || 
            username === '' || 
            password === '' || 
            confirmPassword === '' ||
            password !== confirmPassword
    );

    function changeMethod(m: AuthMethod) {
        return function() {
            method = m;
        }
    }

    function onCancelClick() {
        dispatch('modal-change', { id, open: false });
    }

    function reset() {
        email = '';
        username = '';
        password = '';
        confirmPassword = '';
    }
</script>

<Modal
    {id}
    bind:open
    title={method === 'signin' ? 'Sign In' : 'Sign Up'}
    on:modal-change
>
    {#if method === 'signin'}
        <div>login</div>
    {:else}
        <form action="#">
            <TextInput
                bind:value={email}
                required
                id="email"
                type="email"
                label="Email"
                placeholder="Enter your email"
            />

            <TextInput
                bind:value={username}
                required
                id="username"
                type="text"
                label="Username"
                placeholder="Enter your username"
            />

            <TextInput
                bind:value={password}
                required
                id="password"
                type="password"
                label="Password"
                text="this is just a test"
                placeholder="Enter your password"
            />

            <TextInput
                bind:value={confirmPassword}
                required
                id="confirm-password"
                type="password"
                label="Confirm Password"
                placeholder="Confirm your password"
            />

            <footer>
                <div>
                    <p>
                        Already have an account?
                        
                        <Button
                            kind="primary-transparent"
                            on:click={changeMethod('signin')}
                        >
                            Sign In
                        </Button>
                    </p>
                </div>
                <div>
                    <Button
                        kind="transparent"
                        on:click={onCancelClick}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="submit"
                        kind="primary"
                        disabled={signupDisabled}
                    >
                        Sign Up
                    </Button>
                </div>
            </footer>
        </form>
    {/if}
</Modal>

<style>
    form {
        display: flex;
        flex-direction: column;
        gap: 1.1rem;
        width: 30rem;
        height: auto;
    }

    footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 0.5rem;
        padding-top: 0.5rem;

        & div {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 0.5rem;
        }

        & p {
            font-size: 0.875rem;
        }
    }
</style>