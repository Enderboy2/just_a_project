<!-- src/routes/+layout.svelte -->
<script>
  import '@fontsource/inter/400.css';
  import '@fontsource/inter/500.css';
  import '@fontsource/inter/700.css';
  import '../app.css';
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabaseClient';
  import { writable } from 'svelte/store';

  export const session = writable(null);

  onMount(async () => {
    const { data: { session: s } } = await supabase.auth.getSession();
    session.set(s);

    supabase.auth.onAuthStateChange((_event, s) => {
      session.set(s);
    });
  });
</script>

<slot />
