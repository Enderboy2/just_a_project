<!-- src/routes/+page.svelte -->
<script>
	import { goto } from '$app/navigation';

	function handleGetStarted() {
		goto('/auth');
	}
</script>

<section class="flex h-screen flex-col items-center justify-center bg-white text-center">
	<h1 class="mb-4 text-4xl font-bold">Welcome to My App</h1>
	<p class="mb-6 text-gray-600">Learn smarter. Study easier.</p>
	<button
		on:click={handleGetStarted}
		class="rounded bg-blue-600 px-6 py-2 text-white transition hover:bg-blue-700"
	>
		Get Started
	</button>
</section>
