<script>
  import { Route } from 'svelte-routing';
  import PrivateRouteGuard from './PrivateRouteGuard.svelte';

  // Accepts a path prop from the parent, like /dashboard — this is the URL it should match.
  // in svelte 5 this is 
  export let path;
</script>
<!-- Renders a route for that path. let:params and let:location pull data out of the Route  -->
<Route {path} let:params let:location>
  <PrivateRouteGuard>
  <!-- this is the prop that PrivateRouteGuard gets -->
  {#snippet children()}
  <!-- params and location are forwarded if the page should need it -->
    <slot {params} {location} />
  {/snippet}
</PrivateRouteGuard>
</Route>