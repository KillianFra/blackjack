import { redirect } from "@sveltejs/kit";
import { jwtDecode } from "jwt-decode";

export class User {
    username: string;
    id: string;
    constructor(token: string) {
        const user: { username: string; sub: string } = jwtDecode(token);
        this.username = user.username;
        this.id = user.sub
    }

    // Setter for balance
    async setBalance(newBalance: number, token: string) {
        const user = await this.getUser(token)
        await fetch('/api/u/balance',{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({token: `Bearer ${token}`, newBalance})
        })
    }

    async getBalance(token: string): Promise<number | null> {
        const user = await this.getUser(token)
        return user?.balance
    }


    async getUser(token: string) {
        const response = await fetch(`/api/auth/me`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(`Bearer ${token}`)
        })

        if (response.ok) {
            return response.json()
        }
        return null
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