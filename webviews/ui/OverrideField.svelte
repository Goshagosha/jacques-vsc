<script lang="ts">
    import { onMount } from "svelte";
    import { Warning, Check } from "svelte-codicons";
    export let name: string = "";
    let grammar: string = "";
    let code: string = "";
    let oldGrammar: string = "";
    let oldCode: string = "";
    export let status: "warning" | "ok" | "none" = "none";

    export function start() {}

    $: {
        if (grammar != oldGrammar) {
            status = "none";
        }
        if (code != oldCode) {
            status = "none";
        }
        oldGrammar = grammar;
        oldCode = code;
    }

    onMount(async () => {
        window.addEventListener("message", (event) => {
            const message = event.data;
            switch (message.command) {
                case "postRuleStatusToView":
                    if (message.object.id == id) {
                        status = message.object.status;
                        if (status == "ok") {
                        }
                    }
                    break;
            }
        });
    });
</script>

<div class="main-container">
    <div class="example-container">
        <b>{name}</b>
        <textarea
            rows="1"
            cols="50"
            bind:value={grammar}
            style="resize: none; margin-bottom: 2px;"
        />
        <textarea rows="3" cols="50" bind:value={code} style="resize: none;" />
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
                type: "ruleUpdate",
                id: id,
                sourceValue: grammar,
                targetValue: code,
            })}>Update rule</button
    >
</div>

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
        height: 94px;
        margin-left: 1px;
    }

    .main-container button:disabled {
        color: gray;
    }

    .example-container {
        position: relative;
        width: 90%;
        height: 94px;
    }

    .icon-container {
        position: absolute;
        right: 4px;
        bottom: 0px;
    }
</style>
