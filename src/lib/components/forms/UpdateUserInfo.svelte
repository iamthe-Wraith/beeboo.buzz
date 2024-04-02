<script lang="ts">
    import { enhance } from '$app/forms';
    import { goto } from "$app/navigation";
    import type { ActionResult } from "@sveltejs/kit";
    import { user } from "$lib/stores/user";
    import TextInput from "$lib/components/TextInput.svelte";
    import Button from "$lib/components/Button.svelte";
    import { validateEmail, validateUsername } from "$lib/utils/validators";
    import type { IApiError } from "$lib/utils/api-error";
    import type { SessionUser } from '$lib/services/session';

    let email = $user?.email || '';
    let username = $user?.username || '';

    let emailError: string;
    let usernameError: string;
    let genError: string;
    let successMessage: string;
    let disabled = true;
    let processing = false;

    $: (
        disabled = !email || 
            !username ||
            !!emailError ||
            !!usernameError ||
            (
                $user?.email === email &&
                $user?.username === username
            )
    );

    $: {
        if (successMessage) {
            setTimeout(() => {
                successMessage = '';
            }, 8000);
        }
    }

    function onEmailBlur() {
        const validated = validateEmail(email);

        email = validated.value;
        emailError = validated.error;
    }

    function onSubmitResponse() {
        processing = true;

        return ({ result }: { result: ActionResult<{ message: string, user: SessionUser }> }) => {
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
                        }
                    })
                } else {
                    genError = 'Something went wrong. Please try again later.';    
                }
            }

            if (result.type === 'success') {
                reset();

                if (result.data?.user) {
                    user.set(result.data.user);
                    successMessage = 'Your information has been updated successfully!';
                }
            }

            processing = false;
        }
    };

    function onUsernameBlur() {
        const validated = validateUsername(username);

        username = validated.value;
        usernameError = validated.error;
    }

    function reset() {
        emailError = '';
        usernameError = '';
        genError = '';
        successMessage = '';

        disabled = true;
        processing = false;
    }
</script>

{#if $user}
    <form
        data-testid="user-info-form"
        class="user-info-container-form"
        method="POST" 
        action="/settings/?/updateUserInfo" 
        use:enhance={onSubmitResponse}
    >
        <div class="user-info-inputs-container">
            <div class="user-info">
                <TextInput
                    bind:value={username}
                    id="username"
                    data-testid="user-info-username"
                    label="Username"
                    placeholder="Enter your new username"
                    error={usernameError}
                    required
                    on:blur={onUsernameBlur}
                />
            </div>

            <div class="user-info">
                <TextInput
                    bind:value={email}
                    id="email"
                    data-testid="user-info-email"
                    label="Email"
                    placeholder="Enter your new email"
                    error={emailError}
                    required
                    on:blur={onEmailBlur}
                />
            </div>
        </div>

        <div class="update-user-info-footer">
            {#if genError}
                <p class="error">{genError}</p>
            {/if}

            {#if successMessage}
                <p class="success" data-testid="success-message">{successMessage}</p>
            {/if}

            <div class="buttons-container">
                <Button
                    type="submit"
                    kind="primary"
                    data-testid="user-info-update-button"
                    disabled={disabled}
                    processing={processing}
                >
                    Update
                </Button>
            </div>
        </div>
    </form>
{:else}
    <p data-testid="user-info-error" class="user-info-error">User info not found</p>
{/if}

<style>
    form {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        flex-grow: 1;
        gap: 1rem;

        & .user-info-inputs-container {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }
    }

    .update-user-info-footer p.error {
        text-align: center;
    }

    .buttons-container {
        display: flex;
        justify-content: flex-end;
        padding: 0 var(--outline-offset);
    }

    .user-info-error {
        padding: 2rem 1rem 1rem;
        border: none;
        text-align: center;
    }

    .success {
        color: var(--primary-500);
        text-align: center;
    }
</style>