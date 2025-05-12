<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { HandState, type Game } from '$lib/engine/Game.svelte.js';

	const { data } = $props();

	function getGameStatus(game: Game) {
		return game.playerHands[0].handState;
	}

	function getGameColor(game: Game) {
		return game.playerHands[0].handState === HandState.WIN ? 'text-green-500' : 'text-red-500';
	}
</script>

<div class="flex w-full flex-col items-center justify-center pt-20 text-white">
	<h1 class="mb-6 text-2xl font-bold">Past games</h1>

	<div class="container flex w-full flex-col gap-4">
		{#each data.games as game, index}
			<Card.Root class="w-full ">
				<Card.Content>
					<div class="flex justify-between gap-4">
						<div>
							<span>Game: {index + 1}</span>
						</div>
						<div>
							<span>Bet:&nbsp;</span>
							<span>{game.bet}</span>
						</div>
						<div>
							<span>Player balance:&nbsp;</span>
							<span>{game.playerBalance}</span>
						</div>
						<div>
							<span>Game status:&nbsp;</span>
							<span class={getGameColor(game)}>{getGameStatus(game)}</span>
						</div>
					</div>
				</Card.Content>
			</Card.Root>
		{/each}
	</div>
</div>
