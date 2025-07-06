<script lang="ts">
  import { supabase } from '$lib/supabaseClient';
  import { Auth } from '@supabase/auth-ui-svelte';
  import { ThemeSupa } from '@supabase/auth-ui-shared';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  let checkedSession = false;

  onMount(async () => {
    const { data: { session } } = await supabase.auth.getSession();

    if (session) {
      goto('/dashboard');
    } else {
      checkedSession = true;
    }
  });

  supabase.auth.onAuthStateChange((_event, session) => {
    if (session) {
      goto('/dashboard');
    }
  });

  async function signOut() {
    await supabase.auth.signOut();
    location.reload(); // force clear memory
  }
</script>


<section class="h-screen flex flex-col justify-center items-center">
  {#if checkedSession}
    <Auth
      supabaseClient={supabase}
      appearance={{ theme: ThemeSupa }}
      providers={['google']}
      redirectTo="http://localhost:5173/dashboard"
    />

    <button
      class="mt-4 p-2 bg-red-500 text-white rounded hover:bg-red-600"
      on:click={signOut}>
      Force Sign Out
    </button>
  {/if}
</section>
