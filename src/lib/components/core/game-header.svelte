<script lang="ts">
	import { GameState, HandState, type Game } from '$lib/engine/Game.svelte';

	const { game }: { game: Game } = $props();

	function getEarnings() {
		return game.playerHands.reduce((acc, hand) => {
			switch (hand.handState) {
				case HandState.WIN:
					return acc + hand.bet * 2;
				case HandState.LOST:
					return acc - hand.bet;
				case HandState.EQUAL:
					return acc + hand.bet;
				case HandState.BLACKJACK:
					return acc + hand.bet * 1.5;
				default:
					return acc;
			}
		}, 0);
	}
</script>

{#if game.gameState === GameState.INIT}
	<h3 class="text-center text-2xl font-bold">Start game</h3>
{:else if game.gameState === GameState.PLAYING}
	<h3 class="text-center text-2xl font-bold">Your turn...</h3>
{:else}
	<h3 class="text-center text-2xl font-bold">END GAME</h3>
	<p class="text-center font-bold">Your earnings: {getEarnings()}$</p>
{/if}
