<script>
  import { Router, Route } from "svelte-routing";
  import { Toaster } from 'svelte-sonner';
  
  import Navbar from './components/Navbar.svelte'
  import LandingPage from './pages/_site/LandingPage.svelte'
  import About from './pages/_site/About.svelte'
  import Contact from './pages/_site/Contact.svelte'
  import Footer from './components/Footer.svelte'
  import Login from './pages/_site/Login.svelte'
  import ResetPassword from './pages/_site/ResetPassword.svelte'
  import PrivacyPolicy from './pages/_site/PrivacyPolicy.svelte'
  import PrivateRoute from './components/PrivateRoute.svelte';
  import ArtistDashboard from './pages/artist/ArtistDashboard.svelte';
  import VenueDashboard from './pages/venue/VenueDashboard.svelte';

  import { onMount } from 'svelte';
  import { fetchGet } from './util/fetchUtil.js';
  import { userStore } from './stores/userStore.svelte.js';

  onMount(async () => {
    const response = await fetchGet('/api/home');
    if (response?.ok) {
      const { data, type } = await response.json();
      userStore.user = { ...data, type };
    }
    userStore.authChecked = true;
  });

</script>

<Toaster position="bottom-right"></Toaster>

<main>
  <Router>

    <Route path="/">
      <Navbar><LandingPage /></Navbar>
    </Route>

    <Route path="/about">
      <Navbar><About /></Navbar>
    </Route>

    <Route path="/contact">
      <Navbar><Contact /></Navbar>
    </Route>

    <Route path="/login">
      <Navbar><Login /></Navbar>
    </Route>

    <Route path="/reset-password">
      <Navbar><ResetPassword /></Navbar>
    </Route>

    <Route path="/privacy-policy">
      <Navbar><PrivacyPolicy /></Navbar>
    </Route>

    <PrivateRoute path="/dashboard/artist">
      <ArtistDashboard />
    </PrivateRoute>

    <PrivateRoute path="/dashboard/venue">
      <VenueDashboard />
    </PrivateRoute>

  </Router>
</main>

<Footer />
