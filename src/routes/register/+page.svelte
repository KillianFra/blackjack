<script lang="ts">
	import { Input } from '$lib/components/ui/input';
</script>

<div class="flex h-full items-center justify-center relative">
	<img src="/bojack.png" alt="Blackjack Logo" class="absolute top-0 w-[40vw] h-[40vh] opacity-80 -z-1 hover:opacity-100 duration-200" />
	<div class="flex h-96 w-96 flex-col items-center rounded-lg relative z-10">
		<form method="POST" action="?/register" class="w-full">
			<div class="flex flex-col gap-4 p-4">
				<div class="flex flex-col gap-2">
					<label for="username" class="text-white">Username</label>
					<Input
						type="text"
						name="username"
						id="username"
						class="rounded-lg border-none bg-white/10 p-2 text-white hover:bg-white/20 duration-200"
					/>
				</div>
				<div class="flex flex-col gap-2">
					<label for="password" class="text-white">Password</label>
					<Input
						type="password"
						name="password"
						id="password"
						class="rounded-lg border border-none bg-white/10 p-2 text-white hover:bg-white/20 duration-200 focus:border-white/50"
					/>
				</div>
				<div class="flex flex-col gap-2">
					<label for="confirmPassword" class="text-white">Confirm Password</label>
					<Input
						type="password"
						name="confirmPassword"
						id="confirmPassword"
						class="rounded-lg border border-none bg-white/10 p-2 text-white hover:bg-white/20 duration-200 focus:border-white/50"
					/>
				</div>
				<button type="submit" class="mt-5 rounded-lg bg-white/10 p-2 hover:bg-white/20 duration-300 text-white hover:translate-y-[-2px]">Register</button>
			</div>
			<p class="text-center text-white/50">
				Already have an account ? <a href="/login" class="text-white">Login</a>
			</p>
		</form>
	</div>
</div>
