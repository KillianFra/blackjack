import { fail, redirect } from '@sveltejs/kit';
import { register } from '$lib/api/auth';
import type { Actions } from './$types';

export const actions: Actions = {
    register: async ({ request, cookies }) => {
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
            const user = await register({ username, password, confirmPwd: confirmPassword });
            
            // Création du cookie session après inscription
            cookies.set('session', user.token, {
                path: '/',
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24,  // 24h
            });
        } catch (error: any) {
            console.error('Registration error:', error);
            return fail(500, { 
                error: error.message || 'An error occurred during registration',
                username // Return username to pre-fill the form
            });
        }
    }
};
