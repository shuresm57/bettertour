<script>
  import { navigate } from 'svelte-routing';
  import { userStore } from '../../stores/userStore.svelte.js';

  let { children } = $props();

  $effect(() => {
    if (userStore.authChecked && !userStore.user) {
      navigate('/login', { replace: true });
    }
  });
</script>

{#if userStore.authChecked && userStore.user}
  {@render children()}
{/if}
