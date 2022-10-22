<script lang="ts">
    import OverrideField from "./OverrideField.svelte";

    export let id: string = "";
    export let name: string = "";
    export let targetValue: string = "";
    export let sourceValue: string = "";
    let overriding: boolean = false;
    let overrideCallback: () => void;
</script>

{#if !overriding}
    <div class="response-container">
        <div class="rule-container">
            <b>{name}</b><br />
            {targetValue}<br />
            {sourceValue}
        </div>
        <button
            on:click={() => {
                overriding = true;
                overrideCallback();
            }}>Override rule</button
        >
    </div>
{/if}
<OverrideField {id} {name} bind:start={overrideCallback} />

<style>
    .response-container {
        display: flex;
        flex-direction: row;
        border-color: gray;
        border-width: 1px;
        padding: 1px;
    }

    .response-container button {
        position: relative;
        width: 10%;
        height: 94px;
        margin-left: 1px;
    }

    .response-container button:disabled {
        color: gray;
    }

    .rule-container {
        position: relative;
        width: 90%;
        height: 94px;
    }
</style>
