<script lang="ts">
	import BetCard from '$lib/components/core/bet-card.svelte';
	import Dealer from '$lib/components/core/dealer.svelte';
	import GameButtons from '$lib/components/core/game-buttons.svelte';
	import Jack from '$lib/components/core/jack.svelte';
	import ResetButton from '$lib/components/core/reset-button.svelte';
	import { Game, GameState } from '$lib/engine/Game.svelte';
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();
	const game = new Game(data.deckId);
</script>

<div class="container relative flex h-full w-full flex-col items-center justify-between text-white">
	<section id="header" class="mt-10">
		{#if game.gameState === GameState.INIT}
			<h3 class="text-center text-2xl font-bold">Start game</h3>
		{:else if game.gameState === GameState.PLAYING}
			<h3 class="text-center text-2xl font-bold">Your turn...</h3>
		{:else}
			<h3 class="text-center text-2xl font-bold">
				{#if game.gameState === GameState.WIN}
					You win!
				{:else if game.gameState === GameState.LOSE}
					<span class="text-red-500">Dealer win!</span>
				{:else if game.gameState === GameState.EQUAL}
					<span class="text-yellow-500">Equal. Your bet is returned.</span>
				{:else if game.gameState === GameState.BLACKJACK}
					Blackjack! You win 1.5x your bet.
				{/if}
			</h3>
		{/if}
	</section>

	<section id="game">
		{#if game.playerCards.length > 1}
			<div class="mb-4 flex flex-col gap-6">
				<Dealer cards={game.dealerCards} />
				<Jack cards={game.playerCards} />
			</div>
		{/if}
	</section>

	<section id="game-buttons" class="mb-10">
		<div class="flex flex-col items-center gap-4">
			{#if game.gameState === GameState.PLAYING}
				<GameButtons {game} />
			{:else if [GameState.LOSE, GameState.WIN, GameState.EQUAL, GameState.BLACKJACK].includes(game.gameState)}
				<ResetButton {game} />
			{/if}
			<BetCard {game} />
		</div>
	</section>
</div>
