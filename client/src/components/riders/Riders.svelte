<script>
  import { fetchPost, fetchDelete } from '../../util/fetchUtil.js';

  let { riders: initialRiders } = $props();
  let riders = $state([...initialRiders]);
  let showForm = $state(false);
  let newName = $state('');
  let newUrl = $state('');

  async function addRider() {
    const res = await fetchPost('/api/riders', { riderName: newName, riderUrl: newUrl });

    if (res?.ok) {
      const { id } = (await res.json()).data;
      riders.push({ id, name: newName, url: newUrl });
      newName = '';
      newUrl = '';
      showForm = false;
    }
  }

  async function deleteRider(rider) {
    const res = await fetchDelete(`/api/riders/${rider.id}`);

    if (res?.ok) {
      riders = riders.filter((r) => r.id !== rider.id);
    }
  }
</script>

<div class="card p-6">
  <div class="flex items-center justify-between mb-6">
    <div>
      <h2 class="text-xl font-bold">Riders</h2>
      <p class="text-sm text-surface-400 mt-1">Your current rider documents.</p>
    </div>
    <button onclick={() => (showForm = !showForm)} class="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-surface-800 hover:bg-surface-700 text-surface-300 hover:text-surface-100 transition-colors">
      Add Rider
    </button>
  </div>

  {#if showForm}
    <div class="flex gap-2 mb-4">
      <input bind:value={newName} placeholder="Rider name" class="input text-sm px-3 py-1.5 rounded-lg flex-1" />
      <input bind:value={newUrl} placeholder="Document URL" class="input text-sm px-3 py-1.5 rounded-lg flex-1" />
      <button onclick={addRider} class="text-xs font-medium px-3 py-1.5 rounded-lg bg-blue-500/15 hover:bg-blue-500/25 text-blue-400 transition-colors">
        Save
      </button>
    </div>
  {/if}

  {#if riders.length > 0}
    <ul class="flex flex-col divide-y divide-surface-700">
      {#each riders as rider}
        <li class="flex items-center justify-between py-4 group">
          <a
            href={rider.url}
            target="_blank"
            rel="noopener noreferrer"
            class="font-medium group-hover:text-blue-400 transition-colors"
          >{rider.name}</a>
          <button
            onclick={() => deleteRider(rider)}
            class="text-xs font-medium px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
          >
            Delete
          </button>
        </li>
      {/each}
    </ul>
  {:else}
    <p class="text-sm text-surface-500">No riders uploaded yet.</p>
  {/if}
</div>
