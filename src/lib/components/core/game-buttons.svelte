<script>
	const { game, hand } = $props();
	import { Plus, Minus, SplitSquareHorizontal, Coins } from 'lucide-svelte';

	import Button from '$lib/components/ui/button/button.svelte';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import { HandState } from '$lib/engine/Game.svelte';

	const buttons = [
		{
			name: 'hit',
			icon: Plus,
			color: 'bg-emerald-600 hover:bg-emerald-500',
			onclick: () => game.hit(hand),
			display: true,
			disabled: () => !game.canHit(hand)
		},
		{
			name: 'stand',
			icon: Minus,
			color: 'bg-red-600 hover:bg-red-500',
			onclick: () => game.stand(hand),
			display: true,
			disabled: () => hand.handState === HandState.STANDING
		},
		{
			name: 'double',
			icon: Coins,
			color: 'bg-blue-600 hover:bg-blue-500',
			onclick: () => game.doubleDown(hand),
			display: true,
			disabled: () => !game.canDoubleDown(hand)
		},
		{
			name: 'split',
			icon: SplitSquareHorizontal,
			color: 'bg-purple-600 hover:bg-purple-500',
			onclick: () => game.split(),
			display: () => game.canSplit(),
			disabled: () => !game.canSplit()
		}
	];
</script>

<div class="flex gap-1">
	{#each buttons as button}
		{#if button.display}
			<Tooltip.Root>
				<Tooltip.Trigger>
					<Button
						class="shadow-md {button.color} flex size-12 items-center justify-center rounded-full p-3 text-white transition-all duration-200 hover:scale-110 disabled:cursor-not-allowed disabled:opacity-50"
						on:click={button.onclick}
						disabled={button.disabled()}
						title={button.name}
					>
						{@const Icon = button.icon}
						<Icon size={24} />
					</Button>
				</Tooltip.Trigger>
				<Tooltip.Content>
					<p>{button.name}</p>
				</Tooltip.Content>
			</Tooltip.Root>
		{/if}
	{/each}
</div>
