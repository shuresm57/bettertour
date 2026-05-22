<script>
  let { entity: artist } = $props();
</script>

<div class="card p-6">
  <h2 class="text-xl font-bold mb-1">{artist.artist_name}</h2>
  <p class="text-sm text-surface-400 mb-6">{artist.bio}</p>
  <hr class="border-surface-700 mb-6" />
  <div class="flex flex-col gap-4">
    <div>
      <span class="text-xs text-surface-500 uppercase tracking-wide">Contact email</span>
      <p class="mt-1">
        <a href="mailto:{artist.contact_email}" class="text-sm text-blue-400 hover:underline">
          {artist.contact_email}
        </a>
      </p>
    </div>
  </div>
</div>
