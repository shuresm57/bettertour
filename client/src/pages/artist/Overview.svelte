<script>
  import { formatDateLong as formatDate, statusClass } from '../../util/showUtil.js';
  import Riders from '../../components/riders/Riders.svelte';

  let { entity: artist, shows, riders } = $props();

  const confirmed = $derived(shows.filter(show => show.status === 'confirmed'));
  const pending = $derived(shows.filter(show => show.status === 'pending'));
  const nextShow = $derived(confirmed[0] ?? shows[0]);

</script>

<div class="grid grid-cols-2 gap-5">

  <div class="card border border-surface-700 col-span-2 overflow-hidden">
    <div class="relative h-80 bg-surface-800 flex items-center justify-center">
      <img src="/SYL_presse_byHeyJackStudio_print_275.jpg" alt="Profile" class="absolute inset-0 w-full h-full object-cover" />
      <div class="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 to-transparent"></div>
      <div class="absolute inset-x-0 bottom-0 p-6 flex items-end justify-between gap-4">
        <div class="flex flex-col gap-0.5 min-w-0">
          <h2 class="text-xl font-bold text-white">{artist.artist_name}</h2>
          <p class="text-sm text-white/60">{artist.bio}</p>
          <a href="mailto:{artist.contact_email}" class="text-xs text-blue-300 hover:underline mt-1">{artist.contact_email}</a>
        </div>
      </div>
    </div>
  </div>

  <div class="card p-6 border border-blue-500/30 col-span-2">
    <h2 class="text-base font-semibold text-surface-300 mb-4">Next Show</h2>
    {#if nextShow}
      <div class="flex items-start justify-between gap-4">
        <div class="flex flex-col gap-1">
          <div class="flex items-center gap-2">
            <span class="font-semibold text-lg">{nextShow.event_name}</span>
            <span class="text-xs px-2 py-0.5 rounded-full font-medium {statusClass[nextShow.status] ?? 'bg-surface-700 text-surface-300'}">
              {nextShow.status}
            </span>
          </div>
          <span class="text-sm text-surface-400">{formatDate(nextShow.date)}</span>
          <span class="text-sm text-surface-400">{nextShow.contact_of_day}</span>
        </div>
      </div>
      <ul class="flex flex-col divide-y divide-surface-700 mt-5">
        {#each Object.entries(nextShow.schedule) as [key, value]}
          <li class="flex items-center justify-between py-3">
            <span class="text-surface-400 capitalize">{key.replace(/_/g, ' ')}</span>
            <span class="font-mono text-lg font-semibold text-surface-100">{value}</span>
          </li>
        {/each}
      </ul>
    {:else}
      <p class="text-sm text-surface-500">No upcoming shows.</p>
    {/if}
  </div>

  <div class="card p-6 border border-surface-700">
    <h2 class="text-base font-semibold text-surface-300 mb-4">
      Upcoming Shows
      <span class="ml-2 text-xs font-normal text-surface-500">{confirmed.length} confirmed</span>
    </h2>
    {#if confirmed.length > 0}
      <div class="flex flex-col">
        {#each confirmed.slice(0, 4) as show, i}
          <div class="py-3 {i !== 0 ? 'border-t border-surface-700' : ''}">
            <p class="font-medium text-sm truncate">{show.event_name}</p>
            <p class="text-xs text-surface-400 mt-0.5">{formatDate(show.date)}</p>
          </div>
        {/each}
      </div>
    {:else}
      <p class="text-sm text-surface-500">No confirmed shows yet.</p>
    {/if}
  </div>

  <div class="card p-6 border border-surface-700">
    <h2 class="text-base font-semibold text-surface-300 mb-4">
      Requests
      <span class="ml-2 text-xs font-normal text-surface-500">{pending.length} pending</span>
    </h2>
    {#if pending.length > 0}
      <div class="flex flex-col">
        {#each pending as show, i}
          <div class="py-3 {i !== 0 ? 'border-t border-surface-700' : ''}">
            <div class="flex items-center justify-between gap-2">
              <p class="font-medium text-sm truncate">{show.event_name}</p>
              <span class="text-xs px-2 py-0.5 rounded-full font-medium bg-yellow-500/15 text-yellow-400 shrink-0">pending</span>
            </div>
            <p class="text-xs text-surface-400 mt-0.5">{formatDate(show.date)}</p>
          </div>
        {/each}
      </div>
    {:else}
      <p class="text-sm text-surface-500">No pending requests.</p>
    {/if}
  </div>

  <div class="col-span-2">
    <Riders riders={riders} />
  </div>

</div>
