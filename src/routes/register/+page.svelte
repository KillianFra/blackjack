<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import FormError from '$lib/components/ui/form-error.svelte';
	import type { RegisterFormData } from '$lib/auth/types';
	import Logo from '$lib/components/core/logo.svelte';
	export let form: RegisterFormData | null = null;
</script>

<div class="relative flex h-screen flex-col items-center justify-center">
	<Logo />
	<div class="relative z-10 flex h-96 w-96 flex-col items-center rounded-lg">
		<form method="POST" action="?/register" class="w-full">
			<div class="flex flex-col gap-4 p-4">
				{#if form?.error}
					<FormError error={form.error} fieldErrors={form.fieldErrors ?? {}} />
				{/if}
				<div class="flex flex-col gap-2">
					<label for="username" class="text-white">Username</label>
					<Input
						type="text"
						name="username"
						id="username"
						class="rounded-lg border-none bg-white/10 p-2 text-white duration-200 hover:bg-white/20"
						value={form?.username ?? ''}
					/>
				</div>
				<div class="flex flex-col gap-2">
					<label for="password" class="text-white">Password</label>
					<Input
						type="password"
						name="password"
						id="password"
						class="rounded-lg border border-none bg-white/10 p-2 text-white duration-200 hover:bg-white/20 focus:border-white/50"
					/>
				</div>
				<div class="flex flex-col gap-2">
					<label for="confirmPassword" class="text-white">Confirm Password</label>
					<Input
						type="password"
						name="confirmPassword"
						id="confirmPassword"
						class="rounded-lg border border-none bg-white/10 p-2 text-white duration-200 hover:bg-white/20 focus:border-white/50"
					/>
				</div>
				<button
					type="submit"
					class="mt-5 rounded-lg bg-white/10 p-2 text-white duration-300 hover:translate-y-[-2px] hover:bg-white/20"
					>Register</button
				>
			</div>
			<p class="text-center text-white/50">
				Already have an account ? <a href="/login" class="text-white">Login</a>
			</p>
		</form>
	</div>
</div>
