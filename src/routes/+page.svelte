<script lang="ts">
	import BetCard from "$lib/components/core/bet-card.svelte";
	import Dealer from "$lib/components/core/dealer.svelte";
	import GameButtons from "$lib/components/core/game-buttons.svelte";
	import Jack from "$lib/components/core/jack.svelte";
</script>

<div class="container flex flex-col justify-center items-center text-white h-full w-full">
<section id="header" class="mb-4">
    header du jeu
</section>

<section id="game" class="mb-4">
    <div class="flex flex-col gap-6">
        <Dealer/>
        <Jack/>
    </div>
</section>
<section id="game-states" class="mb-4">
    <div class="flex flex-col items-center gap-4 mt-5">
        <GameButtons/>
        <BetCard/>
    </div>
</section>
</div>
