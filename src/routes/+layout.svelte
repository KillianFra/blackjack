<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>


<main class="w-screen h-screen bg-emerald-950">
	<nav class="w-full bg-emerald-900/10 backdrop-blur-sm border-b border-emerald-800/50">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex items-center justify-between h-16">
				<div class="flex items-center">
					<a href="/" class="flex items-end gap-2 text-white font-bold text-xl hover:text-emerald-300 duration-200">
						<span class="font-serif text-2xl text-[#E9B957] shadow-border">BOJACK</span>
						<span class="font-serif-italic font-semibold">inc.</span>
					</a>
				</div>
				<div class="flex items-center space-x-4">
					<a href="/login" class="text-white/70 hover:text-white px-3 py-2 rounded-md text-sm font-medium duration-200">Login</a>
					<a href="/register" class="bg-emerald-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-emerald-500 duration-200">Register</a>
				</div>
			</div>
		</div>
	</nav>
	{@render children()}
</main>
