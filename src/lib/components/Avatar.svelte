<script lang="ts">
    import { user } from '$lib/stores/user';

    export let size: 'small' | 'medium' | 'large' = 'medium'

    const firstLetter = $user?.username?.charAt(0).toUpperCase();
</script>

<div class="avatar {size}">
    <div class="default-avatar">{firstLetter}</div>
</div>

<style>
    .avatar {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        border-radius: 50%;
        background-color: var(--dark-600);
        aspect-ratio: 1/1;

        &.small {
            width: 2rem;

            & .default-avatar {
                font-size: 1rem;
            }
        }

        &.medium {
            width: 3rem;

            & .default-avatar {
                font-size: 1.75rem;
            }
        }

        &.large {
            width: 4rem;

            & .default-avatar {
                font-size: 2.25rem;
            }
        }
        

        & .default-avatar {
            font-weight: 600;
            line-height: 1em;
        }
    }
</style>