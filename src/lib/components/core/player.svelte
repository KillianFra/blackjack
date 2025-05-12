<script lang="ts">
	import { getHandValue } from '$lib/utils';
	import { type Card } from '$lib/types/players';
	import CardComponent from './card.svelte';
	const { cards, playerType }: { cards: Card[]; playerType: PlayerType } = $props();

	const PlayerType = {
		DEALER: 'DEALER',
		PLAYER: 'PLAYER'
	} as const;
	type PlayerType = (typeof PlayerType)[keyof typeof PlayerType];
</script>

<div>
	<div class="relative mb-4 flex flex-row items-center justify-center gap-4">
		<h1 class="text-bold text-2xl">
			{playerType === PlayerType.DEALER ? 'Dealer' : 'Jack'}
		</h1>

		{#if cards.length > 0}
			<div class="flex size-10 items-center justify-center rounded-full bg-black/20 p-4 font-bold">
				{getHandValue(cards)}
			</div>
		{/if}
	</div>

	<div class="flex justify-center pl-6">
		{#each cards as card, index}
			<CardComponent {card} {index} />
		{/each}
		{#if playerType === PlayerType.DEALER}
			{#if cards.length === 1}
				<CardComponent back />
			{/if}
		{/if}
	</div>
</div>
