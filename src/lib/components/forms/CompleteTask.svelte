<script lang="ts">
    import { goto } from "$app/navigation";
    import { enhance } from "$app/forms";
    import type { Task } from "@prisma/client";
    import Icon from "@iconify/svelte";
	import type { ActionResult } from "@sveltejs/kit";

    export let task: Task;

    let processing = false;

    function onSubmitResponse() {
        processing = true;

        return ({ result }: { result: ActionResult<{ message: string }> }) => {
            if (result.type === 'redirect') {
                goto(result.location);
            }
            
            if (result.type === 'failure') {
                // TODO: Show toast message when completing task fails
                console.log('Error completing task', result);
            }

            if (result.type === 'success') {            
                window.location.reload();
            }

            processing = false;
        }
    };
</script>

<form
    method="POST" 
    action={'/tasks?/update'}
    use:enhance={onSubmitResponse}
>
    <input type="hidden" name="id" value="{task.id}" />
    <input type="hidden" name="completed" value="true" />

    <button type="submit" data-testid="task-complete-button">
        <Icon icon="ion:checkmark-outline" data-testid="task-complete-button-icon"/>
    </button>
</form>
