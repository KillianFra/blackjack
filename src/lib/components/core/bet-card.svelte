<script>

	import { Button } from "../ui/button";

</script>
<div class="rounded bg-black/20 p-4 shadow-lg flex gap-4 justify-between">
    <div class="flex flex-col gap-2">
        <div>
            <p class="font-bold text-gray-500">BET</p>
            <p class="text-2xl">100$</p>
        </div>
        <div>
            <p class="font-bold text-gray-500">BALANCE</p>
            <p class="text-2xl">5000$</p>
        </div>
    </div>
    <div class="flex flex-col items-end gap-4 justify-between">
        <Button class="text-md px-6">DEAL</Button>
        <div class="flex gap-2">
            {#each [1,5,10,25,100] as index }
                <img src="/chips/chip-{index}.svg" alt="chip" class="size-12" />
            {/each}
        </div>
    </div>
</div>