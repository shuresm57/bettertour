<script>
  import Dashboard from '../../components/layout/Dashboard.svelte';
  import Overview from './Overview.svelte';
  import Shows from './Shows.svelte';
</script>

<Dashboard
  apiPath="/api/artist/dashboard"
  title="BetterTour | Artist Dashboard"
  entityKey="artist"
  ridersKey="riders"
  profileConfig={{ apiPath: '/api/artist/profile', nameKey: 'artist_name', nameLabel: 'Artist name', description: 'Update your public artist information.' }}
  {Overview}
  {Shows}
/>
