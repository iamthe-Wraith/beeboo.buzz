<script lang="ts">
    import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
    import Button from "../Button.svelte";
    import TextInput from "../TextInput.svelte";
    import { emailSchema, passwordSchema, usernameSchema } from "$lib/utils/schemas";
    import { onMount } from "svelte";
	import type { ActionResult } from '@sveltejs/kit';
	import type { IApiError } from '$lib/utils/api-error';
	import { user } from '$lib/stores/user';
	import type { SafeParseReturnType } from 'zod';

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
        let validated: SafeParseReturnType<string, string>;
        
        emailOrUsername = emailOrUsername.trim();

        if (!emailOrUsername) {
            emailOrUsernameError = 'Email or username is required';
            return;
        }

        if (emailOrUsername.includes('@')) {
            validated = emailSchema.safeParse(emailOrUsername.trim());
        } else {
            validated = usernameSchema.safeParse(emailOrUsername.trim());
        }

        if (!validated.success) {
            const formatted = validated.error.format();
            emailOrUsernameError = formatted._errors[0];
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
                            case 'emailOrUsername':
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

    <footer>
        {#if genError}
            <p class="error">{genError}</p>
        {/if}
        <div class="buttons-container">
            <slot name="secondary-action" />
            <Button
                {processing}
                type="submit"
                disabled={disabled}
            >
                Sign In
            </Button>
        </div>
    </footer>
</form>

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
        flex-direction: column;
        align-items: stretch;
        padding-top: 0.5rem;
    }

    .buttons-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-grow: 1;
        gap: 0.5rem;
    }

    p.error {
        text-align: center;
    }
</style>