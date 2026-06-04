<script>

  // Imports navigate for redirecting, and the user store which holds auth state.

  import { navigate } from 'svelte-routing';
  import { userStore } from '../../stores/userStore.svelte.js';

  // Receives the children snippet that was passed in from PrivateRoute.

  let { children } = $props();

  // runs reactively whenever the store changes.
  // if no user, redirect to login page

  $effect(() => {
    if (userStore.authChecked && !userStore.user) {
      navigate('/login', { replace: true });
    }
  });
</script>

<!-- but if authchecked ok and there is a user, render children, in this case the page behind the Guard -->

{#if userStore.authChecked && userStore.user}
  {@render children()}
{/if}
