<script>
  import { handleLogout } from '../../services/authService.js';


  // handles the active section and navigate callback from the parent Dashboard
  let { activeSection, onNavigate } = $props();

  // an array defining each nav button, 'id' is used as an identifier, the label is what the user sees
  const navItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'shows', label: 'Shows' },
    { id: 'profile', label: 'Profile' }
  ];
</script>

<nav class="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 px-3 py-2 rounded-full border border-surface-700 bg-surface-900/80 backdrop-blur-md shadow-xl">
<!-- loop over each item (item.id) is the key so Svelte can track each item -->
<!-- keys let Svelte track exactly which item is which, so it only updates what changed. -->
  {#each navItems as item, i (item.id)}
    {#if i === navItems.length - 1}
    <!-- inserts a visual divider line before the last nav item -->
      <div class="w-px h-5 bg-surface-700 mx-1"></div>
    {/if}
    <!-- this button updates the activeSection -->
    <button
      onclick={() => onNavigate(item.id)}
      class="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors
        {activeSection === item.id ? 'bg-blue-500/15 text-blue-400' : 'text-surface-400 hover:text-surface-100 hover:bg-surface-800'}"
    >
      {item.label}
    </button>
  {/each}
</nav>
<!-- logo fixed to the top left -->
<a href="/" class="fixed top-6 left-6 z-50 flex items-center gap-2 px-3 py-2 rounded-full border border-surface-700 bg-surface-900/80 backdrop-blur-md shadow-xl">
  <img src="/bt_favicon.svg" alt="BetterTour logo" class="w-5 h-5" />
</a>

<!-- logs out -->
<button
  onclick={handleLogout}
  class="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border border-surface-700 bg-surface-900/80 backdrop-blur-md shadow-xl transition-colors text-surface-400 hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/10"
>
  Logout
</button>
