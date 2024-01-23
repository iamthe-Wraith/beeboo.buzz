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
    data-testid={'signup-form'}
    use:enhance={onSubmitResponse}
>
    <Button
        kind="transparent"
        type="submit"
        processing={processing}
    >
        Sign out
    </Button>
</form>