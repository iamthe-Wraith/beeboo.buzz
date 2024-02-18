<script lang="ts">
    type Status = 'pending' | 'in-progress' | 'completed' | 'past-due';
    
    export let status: Status;

    let text: string;

    $: switch (status) {
        case 'pending':
            text = 'Pending';
            break;
        case 'in-progress':
            text = 'In Progress';
            break;
        case 'completed':
            text = 'Completed';
            break;
    }
</script>

<div class="status {status}">
    <div class="indicator" />
    <p>{status}</p>
</div>

<style>
    .status {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        border-radius: 0.5rem;
        font-size: 0.875rem;
        font-weight: 500;
        line-height: 1.25rem;
        text-transform: capitalize;
    }

    .pending {
        & .indicator {
            background: var(--secondary-900);
        }

        & p {
            color: var(--secondary-900);
        }
    }

    .in-progress {
        & .indicator {
            background: var(--primary-500);
        }

        & p {
            color: var(--primary-500);
        }
    }

    .completed {
        & .indicator {
            background: var(--dark-900);
        }

        & p {
            color: var(--dark-900);
        }
    }

    .past-due {
        & .indicator {
            background: var(--danger-500);
        }

        & p {
            color: var(--danger-500);
        }
    }

    .indicator {
        width: 12px;
        height: 12px;
        border-radius: 50%;
    }

    p {
        line-height: 1rem;
    }
</style>