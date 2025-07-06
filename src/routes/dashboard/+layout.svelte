<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { enhance } from '$app/forms';
  import { createBrowserClient } from '@supabase/ssr';

  export let data;
  let supabase: ReturnType<typeof createBrowserClient>;
  let newName = '';
  const { subjects } = data;

  // Create Supabase client only after browser is ready
  onMount(() => {
    supabase = createBrowserClient(
      import.meta.env.VITE_PUBLIC_SUPABASE_URL,
      import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY
    );
  });

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) goto('/login');
    else console.error(error.message);
  };
</script>


<div class="flex h-screen">
  <!-- Sidebar -->
  <aside class="w-64 bg-gray-900 text-white p-4 flex flex-col">
    <h2 class="text-lg font-semibold mb-4">Subjects</h2>

    <ul class="flex-1 overflow-y-auto space-y-1">
      {#each subjects as subject}
        <li class="flex justify-between items-center hover:bg-gray-700 p-2 rounded">
          <span>{subject.name}</span>
          <form method="POST" use:enhance>
            <input type="hidden" name="id" value={subject.id} />
            <button name="delete" type="submit" class="text-red-400">🗑️</button>
          </form>
        </li>
      {/each}
    </ul>

    <form method="POST" use:enhance class="mt-4 flex gap-2">
      <input
        name="name"
        placeholder="New subject"
        bind:value={newName}
        class="flex-1 p-1 rounded text-black"
      />
      <button type="submit" name="add" class="bg-blue-600 px-2 rounded">Add</button>
    </form>

    <button class="mt-4 text-sm text-red-300 hover:underline" on:click={logout}>
      Logout
    </button>
  </aside>

  <!-- Main content -->
  <main class="flex-1 p-6 overflow-y-auto bg-gray-100 text-black">
    <slot />
  </main>
</div>
