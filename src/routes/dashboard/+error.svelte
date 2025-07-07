<script>
  export let error;
</script>

<h1 class="text-red-600 text-xl font-semibold">⚠️ Error</h1>

<p>{error?.message ?? 'Unknown error'}</p>

<pre>{JSON.stringify(error, null, 2)}</pre>
