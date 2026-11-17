import { useEffect, useRef } from 'react'
import { ArrowUpRight } from 'lucide-react'

function Counter({ target }: { target: number }) {
  const numberRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = numberRef.current
    if (!el) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      el.textContent = String(target)
      return
    }

    let frame = 0
    let started = false

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting || started) return
        started = true
        observer.disconnect()

        const start = performance.now()
        const duration = 1400

        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1)
          const eased = 1 - Math.pow(1 - progress, 3)
          el.textContent = String(Math.round(target * eased))
          if (progress < 1) frame = requestAnimationFrame(tick)
        }

        frame = requestAnimationFrame(tick)
      },
      { threshold: 0.4 },
    )

    observer.observe(el)

    return () => {
      observer.disconnect()
      if (frame) cancelAnimationFrame(frame)
    }
  }, [target])

  return (
    <>
      <span ref={numberRef} aria-hidden="true" className="tabular-nums">
        0
      </span>
      <span className="sr-only">{target}</span>
    </>
  )
}

export function StatisticsBar() {
  return (
    <section aria-label="Company statistics" className="bg-ink text-white border-b border-white/10">
      <div className="shell">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-l border-r border-white/10">
          {/* 01 / Foundation */}
          <div className="flex flex-col justify-between border-b border-white/10 p-5 sm:p-5 lg:border-b-0 lg:border-r lg:p-6">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[8.5px] uppercase tracking-[0.2em] text-white/45">
                01 / Foundation
              </span>
              <span className="h-1.5 w-1.5 bg-accent" aria-hidden="true" />
            </div>
            <div className="mt-5">
              <p className="font-display text-[clamp(2.2rem,3.2vw,3.6rem)] font-semibold leading-[0.88] tracking-[-0.05em]">
                1967
              </p>
              <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.18em] text-white/55">
                Established
              </p>
              <p className="mt-0.5 text-[11.5px] leading-relaxed text-white/40">
                Incorporated 14 March 1967
              </p>
            </div>
          </div>

          {/* 02 / Continuity */}
          <div className="flex flex-col justify-between border-b border-white/10 p-5 sm:p-5 lg:border-b-0 lg:border-r lg:p-6">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[8.5px] uppercase tracking-[0.2em] text-white/45">
                02 / Continuity
              </span>
              <span className="font-mono text-[8.5px] uppercase tracking-[0.16em] text-white/30">
                Since 1967
              </span>
            </div>
            <div className="mt-5">
              <p className="font-display text-[clamp(2.2rem,3.2vw,3.6rem)] font-semibold leading-[0.88] tracking-[-0.05em]">
                <Counter target={59} />
                <span className="text-accent">+</span>
              </p>
              <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.18em] text-white/55">
                Years since incorporation
              </p>
              <p className="mt-0.5 text-[11.5px] leading-relaxed text-white/40">
                Long-standing industrial presence
              </p>
            </div>
          </div>

          {/* 03 / Sector */}
          <div className="flex flex-col justify-between border-b border-white/10 p-5 sm:p-5 sm:border-b-0 lg:border-r lg:p-6">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[8.5px] uppercase tracking-[0.2em] text-white/45">
                03 / Sector
              </span>
              <span className="h-1.5 w-1.5 bg-white/30" aria-hidden="true" />
            </div>
            <div className="mt-5">
              <p className="font-display text-[clamp(1.5rem,2vw,2.1rem)] font-semibold uppercase leading-[0.92] tracking-[-0.04em]">
                Iron &amp; Steel
              </p>
              <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.18em] text-white/55">
                Industry
              </p>
              <p className="mt-0.5 text-[11.5px] leading-relaxed text-white/40">
                Industrial materials &amp; manufacturing
              </p>
            </div>
          </div>

          {/* 04 / Enquiry */}
          <a
            href="#contact"
            className="group relative flex flex-col justify-between overflow-hidden bg-accent p-5 text-white transition-colors duration-300 hover:bg-accentDark sm:p-5 lg:p-6"
          >
            <div
              className="pointer-events-none absolute inset-0 dot-grid-light opacity-25"
              aria-hidden="true"
            />
            <div className="relative flex items-center justify-between">
              <span className="font-mono text-[8.5px] uppercase tracking-[0.2em] text-white/70">
                04 / Enquiry
              </span>
              <span className="font-mono text-[8.5px] uppercase tracking-[0.16em] text-white/55">
                SRM
              </span>
            </div>
            <div className="relative mt-5 flex items-end justify-between gap-3">
              <div>
                <p className="font-display text-[clamp(1.6rem,2.2vw,2.2rem)] font-semibold uppercase leading-[0.9] tracking-[-0.04em]">
                  Get
                  <br />
                  started
                </p>
                <p className="mt-1 text-[11.5px] text-white/80">Business enquiries</p>
              </div>
              <span className="grid h-9 w-9 shrink-0 place-items-center border border-white/40 transition-colors duration-300 group-hover:border-white group-hover:bg-white group-hover:text-accent">
                <ArrowUpRight
                  size={15}
                  strokeWidth={1.6}
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </span>
            </div>
          </a>
        </div>
      </div>
    </section>
  )
}
