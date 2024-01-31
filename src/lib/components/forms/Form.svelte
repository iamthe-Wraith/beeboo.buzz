<form {...$$restProps}>
    <slot />
    <div class="form-footer">
        <slot name="footer" />
    </div>
</form>

<style>
    form {
        display: flex;
        flex-direction: column;
        gap: 1.1rem;
        width: 30rem;
        height: auto;
    }

    .form-footer {
        display: flex;
        justify-content: flex-end;
        padding-top: 0.5rem;
    }
</style>