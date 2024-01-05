<script lang="ts">
    import './global.css';
</script>

<header>
    <div class="logo">Oh My GTD</div>
</header>

<main>
    <slot></slot>  
</main>

<footer>
    <div></div>
    <div>
        Copyright {new Date().getFullYear()}
    </div>
</footer>

<style>
    header,
    footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 1rem;
        background-color: var(--dark-100);
        color: #fff;
    }

    header {
        height: 4rem;

        & .logo {
            font-size: 1.5rem;
            font-weight: bold;
        }
    }

    footer {
        height: 3rem;
    }

    main {
        min-height: calc(100vh - 7rem);
        padding: 1rem;
        background-color: var(--dark-300);
    }
</style>