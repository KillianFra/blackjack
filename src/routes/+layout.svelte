<script lang="ts">
	import '../app.css';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Popover from '$lib/components/ui/popover';
	import {ChevronDown } from 'lucide-svelte';
	import { User } from '$lib/engine/User.svelte';
	import { redirect } from '@sveltejs/kit';
	import { goto } from '$app/navigation';
	let { children, data } = $props();

	async function disconnect() {
		await User.disconnect()
		return goto('/login')
	}
</script>

<main class="relative h-screen w-screen bg-emerald-950">
	<nav
		class="absolute left-0 top-0 w-full border-b border-emerald-800/50 bg-emerald-900/10 backdrop-blur-sm"
	>
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="flex h-16 items-center justify-between">
				<div class="flex items-center">
					<a
						href="/"
						class="flex items-end gap-2 text-xl font-bold text-white duration-200 hover:text-emerald-300"
					>
						<span class="font-serif text-2xl text-[#E9B957] shadow-border">BOJACK</span>
						<span class="font-serif-italic font-semibold">inc.</span>
					</a>
				</div>
				{#if data?.user}
					<div class="flex items-center space-x-4 text-white">
						<Popover.Root>
							<Popover.Trigger class="hover:translate-y-[-2px] duration-200">
								<div  class="flex gap-2 items-center">
									Hello {data.user.username} 
									<ChevronDown />
								</div>
							</Popover.Trigger>
							<Popover.Content>
								<Button variant="destructive" onclick={disconnect}>Disconnect</Button>
							</Popover.Content>
						  </Popover.Root>
					</div>
				{:else}
				<div class="flex items-center space-x-4">
					<a
						href="/login"
						class="rounded-md px-3 py-2 text-sm font-medium text-white/70 duration-200 hover:text-white"
						>Login</a
					>
					<a
						href="/register"
						class="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white duration-200 hover:bg-emerald-500"
						>Register</a
					>
				</div>
				{/if}
			</div>
		</div>
	</nav>
	{@render children()}
</main>
