import prisma from '$lib/prisma';
import { json } from '@sveltejs/kit';

export async function GET({ locals }) {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const game = await prisma.game.findFirst({
		where: {
			AND: [
				{
					userId: locals.user.id
				},
				{
					isDone: false
				}
			]
		}
	});

	return json(game);
}
