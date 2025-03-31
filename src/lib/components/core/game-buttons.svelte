<script>
	import Button from "../ui/button/button.svelte";

    const buttons = [
        {
            name: "hit",
            onclick: () => { console.log("hit clicked") },
            disabled: true
        },
        {
            name: "stand",
            onclick: () => { console.log("stand clicked") },
            disabled: false
        },
        {
            name: "double",
            onclick: () => { console.log("double clicked") },
            disabled: false
        },
        {
            name: "split",
            onclick: () => { console.log("split clicked") },
            disabled: false
        }
        ]
</script>

<div class="flex gap-1">
    {#each buttons as button}
        <Button 
            disabled={button.disabled}
            class="shadow-md bg-zinc-600 text-lg uppercase w-[100px]" 
            on:click={button.onclick}>
            {button.name}
        </Button>
    {/each}
</div>