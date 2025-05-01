<script lang="ts">
	export let error: string | null = null;
	export let fieldErrors: Record<string, string> = {};
</script>

{#if error}
	<div class="mt-2 rounded-md bg-red-500/10 p-3">
		<p class="text-sm font-medium text-red-500">{error}</p>
	</div>
{/if}

{#each Object.entries(fieldErrors) as [field, message]}
	<div class="mt-1 text-xs font-medium text-red-500" data-field={field}>
		{message}
	</div>
{/each}
