<script>
	import { dealerStore } from "$lib/stores/dealer.store.svelte";
	import { userStore } from "$lib/stores/player.store.svelte";
	import Button from "../ui/button/button.svelte";

    const buttons = [
        {
            name: "hit",
            onclick: () => { 
                userStore.hit();
                console.log(userStore.hand)
             },
            disabled: false
        },
        {
            name: "stand",
            onclick: () => { userStore.clearHand() },
            disabled: false
        },
        {
            name: "dealer hit",
            onclick: () => { dealerStore.hit() },
            disabled: false
        },
        {
            name: "split",
            onclick: () => { console.log("split clicked") },
            disabled: false
        }
        ]
</script>

<div class="flex gap-1">
    {#each buttons as button}
        <Button 
            disabled={button.disabled}
            class="shadow-md bg-zinc-600 text-lg uppercase w-[100px]" 
            on:click={button.onclick}>
            {button.name}
        </Button>
    {/each}
</div>