import type { Actions } from './$types';

export const actions = {
	login: async ({ cookies, request }) => {
		const data = await request.formData();
		const username = data.get('username');
		const password = data.get('password');
		console.log(username, password);
		// TODO : Implement login logic
	}
} satisfies Actions;