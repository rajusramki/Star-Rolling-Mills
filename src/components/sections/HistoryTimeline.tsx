import { ArrowUpRight } from 'lucide-react'
import { timeline } from '../../data/site'
import { requestSpecification } from '../../lib/utils'
import { SectionHeader } from '../common/SectionHeader'

export function HistoryTimeline() {
  return (
    <section id="history" aria-labelledby="history-heading" className="section-pad bg-paper">
      <div className="shell">
        <div data-reveal>
          <SectionHeader
            label="Company history"
            index="09 / Heritage"
            headingId="history-heading"
            title={
              <>
                Continuity,
                <br />
                measured in decades.
              </>
            }
            description="A company history is more than a founding date. It is the accumulation of decisions, relationships and work carried forward."
          />
        </div>

        {/* 3-Milestone Connected Timeline */}
        <ol className="relative mt-7 grid gap-6 md:mt-8 md:grid-cols-3 md:gap-6">
          <span
            data-line
            className="absolute left-0 top-0 hidden h-px w-full origin-left bg-ink/20 md:block"
            aria-hidden="true"
          />

          {timeline.map((item, index) => (
            <li
              key={item.year}
              data-reveal
              className="relative border-l border-ink/20 pl-6 md:border-l-0 md:pl-0 md:pt-4"
            >
              <span
                className="absolute -left-[4px] top-0 h-2 w-2 bg-accent md:-top-[4px] md:left-0"
                aria-hidden="true"
              />
              <div className="flex items-center justify-between gap-4">
                <span className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-ink/60">
                  Milestone / 0{index + 1}
                </span>
                <span className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-muted">
                  {item.label}
                </span>
              </div>

              <p
                className={
                  index === 1
                    ? 'display mt-2 text-[clamp(2.8rem,5vw,4.8rem)] leading-none text-accent'
                    : 'display mt-2 text-[clamp(2.8rem,5vw,4.8rem)] leading-none text-ink'
                }
              >
                {item.year}
              </p>

              <div className="mt-2.5 border-t border-ink/10 pt-2.5">
                <p className="max-w-[36ch] text-[13px] leading-[1.65] text-body/80">
                  {item.description}
                </p>
              </div>
            </li>
          ))}
        </ol>

        {/* Lower Editorial Split */}
        <div className="mt-8 grid gap-8 border-t border-ink/15 pt-6 lg:grid-cols-12 lg:gap-8 xl:gap-10">
          {/* Left Archive Figure */}
          <figure data-reveal className="lg:col-span-5">
            <div className="group relative aspect-[16/11] overflow-hidden bg-ink border border-ink/10">
              <img
                src="/images/history-archive.webp"
                alt="Historic steelworks structures with chimneys and pipework beneath an overcast sky"
                width={1400}
                height={963}
                loading="lazy"
                decoding="async"
                className="img-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.03]"
              />
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent"
                aria-hidden="true"
              />
              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
                <span className="max-w-[30ch] font-mono text-[9.5px] uppercase leading-[1.6] tracking-[0.18em] text-white/80">
                  Industrial heritage — reference image
                </span>
                <span className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-white/55">
                  Est. 1967
                </span>
              </div>
            </div>
            <figcaption className="mt-2.5 flex items-start justify-between gap-4 border-t border-ink/15 pt-2">
              <span className="max-w-[38ch] font-mono text-[9.5px] uppercase leading-[1.6] tracking-[0.16em] text-muted">
                Fig. 04 — Heritage context / not a company photograph
              </span>
              <span className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-ink/40">
                SRM / 09
              </span>
            </figcaption>
          </figure>

          {/* Right Narrative & Heritage Note */}
          <div className="lg:col-span-7">
            <div data-reveal>
              <h3 className="max-w-[32ch] font-display text-[clamp(1.3rem,1.9vw,1.75rem)] font-medium leading-[1.25] tracking-[-0.03em] text-ink">
                The date is documented. The decades are lived in the work.
              </h3>
              <p className="mt-3 max-w-[50ch] text-[13px] leading-[1.7] text-body/85">
                Star Rolling Mills was incorporated in 1967 in West Bengal. Since then, iron and
                steel has changed considerably — in process, expectation and scale. What remains is
                the value of continuity: knowing a material, understanding a requirement and
                carrying a business relationship across time.
              </p>
            </div>

            {/* Heritage Verification Box */}
            <div data-reveal className="mt-5 border border-ink/15 bg-white p-5 sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <span className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-ink/60">
                  Heritage note
                </span>
                <span className="h-1.5 w-1.5 bg-accent" aria-hidden="true" />
              </div>
              <p className="mt-2.5 max-w-[52ch] text-[12.5px] leading-[1.65] text-body/75">
                This timeline presents only the confirmed incorporation date and the company&apos;s
                general continuity. Detailed operational milestones, plant expansions and production
                records are subject to company verification before publication.
              </p>
              <div className="mt-3.5">
                <a
                  href="#contact"
                  onClick={() => requestSpecification('Company history enquiry')}
                  className="group inline-flex items-center gap-3 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-ink transition-colors duration-300 hover:text-accent"
                >
                  <span>Contact the company</span>
                  <ArrowUpRight
                    size={14}
                    strokeWidth={1.6}
                    className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </a>
              </div>
            </div>

            {/* Footer Metadata */}
            <div
              data-reveal
              className="mt-4 flex items-center justify-between gap-6 border-t border-ink/15 pt-3"
            >
              <span className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-muted">
                1967 — today
              </span>
              <span className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-muted">
                59+ years of continuity
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
