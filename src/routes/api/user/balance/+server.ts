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

export async function POST({ locals, request }) {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const { balance } = await request.json();

	const user = await prisma.user.update({
		where: {
			id: locals.user.id
		},
		data: { balance }
	});

	return json(user);
}
