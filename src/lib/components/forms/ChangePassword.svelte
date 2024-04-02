<script lang="ts">
    import type { ActionResult } from "@sveltejs/kit";
    import { enhance } from '$app/forms';
    import { goto } from '$app/navigation';
    import Button from "../Button.svelte";
    import TextInput from "../TextInput.svelte";
    import type { IApiError } from "$lib/utils/api-error";
    import type { SessionUser } from '$lib/services/session';
    import { validatePassword } from '$lib/utils/validators';

    type Field = 'current' | 'new' | 'confirm';

    let currentPassword = '';
    let newPassword = '';
    let confirmPassword = '';

    let currentPasswordError: string;
    let newPasswordError: string;
    let confirmPasswordError: string;
    let genError: string;
    let successMessage: string;
    let disabled = true;
    let processing = false;

    $: (
        disabled = !currentPassword || 
            !newPassword ||
            !confirmPassword ||
            !!currentPasswordError ||
            !!newPasswordError ||
            !!confirmPasswordError ||
            currentPassword === newPassword ||
            newPassword !== confirmPassword
    );

    function onBlur(field: Field) {
        return function() {
            if (field === 'current') {
                if (!currentPassword) {
                    currentPasswordError = 'Current password is required.';
                } else {
                    currentPasswordError = '';
                }
            }

            if (field === 'new') {
                const validated = validatePassword(newPassword);

                newPassword = validated.value;
                newPasswordError = validated.error;
            }

            if (field === 'confirm') {
                if (!newPassword) {
                    confirmPasswordError = '';
                    return;
                }

                if (!confirmPassword) {
                    confirmPasswordError = 'Please confirm your password.';
                } else if (confirmPassword !== newPassword) {
                    confirmPasswordError = 'Passwords do not match.';
                } else {
                    confirmPasswordError = '';
                }
            }

            if (!!currentPassword && !!newPassword && currentPassword === newPassword) {
                newPasswordError = 'New password must be different from the current password.';
            }
        }
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
                            case 'current':
                                currentPasswordError = e.message;
                                break;
                            case 'password':
                                newPassword = e.message;
                                break;
                            case 'confirmPassword':
                                confirmPasswordError = e.message;
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

                if (result.data?.user) {
                    successMessage = 'Your password has been changed successfully!';
                }
            }

            processing = false;
        }
    };

    function reset() {
        currentPassword = '';
        currentPasswordError = '';
        newPassword = '';
        newPasswordError = '';
        confirmPassword = '';
        confirmPasswordError = '';
        genError = '';
        successMessage = '';

        disabled = true;
        processing = false;
    }
</script>

<form
    data-testid="change-password-form"
    class="change-password-form"
    method="POST" 
    action="/settings/?/changePassword" 
    use:enhance={onSubmitResponse}
>
    <div class="change-password-inputs-container">
        <div class="current-password">
            <TextInput
                bind:value={currentPassword}
                id="current"
                data-testid="current-password"
                label="Current Password"
                type="password"
                placeholder="Enter your current password"
                error={currentPasswordError}
                required
                on:blur={onBlur('current')}
            />
        </div>

        <div class="new-password">
            <TextInput
                bind:value={newPassword}
                id="password"
                data-testid="new-password"
                label="New Password"
                type="password"
                placeholder="Enter your new password"
                error={newPasswordError}
                required
                on:blur={onBlur('new')}
            />
        </div>

        <div class="confirm-password">
            <TextInput
                bind:value={confirmPassword}
                id="confirm-password"
                data-testid="confirm-password"
                label="Confirm Password"
                type="password"
                placeholder="Confirm your new password"
                error={confirmPasswordError}
                required
                on:blur={onBlur('confirm')}
            />
        </div>
    </div>

    <div class="change-password-footer">
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
                data-testid="change-password-button"
                disabled={disabled}
                processing={processing}
            >
                Change Password
            </Button>
        </div>
    </div>
</form>

<style>
    form {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        flex-grow: 1;
        gap: 1rem;

        & .change-password-inputs-container {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }
    }

    .change-password-footer p.error {
        text-align: center;
    }

    .buttons-container {
        display: flex;
        justify-content: flex-end;
        padding: 0 var(--outline-offset);
    }

    .success {
        color: var(--primary-500);
        text-align: center;
    }
</style>