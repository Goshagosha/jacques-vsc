<script lang="ts">
    import { onMount } from "svelte";
    import {
        SvelteVscMessageTypes,
        VscSvelteMessageTypes,
    } from "../../src/messageTypes";

    let dsl: string = "";
    let result: string = "";

    onMount(async () => {
        window.addEventListener("message", (event) => {
            const message = event.data;
            switch (message.command) {
                case VscSvelteMessageTypes.translation:
                    result = message.object.result;
                    break;
            }
        });
    });
</script>

<div class="field-container">
    <textarea
        rows="3"
        cols="50"
        bind:value={dsl}
        style="resize: none; margin-bottom: 2px;"
    />
    <!-- svelte-ignore missing-declaration -->
    <button
        on:click={() =>
            tsvscode.postMessage({
                type: SvelteVscMessageTypes.translationRequest,
                dsl: dsl,
            })}>Translate</button
    >
</div>
{#if result}
    <h3>Result:</h3>
{/if}
{result}

<style>
    .field-container {
        display: flex;
        flex-direction: row;
        padding: 1px;
    }

    .field-container button {
        position: relative;
        width: 10%;
        height: 112px;
        margin-left: 1px;
    }
</style>
