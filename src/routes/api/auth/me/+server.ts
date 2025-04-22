import { me } from '$lib/api/auth';
import { json } from '@sveltejs/kit';

export async function POST(request: Request) {
    const authHeader = request.headers?.get('Authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) {
        return json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
        const user = await me(token);
        if (!user) {
            return json({ error: 'Unauthorized' }, { status: 401 });
        }
        return json(user);
    } catch (err) {
        console.error('Error fetching user:', err);
        return json({ error: 'Internal Server Error' }, { status: 500 });
    }
}