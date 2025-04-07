<script>
	import Button from '../ui/button/button.svelte';

	const { game } = $props();
</script>

<Button on:click={() => game.reset()}>Rejouer</Button>
