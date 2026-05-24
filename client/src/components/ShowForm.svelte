<script>
  import ShowDatePicker from './ShowDatePicker.svelte';

  let { onSubmit, artistEmailField = false, initialData = null } = $props();

  let newEventName = $state(initialData?.event_name ?? '');
  let newDate = $state(initialData?.date ?? '');
  let newContact = $state(initialData?.contact_of_day ?? '');
  let newArtistEmail = $state('');
  let scheduleEntries = $state(
    initialData?.schedule && Object.keys(initialData.schedule).length > 0
      ? Object.entries(initialData.schedule).map(([key, value]) => ({ key, value }))
      : [{ key: '', value: '' }]
  );

  function buildSchedule() {
    const schedule = {};
    for (const entry of scheduleEntries) {
      if (entry.key.trim()) schedule[entry.key.trim()] = entry.value.trim();
    }
    return Object.keys(schedule).length > 0 ? schedule : null;
  }

  function submit() {
    onSubmit({
      event_name: newEventName,
      date: newDate,
      contact_of_day: newContact,
      schedule: buildSchedule(),
      artistEmail: newArtistEmail || null
    });
    newEventName = '';
    newDate = '';
    newContact = '';
    newArtistEmail = '';
    scheduleEntries = [{ key: '', value: '' }];
  }
</script>

<div class="flex flex-col gap-3 mb-6 p-4 bg-surface-800/50 rounded-lg">
  <input bind:value={newEventName} placeholder="Event name" class="input text-sm px-3 py-1.5 rounded-lg w-full" />

  <ShowDatePicker onSelect={(date) => { newDate = date; }} />

  <input bind:value={newContact} placeholder="Contact of day (name + phone)" class="input text-sm px-3 py-1.5 rounded-lg w-full" />

  {#if artistEmailField}
    <input bind:value={newArtistEmail} placeholder="Send request to artist email (optional)" class="input text-sm px-3 py-1.5 rounded-lg w-full" />
  {/if}

  <div class="flex flex-col gap-2">
    <span class="text-xs text-surface-400 font-medium">Schedule</span>
    {#each scheduleEntries as entry, i (i)}
      <div class="flex gap-2 items-center">
        <input bind:value={entry.key} placeholder="e.g. get-in" class="input text-sm px-3 py-1.5 rounded-lg flex-1" />
        <input bind:value={entry.value} placeholder="e.g. 19:00" class="input text-sm px-3 py-1.5 rounded-lg flex-1" />
        {#if scheduleEntries.length > 1}
          <button onclick={() => scheduleEntries.splice(i, 1)} class="text-surface-500 hover:text-red-400 transition-colors px-1">×</button>
        {/if}
      </div>
    {/each}
    <button onclick={() => scheduleEntries.push({ key: '', value: '' })} class="self-start text-xs text-surface-400 hover:text-surface-200 transition-colors">
      + Add row
    </button>
  </div>

  <div class="flex justify-end gap-2">
    <button onclick={() => onSubmit(null)} class="text-xs font-medium px-3 py-1.5 rounded-lg bg-surface-700 hover:bg-surface-600 text-surface-300 transition-colors">
      Cancel
    </button>
    <button onclick={submit} class="text-xs font-medium px-3 py-1.5 rounded-lg bg-blue-500/15 hover:bg-blue-500/25 text-blue-400 transition-colors">
      Save
    </button>
  </div>
</div>
