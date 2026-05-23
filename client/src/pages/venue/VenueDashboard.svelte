<script>
  import Dashboard from '../../components/Dashboard.svelte';
  import Overview from './Overview.svelte';
  import Shows from './Shows.svelte';
</script>

<Dashboard
  apiPath="/api/venue/dashboard"
  title="BetterTour | Venue Dashboard"
  entityKey="venue"
  ridersKey="techSpecs"
  {Overview}
  {Shows}
/>
