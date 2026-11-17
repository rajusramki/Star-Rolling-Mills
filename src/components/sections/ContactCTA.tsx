import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { scrollToEnquiry } from '../../lib/utils'

export function ContactCTA() {
  return (
    <section aria-labelledby="cta-heading" className="relative overflow-hidden bg-accent text-white">
      <div
        className="pointer-events-none absolute inset-0 dot-grid-light opacity-20 [mask-image:radial-gradient(ellipse_at_15%_25%,black_0%,transparent_65%)]"
        aria-hidden="true"
      />

      <div className="shell relative py-10 lg:py-14 xl:py-16">
        {/* Top Header */}
        <div className="flex items-center justify-between gap-6 border-b border-white/20 pb-3">
          <span className="inline-flex items-center gap-2.5 font-mono text-[9.5px] uppercase tracking-[0.24em] text-white/80 sm:text-[10px]">
            <span className="h-1.5 w-1.5 bg-white" aria-hidden="true" />
            Business enquiries
          </span>
          <span className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-white/60 sm:text-[10px]">
            Next step / 10
          </span>
        </div>

        {/* Center 12-Column Grid */}
        <div className="mt-7 grid gap-6 lg:mt-8 lg:grid-cols-12 lg:items-end lg:gap-8">
          <h2
            id="cta-heading"
            data-reveal
            className="display text-[clamp(2.75rem,6.5vw,6.5rem)] leading-[0.88] text-white lg:col-span-8"
          >
            Let&apos;s build
            <br />
            what comes
            <br />
            <span className="text-ink">next.</span>
          </h2>

          <div className="lg:col-span-4 lg:pb-1">
            <p data-reveal className="max-w-[38ch] text-[13.5px] leading-[1.7] text-white/85">
              A material requirement, a supply partnership or a question about our capabilities —
              start with a conversation. We will review the details and respond directly.
            </p>

            <div data-reveal className="mt-5 flex flex-col gap-2.5">
              <a
                href="#enquiry"
                onClick={scrollToEnquiry}
                className="group flex items-center justify-between gap-4 bg-white px-5 py-3 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-ink transition-colors duration-300 hover:bg-ink hover:text-white"
              >
                <span>Start an enquiry</span>
                <ArrowUpRight
                  size={15}
                  strokeWidth={1.6}
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </a>
              <a
                href="#products"
                className="group flex items-center justify-between gap-4 border border-white/40 px-5 py-3 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-white transition-colors duration-300 hover:border-white hover:bg-white hover:text-ink"
              >
                <span>Explore materials</span>
                <ArrowRight
                  size={15}
                  strokeWidth={1.6}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Metadata Bar */}
        <div className="mt-8 flex flex-col justify-between gap-3 border-t border-white/25 pt-4 sm:flex-row sm:items-center lg:mt-10">
          <span className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-white/70">
            Industrial strength since 1967
          </span>
          <span className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-white/55">
            Iron &amp; Steel / Howrah, West Bengal
          </span>
        </div>
      </div>
    </section>
  )
}
