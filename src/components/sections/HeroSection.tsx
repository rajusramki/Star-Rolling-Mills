import { useEffect, useRef } from 'react'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import gsap from 'gsap'
import { company } from '../../data/site'

const heroMeta = [
  { label: 'Established', value: '1967' },
  { label: 'Industry', value: 'Iron & Steel' },
  { label: 'Business', value: 'Industrial Manufacturing' },
]

export function HeroSection() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.from('[data-hero-eyebrow]', { y: 12, autoAlpha: 0, duration: 0.65 })
        .from(
          '[data-hero-line-inner]',
          { yPercent: 115, duration: 1.1, stagger: 0.08, ease: 'power4.out' },
          '-=0.25',
        )
        .from('[data-hero-support]', { y: 16, autoAlpha: 0, duration: 0.75 }, '-=0.6')
        .from(
          '[data-hero-meta]',
          { y: 12, autoAlpha: 0, duration: 0.6, stagger: 0.05 },
          '-=0.5',
        )
        .from(
          '[data-hero-panel]',
          { y: 20, autoAlpha: 0, duration: 0.8, stagger: 0.08 },
          '-=0.8',
        )
        .from('[data-hero-cue]', { autoAlpha: 0, duration: 0.6 }, '-=0.3')
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <section id="top" ref={root} aria-labelledby="hero-heading" className="relative bg-paper">
      <div className="grid md:grid-cols-[60fr_40fr] lg:grid-cols-[68fr_32fr] xl:grid-cols-[70fr_30fr]">
        {/* Left Hero Panel */}
        <div className="relative flex flex-col justify-between overflow-hidden border-b border-ink/10 px-4 pb-6 pt-5 sm:px-6 sm:pb-7 sm:pt-6 md:border-b-0 md:border-r md:px-8 md:pb-7 md:pt-6 lg:px-10 lg:pb-8 lg:pt-8 xl:px-12">
          <div
            className="pointer-events-none absolute inset-0 dot-grid opacity-60 [mask-image:radial-gradient(ellipse_at_20%_35%,black_0%,transparent_72%)]"
            aria-hidden="true"
          />

          {/* Top Eyebrow */}
          <div className="relative flex items-center justify-between gap-6">
            <p
              data-hero-eyebrow
              className="inline-flex items-center gap-2 font-mono text-[9px] font-medium uppercase leading-none tracking-[0.24em] text-ink/70 sm:text-[9.5px]"
            >
              <span className="h-1.5 w-1.5 shrink-0 bg-accent" aria-hidden="true" />
              Industrial excellence
            </p>
            <div className="flex items-center gap-3">
              <span className="hidden h-px w-12 bg-ink/20 sm:block" aria-hidden="true" />
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted">
                SRM / Est. {company.established}
              </span>
            </div>
          </div>

          {/* Main Headline */}
          <div className="relative my-auto py-8 sm:py-10 md:py-8 lg:py-10">
            <h1
              id="hero-heading"
              className="display text-[clamp(2.8rem,7.2vw,7.6rem)] leading-[0.88] tracking-[-0.045em]"
            >
              <span className="block overflow-hidden pb-[0.03em]">
                <span data-hero-line-inner className="block">
                  Built around
                </span>
              </span>
              <span className="block overflow-hidden pb-[0.03em]">
                <span data-hero-line-inner className="block">
                  Industrial
                </span>
              </span>
              <span className="block overflow-hidden pb-[0.03em]">
                <span data-hero-line-inner className="block text-accent">
                  Strength<span className="text-ink">.</span>
                </span>
              </span>
            </h1>

            <div className="mt-6 flex items-center gap-2.5 lg:mt-8" data-hero-cue>
              <span className="grid h-6 w-6 place-items-center border border-ink/20 text-ink/70">
                <ArrowDown size={11} strokeWidth={1.75} aria-hidden="true" />
              </span>
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted">
                Industrial strength since 1967
              </span>
            </div>
          </div>

          {/* Bottom Support & Meta */}
          <div className="relative grid gap-5 border-t border-ink/15 pt-5 lg:grid-cols-12 lg:gap-6 lg:pt-6">
            <p
              data-hero-support
              className="max-w-[46ch] text-[13.5px] leading-[1.7] text-body/85 lg:col-span-7"
            >
              Rooted in industrial experience since 1967, Star Rolling Mills represents a legacy of
              industrial commitment, material expertise and dependable business relationships.
            </p>
            <div className="grid grid-cols-1 gap-0 sm:grid-cols-3 md:grid-cols-1 lg:col-span-5">
              {heroMeta.map((item) => (
                <div
                  key={item.label}
                  data-hero-meta
                  className="flex items-baseline justify-between gap-3 border-b border-ink/10 py-1.5 sm:border-b-0 sm:border-r sm:pr-3 sm:last:border-r-0 md:border-b md:border-r-0 md:py-1.5 md:first:pt-0 md:last:border-b-0 lg:py-2"
                >
                  <span className="font-mono text-[8.5px] uppercase tracking-[0.2em] text-muted lg:text-[9px]">
                    {item.label}
                  </span>
                  <span className="font-mono text-[10px] font-medium uppercase tracking-[0.1em] text-ink/85">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Split Panels */}
        <aside className="grid grid-rows-[1.05fr_0.95fr] md:min-h-0" aria-label="Contact and company heritage">
          {/* Top Red Enquiry Panel */}
          <a
            href="#contact"
            data-hero-panel
            className="group relative flex min-h-[220px] flex-col justify-between overflow-hidden bg-accent p-6 text-white transition-colors duration-300 hover:bg-accentDark sm:p-7 lg:p-7 xl:p-8"
          >
            <div
              className="pointer-events-none absolute inset-0 dot-grid-light opacity-25 [mask-image:radial-gradient(circle_at_85%_15%,black,transparent_70%)]"
              aria-hidden="true"
            />
            <div className="relative flex items-start justify-between gap-4">
              <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-white/75">
                Enquiry desk / 01
              </span>
              <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-white/55">
                SRM
              </span>
            </div>

            <div className="relative my-auto py-3">
              <p className="font-display text-[clamp(2.2rem,3vw,3.4rem)] font-semibold uppercase leading-[0.88] tracking-[-0.04em]">
                Get in
                <br />
                touch
              </p>
              <p className="mt-3 max-w-[26ch] text-[12.5px] leading-[1.6] text-white/85">
                Have a material requirement or a business enquiry? Speak to our team.
              </p>
            </div>

            <div className="relative flex items-end justify-between pt-2">
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/70">
                Start a conversation
              </span>
              <span className="grid h-9 w-9 place-items-center border border-white/35 transition-colors duration-300 group-hover:border-white group-hover:bg-white group-hover:text-accent">
                <ArrowUpRight
                  size={16}
                  strokeWidth={1.5}
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </span>
            </div>
          </a>

          {/* Bottom Dark Heritage Panel */}
          <div
            data-hero-panel
            className="relative flex min-h-[200px] flex-col justify-between overflow-hidden bg-ink p-6 text-white sm:p-7 lg:p-7 xl:p-8"
          >
            <div
              className="pointer-events-none absolute inset-0 dot-grid-light opacity-15 [mask-image:linear-gradient(135deg,transparent_20%,black_100%)]"
              aria-hidden="true"
            />
            <div className="relative flex items-start justify-between gap-4">
              <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-white/55">
                Company heritage / 02
              </span>
              <span className="h-1.5 w-1.5 bg-accent" aria-hidden="true" />
            </div>

            <div className="relative my-auto py-2">
              <p className="font-display text-[clamp(3.2rem,4.4vw,5.2rem)] font-semibold leading-[0.82] tracking-[-0.05em]">
                1967
              </p>
              <div className="mt-3 border-t border-white/15 pt-2.5">
                <p className="font-mono text-[9px] uppercase leading-[1.5] tracking-[0.2em] text-white/50">
                  Years of industrial heritage
                  <br />
                  Established 1967
                </p>
                <p className="mt-2 max-w-[28ch] text-[12px] leading-[1.55] text-white/65">
                  A long-standing presence in the iron and steel sector, built on continuity and trust.
                </p>
              </div>
            </div>

            <div className="relative flex items-center justify-between border-t border-white/10 pt-2 text-white/40">
              <span className="font-mono text-[8.5px] uppercase tracking-[0.18em]">
                Howrah, West Bengal
              </span>
              <span className="font-mono text-[8.5px] uppercase tracking-[0.18em]">
                Active P.L.C.
              </span>
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}
