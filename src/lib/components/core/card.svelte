<script lang="ts">
    let {back = false} = $props();
</script>

{#if !back}
<img src="https://deckofcardsapi.com/static/img/6H.png" alt="card img" class="rounded max-w-[120px]">
{:else}
<img src="https://deckofcardsapi.com/static/img/back.png" alt="card img" class="rounded max-w-[120px]">
{/if}