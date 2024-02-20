<script lang="ts">
    import { goto } from "$app/navigation";
    import { enhance } from "$app/forms";
    import type { Task } from "@prisma/client";
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
    <input type="hidden" name="title" value="{task.title}" />
    <input type="hidden" name="description" value="{task.description}" />
    <input type="hidden" name="completed" value={!task.completed} />

    <!--
        using slot because different kinds of submit buttons are used throughout the app.
        it's the calling component's responsibility to provide the button with a type of
        "submit" and any other necessary attributes.
    -->
    <slot />
</form>
