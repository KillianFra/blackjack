<script lang="ts">
	import BetCard from '$lib/components/core/bet-card.svelte';
	import Dealer from '$lib/components/core/dealer.svelte';
	import GameButtons from '$lib/components/core/game-buttons.svelte';
	import Jack from '$lib/components/core/jack.svelte';
	import { Game, GameState } from '$lib/engine/Game.svelte';
	import { parseGameState } from '$lib/utils';
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();
	const game = new Game(data.deckId);
</script>

<span>
	game : {parseGameState(game.gameState)}
</span>

<div class="container relative flex h-full w-full flex-col items-center justify-center text-white">
	<section id="header" class="mb-4">header du jeu</section>

	<section id="game" class="mb-4">
		{#if game.playerCards.length > 1}
			<div class="mb-4 flex flex-col gap-6">
				<Dealer cards={game.dealerCards} />
				<Jack cards={game.playerCards} />
			</div>
		{:else}
			start game
		{/if}
		<div class="flex flex-col items-center gap-4">
			{#if game.gameState === GameState.PLAYING}
				<GameButtons {game} />
			{/if}
			<BetCard {game} />
		</div>
	</section>
</div>
