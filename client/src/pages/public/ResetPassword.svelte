<script>
    import { handleResetPassword } from '../../services/authService.js';

    const token = new URLSearchParams(window.location.search).get('token');

    let passwordOne = $state('');
    let passwordTwo = $state('');
</script>

<svelte:head>
    <title>BetterTour | Reset Password</title>
</svelte:head>

<div class="page-wrapper items-start justify-center">
  <div aria-hidden="true" class="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl">
    <div style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)" class="relative left-[calc(50%+5rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#1d4ed8] to-[#60a5fa] opacity-25"></div>
  </div>
  <div aria-hidden="true" class="pointer-events-none absolute inset-x-0 bottom-0 -z-10 transform-gpu overflow-hidden blur-3xl">
    <div style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)" class="relative left-[calc(50%-15rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#3b82f6] to-[#1e40af] opacity-20"></div>
  </div>
  <div class="card p-10 w-full max-w-lg space-y-6 outline outline-2 outline-blue-500 bg-blue-950/30 text-xl [&_.label-text]:text-xl [&_.input]:text-xl">
    <p class="text-2xl font-semibold text-center">Reset Password</p>
    <div class="space-y-4">
      <label class="label">
        <span class="label-text text-xl">New Password</span>
        <input class="input text-xl" type="password" bind:value={passwordOne} required />
      </label>
      <label class="label">
        <span class="label-text text-xl">Repeat Password</span>
        <input class="input text-xl" type="password" bind:value={passwordTwo} required />
      </label>
      <button class="btn-primary w-1/2 mx-auto block" type="button" onclick={() => handleResetPassword(token, passwordOne, passwordTwo)}>
        Reset Password
      </button>
    </div>
  </div>
</div>
