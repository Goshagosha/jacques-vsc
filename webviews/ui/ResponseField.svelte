<script lang="ts">
    import OverrideField from "./OverrideField.svelte";

    export let name: string = "";
    export let targetValue: string = "";
    export let sourceValue: string = "";
    let overrideCallback: () => void;
</script>

<div class="main-container">
    <div class="rule-container">
        <b>{name}</b>
        {targetValue}
        {sourceValue}
    </div>
    <!-- svelte-ignore missing-declaration -->
    <button
        on:click={() => {
            overrideCallback();
        }}>Override rule</button
    >
    <OverrideField {name} bind:start={overrideCallback} />
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

    .rule-container {
        position: relative;
        width: 90%;
        height: 94px;
    }
</style>
