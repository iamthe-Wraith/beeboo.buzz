<script lang="ts">
    import Form from "../forms/Form.svelte";
    import Button from "../Button.svelte";
	import TextInput from "../TextInput.svelte";
	import { emailSchema, passwordSchema, usernameSchema } from "$lib/utils/schemas";
	import { onMount } from "svelte";

    let email: string = '';
    let username: string = '';
    let password: string = '';
    let confirmPassword: string = '';

    let emailError: string = '';
    let usernameError: string = '';
    let passwordError: string = '';
    let confirmPasswordError: string = '';

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

<Form method="POST" action="/?/signup" data-testid={'signup-form'}>
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
        text="this is just a test"
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

    <div class="buttons-container" slot="footer">
        <slot name="secondary-action" />
        <Button
            type="submit"
            kind="primary"
            disabled={disabled}
        >
            Sign Up
        </Button>
    </div>
</Form>

<style>
    .buttons-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-grow: 1;
        gap: 0.5rem;
    }
</style>