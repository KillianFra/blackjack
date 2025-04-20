<script>
	import Button from '../ui/button/button.svelte';

	const { game } = $props();

	const buttons = [
		{
			name: 'hit',
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
			onclick: () => {
				game.doubleDown();
			}
		}
	];
</script>

<div class="flex gap-1">
	{#each buttons as button}
		<Button class="w-[100px] bg-zinc-600 text-lg uppercase shadow-md" on:click={button.onclick}>
			{button.name}
		</Button>
	{/each}
	{#if game.canSplit()}
		<Button class="w-[100px] bg-zinc-600 text-lg uppercase shadow-md" on:click={() => game.split()}>
			Split
		</Button>
	{/if}
</div>
