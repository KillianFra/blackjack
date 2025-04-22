import { env } from '$env/dynamic/public';
import { json } from '@sveltejs/kit';

export async function GET({ url }: { url: URL }) {
	const deckId = url.searchParams.get('deckId');
	const drawCount = url.searchParams.get('drawCount') ?? 1;

	const cards = await fetch(`${env.PUBLIC_API_URL}/${deckId}/draw/?count=${drawCount}`)
		.then((response) => response.json())
		.then((data) => data.cards);

	return json(cards);
}
