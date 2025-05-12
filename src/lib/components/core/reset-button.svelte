<script lang="ts">
	import { type Game } from '$lib/engine/Game.svelte';
	import Button from '../ui/button/button.svelte';

	const { game }: { game: Game } = $props();
</script>

<Button on:click={() => game.replay()}>Replay</Button>
