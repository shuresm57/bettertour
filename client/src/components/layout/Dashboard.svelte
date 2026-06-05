<script>
  import DashboardNav from './DashboardNav.svelte';
  import Profile from './Profile.svelte';
  import { onMount, onDestroy } from 'svelte';
  import { fetchGet } from '../../util/fetchUtil.js';
  import io from 'socket.io-client';
  import { toast } from 'svelte-sonner';
  import { userStore } from '../../stores/userStore.svelte.js';


  // used as variables for the Dashboard component
  let { apiPath, title, entityKey, ridersKey, profileConfig, Overview, Shows } = $props();

  // the svelte runes $state is used to declare reactive variables
  let activeSection = $state('overview');
  let entity = $state(null);
  let shows = $state([]);
  let riders = $state([]);
  let loaded = $state(false);
  let dashboardSocket;

  // the spread operator of show is used to clone the object
  // then override the schedule field
  // if there is a schedule, parse it from JSON to an object - if none, default to empty object
  function parseShow (show) {
    return { ...show, schedule: show.schedule ? JSON.parse(show.schedule) : {} };
  }

  // when the component mounts, fetchGet the provided apiPath
  // if the response is missing or failed, mark as loaded and return early to prevent parsing bad data
  // to avoid crashing or processing data from a failed or missing network response.

  onMount(async () => {
    const res = await fetchGet(apiPath);
    if (!res?.ok) {
      // so if no data, it will show the could not load data
      loaded = true;
      return;
    }

    // we expect data from the fetch
    const { data } = await res.json();
    // entity either venue or artist
    entity = data[entityKey];
    shows = data.shows.map(parseShow);
    // if the array is empty, make and empty array - so we can add riders if empty
    riders = data[ridersKey] ?? [];
    loaded = true;

    // persistent socket so show requests are received regardless of which section is active
    if (entityKey === 'artist') {
      dashboardSocket = io(import.meta.env.VITE_BASE_URL, { withCredentials: true });
      dashboardSocket.on('connect', () => dashboardSocket.emit('client-joins', userStore.user.userId));
      dashboardSocket.on('server-sends-show-request', (data) => {
        shows = [...shows, { ...data, schedule: data.schedule ?? {} }];
        toast.info('New show request received.');
      });
    }
  });

  onDestroy(() => {
    dashboardSocket?.disconnect();
  });
  
</script>

<!--  svelte:head is used to set things such as CDN scripts and titles specific for pages --> 
<svelte:head>
  <title>{title}</title>
</svelte:head>

<div class="flex-1">
  <div class="pt-24 px-8 pb-8 max-w-5xl mx-auto">
    <!-- if loaded false, show loading -->
    {#if !loaded}
      <p class="text-surface-400">Loading...</p>
    <!-- if loaded but entity is null, data failed to load -->
    {:else if !entity}
      <p class="text-surface-400">Could not load data.</p>
    <!-- active section starts as overview -->
    <!-- render the Overview component with all data -->
    {:else if activeSection === 'overview'}
      <Overview {entity} {shows} {riders} />
    {:else if activeSection === 'shows'}
      <Shows {shows} />
    {:else if activeSection === 'profile'}
    <!-- render Profile with the entity and spread profileConfig as props. 
     because different entities (artist/venue) need different profile field configurations. -->
      <Profile {entity} {...profileConfig} />
    {/if}
  </div>
</div>
<!-- always rendered outside the conditionalsm the nav needs to be visible regardless of which section is active, and updating activeSection is what drives the section switching above. -->
<DashboardNav {activeSection} onNavigate={(id) => (activeSection = id)} />
