<script>
	import { dealerStore } from "$lib/stores/dealer.store.svelte";
	import { userStore } from "$lib/stores/player.store.svelte";
	import Button from "../ui/button/button.svelte";
	import { Plus, Minus, SplitSquareHorizontal, Coins } from 'lucide-svelte';

    const buttons = [
        {
            name: "hit",
            icon: Plus,
            color: "bg-emerald-600 hover:bg-emerald-500",
            onclick: () => { 
                userStore.hit();
                console.log(userStore.hand)
            },
            disabled: false
        },
        {
            name: "double",
            icon: Coins,
            color: "bg-blue-600 hover:bg-blue-500 mb-5",
            onclick: () => { console.log("double clicked") },
            disabled: false
        },
        {
            name: "stand",
            icon: Minus,
            color: "bg-red-600 hover:bg-red-500",
            onclick: () => { userStore.clearHand() },
            disabled: false
        },
        {
            name: "split",
            icon: SplitSquareHorizontal,
            color: "bg-purple-600 hover:bg-purple-500",
            onclick: () => { console.log("split clicked") },
            disabled: false
        }
    ]
</script>

<div class="flex gap-4">
    {#each buttons as button}
        <Button
            disabled={button.disabled}
            class="shadow-md {button.color} text-white p-3 rounded-full size-12 flex items-center justify-center transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed" 
            onclick={button.onclick}
            title={button.name}>
            <svelte:component this={button.icon} size={24} />
        </Button>
    {/each}
</div>