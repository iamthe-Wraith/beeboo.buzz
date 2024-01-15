<form {...$$restProps}>
    <slot />
    <footer>
        <slot name="footer" />
    </footer>
</form>

<style>
    form {
        display: flex;
        flex-direction: column;
        gap: 1.1rem;
        width: 30rem;
        height: auto;
    }

    footer {
        display: flex;
        justify-content: flex-end;
        padding-top: 0.5rem;
    }
</style>