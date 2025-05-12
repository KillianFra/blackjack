import prisma from '$lib/prisma';
import { json } from '@sveltejs/kit';

export async function GET({ locals, url }) {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const page = url.searchParams.get('page') || '0';
	const pageSize = url.searchParams.get('pageSize') || '10';

	const games = await prisma.game.findMany({
		where: {
			userId: locals.user.id
		},
		skip: parseInt(page) * parseInt(pageSize),
		take: parseInt(pageSize)
	});

	return json(games);
}
