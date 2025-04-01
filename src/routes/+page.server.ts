import { Game } from '$lib/engine/Game.svelte';

export async function load({ fetch }) {
	const deckId = await Game.init(fetch);
	console.log('deckId:', deckId);
	return { deckId };
}
