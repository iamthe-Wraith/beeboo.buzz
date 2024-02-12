<script lang="ts">
    import { goto } from "$app/navigation";
    import { enhance } from "$app/forms";
    import type { Project } from "@prisma/client";
	import type { ActionResult } from "@sveltejs/kit";
	import Icon from "../Icon.svelte";

    export let project: Project;

    let processing = false;

    function onSubmitResponse() {
        processing = true;

        return ({ result }: { result: ActionResult<{ message: string }> }) => {
            if (result.type === 'redirect') {
                goto(result.location);
            }
            
            if (result.type === 'failure') {
                // TODO: Show toast message when completing project fails
                console.log('Error completing project', result);
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
    action={'/projects?/update'}
    use:enhance={onSubmitResponse}
>
    <input type="hidden" name="id" value="{project.id}" />
    <input type="hidden" name="completed" value="true" />

    <button type="submit" data-testid="project-complete-button">
        <Icon name="checkmark" data-testid="project-complete-button-icon"/>
    </button>
</form>
