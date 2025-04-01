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
				game.stand();
			}
		},
		{
			name: 'dealer hit',
			onclick: () => {
				game.dealerHit();
			}
		},
		{
			name: 'split',
			onclick: () => {
				game.split();
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
</div>
