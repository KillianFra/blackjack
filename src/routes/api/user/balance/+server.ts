import prisma from '$lib/prisma';
import { json } from '@sveltejs/kit';

export async function GET({ locals }) {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const user = await prisma.user.findUnique({
		where: {
			id: locals.user.id
		},
		select: {
			balance: true
		}
	});

	return json(user);
}
