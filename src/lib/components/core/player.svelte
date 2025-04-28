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
	<h1 class="text-bold mb-4 text-center text-2xl">
		{playerType === PlayerType.DEALER ? 'Dealer' : 'Jack'}
	</h1>
	<div class="flex items-center justify-center gap-12 pl-[calc(40px_+_1rem)]">
		<div class="flex gap-4">
			{#each cards as card, index}
				<div class="h-42 flex w-16 items-center justify-center rounded-lg bg-white/10 shadow-md">
					<CardComponent {card} {index} />
				</div>
			{/each}
			{#if playerType === PlayerType.DEALER}
				{#if cards.length === 1}
					<CardComponent back />
				{/if}
			{/if}
		</div>
		{#if cards.length > 0}
			<div class="flex size-10 items-center justify-center rounded-full bg-black/20 p-4 font-bold">
				{getHandValue(cards)}
			</div>
		{/if}
	</div>
</div>
