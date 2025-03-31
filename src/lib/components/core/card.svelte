<script lang="ts">
    let {back = false, card = null} = $props();
</script>

<div class="card-wrapper">
    {#if !back}
    <img src={card?.image} alt="card img" class="rounded max-w-[120px]">
    {:else}
    <img src="https://deckofcardsapi.com/static/img/back.png" alt="card img" class="rounded max-w-[120px]">
    {/if}
</div>
<style>
    .card-wrapper {
        animation: slideUp 0.5s ease-out;
    }

    @keyframes slideUp {
        from {
            transform: translateY(10px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
</style>