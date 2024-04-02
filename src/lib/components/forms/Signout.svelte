<script lang="ts">
    import Button from "../Button.svelte";
    let processing = false;
</script>

<form
    method="POST" 
    action="/?/signout" 
    data-testid={'signout-form'}
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