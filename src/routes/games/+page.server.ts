export async function load({ fetch }) {
	const games = await fetch('/api/game/getAll').then((response) => response.json());

	return { games };
}
