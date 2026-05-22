<script>
  import { onMount } from 'svelte';
  import io from 'socket.io-client';
  import { toast } from 'svelte-sonner';
  import ShowForm from '../../components/ShowForm.svelte';
  import { formatDate, statusClass } from '../../util/showUtil.js';
  import { userStore } from '../../stores/userStore.svelte.js';
  import { fetchPost } from '../../util/fetchUtil.js';

  let { shows: initialShows } = $props();

  let shows = $state([...initialShows]);
  let socket;
  let showForm = $state(false);

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
  });

  async function handleSubmit(formData) {
    if (!formData) { showForm = false; return; }
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
      <div class="py-4 {i !== 0 ? 'border-t border-surface-700' : ''}">
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
              <button onclick={() => acceptShow(show)} class="text-xs font-medium px-3 py-1.5 rounded-lg bg-green-500/15 hover:bg-green-500/25 text-green-400 transition-colors">
                Accept
              </button>
            {/if}
          </div>
        </div>
        {#if show.schedule}
          <div class="mt-3 flex flex-wrap gap-x-4 gap-y-1">
            {#each Object.entries(show.schedule) as [key, value]}
              <div class="flex gap-1 text-sm">
                <span class="text-surface-500 capitalize">{key.replaceAll('_', ' ')}:</span>
                <span class="text-surface-200">{value}</span>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    {/each}
  </div>
</div>
