import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { verifyToken } from '$lib/auth/jwt';

export const load: LayoutServerLoad = async ({ url, cookies }) => {
    const token = cookies.get('session');
    const isAuthPage = ['/login', '/register'].includes(url.pathname);

    // If user is not authenticated and trying to access protected routes
    if (!token && !isAuthPage) {
        throw redirect(303, '/login');
    }

    // If user is authenticated and trying to access auth pages
    if (token && isAuthPage) {
        throw redirect(303, '/');
    }
    
    let user = null;
    if (token) {
        user = verifyToken(token);
    }

    return {
        user
    };
}; 