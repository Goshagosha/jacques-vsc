<script lang="ts">
    import { onMount } from "svelte";
    import { Warning, Check } from "svelte-codicons";
    export let id: string;
    export let sourceValue: string = "";
    export let targetValue: string = "";
    export let oldTargetValue: string = "";
    export let oldSourceValue: string = "";
    export let status: "warning" | "ok" | "none" = "none";
    export let newFieldCallback: null | (() => void);
    export let beenTouchedCallback: null | ((id: string) => void);

    $: {
        if (targetValue != oldTargetValue) {
            status = "none";
            beenTouchedCallback?.(id);
        }
        if (sourceValue != oldSourceValue) {
            status = "none";
            beenTouchedCallback?.(id);
        }
        oldTargetValue = targetValue;
        oldSourceValue = sourceValue;
    }

    onMount(async () => {
        window.addEventListener("message", (event) => {
            const message = event.data;
            switch (message.command) {
                case "postExampleStatusToView":
                    if (message.object.id == id) {
                        status = message.object.status;
                        if (status == "ok") {
                            newFieldCallback?.();
                        }
                    }
                    break;
            }
        });
    });
</script>

<div class="main-container">
    <div class="example-container">
        <textarea
            rows="1"
            cols="50"
            bind:value={sourceValue}
            style="resize: none; margin-bottom: 2px;"
            placeholder="Enter the source of the example"
        />
        <textarea
            rows="3"
            cols="50"
            bind:value={targetValue}
            style="resize: none;"
            placeholder="Enter the target of the example"
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
                type: "example",
                id: id,
                sourceValue: sourceValue,
                targetValue: targetValue,
            })}>Push example</button
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
