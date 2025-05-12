<script lang="ts">
	import { page } from '$app/state';
	import Logo from '$lib/components/core/logo.svelte';
</script>

<main class="flex h-screen w-screen flex-col items-center justify-center gap-4">
	<Logo />
	<h1 class="text-4xl font-bold text-white">{page.status}</h1>
	<p class="text-lg text-white">{page.error?.message ?? 'An unknown error has occurred.'}</p>
</main>
