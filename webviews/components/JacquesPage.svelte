<!-- Language: svelte -->
<script lang="ts">
    import { onMount } from "svelte";
    import ExampleField from "../ui/ExampleField.svelte";
    import ResponseField from "../ui/ResponseField.svelte";
    import {
        SvelteVscMessageTypes,
        VscSvelteMessageTypes,
    } from "../../src/extension";

    let rules: Array<{ id: string; name: string; dsl: string; code: string }> =
        [];
    let id_counter = 0;
    let field_ids: Array<{ id: string; virgin: boolean }> = [];

    function newFieldCallback() {
        if (field_ids.at(field_ids.length - 1)?.virgin) {
            return;
        }
        let id = id_counter.toString();
        field_ids.push({ id, virgin: true });
        field_ids = field_ids;
        id_counter++;
        console.log("NEW FIELD REQUESTED " + field_ids);
    }

    function beenTouchedCallback(id: string) {
        field_ids = field_ids.map((field) => {
            if (field.id == id) {
                field.virgin = false;
            }
            return field;
        });
    }

    newFieldCallback();

    onMount(async () => {
        window.addEventListener("message", (event) => {
            const message = event.data;
            switch (message.command) {
                case VscSvelteMessageTypes.rules:
                    rules = message.object;
                    break;
            }
        });
    });
</script>

<h1>Jacques</h1>
<br />
{#each field_ids as tuple (tuple.id)}
    <svelte:component
        this={ExampleField}
        id={tuple.id}
        {newFieldCallback}
        {beenTouchedCallback}
    />
{/each}

<div class="button-panel">
    <!-- svelte-ignore missing-declaration -->
    <button
        on:click={() =>
            tsvscode.postMessage({
                type: SvelteVscMessageTypes.processExamples,
            })}>Process all</button
    >

    <!-- svelte-ignore missing-declaration -->
    <button
        on:click={() =>
            tsvscode.postMessage({
                type: SvelteVscMessageTypes.getRules,
            })}>Get rules</button
    >

    <!-- svelte-ignore missing-declaration -->
    <button
        on:click={() =>
            tsvscode.postMessage({
                type: SvelteVscMessageTypes.reset,
            })}>Reset</button
    >
</div>

{#each rules as rule}
    <ResponseField
        bind:id={rule.id}
        bind:name={rule.name}
        bind:targetValue={rule.dsl}
        bind:sourceValue={rule.code}
    />
{/each}

<style>
    .button-panel {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
    .button-panel button {
        margin-left: 4px;
        margin-right: 4px;
    }
</style>
