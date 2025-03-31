<script>
	import { userStore } from "$lib/stores/player.store.svelte";


	import Card from "./card.svelte";

</script>
<div>
    <h1 class="text-bold text-2xl text-center mb-4">Jack</h1>
    <div class="flex items-center justify-center gap-4 pl-[calc(40px_+_1rem)]">
        <div class="flex gap-4">
            {#each userStore.hand as card}
                <Card card={card}/>
            {/each}
        </div>
        {#if userStore.handValue > 0}
            <div class="rounded-full p-4 bg-black/20 size-10 flex justify-center items-center font-bold">{userStore.handValue}</div>
        {/if}
    </div>
</div>