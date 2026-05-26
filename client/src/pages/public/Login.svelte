<script>
  import { Tabs } from '@skeletonlabs/skeleton-svelte';
  import { handleLogin, handleSignup, handlePasswordRecovery } from '../../util/authService.js';

  let view = $state('login');

  let emailInput = $state('');
  let passwordInput = $state('');

  let signupEmail = $state('');
  let signupPasswordOne = $state('');
  let signupPasswordTwo = $state('');
  let signupName = $state('');
  let signupType = $state('artist');

  let recoveryEmail = $state('');

  let loginSubmitting = $state(false);
  let signupSubmitting = $state(false);
  let recoverySubmitting = $state(false);

  async function onLogin() {
    loginSubmitting = true;
    await handleLogin(emailInput, passwordInput);
    loginSubmitting = false;
  }

  async function onSignup() {
    signupSubmitting = true;
    await handleSignup(signupEmail, signupPasswordOne, signupPasswordTwo, signupName, signupType, showLogin);
    signupSubmitting = false;
  }

  async function onRecovery() {
    recoverySubmitting = true;
    await handlePasswordRecovery(recoveryEmail, showLogin);
    recoverySubmitting = false;
  }

  function showLogin() { view = 'login'; }
</script>

<svelte:head>
  <title>BetterTour | {view === 'recovery' ? 'Recover Password' : view === 'signup' ? 'Sign Up' : 'Login'}</title>
</svelte:head>

<div class="page-wrapper items-start justify-center">
  <div aria-hidden="true" class="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl">
    <div style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)" class="relative left-[calc(50%+5rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#1d4ed8] to-[#60a5fa] opacity-25"></div>
  </div>
  <div aria-hidden="true" class="pointer-events-none absolute inset-x-0 bottom-0 -z-10 transform-gpu overflow-hidden blur-3xl">
    <div style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)" class="relative left-[calc(50%-15rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#3b82f6] to-[#1e40af] opacity-20"></div>
  </div>
  <div class="card p-10 w-full max-w-lg space-y-6 outline outline-2 outline-blue-500 bg-blue-950/30 text-xl [&_.label-text]:text-xl [&_.input]:text-xl">
    <Tabs value={view} onValueChange={(event) => (view = event.value)}>
      <Tabs.List class="justify-center">
        <Tabs.Trigger value="login" class="text-2xl">Login</Tabs.Trigger>
        <Tabs.Trigger value="signup" class="text-2xl">Sign Up</Tabs.Trigger>
        <Tabs.Trigger value="recovery" class="text-2xl">Recover</Tabs.Trigger>
        <Tabs.Indicator />
      </Tabs.List>

      <Tabs.Content value="login">
        <div class="space-y-4 mt-4">
          <label class="label">
            <span class="label-text text-xl">Email</span>
            <input class="input text-xl" type="email" bind:value={emailInput} required />
          </label>
          <label class="label">
            <span class="label-text text-xl">Password</span>
            <input class="input text-xl" type="password" bind:value={passwordInput} required />
          </label>
          <button class="btn-primary w-1/2 mx-auto block" type="button" onclick={onLogin} disabled={loginSubmitting}>
            {loginSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </div>
      </Tabs.Content>

      <Tabs.Content value="signup">
        <div class="space-y-4 mt-4">
          <Tabs value={signupType} onValueChange={(event) => (signupType = event.value)}>
            <Tabs.List class="justify-center">
              <Tabs.Trigger value="artist" class="text-xl">Artist</Tabs.Trigger>
              <Tabs.Trigger value="venue" class="text-xl">Venue</Tabs.Trigger>
              <Tabs.Indicator />
            </Tabs.List>
          </Tabs>
          <label class="label">
            <span class="label-text text-xl">{signupType === 'artist' ? 'Artist name' : 'Venue name'}</span>
            <input class="input text-xl" type="text" bind:value={signupName} required />
          </label>
          <label class="label">
            <span class="label-text text-xl">Email</span>
            <input class="input text-xl" type="email" bind:value={signupEmail} required />
          </label>
          <label class="label">
            <span class="label-text text-xl">Password</span>
            <input class="input text-xl" type="password" bind:value={signupPasswordOne} required />
          </label>
          <label class="label">
            <span class="label-text text-xl">Repeat Password</span>
            <input class="input text-xl" type="password" bind:value={signupPasswordTwo} required />
          </label>
          <button class="btn-primary w-1/2 mx-auto block" type="button" onclick={onSignup} disabled={signupSubmitting}>
            {signupSubmitting ? 'Creating account...' : 'Create Account'}
          </button>
        </div>
      </Tabs.Content>

      <Tabs.Content value="recovery">
        <div class="space-y-4 mt-4">
          <label class="label">
            <span class="label-text text-xl">Email</span>
            <input class="input text-xl" type="email" bind:value={recoveryEmail} required />
          </label>
          <button class="btn-primary w-1/2 mx-auto block" type="button" onclick={onRecovery} disabled={recoverySubmitting}>
            {recoverySubmitting ? 'Sending...' : 'Send reset link'}
          </button>
        </div>
      </Tabs.Content>
    </Tabs>
    </div>
</div>
