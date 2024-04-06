<script lang="ts">
	import { marked } from "marked";

    export let id: string;
    export let value = '';
    export let label = '';
    export let text = '';
    export let placeholder = '';
    export let error = '';
    export let required = false;
    export let hideControls = false;
    export let disableEditing = false;

    let previewing = false;

    $: previewing = disableEditing;

    function setPreviewing(value: boolean) {
        return function() {
            previewing = disableEditing ? false : value;
        }
    }
</script>

<div
    class="container"
    data-testid="{id}-container"
>
    {#if label}
        <label for={id}>
            {label}
            {#if !required}
                <span>- Optional</span>
            {/if}
        </label>
    {/if}

    {#if text}
        <p
            class="text"
            data-testid={`${id}-text`}
        >
            {text}
        </p>
    {/if}

    {#if !hideControls}
        <div
            class="preview-controls" 
            data-testid="{id}-preview-controls"
        >
            <button
                type="button"
                data-testid="{id}-write-button"
                class="{ previewing ? '' : 'selected' }"
                disabled={!previewing}
                on:click={setPreviewing(false)}
            >
                Write
            </button>
            <button
                type="button"
                data-testid="{id}-preview-button"
                class="{ previewing ? 'selected' : '' }"
                disabled={previewing}
                on:click={setPreviewing(true)}
            >
                Preview
            </button>
        </div>
    {/if}

    {#if previewing}
        <div
            class="preview"
            data-testid="{id}-preview"
        >
            {@html marked(value)}
        </div>
    {/if}

    <div
        class="textarea-container { previewing ? 'hidden' : '' }"
        data-testid="{id}-textarea-container"
    >
        <textarea
            {id}
            {required}
            name={id}
            data-testid="{id}"
            placeholder="{placeholder}"
            bind:value={value}
            {...$$restProps}
            class="{error ? 'error' : ''} no-scrollbar"
            on:change
            on:click
            on:focus
            on:blur
            on:keydown
            on:keypress
            on:keyup
        />
    </div>

    {#if error}
        <p class="error" data-testid={`${id}-error`}>{error}</p>
    {/if}
</div>

<style>
    .container {
        --markdown-editor-flex-grow: 1;

        display: flex;
        flex-direction: column;
        flex-grow: var(--markdown-editor-flex-grow);
        gap: 0.5rem;
        padding: var(--outline-offset);
    }

    label {
        font-weight: 500;

        & span {
            color: var(--dark-900);
        }
    }

    .text {
        margin: 0;
        color: var(--dark-900);
    }

    .preview-controls {
        display: flex;
        flex-direction: row;
        gap: 0.1rem;
        padding: var(--outline-offset);
        overflow: hidden;

        & button {
            position: relative;
            padding: 0.5rem 1rem;
            background: none;
            border: none;
            border: 1px solid transparent;
            border-bottom: none;

            &.selected {
                border: 1px solid var(--dark-700);
                border-bottom: none;
                border-top-left-radius: 0.25rem;
                border-top-right-radius: 0.25rem;

                &:before,
                &:after {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    display: block;
                    width: 100vw;
                    height: 0;
                    border-bottom: 1px solid var(--dark-700);
                }

                &:before {
                    left: 100%;
                }

                &:after {
                    right: 100%;
                }
            }

            &:not(.selected):hover {
                cursor: pointer;
            }
        }
    }

    .textarea-container {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
    }

    textarea {
        flex-grow: 1;
        width: 100%;
        padding: 0.5rem;
        border: 1px solid var(--dark-600);
        border-radius: 0.25rem;
        color: var(--light-500);
        background-color: var(--dark-200);
        resize: none;

        &.error {
            border-color: var(--danger-500);
        }

        &::placeholder {
            color: var(--dark-700);
        }
    }

    .preview {
        flex-grow: var(--markdown-editor-flex-grow);

        & h1,
        & h2,
        & h3,
        & h4,
        & h5,
        & h6 {
            color: var(--dark-900);
            text-align: left;
        }

        & a {
            color: var(--primary-500);
            text-decoration: none;

            &:hover {
                text-decoration: underline;
            }
        }

        & table {
            width: 100%;
            margin: 1.5rem 0;
            border-collapse: collapse;
            overflow: auto;

            & thead {
                & th:nth-child(odd) {
                    background: var(--primary-200);
                }

                & th:nth-child(even) {
                    background: var(--primary-100);
                }
            }

            & th,
            & td {
                padding: 0.5rem;
            }

            & tbody {
                & tr {
                    &:nth-child(odd) {
                        & td:nth-child(odd) {
                            background: var(--dark-300);
                        }

                        & td:nth-child(even) {
                            background: var(--dark-200);
                        }
                    }

                    &:nth-child(even) {
                        & td:nth-child(odd) {
                            background: var(--dark-400);
                        }

                        & td:nth-child(even) {
                            background: var(--dark-300);
                        }
                    }
                }
            }
        }

        & ul {
            padding-left: 1rem;
            list-style-type: disc;
            
            & ul {
                padding-top: 0.25rem;
            }

            & li {
                padding: 0.15rem;

                &:last-child {
                    padding-bottom: 0;
                }
            }

            & li::marker {
                color: var(--primary-300);
            }
        }

        & > ul {
            margin: 1.5rem 0;
        }

        & code {
            padding: 0.1rem 0.25rem;
            background: var(--dark-500);
        }

        & pre code {
            display: block;
            margin: 1.5rem 0;
            padding: 0.5rem;
        }

        & img {
            display: block;
            max-width: 90%;
            height: auto;
            margin: 1.5rem 0;
        }

        & blockquote {
            padding: 0.5rem;
            margin: 1.5rem 0;
            border-left: 0.25rem solid var(--primary-500);
            background: var(--dark-200);

            & * {
                margin: 0;
            }
        }

        & hr {
            margin: 1.5rem 0;
            border: none;
            border-top: 1px solid var(--dark-400);
        }
    }
</style>