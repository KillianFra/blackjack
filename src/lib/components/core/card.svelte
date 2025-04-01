<script lang="ts">
    let {back = false, card = null, index = 0} = $props();
</script>

<div class="card-container">
    <div class="card-wrapper group" style="z-index: {index};">
        {#if !back}
        <img src={card?.image} alt="card img" class="rounded max-w-[120px] transition-all duration-300 group-hover:scale-110">
        {:else}
        <img src="https://deckofcardsapi.com/static/img/back.png" alt="card img" class="rounded max-w-[120px] transition-all duration-300 group-hover:scale-110">
        {/if}
    </div>
</div>

<style>
    .card-container {
        perspective: 1000px;
    }

    .card-wrapper {
        animation: slideUp 0.5s ease-out;
        transform-origin: center;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        margin-left: -40px;
        transform-style: preserve-3d;
    }

    .card-wrapper:first-child {
        margin-left: 0;
    }

    .card-wrapper:hover {
        transform: translate3d(0, -20px, 0) rotate3d(1, 1, 0, 15deg);
        z-index: 50;
    }

    .card-wrapper:hover ~ .card-wrapper {
        transform: translate3d(40px, 0, 0) rotate3d(1, 1, 0, -15deg);
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