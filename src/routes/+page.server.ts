import { Game } from '$lib/engine/Game.svelte';
import { GameState } from '$lib/types/players';

export async function load({ fetch }) {
	const deckId = await Game.init(fetch);
	return { deckId };
}
