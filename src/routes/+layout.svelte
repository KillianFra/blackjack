<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>


<main class="w-screen h-screen bg-emerald-950">
	{@render children()}
</main>
