<script>
  import { Accordion } from '@skeletonlabs/skeleton-svelte';


  const imgSrcOne = 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/James_Hetfield_with_Metallica_--_7_October_2004.jpg/960px-James_Hetfield_with_Metallica_--_7_October_2004.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail';
  const imgSrcTwo = 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Annisette_Koppel.jpg/960px-Annisette_Koppel.jpg?utm_source=commons.wikimedia.org&utm_campaign=gallery&utm_content=thumbnail';

</script>

<svelte:head>
  <title>BetterTour | About</title>
</svelte:head>

<div class="relative isolate page">
  <div aria-hidden="true" class="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl">
    <div style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)" class="relative left-[calc(50%+5rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#1d4ed8] to-[#60a5fa] opacity-25"></div>
  </div>
  <div aria-hidden="true" class="pointer-events-none absolute inset-x-0 bottom-0 -z-10 transform-gpu overflow-hidden blur-3xl">
    <div style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)" class="relative left-[calc(50%-15rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#3b82f6] to-[#1e40af] opacity-20"></div>
  </div>

  <div class="flex justify-center items-center gap-30 mb-16">
    <img src={imgSrcOne} class="rounded-lg w-180 object-cover" alt="about" />
    <div class="w-120">
      <h2 class="text-4xl text-right">Plan tours and manage gigs without the administrative nightmare.</h2>
      <p class="text-2xl mt-12 text-justify">
        Here at <span class="text-blue-500">BetterTour</span>, we strive to connect you faster - no matter whether you are an
        artist or a venue.
      </p>
    </div>
  </div>

  <div class="flex justify-center items-center gap-30 ">
    <div class="w-120">
      <h3 class="text-4xl mb-6">FAQ</h3>
      <Accordion multiple class="ml-[-17px]">
        <Accordion.Item value="how">
          <h3 class="text-4xl">
            <Accordion.ItemTrigger class="underline underline-offset-8">How does it work?</Accordion.ItemTrigger>
          </h3>
          <Accordion.ItemContent class="text-2xl mt-12">
            Artists create a profile and list their availability. Venues post open dates and requirements.
            BetterTour matches them based on location, genre, and schedule, replacing endless back-and-forth
            emails with a single streamlined platform.
          </Accordion.ItemContent>
        </Accordion.Item>

        <Accordion.Item value="who">
          <h3 class="text-4xl">
            <Accordion.ItemTrigger class="underline underline-offset-8">Who is it for?</Accordion.ItemTrigger>
          </h3>
          <Accordion.ItemContent class="text-2xl mt-12">
            BetterTour is built for independent artists, bands, and touring musicians on one side
            and bars, clubs, festivals, and concert venues on the other. If you book gigs or play them,
            this is for you.
          </Accordion.ItemContent>
        </Accordion.Item>

        <Accordion.Item value="release">
          <h3 class="text-4xl">
            <Accordion.ItemTrigger class="underline underline-offset-8">When is the global release?</Accordion.ItemTrigger>
          </h3>
          <Accordion.ItemContent class="text-2xl mt-12">
            We are currently in closed exam beta. A global release is planned for Q3 2027 - starting with
            Scandinavia and then central Europe.
          </Accordion.ItemContent>
        </Accordion.Item>
      </Accordion>
    </div>
    <img src={imgSrcTwo} class="rounded-lg w-180 h-180 object-cover" alt="about" />
  </div>
</div>
