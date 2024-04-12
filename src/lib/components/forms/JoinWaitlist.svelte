<script lang="ts">
    import { enhance } from '$app/forms';
    import { goto } from '$app/navigation';
    import type { ActionResult } from '@sveltejs/kit';
    import { validateEmail } from "$lib/utils/validators";
    import Button from "../Button.svelte";
    import TextInput from "../TextInput.svelte";
	import type { IApiError } from '$lib/utils/api-error';
	import { toast } from '$lib/stores/toast';
	import { HttpStatus } from '$lib/constants/error';

    let email = '';
    let emailError = '';
    let emailMessage = '';

    let processing = false;

    function onBlur() {
        const validated = validateEmail(email);

        email = validated.value;
        if (validated.error !== 'Email is required') emailError = validated.error;
    }

    function onSubmitResponse() {
        processing = true;

        return ({ result }: { result: ActionResult<{ message: string }> }) => {
            if (result.type === 'redirect') {
				goto(result.location);
			}
            
            if (result.type === 'failure') {
                if (result.status === HttpStatus.CONFLICT) {
                    emailMessage = 'This email is already on the waitlist.';
                } else if (result.data?.errors) {
                    result.data.errors.map((e: IApiError) => {
                        emailError = e.message;
                    })
                } else {
                    emailError = 'Something went wrong. Please try again later.';    
                }
            }

            if (result.type === 'success') {
                reset();
                toast.add({ message: 'You\'ve joined the waitlist!' });
            }

            processing = false;
        };
    }

    function reset() {
        email = '';
        emailError = '';
        emailMessage = '';
    }
</script>

<div class="container">
    <div class="content">
        <h2>Join the Waitlist</h2>
        <p>And we'll let you know as soon as the app becomes available!</p>
    </div>

    <form
        method="POST" 
        action="/?/joinWaitlist" 
        data-testid={'join-waitlist-form'}
        use:enhance={onSubmitResponse}
    >
        <div>
            <TextInput
                bind:value={email}
                id="email"
                data-testid="waitlist-email"
                type="email"
                placeholder="Your email address"
                on:blur={onBlur}
            />

            {#if emailError}
                <p class="error message m-message">{ emailError }</p>
            {/if}

            {#if emailMessage && !emailError}
                <p class="message m-message">{ emailMessage }</p>
            {/if}

            <Button
                type="submit"
                data-testid="join-waitlist-button"
                disabled={processing || !email || emailError}
            >
                <span class="no-wrap">Join the Waitlist</span>
            </Button>
        </div>

        {#if emailError}
            <p class="error message dt-message">{ emailError }</p>
        {/if}

        {#if emailMessage && !emailError}
            <p class="message dt-message">{ emailMessage }</p>
        {/if}
    </form>
</div>

<style>
    .container {
        container-type: inline-size;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1.5rem;
        margin: 0 auto;
    }
    
    .content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;

        & h2 {
            margin: 0;
        }

        & p {
            margin: 0;
            color: var(--dark-900);
        }
    }

    form {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 0.5rem;
        width: 80vw;
        max-width: 40rem;
        transition: width 0.2s ease-in-out;

        & > div {
            display: flex;
            align-items: center;
            flex-direction: row;
            gap: 0.5rem;
            width: 100%;
        }
    }

    .message {
        margin: 0;
        text-align: center;

        &:not(.error) {
            color: var(--secondary-500);
        }
    }

    .m-message {
        display: none;
    }

    .dt-message {
        display: block;
    }

    .no-wrap {
        white-space: nowrap;
    }

    @container (width < 600px) {
        form {
            width: 90%;
        }

        form > div {
            flex-direction: column;
        }

        .m-message {
            display: block;
            margin-bottom: 1rem;
        }

        .dt-message {
            display: none;
        }
    }

    @container (width < 420px) {
        form {
            width: 100%;
        }   
    }
</style>