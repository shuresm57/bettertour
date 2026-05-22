<script>
  let { entity: venue } = $props();
</script>

<div class="card p-6">
  <h2 class="text-xl font-bold mb-1">{venue.name}</h2>
  <p class="text-sm text-surface-400 mb-6">{venue.bio}</p>
  <hr class="border-surface-700 mb-6" />
  <div class="flex flex-col gap-5">
    <div>
      <span class="text-xs text-surface-500 uppercase tracking-wide">Address</span>
      <p class="mt-1 text-sm">{venue.address}</p>
    </div>
    <div>
      <span class="text-xs text-surface-500 uppercase tracking-wide">Capacity</span>
      <p class="mt-1 text-sm">{venue.capacity} people</p>
    </div>
    <div>
      <span class="text-xs text-surface-500 uppercase tracking-wide">Contact email</span>
      <p class="mt-1">
        <a href="mailto:{venue.contact_email}" class="text-sm text-blue-400 hover:underline">
          {venue.contact_email}
        </a>
      </p>
    </div>
  </div>
</div>
