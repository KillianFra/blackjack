import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	optimizeDeps: {
		include: ['lucide-svelte']
	},
	ssr: {
		noExternal: ['lucide-svelte']
	}
});
