<script>

	import Card from "./card.svelte";

</script>
<div>
    <h1 class="text-bold text-2xl text-center mb-4">Dealer</h1>
    <div class="flex items-center gap-4 pl-[calc(40px_+_1rem)]">
        <div class="flex gap-4">
            <Card/>
            <Card back={true}/>
        </div>
        <div class="rounded-full p-4 bg-black/20 size-10 flex justify-center items-center font-bold">19</div>
    </div>
</div>