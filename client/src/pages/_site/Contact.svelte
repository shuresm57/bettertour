  <script>
  import { toast } from 'svelte-sonner';
  import { fetchPost } from '../../util/fetchUtil.js';

  let name = $state('');
  let email = $state('');
  let message = $state('');
  let submitting = $state(false);

  async function handleContact() {
    if (!name || !email || !message) {
      toast.error('Please fill in all fields.');
      return;
    }
    submitting = true;
    const response = await fetchPost('/api/contact', { name, email, message });
    submitting = false;

    if (response?.ok) {
      toast.success('Message sent!');
      name = '';
      email = '';
      message = '';
    } else {
      toast.error('Failed to send message. Try again later.');
    }
  }
</script>
  
  <svelte:head>
    <title>BetterTour | Contact</title>
  </svelte:head>

  <div class="page-wrapper flex-col items-center gap-6">
    <div aria-hidden="true" class="pointer-events-none absolute inset-x-0 top-0 -z-10 transform-gpu overflow-hidden blur-3xl">
      <div style="clip-path: polygon(0% 20%, 60% 39%, 60% 0%, 76% 35%, 61% 62%, 44% 34%, 0% 80%);" class="relative left-[calc(20%-5rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[60deg] bg-gradient-to-tr from-[#2563eb] to-[#93c5fd] opacity-50"></div>
    </div>
    <div aria-hidden="true" class="pointer-events-none absolute inset-x-0 bottom-0 -z-10 transform-gpu overflow-hidden blur-3xl">
      <div style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)" class="relative left-[calc(50%+10rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#1d4ed8] to-[#3b82f6] opacity-20"></div>
    </div>
    <div class="text-center">
      <h1 class="text-5xl font-bold text-white">Get in touch</h1>
      <p class="text-gray-400 mt-2 text-lg">We love fan mail.</p>
    </div>
    <div class="card preset-filled-surface-100-900 rounded-xl border border-blue-500 p-8 w-full max-w-md space-y-4">
     

      <label class="label">
        <span class="text-blue-300 text-xl">Name</span>
        <input class="input border-blue-500 focus:ring-blue-500 text-xl" type="text" placeholder="Your name" bind:value={name}/>
      </label>

      <label class="label">
        <span class="text-blue-300 text-xl">Email</span>
        <input class="input border-blue-500 focus:ring-blue-500 text-xl" type="email" placeholder="you@example.com" bind:value={email}/>
      </label>

      <label class="label">
        <span class="text-blue-300 text-xl">Message</span>
        <textarea class="textarea border-blue-500 focus:ring-blue-500 text-xl" rows="4" placeholder="Your message..." bind:value={message}></textarea>
      </label>

      <button class="btn bg-blue-500 hover:bg-blue-400 text-white w-full font-bold py-4 text-xl" disabled={submitting} onclick={handleContact}>{submitting ? 'Sending...' : 'Send'}</button>
    </div>
  </div>