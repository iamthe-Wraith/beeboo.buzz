<script lang="ts">
    import Form from "../forms/Form.svelte";
    import Button from "../Button.svelte";
	import TextInput from "../TextInput.svelte";

    let email: string = '';
    let username: string = '';
    let password: string = '';
    let confirmPassword: string = '';
    let disabled = true;

    $: (
        disabled = email === '' || 
            username === '' || 
            password === '' || 
            confirmPassword === '' ||
            password !== confirmPassword
    );

    export function reset() {
        email = '';
        username = '';
        password = '';
        confirmPassword = '';
    }
</script>

<Form action="#">
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