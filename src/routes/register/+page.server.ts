import { fail, redirect, RequestEvent } from '@sveltejs/kit';
import { register } from '$lib/api/auth'; 
import type { Actions } from './$types';

export const actions: Actions = {
  default: async ({ request, cookies }: RequestEvent) => {
    const formData = await request.formData();
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    
    // Validation des champs
    if (!username || !password || !confirmPassword) {
        return fail(400, { error: 'Please fill in all fields' });
    }
    
    if (password !== confirmPassword) {
        return fail(400, { error: 'Passwords do not match' });
    }

    try {
        // Enregistrement de l'utilisateur
        const user = await register({ username, password, confirmPwd: password });

        // Création du cookie session après inscription
        cookies.set('session', user.token, {
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24,  // 24h
        });

        // Redirection vers la page d'accueil
        throw redirect(303, '/');
    } catch (error: any) {
        return fail(500, { error: error.message || 'An error occurred during registration' });
    }
  }
};
