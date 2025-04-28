<script lang="ts">
	import { GameState, HandState, type Game } from '$lib/engine/Game.svelte';
	import GameButtons from './game-buttons.svelte';
	import Player from './player.svelte';

	const { game }: { game: Game } = $props();
</script>

<div class="flex flex-col items-center gap-4">
	<div class="flex flex-row gap-6">
		{#each game.playerHands as hand}
			<div class="flex flex-col items-center gap-4">
				<Player cards={hand.cards} playerType="PLAYER" />
				{#if game.gameState === GameState.PLAYING}
					<GameButtons {game} {hand} />
				{/if}

				{#if hand.handState === HandState.WIN}
					You win!
				{:else if hand.handState === HandState.LOST}
					<span class="text-red-500">Dealer win!</span>
				{:else if hand.handState === HandState.EQUAL}
					<span class="text-yellow-500">Equal. Your bet is returned.</span>
				{:else if hand.handState === HandState.BLACKJACK}
					Blackjack! You win 1.5x your bet.
				{/if}
			</div>
		{/each}
	</div>
</div>
