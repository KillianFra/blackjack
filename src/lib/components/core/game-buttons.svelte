<script>
	const { game } = $props();
	import { Plus, Minus, SplitSquareHorizontal, Coins } from 'lucide-svelte';
	import Button from '../ui/button/button.svelte';

	const buttons = [
		{
			name: 'hit',
			icon: Plus,
			color: 'bg-emerald-600 hover:bg-emerald-500',
			onclick: () => {
				game.hit();
			}
		},
		{
			name: 'stand',
			onclick: () => {
				game.dealerPlay();
			}
		},
		{
			name: 'double',
			icon: Coins,
			color: 'bg-blue-600 hover:bg-blue-500 mb-5',
			onclick: () => {
				game.doubleDown();
			}
		},
		{
			name: 'split',
			icon: SplitSquareHorizontal,
			color: 'bg-purple-600 hover:bg-purple-500',
			onclick: () => {
				game.split();
			}
		}
	];
</script>

<div class="flex gap-1">
	{#each buttons as button}
		<Button
			class="shadow-md {button.color} flex size-12 items-center justify-center rounded-full p-3 text-white transition-all duration-200 hover:scale-110 disabled:cursor-not-allowed disabled:opacity-50"
			on:click={button.onclick}
			title={button.name}
		>
			<svelte:component this={button.icon} size={24} />
		</Button>
	{/each}
	{#if game.canSplit()}
		<Button class="w-[100px] bg-zinc-600 text-lg uppercase shadow-md" on:click={() => game.split()}>
			Split
		</Button>
	{/if}
</div>
