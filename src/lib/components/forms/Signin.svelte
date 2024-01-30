<script lang="ts">
    import { enhance } from '$app/forms';
    import { goto } from '$app/navigation';
    import Button from "../Button.svelte";
    import TextInput from "../TextInput.svelte";
    import { onMount } from "svelte";
    import type { ActionResult } from '@sveltejs/kit';
    import type { IApiError } from '$lib/utils/api-error';

    let emailOrUsername: string = '';
    let password: string = '';

    let genError: string = '';
    let emailOrUsernameError: string = '';
    let passwordError: string = '';

    let processing = false;
    let disabled = true;

    $: disabled = emailOrUsername === '' || password === '';

    onMount(() => {
        reset();

        return reset;
    })

    export function reset() {
        emailOrUsername = '';
        password = '';

        emailOrUsernameError = '';
        passwordError = '';

        disabled = true;
    }

    function onEmailOrUsernameBlur() {
        emailOrUsername = emailOrUsername.trim();

        if (!emailOrUsername) {
            emailOrUsernameError = 'Email or username is required';
            return;
        }
        
        emailOrUsernameError = '';
    }

    function onPasswordBlur() {
        password = password.trim();

        if (!password) {
            passwordError = 'Password is required';
            return;
        }

        passwordError = '';
    }

    function onSubmitResponse() {
        processing = true;

        return ({ result }: { result: ActionResult<{ message: string }> }) => {
            if (result.type === 'redirect') {
                goto(result.location);
            }
            
            if (result.type === 'failure') {
                if (result.data?.errors) {
                    result.data.errors.map((e: IApiError) => {
                        switch (e.field) {
                            case 'email_or_username':
                                emailOrUsernameError = e.message;
                                break;
                            case 'password':
                                passwordError = e.message;
                                break;
                            default:
                                genError = e.message;
                                break;
                        }
                    })
                } else {
                    genError = 'Something went wrong. Please try again later.';    
                }
            }

            if (result.type === 'success') {
                reset();
                window.location.href = '/dashboard';
            }

            processing = false;
        }
    };
</script>

<form
    method="POST" 
    action="/?/signin" 
    data-testid={'signin-form'}
    use:enhance={onSubmitResponse}
>
    <TextInput
        bind:value={emailOrUsername}
        required
        id="email_or_username"
        type="text"
        label="Email or Username"
        placeholder="Enter your email or username"
        error={emailOrUsernameError}
        on:blur={onEmailOrUsernameBlur}
    />

    <TextInput
        bind:value={password}
        required
        id="password"
        type="password"
        label="Password"
        placeholder="Enter your password"
        error={passwordError}
        on:blur={onPasswordBlur}
    />

    <div class="signin-footer">
        {#if genError}
            <p class="error" data-testid="gen-error">{genError}</p>
        {/if}

        <div class="buttons-container">
            <Button
                {processing}
                type="submit"
                disabled={disabled}
            >
                Sign In
            </Button>

            <slot name="secondary-action" />
        </div>
    </div>
</form>

<style>
    form {
        display: flex;
        flex-direction: column;
        gap: 1.1rem;
        width: 80vw;
        max-width: 30rem;
        height: auto;
    }

    .signin-footer {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        padding-top: 0.5rem;
    }

    .buttons-container {
        display: flex;
        flex-direction: row-reverse;
        justify-content: space-between;
        align-items: center;
        flex-grow: 1;
        gap: 0.5rem;
    }

    p.error {
        text-align: center;
    }
</style>