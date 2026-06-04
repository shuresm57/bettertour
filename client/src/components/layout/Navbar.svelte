<script>
  import { userStore } from '../../stores/userStore.svelte.js';
  
  // if there is a logged in user check their type, if artist, go to the artist dashboard, if not go to the venue, fall back to login if none
  // derived so loginHref reactively updates if the user logs in or out and it is calculated by the state of userStore
  const loginHref = $derived(userStore.user ? (userStore.user.type === 'artist' ? '/dashboard/artist' : '/dashboard/venue') : '/login');
</script>

<div class="flex flex-col flex-1">
  <nav class="flex items-center w-[90%] mx-auto mt-[3vh] px-10 py-10 rounded-lg outline-2 outline-offset-2 outline-blue-500">
    <a href="/" class="flex items-center gap-2 text-2xl font-bold">
      <img src="/bt_favicon.svg" alt="BetterTour logo" class="w-8 h-8" />
      BetterTour
    </a>
    <div class="flex flex-1 justify-center gap-10">
      <a class="font-bold text-2xl" href="/">Home</a>
      <a class="font-bold text-2xl" href="/contact">Contact</a>
      <a class="font-bold text-2xl" href="/about">About</a>
    </div>
    <a href={loginHref} class="btn-primary">Login</a>
  </nav>

  <!-- <slot /> renders the child page content here so every page gets the navbar without duplicating it. --> 
  <div class="flex-1 flex flex-col">
    <slot />
  </div>
</div>
