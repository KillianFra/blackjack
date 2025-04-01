<script lang="ts">
	import { Input } from "$lib/components/ui/input";
</script>

<div class="flex h-full justify-center items-center">
    <div class="w-96 h-[500px] rounded-lg flex flex-col justify-center items-center">
	<img src="/bojack.png" alt="Blackjack Logo" class="absolute top-20 w-[40vw] h-[40vh] opacity-80 -z-1 hover:opacity-100 duration-200" />
        <form method="POST" action="?/register">
            <div class="flex flex-col w-96 gap-4 p-4">
                <div class="flex flex-col gap-2">
                    <label for="username" class="text-white">Username</label>
                    <Input type="text" name="username" id="username" class="p-2 rounded-lg bg-white/10 border-none duration-200 text-white" />
                </div>
                <div class="flex flex-col gap-2">
                        <label for="password" class="text-white">Password</label>
                    <Input type="password" name="password" id="password" class="p-2 rounded-lg bg-white/10 border-none duration-200 border focus:border-white/50 text-white" />
                </div>
                <div class="flex flex-col gap-2">
                    <label for="confirmPassword" class="text-white">Confirm Password</label>
                    <Input type="password" name="confirmPassword" id="confirmPassword" class="p-2 rounded-lg bg-white/10 border-none duration-200 border focus:border-white/50 text-white" />
                </div>
                <button type="submit" class="bg-white/10 p-2 mt-5 rounded-lg text-white">Register</button>
            </div>
            <p class="text-white/50 text-center">Already have an account ? <a href="/login" class='text-white'>Login</a></p>
        </form>
    </div>
</div> 