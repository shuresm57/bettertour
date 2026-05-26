<script>
  import Dashboard from '../../components/layout/Dashboard.svelte';
  import Overview from './Overview.svelte';
  import Shows from './Shows.svelte';
  import Profile from './Profile.svelte';
</script>

<Dashboard
  apiPath="/api/artist/dashboard"
  title="BetterTour | Artist Dashboard"
  entityKey="artist"
  ridersKey="riders"
  {Overview}
  {Shows}
  {Profile}
/>
