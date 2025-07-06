<script lang="ts">
	export let data;
	let newSubject = '';
	let editingId: string | null = null;
	let editingName = '';
</script>

<div class="flex h-screen">
	<!-- Sidebar -->
	<div class="w-64 bg-gray-900 text-white p-4 space-y-4">
		<h2 class="text-xl font-bold">Subjects</h2>

		{#each data.subjects as subject}
			<div class="flex justify-between items-center">
				{#if editingId === subject.id}
					<form method="POST" class="flex gap-2 w-full">
						<input type="hidden" name="id" value={subject.id} />
						<input
							name="name"
							bind:value={editingName}
							class="bg-gray-800 p-1 rounded w-full"
						/>
						<button formaction="?/renameSubject">✔</button>
					</form>
				{:else}
					<div class="flex justify-between items-center w-full">
						<span class="truncate">{subject.name}</span>
						<div class="flex gap-2">
							<button
								on:click={() => {
									editingId = subject.id;
									editingName = subject.name;
								}}
							>
								✏
							</button>
							<form method="POST">
								<input type="hidden" name="id" value={subject.id} />
								<button formaction="?/deleteSubject">🗑</button>
							</form>
						</div>
					</div>
				{/if}
			</div>
		{/each}

		<!-- Add Subject -->
		<form method="POST" class="flex gap-2 mt-4">
			<input
				name="name"
				placeholder="New subject"
				bind:value={newSubject}
				class="w-full p-2 rounded bg-gray-800 text-white"
			/>
			<button type="submit" formaction="?/addSubject">➕</button>
		</form>
	</div>

	<!-- Main content -->
	<div class="flex-1 p-10">
		<!-- This is where selected subject content would go -->
		<h1 class="text-2xl">Welcome to your Dashboard</h1>
	</div>
</div>
