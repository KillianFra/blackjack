<script>

	import { dealerStore } from "$lib/stores/dealer.store.svelte";
    import Card from "./card.svelte";

</script>
<div>
    <h1 class="text-bold text-2xl text-center mb-4">Dealer</h1>
    <div class="flex items-center justify-center gap-12 pl-[calc(40px_+_1rem)]">
        <div class="flex">
            {#each dealerStore.hand as card, index}
            <div class="w-16 h-42 bg-white/10 rounded-lg shadow-md flex justify-center items-center">
                <Card card={card} {index}/>
            </div>
            {/each}
        </div>
        {#if dealerStore.handValue > 0}
            <div class="rounded-full p-4 bg-black/20 size-10 flex justify-center items-center font-bold">{dealerStore.handValue}</div>
        {/if}
    </div>
</div>