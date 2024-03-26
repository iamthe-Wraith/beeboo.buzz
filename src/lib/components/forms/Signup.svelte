<script lang="ts">
    import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
    import Button from "../Button.svelte";
    import TextInput from "../TextInput.svelte";
    import { emailSchema, passwordSchema, usernameSchema } from "$lib/utils/schemas";
    import { onMount } from "svelte";
	import type { ActionResult } from '@sveltejs/kit';
	import type { IApiError } from '$lib/utils/api-error';
	import { featureFlags } from '$lib/stores/featureFlags';

    let email: string = '';
    let username: string = '';
    let password: string = '';
    let confirmPassword: string = '';

    let genError: string = '';
    let emailError: string = '';
    let usernameError: string = '';
    let passwordError: string = '';
    let confirmPasswordError: string = '';

    let processing = false;
    let disabled = true;

    $: (
        disabled = email === '' || 
            username === '' || 
            password === '' || 
            confirmPassword === '' ||
            password !== confirmPassword
    );

    onMount(() => {
        reset();

        return reset;
    })

    export function reset() {
        email = '';
        username = '';
        password = '';
        confirmPassword = '';

        emailError = '';
        usernameError = '';
        passwordError = '';
        confirmPasswordError = '';

        disabled = true;
    }

    function onConfirmPasswordBlur() {
        if (password !== confirmPassword) {
            confirmPasswordError = 'Passwords do not match';
            return;
        }

        confirmPasswordError = '';
    }

    function onEmailBlur() {
        const validated = emailSchema.safeParse(email.trim());

        if (!validated.success) {
            const formatted = validated.error.format();
            emailError = formatted._errors[0];
            return;
        }
        
        email = email.trim();
        if (!username) {
            username = email.split('@')[0];
            username = username.replace(/[^a-zA-Z0-9-_]/g, '');
            usernameError = '';
        }
        emailError = '';
    }

    function onPasswordBlur() {
        const validated = passwordSchema.safeParse(password.trim());

        if (!validated.success) {
            const formatted = validated.error.format();
            passwordError = formatted._errors[0];
            return;
        }

        password = password.trim();
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
                            case 'email':
                                emailError = e.message;
                                break;
                            case 'username':
                                usernameError = e.message;
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

    function onUsernameBlur() {
        const validated = usernameSchema.safeParse(username.trim());

        if (!validated.success) {
            const formatted = validated.error.format();
            usernameError = formatted._errors[0];
            return;
        }

        username = username.trim();
        usernameError = '';
    }
</script>

{#if $featureFlags['allow-new-users']?.isEnabled}
    <form
        method="POST" 
        action="/?/signup" 
        data-testid={'signup-form'}
        use:enhance={onSubmitResponse}
    >
        <TextInput
            bind:value={email}
            required
            id="email"
            type="email"
            label="Email"
            placeholder="Enter your email"
            error={emailError}
            on:blur={onEmailBlur}
        />

        <TextInput
            bind:value={username}
            required
            id="username"
            type="text"
            label="Username"
            placeholder="Enter your username"
            error={usernameError}
            on:blur={onUsernameBlur}
        />

        <TextInput
            bind:value={password}
            required
            id="password"
            type="password"
            label="Password"
            text="Must be at least 8 characters long and contain at least one number, one uppercase letter, one lowercase letter, and one special character."
            placeholder="Enter your password"
            error={passwordError}
            on:blur={onPasswordBlur}
        />

        <TextInput
            bind:value={confirmPassword}
            required
            id="confirm-password"
            type="password"
            label="Confirm Password"
            placeholder="Confirm your password"
            error={confirmPasswordError}
            on:blur={onConfirmPasswordBlur}
        />

        <div class="signout-footer">
            {#if genError}
                <p class="error">{genError}</p>
            {/if}

            <div class="buttons-container">
                <Button
                    {processing}
                    type="submit"
                    disabled={disabled}
                >
                    Sign Up
                </Button>

                <slot name="secondary-action" />
            </div>
        </div>
    </form>
{:else}
    <p class="error sorry">Sorry, we're not accepting new users at this time. Please try again later.</p>
{/if}

<style>
    form {
        display: flex;
        flex-direction: column;
        gap: 0.7rem;
        height: auto;

        @media (min-width: 500px) {
            gap: 1.1rem;
        }
    }

    .signout-footer {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        padding-top: 0.5rem;
    }

    .buttons-container {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        flex-grow: 1;
        gap: 0.5rem;

        @media (min-width: 500px) {
            flex-direction: row-reverse;
            justify-content: space-between;
        }
    }

    p.error {
        text-align: center;
    }

    p.sorry {
        padding: 2rem 0;
    }
</style>