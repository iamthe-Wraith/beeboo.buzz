<script lang="ts">
    import { enhance } from '$app/forms';
    import type { ActionResult } from '@sveltejs/kit';
	import { goto } from '$app/navigation';
	import Button from "../Button.svelte";
	import { user } from '$lib/stores/user';

    let processing = false;

    function onSubmitResponse() {
        processing = true;

        user.reset();

        return ({ result }: { result: ActionResult<{ message: string }> }) => {
            if (result.type === 'redirect') {
				goto(result.location);
			}

            processing = false;
        }
    };
</script>

<form
    method="POST" 
    action="/?/signout" 
    data-testid={'signout-form'}
    use:enhance={onSubmitResponse}
>
    <Button
        kind="transparent"
        type="submit"
        processing={processing}
        data-testid={'signout-button'}
    >
        Sign out
    </Button>
</form>