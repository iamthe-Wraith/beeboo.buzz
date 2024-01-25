<script lang="ts">
	import type { AuthMethod } from "$lib/types/modal";
	import Signup from "../forms/Signup.svelte";
    import Modal from "./Modal.svelte";
    import Button from "../Button.svelte";
	import Signin from "../forms/Signin.svelte";

    export let id: string;
    export let open: boolean;
    export let method: 'signin' | 'signup' = 'signin';

    let reset: () => void;

    $: if (!open) reset?.();

    function onChangeAuthMethod(m: AuthMethod) {
        return function() {
            method = m;
        }
    }
</script>

<Modal
    {id}
    bind:open
    title={method === 'signin' ? 'Sign In' : 'Sign Up'}
    on:modal-change
>
    {#if method === 'signin'}
        <Signin bind:reset={reset}>
            <div slot="secondary-action">
                <p>
                    Don't have an account yet?
                    
                    <Button
                        kind="primary-transparent"
                        on:click={onChangeAuthMethod('signup')}
                    >
                        Sign Up
                    </Button>
                </p>
            </div>
        </Signin>
    {:else}
        <Signup bind:reset={reset}>
            <div slot="secondary-action">
                <p>
                    Already have an account?
                    
                    <Button
                        kind="primary-transparent"
                        on:click={onChangeAuthMethod('signin')}
                    >
                        Sign In
                    </Button>
                </p>
            </div>
        </Signup>
    {/if}
</Modal>
