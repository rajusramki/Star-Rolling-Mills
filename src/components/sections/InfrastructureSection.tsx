import { ArrowUpRight } from 'lucide-react'
import { requestSpecification } from '../../lib/utils'

export function InfrastructureSection() {
  return (
    <section
      id="infrastructure"
      aria-labelledby="infrastructure-heading"
      className="relative bg-ink text-white overflow-hidden"
    >
      <div data-parallax-wrap className="relative min-h-[460px] overflow-hidden lg:min-h-[60svh]">
        {/* Parallax Background */}
        <div data-parallax className="absolute inset-[-6%]">
          <img
            src="/images/infrastructure.webp"
            alt="Large industrial gantry crane and steel plant interior in warm orange light"
            width={2400}
            height={1350}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover object-[center_35%]"
          />
        </div>

        {/* Restrained Directional Overlays for High Legibility without Muddying the Image */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/65 to-ink/20"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-ink/75 via-transparent to-ink/40"
          aria-hidden="true"
        />

        {/* Section Content Aligned to Global Grid */}
        <div className="shell relative flex min-h-[460px] flex-col justify-between py-6 lg:min-h-[60svh] lg:py-8">
          {/* Top Bar */}
          <div data-reveal className="flex items-center justify-between gap-6 border-b border-white/10 pb-3">
            <span className="inline-flex items-center gap-2.5 font-mono text-[9.5px] uppercase tracking-[0.24em] text-white/80 sm:text-[10px]">
              <span className="h-1.5 w-1.5 bg-accent" aria-hidden="true" />
              Industrial infrastructure
            </span>
            <span className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-white/55 sm:text-[10px]">
              04 / SRM
            </span>
          </div>

          {/* Center Heading & Call to Action */}
          <div className="relative max-w-[1000px] my-auto py-6 lg:py-8">
            <span
              data-reveal
              className="mb-4 block h-px w-16 bg-accent lg:mb-6 lg:w-20"
              aria-hidden="true"
            />
            <h2
              id="infrastructure-heading"
              data-reveal
              className="display text-[clamp(2.75rem,6.5vw,6.5rem)] leading-[0.88] text-white"
            >
              Built for
              <br />
              industrial
              <br />
              performance.
            </h2>
            <div className="mt-6 grid gap-5 border-t border-white/20 pt-5 sm:flex sm:items-end sm:justify-between lg:mt-6">
              <p
                data-reveal
                className="max-w-[44ch] text-[14px] leading-[1.7] text-white/80 lg:text-[15px]"
              >
                Industrial infrastructure, operational expertise and a commitment to dependable
                business.
              </p>
              <a
                data-reveal
                href="#contact"
                onClick={() => requestSpecification('Infrastructure enquiry')}
                className="group inline-flex w-fit items-center gap-3.5 border border-white/40 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-white transition-all duration-300 hover:border-white hover:bg-white hover:text-ink shrink-0"
              >
                Discuss your requirement
                <ArrowUpRight
                  size={14}
                  strokeWidth={1.6}
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </a>
            </div>
          </div>

          {/* Bottom Caption Bar */}
          <div className="flex items-end justify-between gap-6 border-t border-white/15 pt-3">
            <span className="font-mono text-[9px] uppercase leading-[1.6] tracking-[0.18em] text-white/45">
              Industrial infrastructure / Reference environment
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/45">
              SRM / Est. 1967
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
