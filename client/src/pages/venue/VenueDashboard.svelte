<script>
  import Dashboard from '../../components/layout/Dashboard.svelte';
  import Overview from './Overview.svelte';
  import Shows from './Shows.svelte';
</script>

<Dashboard
  apiPath="/api/venue/dashboard"
  title="BetterTour | Venue Dashboard"
  entityKey="venue"
  ridersKey="techSpecs"
  profileConfig={{ apiPath: '/api/venue/profile', nameKey: 'venue_name', nameLabel: 'Venue name', description: 'Update your venue information.', hasAddress: true }}
  {Overview}
  {Shows}
/>
