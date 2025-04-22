import { env } from '$env/dynamic/public';
import { json } from '@sveltejs/kit';

const deckCount = 6;

export async function GET() {
	const deckId = await fetch(`${env.PUBLIC_API_URL}/new/shuffle/?deck_count=${deckCount}`)
		.then((response) => response.json())
		.then((data) => data.deck_id);
	return json(deckId);
}
