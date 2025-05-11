import { json } from '@sveltejs/kit';
import prisma from '$lib/prisma';

export async function POST({ request, locals }) {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const gameData = await request.json();

	// Update user balance
	await prisma.user.update({
		where: { id: locals.user.id },
		data: { balance: gameData.playerBalance }
	});

	// Save or update game state
	const existingGame = await prisma.game.findFirst({
		where: {
			userId: locals.user.id,
			isDone: false
		}
	});

	if (existingGame) {
		return json(
			await prisma.game.update({
				where: { id: existingGame.id },
				data: gameData
			})
		);
	} else {
		return json(
			await prisma.game.create({
				data: { ...gameData, userId: locals.user.id }
			})
		);
	}
}
