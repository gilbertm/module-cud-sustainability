# Carousel Overlay Templates

Use any one full block below as the content of the carousel overlay field.
Each block is complete and intended to be pasted as one whole overlay.

Rendering note:
- The safest option for field content is plain HTML.
- Avoid module-specific Twig variables such as `research_link_clusters` in field content.
- If Twig is supported in your rendering pipeline, keep it minimal and generic.
- These examples therefore use plain text labels and simple `#` links so they render safely as pasted content.

## Option 1 - Original Layout (Left Content)

<div class="mx-auto flex h-full w-full max-w-7xl flex-col px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
  <div class="flex justify-end">
    <p class="inline-flex rounded-full border border-white/35 bg-black/35 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-100 sm:px-3 sm:text-xs sm:tracking-[0.24em]">
      Upper
    </p>
  </div>

  <div class="title-description flex flex-1 items-center pt-4 sm:pt-0">
    <div class="cud-carousel-text max-w-[92vw] sm:max-w-3xl lg:max-w-4xl">
      <h3 class="cud-carousel-title max-w-[16ch] text-[clamp(1.75rem,5vw,4.5rem)] leading-[0.95] sm:max-w-[14ch]">Mapping Future Research Pathways</h3>
      <p class="cud-carousel-description mt-3 max-w-[62ch] text-sm leading-6 sm:text-base sm:leading-7">A full overlay block rendered as one unit from the field.</p>

      <div class="mt-5 flex flex-wrap items-center gap-2.5 sm:mt-8 sm:gap-3">
        <a href="#" class="inline-flex min-h-10 items-center gap-2 rounded-md bg-[#b13634] px-3.5 py-2 text-[11px] font-semibold leading-none text-white shadow-[0_10px_24px_rgba(177,54,52,0.32)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#982b2a] hover:shadow-[0_14px_28px_rgba(152,43,42,0.36)] focus:outline-none focus:ring-2 focus:ring-[#b13634]/45 focus:ring-offset-2 focus:ring-offset-transparent sm:px-4 sm:text-[12px]">
          <span>Explore Projects</span>
          <svg class="h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M3.75 10h11" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            <path d="m10 5 5 5-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </a>

        <a href="#" class="inline-flex min-h-10 items-center gap-2 rounded-md border border-white/0 px-1 py-2 text-[11px] font-medium leading-none text-white transition-all duration-200 hover:border-white/20 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/40 focus:ring-offset-2 focus:ring-offset-transparent sm:text-[12px]">
          <span>View publications</span>
          <svg class="h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M3.75 10h11" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            <path d="m10 5 5 5-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </a>
      </div>
    </div>
  </div>
</div>

## Option 2 - Mid Overlay Handling (Centered Content)

<div class="mx-auto flex h-full w-full max-w-7xl flex-col px-4 py-4 text-center sm:px-6 sm:py-6 lg:px-8 lg:py-8">
  <div class="flex justify-center">
    <p class="inline-flex rounded-full border border-white/35 bg-black/35 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-100 sm:px-3 sm:text-xs sm:tracking-[0.24em]">
      Upper
    </p>
  </div>

  <div class="title-description flex flex-1 items-center justify-center pt-4 sm:pt-0">
    <div class="cud-carousel-text mx-auto max-w-[94vw] sm:max-w-3xl">
      <h3 class="cud-carousel-title mx-auto max-w-[16ch] text-[clamp(1.65rem,4.6vw,4.25rem)] leading-[0.98]">Mapping Future Research Pathways</h3>
      <p class="cud-carousel-description mx-auto mt-3 max-w-[58ch] text-sm leading-6 sm:text-base sm:leading-7">A centered full-overlay variant for balanced hero presentation.</p>

      <div class="mt-5 flex flex-wrap items-center justify-center gap-2.5 sm:mt-8 sm:gap-3">
        <a href="#" class="inline-flex min-h-10 items-center gap-2 rounded-md bg-[#b13634] px-3.5 py-2 text-[11px] font-semibold leading-none text-white shadow-[0_10px_24px_rgba(177,54,52,0.32)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#982b2a] hover:shadow-[0_14px_28px_rgba(152,43,42,0.36)] focus:outline-none focus:ring-2 focus:ring-[#b13634]/45 focus:ring-offset-2 focus:ring-offset-transparent sm:px-4 sm:text-[12px]">
          <span>Explore Projects</span>
          <svg class="h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M3.75 10h11" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            <path d="m10 5 5 5-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </a>

        <a href="#" class="inline-flex min-h-10 items-center gap-2 rounded-md border border-white/0 px-1 py-2 text-[11px] font-medium leading-none text-white transition-all duration-200 hover:border-white/20 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/40 focus:ring-offset-2 focus:ring-offset-transparent sm:text-[12px]">
          <span>View publications</span>
          <svg class="h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M3.75 10h11" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            <path d="m10 5 5 5-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </a>
      </div>
    </div>
  </div>
</div>

## Option 3 - Right Overlay Handling (Right-Aligned Content)

<div class="mx-auto flex h-full w-full max-w-7xl flex-col px-4 py-4 text-left sm:px-6 sm:py-6 sm:text-right lg:px-8 lg:py-8">
  <div class="flex justify-end">
    <p class="inline-flex rounded-full border border-white/35 bg-black/35 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-100 sm:px-3 sm:text-xs sm:tracking-[0.24em]">
      Upper
    </p>
  </div>

  <div class="title-description flex flex-1 items-center justify-start pt-4 sm:justify-end sm:pt-0">
    <div class="cud-carousel-text max-w-[92vw] sm:ml-auto sm:max-w-3xl">
      <h3 class="cud-carousel-title max-w-[16ch] text-[clamp(1.65rem,4.8vw,4.25rem)] leading-[0.98] sm:ml-auto">Mapping Future Research Pathways</h3>
      <p class="cud-carousel-description mt-3 max-w-[58ch] text-sm leading-6 sm:ml-auto sm:text-base sm:leading-7">A right-hand full-overlay variant to keep focus away from left-heavy imagery.</p>

      <div class="mt-5 flex flex-wrap items-center justify-start gap-2.5 sm:mt-8 sm:justify-end sm:gap-3">
        <a href="#" class="inline-flex min-h-10 items-center gap-2 rounded-md bg-[#b13634] px-3.5 py-2 text-[11px] font-semibold leading-none text-white shadow-[0_10px_24px_rgba(177,54,52,0.32)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#982b2a] hover:shadow-[0_14px_28px_rgba(152,43,42,0.36)] focus:outline-none focus:ring-2 focus:ring-[#b13634]/45 focus:ring-offset-2 focus:ring-offset-transparent sm:px-4 sm:text-[12px]">
          <span>Explore Projects</span>
          <svg class="h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M3.75 10h11" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            <path d="m10 5 5 5-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </a>

        <a href="#" class="inline-flex min-h-10 items-center gap-2 rounded-md border border-white/0 px-1 py-2 text-[11px] font-medium leading-none text-white transition-all duration-200 hover:border-white/20 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/40 focus:ring-offset-2 focus:ring-offset-transparent sm:text-[12px]">
          <span>View publications</span>
          <svg class="h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M3.75 10h11" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            <path d="m10 5 5 5-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </a>
      </div>
    </div>
  </div>
</div>
