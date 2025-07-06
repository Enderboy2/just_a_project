<!-- src/lib/Sidebar.svelte -->
<script>
  export let subjects = [];
  export let selectedSubject = '';
  export let onSelect = (subject) => {};
  export let isOpen = false;
  export let setIsOpen = () => {};

  function handleClick(subject) {
    onSelect(subject);
    if (window.innerWidth < 768) setIsOpen(false); // close on mobile
  }
</script>

<!-- Toggle button for mobile -->
<div class="md:hidden p-4">
  <button
    on:click={() => setIsOpen(!isOpen)}
    class="text-white bg-gray-800 p-2 rounded"
  >
    {#if isOpen} ✖ Close {:else} ☰ Menu {/if}
  </button>
</div>

<!-- Backdrop -->
{#if isOpen}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
    on:click={() => setIsOpen(false)}
  ></div>
{/if}

<!-- Sidebar -->
<aside
  class={`bg-gray-900 text-white w-64 py-6 px-4 fixed md:relative inset-y-0 left-0 z-40 transform ${
    isOpen ? 'translate-x-0' : '-translate-x-full'
  } md:translate-x-0 transition duration-200 ease-in-out`}
>
  <h2 class="text-xl font-semibold mb-4">Subjects</h2>
  <nav>
    {#each subjects as subject}
      <button
        on:click={() => handleClick(subject)}
        class={`block w-full text-left py-2 px-3 rounded mb-2 ${
          subject === selectedSubject ? 'bg-gray-700' : 'hover:bg-gray-700'
        }`}
      >
        {subject.name}
      </button>
    {/each}
  </nav>
</aside>
