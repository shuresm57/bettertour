<script>
  import Dashboard from '../../components/layout/Dashboard.svelte';
  import Overview from './Overview.svelte';
  import Shows from './Shows.svelte';
  import Profile from './Profile.svelte';
</script>

<Dashboard
  apiPath="/api/venue/dashboard"
  title="BetterTour | Venue Dashboard"
  entityKey="venue"
  ridersKey="techSpecs"
  {Overview}
  {Shows}
  {Profile}
/>
