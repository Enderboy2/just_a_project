<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidate } from '$app/navigation';
	import { tick } from 'svelte';
	import type { SubmitFunction } from '@sveltejs/kit';

	export let data;

	let sidebarOpen = true;
	let adding = false;
	let inputRef: HTMLInputElement;
	let renameInputRef: HTMLInputElement | null = null;

	let menuOpenId: string | null = null;
	let renamingId: string | null = null;
	let selectedSubject: { name: string; fileCount: number; id: string } | null = null;

	// use local subjects for optimistic updates
	let subjects = [...data.subjects];
	function selectSubject(subject) {
	selectedSubject = selectedSubject?.id === subject.id ? null : subject;
	}

	function startAdding() {
		adding = true;
		tick().then(() => inputRef?.focus());
	}

	const handleAddEnhance: SubmitFunction = ({ result, formData }) => {
		const name = formData.get('name')?.toString().trim() || 'New Subject';

		const tempId = crypto.randomUUID();
		subjects = [...subjects, { id: tempId, name, fileCount: 0, userId: 'temp' }];

		result?.then(() => {
			adding = false;
			invalidate();
		});
	};

	const handleRenameEnhance: SubmitFunction = ({ result, formData }) => {
		const id = formData.get('id')?.toString();
		const name = formData.get('name')?.toString() || 'New Subject';

		if (id) {
			subjects = subjects.map((s) => (s.id === id ? { ...s, name } : s));
		}

		result?.then(() => {
			menuOpenId = null;
			renamingId = null;
			invalidate();
		});
	};

	const handleDeleteEnhance: SubmitFunction = ({ result, formData }) => {
		const id = formData.get('id')?.toString();

		if (id) {
			subjects = subjects.filter((s) => s.id !== id);
		}

		result?.then(() => {
			menuOpenId = null;
			invalidate();
		});
	};
</script>

<div class="flex h-screen">
	<!-- Sidebar -->
	<div class={`bg-[#FFFFFF] text-[#2D2D2D] p-2 w-64 transition-all duration-300 ${sidebarOpen ? 'block' : 'hidden'}`}>
		<!-- Sidebar header -->
		<div class="flex items-center justify-between mb-4">
			<button
				on:click={startAdding}
    			class="bg-[#887f99] hover:bg-[#887f99] text-white text-sm px-3 py-1 rounded"
			>
				+ New Subject
			</button>
			<button on:click={() => (sidebarOpen = false)} class="text-sm hover:underline">Hide</button>
		</div>

		<!-- Add Subject Form -->
		{#if adding}
			<form method="POST" action="?/add" use:enhance={handleAddEnhance} class="mb-2">
				<input
					name="name"
					bind:this={inputRef}
					class="w-full bg-transparent border-[#887f99] text-[#2D2D2D] placeholder-[#5c5470] focus:outline-none"
					placeholder="New Subject"
					autocomplete="off"
					on:keydown={(e) => {
						if (e.key === 'Enter' && !inputRef.value.trim()) {
							inputRef.value = 'New Subject';
						}
					}}
				/>
			</form>
		{/if}

		<!-- Subject list -->
		<ul class="space-y-1 overflow-y-auto h-screen pr-1">
			{#each subjects as subject (subject.id)}
				<li class="group flex items-center justify-between hover:bg-[#F3F0FF] p-2 rounded relative cursor-pointer"
				on:click={() => selectSubject(subject)}
				>

					<!-- Subject name or input if renaming -->
					{#if renamingId === subject.id}
						<form method="POST" action="?/rename" use:enhance={handleRenameEnhance} class="flex-grow mr-2">
							<input type="hidden" name="id" value={subject.id} />
							<input
								bind:this={renameInputRef}
								name="name"
								class="w-full bg-transparent border-b border-white focus:outline-none text-white"
								value={subject.name}
								on:blur={() => (renamingId = null)}
								on:keydown={(e) => {
									if (e.key === 'Enter') {
										if (!e.currentTarget.value.trim()) {
											e.currentTarget.value = 'New Subject';
										}
									}
								}}
							/>
						</form>
						{@html tick().then(() => renameInputRef?.focus())}
					{:else}
						<span class="truncate">{subject.name}</span>
					{/if}

					<!-- 3-dot menu -->
					<div class="relative group">
						<button
							class="invisible group-hover:visible px-2 text-white hover:text-gray-300"
							on:click={() => menuOpenId = menuOpenId === subject.id ? null : subject.id}
						>
							⋯
						</button>

						{#if menuOpenId === subject.id}
							<div class="absolute right-0 top-6 bg-[#2e2938] text-white border border-gray-700 rounded shadow z-10 w-28">
								<!-- Rename trigger -->
								<button
									type="button"
									class="w-full text-left px-3 py-1 hover:bg-gray-700"
									on:click={() => {
										renamingId = subject.id;
										menuOpenId = null;
									}}
								>
									Rename
								</button>

								<!-- Delete -->
								<form method="POST" action="?/delete" use:enhance={handleDeleteEnhance}>
									<input type="hidden" name="id" value={subject.id} />
									<button
										type="submit"
										class="w-full text-left text-red-400 px-3 py-1 hover:bg-gray-700 hover:text-red-500"
									>
										Delete
									</button>
								</form>
							</div>
						{/if}
					</div>
				</li>
			{/each}
		</ul>
	</div>

	<!-- Sidebar Toggle -->
	{#if !sidebarOpen}
		<button
			class="absolute top-2 left-2 text-sm bg-[#2e2938] text-white px-3 py-1 rounded"
			on:click={() => (sidebarOpen = true)}
		>
			☰
		</button>
	{/if}

	<!-- Main content -->
	<div class="flex-1 bg-[#e2ddeb] text-[#2e2938] p-6">
		{#if selectedSubject}
			<div class="flex flex-col items-center text-center">
				<h1 class="text-2xl font-bold mb-2">{selectedSubject.name}</h1>
				<p class="mb-6">{selectedSubject.fileCount} files</p>
			</div>
		{:else}
			<h1 class="text-2xl font-bold mb-2">Welcome</h1>
			<p class="mb-6">Select or manage your subjects from the sidebar.</p>
		{/if}
	</div>


</div>
