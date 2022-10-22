<script lang="ts">
    import { onMount } from "svelte";
    import { Warning, Check } from "svelte-codicons";
    import {
        SvelteVscMessageTypes,
        VscSvelteMessageTypes,
    } from "../../src/messageTypes";

    export let id: string = "";
    export let name: string = "";
    let dsl: string = "";
    let code: string = "";
    let oldGrammar: string = "";
    let oldCode: string = "";
    let hidden: Boolean = true;
    export let status: "warning" | "ok" | "none" = "none";

    export function start() {
        tsvscode.postMessage({
            type: SvelteVscMessageTypes.getRuleSource,
            id: id,
        });
        hidden = false;
    }

    $: {
        if (dsl != oldGrammar) {
            status = "none";
        }
        if (code != oldCode) {
            status = "none";
        }
        oldGrammar = dsl;
        oldCode = code;
    }

    onMount(async () => {
        window.addEventListener("message", (event) => {
            const message = event.data;
            switch (message.command) {
                case VscSvelteMessageTypes.overrideStatus:
                    if (message.object.id == id) {
                        status = message.object.status;
                        if (status == "ok") {
                        }
                    }
                    break;
                case VscSvelteMessageTypes.ruleSource:
                    if (message.object.id == id) {
                        dsl = message.object.dsl;
                        code = message.object.code;
                    }
                    break;
            }
        });
    });
</script>

{#if !hidden}
    <div class="main-container">
        <div class="example-container">
            <b>{name}</b>
            <textarea
                rows="1"
                cols="50"
                bind:value={dsl}
                style="resize: none; margin-bottom: 2px;"
            />
            <textarea
                rows="3"
                cols="50"
                bind:value={code}
                style="resize: none;"
            />
            <div class="icon-container" style="hidden: {status == 'none'}">
                {#if status === "warning"}
                    <Warning />
                {:else if status === "ok"}
                    <Check />
                {/if}
            </div>
        </div>
        <!-- svelte-ignore missing-declaration -->
        <button
            disabled={status == "ok"}
            on:click={() =>
                tsvscode.postMessage({
                    type: SvelteVscMessageTypes.ruleOverride,
                    name: name,
                    id: id,
                    dsl: dsl,
                    code: code,
                })}>Update rule</button
        >
    </div>
{/if}

<style>
    .main-container {
        display: flex;
        flex-direction: row;
        background-color: gray;
        padding: 1px;
    }

    .main-container button {
        position: relative;
        width: 10%;
        height: 112px;
        margin-left: 1px;
    }

    .main-container button:disabled {
        color: gray;
    }

    .example-container {
        position: relative;
        width: 90%;
        height: 112px;
    }

    .icon-container {
        position: absolute;
        right: 4px;
        bottom: 0px;
    }
</style>
