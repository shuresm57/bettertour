<div class="flex flex-col flex-1">
  <nav class="flex items-center w-[90%] mx-auto mt-[3vh] px-10 py-10 rounded-lg outline-2 outline-offset-2 outline-blue-500">
    <a href="/" class="text-2xl font-bold">BetterTour</a>
    <div class="flex flex-1 justify-center gap-10">
      <a class="font-bold text-2xl" href="/">Home</a>
      <a class="font-bold text-2xl" href="/contact">Contact</a>
      <a class="font-bold text-2xl" href="/about">About</a>
    </div>
    <a href="/login" class="btn-primary">Login</a>
  </nav>

  <div class="flex-1 flex flex-col">
    <slot />
  </div>
</div>
