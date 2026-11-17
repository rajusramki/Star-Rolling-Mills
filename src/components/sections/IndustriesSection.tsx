import { ArrowUpRight } from 'lucide-react'
import { industries } from '../../data/site'
import { cn, requestSpecification } from '../../lib/utils'
import { SectionHeader } from '../common/SectionHeader'

const layouts = [
  { span: 'lg:col-span-7', height: 'h-[260px] sm:h-[300px] lg:h-[340px]' },
  { span: 'lg:col-span-5', height: 'h-[260px] sm:h-[300px] lg:h-[340px]' },
  { span: 'lg:col-span-5', height: 'h-[260px] sm:h-[300px] lg:h-[340px]' },
  { span: 'lg:col-span-7', height: 'h-[260px] sm:h-[300px] lg:h-[340px]' },
  { span: 'lg:col-span-7', height: 'h-[260px] sm:h-[300px] lg:h-[340px]' },
  { span: 'lg:col-span-5', height: 'h-[260px] sm:h-[300px] lg:h-[340px]' },
]

export function IndustriesSection() {
  return (
    <section id="industries" aria-labelledby="industries-heading" className="section-pad bg-white">
      <div className="shell">
        <div data-reveal>
          <SectionHeader
            label="Industries we support"
            index="07 / Sectors"
            headingId="industries-heading"
            title={
              <>
                Where our materials
                <br />
                go to work.
              </>
            }
            description="Iron and steel sits beneath the structures, machines and networks that industry depends on. These are the sectors our material categories are suited to."
          />
        </div>

        {/* Subheader Meta Bar */}
        <div
          data-reveal
          className="mt-5 flex flex-col justify-between gap-3 border-t border-ink/15 pt-3 sm:flex-row sm:items-center"
        >
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-ink/60">
              Sector mapping
            </span>
            <span className="h-3 w-px bg-ink/15" aria-hidden="true" />
            <span className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-ink/60">
              06 industrial sectors
            </span>
          </div>
          <span className="inline-flex items-center gap-2.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-muted">
            <span className="h-1.5 w-1.5 bg-accent" aria-hidden="true" />
            Requirements reviewed on enquiry
          </span>
        </div>

        {/* Asymmetrical Grid with Consistent Row Heights */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-12 lg:gap-5">
          {industries.map((industry, index) => {
            const layout = layouts[index] ?? layouts[0]

            return (
              <a
                key={industry.number}
                data-reveal
                data-clip
                href="#contact"
                onClick={() => requestSpecification(`Industry enquiry: ${industry.title}`)}
                aria-label={`Enquire about materials for ${industry.title}`}
                className={cn(
                  'group relative block overflow-hidden bg-ink border border-ink/10 focus-visible:outline-offset-4',
                  layout.span,
                  layout.height,
                )}
              >
                <img
                  src={industry.image}
                  alt={industry.imageAlt}
                  width={1600}
                  height={1200}
                  loading="lazy"
                  decoding="async"
                  className="img-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.035]"
                />
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/40 to-transparent"
                  aria-hidden="true"
                />

                <div className="absolute inset-0 flex flex-col justify-between p-5 sm:p-5 lg:p-6">
                  {/* Top Meta */}
                  <div className="flex items-start justify-between gap-4">
                    <span className="inline-flex items-center gap-2.5 font-mono text-[9.5px] uppercase tracking-[0.2em] text-white/80">
                      <span className="h-1.5 w-1.5 bg-accent" aria-hidden="true" />
                      Sector / {industry.number}
                    </span>
                    <span className="grid h-8 w-8 place-items-center border border-white/40 bg-ink/40 text-white transition-colors duration-300 group-hover:border-white group-hover:bg-white group-hover:text-ink">
                      <ArrowUpRight
                        size={14}
                        strokeWidth={1.5}
                        className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </span>
                  </div>

                  {/* Bottom Text Content */}
                  <div>
                    <span className="mb-2 block h-px w-10 bg-accent lg:mb-3 lg:w-12" aria-hidden="true" />
                    <h3 className="display max-w-[18ch] text-[clamp(1.35rem,2vw,1.9rem)] text-white">
                      {industry.title}
                    </h3>
                    <p className="mt-1.5 max-w-[42ch] text-[12px] leading-[1.6] text-white/80">
                      {industry.description}
                    </p>
                  </div>
                </div>
              </a>
            )
          })}
        </div>

        {/* Bottom Technical Note */}
        <div
          data-reveal
          className="mt-6 flex flex-col justify-between gap-4 border-t border-ink/15 pt-4 sm:flex-row sm:items-start"
        >
          <p className="max-w-[68ch] font-mono text-[9.5px] leading-[1.7] tracking-[0.06em] text-muted">
            Sector categories are indicative of where our material range is suited. Specific
            project requirements, quantities and delivery schedules are reviewed individually.
          </p>
          <a
            href="#contact"
            onClick={() => requestSpecification('Sector requirements enquiry')}
            className="editorial-link group shrink-0"
          >
            <span>Discuss your sector</span>
            <ArrowUpRight
              size={14}
              strokeWidth={1.7}
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </a>
        </div>
      </div>
    </section>
  )
}
