import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { User } from '$lib/engine/User.svelte';
import { Game } from '$lib/engine/Game.svelte';

export const load: LayoutServerLoad = async ({ url, cookies, fetch }) => {
	const token = cookies.get('session');
	if (url.pathname === '/login' || url.pathname === '/register') {
		return {};
	}
	if (!token) {
		throw redirect(301, '/login');
	}
	const userInstance = token ? new User(token) : null;
	const user = userInstance ? { username: userInstance.username, id: userInstance.id } : null;
	if (!user) {
		throw redirect(301, '/login');
	}
	const deckId = await Game.init(fetch);

	return { deckId, user };
};
