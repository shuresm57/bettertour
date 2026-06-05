<script>
  import DashboardNav from './DashboardNav.svelte';
  import Profile from './Profile.svelte';
  import { onMount, onDestroy } from 'svelte';
  import { fetchGet } from '../../util/fetchUtil.js';
  import io from 'socket.io-client';
  import { toast } from 'svelte-sonner';
  import { userStore } from '../../stores/userStore.svelte.js';

  let { apiPath, title, entityKey, ridersKey, profileConfig, Overview, Shows } = $props();

  let activeSection = $state('overview');
  let entity = $state(null);
  let shows = $state([]);
  let riders = $state([]);
  let loaded = $state(false);
  let dashboardSocket;

  function parseShow (show) {
    return { ...show, schedule: typeof show.schedule === 'string' ? JSON.parse(show.schedule) : (show.schedule ?? {}) };
  }

  onMount(async () => {
    const res = await fetchGet(apiPath);
    if (!res?.ok) {
      loaded = true;
      return;
    }
    const { data } = await res.json();
    entity = data[entityKey];
    shows = data.shows.map(parseShow);
    riders = data[ridersKey] ?? [];
    loaded = true;

    if (entityKey === 'artist') {
      dashboardSocket = io(import.meta.env.VITE_BASE_URL, { withCredentials: true });
      dashboardSocket.on('connect', () => dashboardSocket.emit('client-joins', userStore.user.userId));
      dashboardSocket.on('server-sends-show-request', (data) => {
        shows = [...shows, parseShow(data)];
        toast.info('New show request received.');
      });
    }
  });

  onDestroy(() => {
    dashboardSocket?.disconnect();
  });
  
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

<div class="flex-1">
  <div class="pt-24 px-8 pb-8 max-w-5xl mx-auto">
    {#if !loaded}
      <p class="text-surface-400">Loading...</p>
    {:else if !entity}
      <p class="text-surface-400">Could not load data.</p>
    {:else if activeSection === 'overview'}
      <Overview {entity} {shows} {riders} />
    {:else if activeSection === 'shows'}
      <Shows {shows} />
    {:else if activeSection === 'profile'}
      <Profile {entity} {...profileConfig} />
    {/if}
  </div>
</div>

<DashboardNav {activeSection} onNavigate={(id) => (activeSection = id)} />
