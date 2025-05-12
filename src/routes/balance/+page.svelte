<script lang="ts">
	import { onMount } from 'svelte';
	import { User } from '$lib/engine/User.svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	let newBalance: number = 0;
	let error: string = '';
	let success: string = '';
	let token: string | null = null;
	let user: User | null = null;

	onMount(() => {
		token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
		if (token) {
			user = new User(token);
		}
	});

	async function updateBalance() {
		if (!user || !token) return;
		try {
			await user.setBalance(newBalance, token);
			success = 'Balance updated!';
			error = '';
			setTimeout(() => goto('/'), 1000);
		} catch (e) {
			error = 'Failed to update balance.';
			success = '';
		}
	}
</script>

<div class="modal-backdrop">
	<div class="modal">
		<h2>Update Balance</h2>
		<input type="number" bind:value={newBalance} min="0" placeholder="New Balance" />
		<button on:click={updateBalance}>Update</button>
		{#if error}
			<p class="error">{error}</p>
		{/if}
		{#if success}
			<p class="success">{success}</p>
		{/if}
		<button on:click={() => goto('/')}>Cancel</button>
	</div>
</div>

<style>
	.modal-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
	}
	.modal {
		background: white;
		padding: 2rem;
		border-radius: 8px;
		min-width: 300px;
		box-shadow: 0 2px 16px rgba(0, 0, 0, 0.2);
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.error {
		color: red;
	}
	.success {
		color: green;
	}
</style>
