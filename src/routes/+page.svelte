<script lang="ts">
	export let data;
</script>

<h1 class="text-4xl font-bold mb-4">Welcome to My App</h1>

{#if data.isLoggedIn}
	<a href="/dashboard" class="btn btn-primary">Go to Dashboard</a>
{:else}
	<a href="/auth" class="btn btn-primary">Get Started</a>
{/if}
