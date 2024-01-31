<script lang="ts">
    export let message: string;
</script>

<div class="awkward-container">
    <div>
        <p>Well this is awkward...</p>
        <p>{ message }</p>
    </div>
</div>

<style>
    .awkward-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;

        & div {
            max-width: 400px;
            text-align: center;
        }

        & p {
            &:first-child {
                font-size: 1.5rem;
                font-weight: 600;
                margin-bottom: 1rem;
                color: var(--secondary-700);
            }
        }
    }
</style>