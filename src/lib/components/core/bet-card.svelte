<script lang="ts">
	import { Button } from '../ui/button';

	const chips = [
		{ value: 1, image: '/chips/chip-1.svg' },
		{ value: 5, image: '/chips/chip-5.svg' },
		{ value: 10, image: '/chips/chip-10.svg' },
		{ value: 25, image: '/chips/chip-25.svg' },
		{ value: 100, image: '/chips/chip-100.svg' }
	];

	const { game } = $props();

	function handleChipClick(value: number) {
		game.playerBet += value;
		game.playerBalance -= value;
	}

	function resetBet() {
		game.playerBalance += game.playerBet;
		game.playerBet = 0;
	}

	function handleDeal(bet: number) {
		game.deal(bet);
	}
</script>

<div class="flex justify-between gap-4 rounded bg-black/20 p-4 shadow-lg">
	<div class="flex flex-col gap-2">
		<div class="flex flex-col">
			<p class="font-bold text-gray-500">BET</p>
			<div class="flex">
				<p class="text-left text-2xl">{game.playerBet}$</p>
				{#if game.playerBet > 0}
					<button onclick={() => resetBet()} aria-label="reset-bet" class="text-md ml-2">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="lucide lucide-refresh-ccw-icon lucide-refresh-ccw"
							><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path
								d="M3 3v5h5"
							/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" /><path
								d="M16 16h5v5"
							/></svg
						>
					</button>
				{/if}
			</div>
		</div>
		<div>
			<p class="font-bold text-gray-500">BALANCE</p>
			<p class="w-[100px] text-left text-2xl">{game.playerBalance}$</p>
		</div>
	</div>
	<div class="flex flex-col items-end justify-between gap-4">
		<Button class="text-md px-6" onclick={() => handleDeal(game.playerBet)}>DEAL</Button>
		<div class="flex gap-2">
			{#each chips as chip}
				<button
					onclick={() => handleChipClick(chip.value)}
					class="cursor-pointer transition-transform hover:scale-110"
				>
					<img src={chip.image} alt="{chip.value}$ chip" class="size-12" />
				</button>
			{/each}
		</div>
	</div>
</div>
