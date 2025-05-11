<script lang="ts">
	import BetCard from '$lib/components/core/bet-card.svelte';
	import PlayerCards from '$lib/components/core/player-cards.svelte';
	import Player from '$lib/components/core/player.svelte';
	import ResetButton from '$lib/components/core/reset-button.svelte';
	import { Game, GameState } from '$lib/engine/Game.svelte';
	import GameHeader from '$lib/components/core/game-header.svelte';

	import type { PageProps } from './$types';

	const { data }: PageProps = $props();
	const game = new Game(data.deckId);
</script>

<div
	class="container flex h-screen w-full flex-col items-center justify-between overflow-y-hidden pt-10 text-white"
>
	<section id="header" class="mt-10">
		<GameHeader {game} />
	</section>

	<section id="game">
		{#if game.gameState !== GameState.INIT}
			<div class="mb-4 flex flex-col gap-10">
				<Player cards={game.dealerCards} playerType="DEALER" />
				<PlayerCards {game} />
			</div>
		{/if}
	</section>

	<section id="bet-card" class="mb-10">
		<div class="flex flex-col items-center gap-4">
			{#if game.gameState === GameState.END}
				<ResetButton {game} />
			{/if}
			<BetCard {game} />
		</div>
	</section>
</div>
