import { ArrowUpRight } from 'lucide-react'
import { processSteps } from '../../data/site'
import { requestSpecification } from '../../lib/utils'
import { SectionHeader } from '../common/SectionHeader'

const processMeta = [
  { label: 'Enquiry', value: 'Requirement capture' },
  { label: 'Review', value: 'Specification alignment' },
  { label: 'Dispatch', value: 'Documented handover' },
]

export function ProcessSection() {
  return (
    <section id="process" aria-labelledby="process-heading" className="section-pad bg-ink text-white">
      <div className="shell">
        <div data-reveal>
          <SectionHeader
            inverse
            label="Quality & business process"
            index="08 / Process"
            headingId="process-heading"
            title={
              <>
                A disciplined
                <br />
                way of working.
              </>
            }
            description="A clear, specification-led route from first enquiry to dispatch. Every stage is built around the requirement confirmed with you."
          />
        </div>

        <div className="mt-8 grid gap-8 lg:mt-10 lg:grid-cols-12 lg:gap-8 xl:gap-10">
          {/* Left Sticky Figure */}
          <figure className="lg:col-span-5">
            <div className="lg:sticky lg:top-24">
              <div data-clip className="relative aspect-[4/5] overflow-hidden bg-white/5 border border-white/10">
                <img
                  src="/images/process-machinery.webp"
                  alt="Industrial machinery and production equipment inside a steel plant"
                  width={1500}
                  height={1875}
                  loading="lazy"
                  decoding="async"
                  className="img-cover transition-transform duration-[1200ms] ease-out hover:scale-[1.03]"
                />
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-transparent"
                  aria-hidden="true"
                />
                <div className="absolute left-5 top-5 flex items-center gap-2.5">
                  <span className="h-1.5 w-1.5 bg-accent" aria-hidden="true" />
                  <span className="font-mono text-[9.5px] uppercase tracking-[0.22em] text-white/80">
                    Process / Operating discipline
                  </span>
                </div>
                <div className="absolute bottom-5 left-5 right-5">
                  <span className="mb-2.5 block h-px w-10 bg-accent" aria-hidden="true" />
                  <p className="max-w-[26ch] font-display text-[clamp(1.25rem,1.8vw,1.65rem)] font-medium leading-[1.25] tracking-[-0.025em] text-white">
                    The requirement is the starting point. The material follows.
                  </p>
                  <p className="mt-2.5 font-mono text-[9px] uppercase tracking-[0.2em] text-white/50">
                    Fig. 03 — Industrial process environment
                  </p>
                </div>
              </div>
              <figcaption className="mt-3 flex items-start justify-between gap-4 border-t border-white/15 pt-2.5">
                <span className="max-w-[38ch] font-mono text-[9.5px] uppercase leading-[1.6] tracking-[0.16em] text-white/45">
                  Process visual — indicative of industrial operations
                </span>
                <span className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-white/35">
                  SRM / 08
                </span>
              </figcaption>
            </div>
          </figure>

          {/* Right Process Progression */}
          <div className="lg:col-span-7">
            {/* 3-Stage Progression Track */}
            <div className="grid grid-cols-3 border-y border-white/15">
              {processMeta.map((item, i) => (
                <div
                  key={item.label}
                  data-reveal
                  className="border-r border-white/10 py-3 pr-3 last:border-r-0 sm:pr-4"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[8.5px] uppercase tracking-[0.2em] text-white/40">
                      Phase 0{i + 1}
                    </span>
                  </div>
                  <p className="mt-1 font-mono text-[9.5px] font-medium uppercase tracking-[0.1em] text-white/85">
                    {item.label}
                  </p>
                  <p className="mt-1 text-[11.5px] leading-relaxed text-white/50">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            {/* 4 Process Steps */}
            <ol className="mt-4">
              {processSteps.map((step) => (
                <li
                  key={step.number}
                  data-reveal
                  className="group grid grid-cols-[auto_1fr] gap-4 border-b border-white/15 px-3 py-3.5 transition-colors duration-300 hover:bg-white/[0.03] sm:gap-6 sm:py-4"
                >
                  <span className="mt-1 font-mono text-[11px] font-medium tracking-[0.14em] text-accent">
                    {step.number}
                  </span>
                  <div>
                    <div className="flex items-start justify-between gap-5">
                      <h3 className="font-display text-[clamp(1.2rem,1.6vw,1.45rem)] font-semibold uppercase leading-tight tracking-[-0.03em] text-white transition-colors duration-300 group-hover:text-accent">
                        {step.title}
                      </h3>
                      <span
                        className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-white/30 transition-colors duration-300 group-hover:bg-accent"
                        aria-hidden="true"
                      />
                    </div>
                    <p className="mt-1.5 max-w-[48ch] text-[12.5px] leading-[1.65] text-white/65">
                      {step.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            {/* Quality Position Card */}
            <div
              data-reveal
              className="mt-6 border border-white/15 bg-white/[0.02] p-5 sm:p-6"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-white/55">
                  Quality position
                </span>
                <span className="h-1.5 w-1.5 bg-accent" aria-hidden="true" />
              </div>
              <p className="mt-2.5 max-w-[48ch] text-[12.5px] leading-[1.65] text-white/70">
                Inspections and documentation are aligned to the requirements agreed at enquiry
                stage. Specific standards, grades and certification are confirmed in writing before
                supply — never assumed.
              </p>
              <div className="mt-4">
                <a
                  href="#contact"
                  onClick={() => requestSpecification('Quality and process enquiry')}
                  className="group inline-flex items-center gap-3 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-white transition-colors duration-300 hover:text-accent"
                >
                  <span>Discuss quality requirements</span>
                  <ArrowUpRight
                    size={14}
                    strokeWidth={1.6}
                    className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
