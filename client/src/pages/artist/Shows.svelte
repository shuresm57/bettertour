<script>
  import { onMount, onDestroy } from 'svelte';
  import io from 'socket.io-client';
  import { toast } from 'svelte-sonner';
  import ShowForm from '../../components/shows/ShowForm.svelte';
  import { formatDate, statusClass } from '../../util/showUtil.js';
  import { userStore } from '../../stores/userStore.svelte.js';
  import { fetchPost, fetchPut, fetchDelete } from '../../util/fetchUtil.js';

  let { shows: initialShows } = $props();

  let shows = $state([...initialShows]);
  let socket;
  let showForm = $state(false);
  let selectedShow = $state(null);
  let editingShow = $state(false);

  onMount(() => {
    socket = io(import.meta.env.VITE_BASE_URL, { withCredentials: true });

    socket.on('connect', () => {
      socket.emit('client-joins', userStore.user.userId);
    });

    socket.on('server-sends-show-request', (data) => {
      shows = [...shows, data];
      toast.info('New show request received.');
    });

    socket.on('server-sends-acceptance', (data) => {
      const show = shows.find(show => show.show_id === data.show_id);
      shows = shows.map(s => s.show_id === data.show_id ? { ...s, status: 'confirmed' } : s);
      if (show) toast.success(`${show.event_name ?? 'Show'} confirmed!`);
    });

    socket.on('server-sends-show-update', (data) => {
      shows = shows.map(s => s.show_id === data.show_id ? { ...s, ...data } : s);
      if (selectedShow?.show_id === data.show_id) selectedShow = { ...selectedShow, ...data };
      toast.info(`${data.event_name ?? 'Show'} was updated.`);
    });
  });

  onDestroy(() => {
    socket.off('connect');
    socket.off('server-sends-show-request');
    socket.off('server-sends-acceptance');
    socket.off('server-sends-show-update');
    socket.disconnect();
  });

  async function handleSubmit(formData) {
    if (!formData) {
      showForm = false; return;
    }
    const response = await fetchPost('/api/artist/shows', {
      event_name: formData.event_name,
      date: formData.date,
      contact_of_day: formData.contact_of_day,
      schedule: formData.schedule
    });
    const { data } = await response.json();
    shows = [...shows, data];
    showForm = false;
  }

  function acceptShow(show) {
    socket.emit('artist-accepts-show', {
      venueId: show.venueId,
      artistId: userStore.user.userId,
      show_id: show.show_id
    });
  }

  async function handleEdit(formData) {
    if (!formData) { 
      editingShow = false; return; 
    }
    const res = await fetchPut(`/api/artist/shows/${selectedShow.show_id}`, {
      event_name: formData.event_name,
      date: formData.date,
      contact_of_day: formData.contact_of_day,
      schedule: formData.schedule,
      status: selectedShow.status
    });
    if (res?.ok) {
      const updated = { ...selectedShow, event_name: formData.event_name, date: formData.date, contact_of_day: formData.contact_of_day, schedule: formData.schedule };
      shows = shows.map(s => s.show_id === selectedShow.show_id ? updated : s);
      selectedShow = updated;
      editingShow = false;
    }
  }

  async function handleDelete() {
    const res = await fetchDelete(`/api/artist/shows/${selectedShow.show_id}`);
    if (res?.ok) {
      shows = shows.filter(s => s.show_id !== selectedShow.show_id);
      selectedShow = null;
    }
  }
</script>

<div class="card p-6">
  <div class="flex items-center justify-between mb-1">
    <h2 class="text-xl font-bold">Upcoming Shows</h2>
    <button onclick={() => (showForm = !showForm)} class="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-surface-800 hover:bg-surface-700 text-surface-300 hover:text-surface-100 transition-colors">
      Add Show
    </button>
  </div>
  <p class="text-sm text-surface-400 mb-6">Your confirmed and pending bookings.</p>

  {#if showForm}
    <ShowForm onSubmit={handleSubmit} />
  {/if}

  <div class="flex flex-col">
    {#each shows as show, i}
      <div
        class="py-4 cursor-pointer hover:bg-surface-800/40 rounded-lg px-2 -mx-2 transition-colors {i !== 0 ? 'border-t border-surface-700' : ''}"
        onclick={() => selectedShow = show}
      >
        <div class="flex items-start justify-between gap-4">
          <div class="flex flex-col gap-1 min-w-0">
            <div class="flex items-center gap-2">
              <span class="font-semibold truncate">{show.event_name ?? 'Incoming request'}</span>
              <span class="text-xs px-2 py-0.5 rounded-full font-medium shrink-0 {statusClass[show.status] ?? 'bg-surface-700 text-surface-300'}">
                {show.status}
              </span>
            </div>
            <span class="text-sm text-surface-400">{formatDate(show.date)}</span>
            <span class="text-sm text-surface-400">{show.contact_of_day ?? ''}</span>
          </div>
          <div class="flex items-center gap-2 shrink-0">
            {#if show.status === 'pending' && show.venueId}
              <button
                onclick={(event) => { event.stopPropagation(); acceptShow(show); }}
                class="text-xs font-medium px-3 py-1.5 rounded-lg bg-green-500/15 hover:bg-green-500/25 text-green-400 transition-colors"
              >
                Accept
              </button>
            {/if}
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>

{#if selectedShow}
  <div class="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onclick={() => { selectedShow = null; editingShow = false; }}></div>
  <div class="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
    <div class="card bg-surface-900 border border-surface-700 p-8 w-full max-w-2xl space-y-4 pointer-events-auto">
      {#if editingShow}
        <h2 class="text-xl font-bold">Edit Show</h2>
        <ShowForm onSubmit={handleEdit} initialData={selectedShow} />
      {:else}
        <h2 class="text-xl font-bold">{selectedShow.event_name ?? 'Show'}</h2>
        <p class="text-sm text-surface-400">{formatDate(selectedShow.date)}</p>
        {#if selectedShow.contact_of_day}
          <h1 class="text-3xl font-bold">Contact of day</h1>
          <p class="text-sm text-surface-400">{selectedShow.contact_of_day}</p>
        {/if}
        <h1 class="text-3xl font-bold">Schedule</h1>
        <ul class="flex flex-col divide-y divide-surface-700">
          {#each Object.entries(selectedShow.schedule) as [key, value]}
            <li class="flex items-center justify-between py-3">
              <span class="text-surface-400 capitalize">{key.replaceAll('_', ' ')}</span>
              <span class="font-mono font-semibold text-surface-100">{value}</span>
            </li>
          {/each}
        </ul>
        <div class="flex gap-2">
          {#if !selectedShow.venueId}
            <button onclick={() => (editingShow = true)} class="flex-1 text-sm font-medium px-4 py-2 rounded-lg bg-blue-500/15 hover:bg-blue-500/25 text-blue-400 transition-colors">
              Edit
            </button>
          {/if}
          <button onclick={handleDelete} class="flex-1 text-sm font-medium px-4 py-2 rounded-lg bg-red-500/15 hover:bg-red-500/25 text-red-400 transition-colors">
            Delete
          </button>
          <button onclick={() => selectedShow = null} class="flex-1 text-sm font-medium px-4 py-2 rounded-lg bg-surface-800 hover:bg-surface-700 text-surface-300 hover:text-surface-100 transition-colors">
            Close
          </button>
        </div>
      {/if}
    </div>
  </div>
{/if}
