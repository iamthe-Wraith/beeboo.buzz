<script lang="ts">
	import type { AuthMethod } from "$lib/types/modal";
	import Signup from "../forms/Signup.svelte";
    import Modal from "./Modal.svelte";
    import Button from "../Button.svelte";

    export let id: string;
    export let open: boolean;
    export let method: 'signin' | 'signup' = 'signin';

    let resetSignup: () => void;

    $: if (!open) resetSignup?.();

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
        <div>login</div>
    {:else}
        <Signup bind:reset={resetSignup}>
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
