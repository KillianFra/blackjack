import { fail, redirect, type RequestEvent } from '@sveltejs/kit';
import { login } from '$lib/api/auth';
import type { Actions } from './$types';

export const actions: Actions = {
  login: async ({ request, cookies }: RequestEvent) => {
    console.log('🟢 Action login appelée');

    const formData = await request.formData();
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    console.log('📩 Form Data reçu:', { username, password });

    if (!username || !password) {
      console.log('❌ Champs manquants');
      return fail(400, { error: 'Veuillez remplir tous les champs' });
    }

    try {
      console.log('🔍 Tentative de connexion pour:', username);
      const { token, user } = await login(username, password);
      console.log('✅ Connexion réussie pour:', user);

      cookies.set('auth_token', token, {
        httpOnly: true,
        secure: true,
        path: '/',
        maxAge: 3600, // 1h
      });

      console.log('🍪 Token stocké dans les cookies');
      throw redirect(303, '/dashboard');
    } catch (error) {
      console.log('❌ Erreur de connexion:', error);
      return fail(401, { error: 'Identifiants incorrects' });
    }
  }
};
