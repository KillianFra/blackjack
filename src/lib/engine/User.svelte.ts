import { jwtDecode } from 'jwt-decode';

export class User {
	username: string;
	id: string;
	constructor(token: string) {
		const user: { username: string; sub: string } = jwtDecode(token);
		this.username = user.username;
		this.id = user.sub;
	}

	// Setter for balance
	static async setBalance(newBalance: number) {
		await fetch('/api/user/balance', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ newBalance })
		});
	}

	static async disconnect() {
		try {
			const response = await fetch('/api/auth/disconnect', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				}
			});
			if (!response.ok) {
				console.error('Failed to disconnect:', response.statusText);
				return false;
			}
			if (typeof localStorage !== 'undefined') {
				localStorage.removeItem('token');
			}
		} catch (error) {
			console.error('Error during disconnect:', error);
			return false;
		}
	}
}
