import { fail, redirect, type RequestEvent } from '@sveltejs/kit';
import { login } from '$lib/api/auth';
import type { Actions } from './$types';

export const actions: Actions = {
  login: async ({ request, cookies }: RequestEvent) => {
    const formData = await request.formData();
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;
    if (!username || !password) {
      return fail(400, { error: 'Veuillez remplir tous les champs' });
    }

    let loginResult;
    try {
      // Only wrap the part that might throw actual errors
      loginResult = await login(username, password);
    } catch (error) {
      console.error('❌ Erreur de connexion:', error);
      
      return fail(401, { 
        error: 'Identifiants incorrects',
        username
      });
    }

    // Process successful login outside the try/catch
    if (loginResult?.token && loginResult?.user) {
      cookies.set('session', loginResult.token, {
        httpOnly: true,
        secure: true,
        path: '/',
        maxAge: 3600,
      });
      
      // This redirect won't be caught by your catch block
      return redirect(303, '/');
    } else {
      return fail(401, { 
        error: 'Identifiants incorrects ou erreur de serveur',
        username
      });
    }
  }
}
