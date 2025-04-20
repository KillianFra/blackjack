<script>
	import { getHandValue } from '$lib/utils';
	import Card from './card.svelte';
	const { cards } = $props();
</script>

<div>
	<h1 class="text-bold mb-4 text-center text-2xl">Dealer</h1>
	<div class="flex items-center justify-center gap-4 pl-[calc(40px_+_1rem)]">
		<div class="flex gap-4">
			{#each cards as card}
				<Card {card} />
			{/each}
			{#if cards.length === 1}
				<Card back />
			{/if}
		</div>
		<div class="flex size-10 items-center justify-center rounded-full bg-black/20 p-4 font-bold">
			{#if cards.length > 1}
				{getHandValue(cards)}
			{:else}
				?
			{/if}
		</div>
	</div>
</div>
