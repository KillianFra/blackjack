


export class User {
    static async getUser() {
    }

    static async login(username: string, password: string) {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        if (response.status === 401) {
            return null;
        } else if (response.status === 200) {
            return response.json();
        } else {
            throw new Error('Failed to login');
        }
    }

    static async register(username: string, password: string, confirmPwd: string) {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, confirmPwd })
        });
        if (response.status === 401) {
            return null;
        } else if (response.status === 200) {
            return response.json();
        } else {
            throw new Error('Failed to register');
        }
    }
}