<script>
  import DashboardNav from './DashboardNav.svelte';
  import { onMount } from 'svelte';
  import { fetchGet } from '../util/fetchUtil.js';

  let { apiPath, title, entityKey, ridersKey, Overview, Shows, Profile } = $props();

  let activeSection = $state('overview');
  let entity = $state(null);
  let shows = $state([]);
  let riders = $state([]);

  onMount(async () => {
    const res = await fetchGet(apiPath);
    if (res?.ok) {
      const { data } = await res.json();
      entity = data[entityKey];
      shows = data.shows.map(show => ({ ...show, schedule: show.schedule ? JSON.parse(show.schedule) : {} }));
      riders = data[ridersKey] ?? [];
    }
  });
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

<div class="flex-1">
  <div class="pt-24 px-8 pb-8 max-w-5xl mx-auto">
    {#if !entity}
      <p class="text-surface-400">Could not load data.</p>
    {:else if activeSection === 'overview'}
      <Overview {entity} {shows} {riders} />
    {:else if activeSection === 'shows'}
      <Shows {shows} />
    {:else if activeSection === 'profile'}
      <Profile {entity} />
    {/if}
  </div>
</div>

<DashboardNav {activeSection} onNavigate={(id) => (activeSection = id)} />
