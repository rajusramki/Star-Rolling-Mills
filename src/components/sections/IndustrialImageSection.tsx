export function IndustrialImageSection() {
  return (
    <figure
      className="relative h-[42vh] min-h-[320px] max-h-[520px] w-full overflow-hidden bg-ink border-y border-ink"
      aria-labelledby="operations-caption"
    >
      <div data-parallax-wrap className="absolute inset-0 overflow-hidden">
        <div data-parallax className="absolute inset-[-6%]">
          <img
            src="/images/industrial-operations.webp"
            alt="Steel manufacturing floor with overhead cranes and a furnace glowing in the distance"
            width={2200}
            height={1100}
            className="h-full w-full object-cover object-center"
            decoding="async"
          />
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/35 via-transparent to-ink/65"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink/40 via-transparent to-ink/25"
        aria-hidden="true"
      />

      <div className="absolute left-4 top-4 flex items-center gap-2 sm:left-6 sm:top-5 lg:left-10 xl:left-12">
        <span className="h-1.5 w-1.5 bg-accent" aria-hidden="true" />
        <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-white/80 sm:text-[9.5px]">
          Industrial operations
        </span>
      </div>

      <div className="absolute right-4 top-4 flex items-center gap-2.5 sm:right-6 sm:top-5 lg:right-10 xl:right-12">
        <span className="hidden h-px w-10 bg-white/30 sm:block" aria-hidden="true" />
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/60 sm:text-[9.5px]">
          01 / Visual record
        </span>
      </div>

      <figcaption
        id="operations-caption"
        className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4 sm:bottom-6 sm:left-6 lg:bottom-6 lg:left-10 xl:left-12"
      >
        <div>
          <span className="mb-2 block h-px w-8 bg-accent" aria-hidden="true" />
          <p className="max-w-[38ch] font-mono text-[9px] uppercase leading-[1.6] tracking-[0.18em] text-white/85 sm:text-[9.5px]">
            Industrial operations — reference image.
          </p>
        </div>
        <span className="hidden font-mono text-[9px] uppercase tracking-[0.2em] text-white/50 md:block">
          Iron &amp; Steel / Est. 1967
        </span>
      </figcaption>
    </figure>
  )
}
