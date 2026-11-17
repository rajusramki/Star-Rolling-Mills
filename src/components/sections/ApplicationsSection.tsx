import { ArrowUpRight } from 'lucide-react'
import { applications } from '../../data/site'
import { requestSpecification } from '../../lib/utils'
import { EditorialLink } from '../common/EditorialLink'
import { SectionHeader } from '../common/SectionHeader'

export function ApplicationsSection() {
  return (
    <section id="applications" aria-labelledby="applications-heading" className="section-pad bg-paper">
      <div className="shell">
        <div data-reveal>
          <SectionHeader
            label="Industrial applications"
            index="06 / Application"
            headingId="applications-heading"
            title={
              <>
                From material
                <br />
                to industrial value.
              </>
            }
            description="Steel is only as useful as the structure it supports. Our materials are positioned for sectors where strength, consistency and dependable supply matter."
          />
        </div>

        <div className="mt-8 grid gap-8 lg:mt-10 lg:grid-cols-12 lg:gap-8 xl:gap-10">
          {/* Left Sticky Figure */}
          <figure className="lg:col-span-5">
            <div className="lg:sticky lg:top-24">
              <div data-clip className="relative aspect-[4/5] overflow-hidden bg-ink border border-ink/10">
                <img
                  src="/images/application-reinforcement.webp"
                  alt="Tower of steel reinforcement bars rising into a clear sky"
                  width={1500}
                  height={1875}
                  loading="lazy"
                  decoding="async"
                  className="img-cover transition-transform duration-[1200ms] ease-out hover:scale-[1.03]"
                />
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/75 via-transparent to-transparent"
                  aria-hidden="true"
                />
                <span className="absolute left-5 top-5 font-mono text-[9.5px] uppercase tracking-[0.22em] text-white/85">
                  Application / 01
                </span>
                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
                  <p className="max-w-[24ch] font-mono text-[9.5px] uppercase leading-[1.6] tracking-[0.18em] text-white/85">
                    Reinforcement / Structural framework
                  </p>
                  <span className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-white/60">
                    SRM
                  </span>
                </div>
              </div>
              <figcaption className="mt-3 flex items-start justify-between gap-4 border-t border-ink/15 pt-2.5">
                <span className="max-w-[38ch] font-mono text-[9.5px] uppercase leading-[1.6] tracking-[0.16em] text-muted">
                  Fig. 02 — Material application / reinforced structure
                </span>
                <span className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-ink/40">
                  Ind. / 01
                </span>
              </figcaption>
            </div>
          </figure>

          {/* Right Content & Application List */}
          <div className="lg:col-span-7">
            <p data-reveal className="max-w-[50ch] text-[13.5px] leading-[1.7] text-body/85">
              From the first structural frame to the final finished surface, industrial materials
              carry the demands of the built environment. Our focus is on supplying the right
              material for the application — with clarity on what is available and how it can be
              delivered.
            </p>

            <div data-reveal className="mt-6">
              <div className="flex items-center justify-between border-t border-ink/20 pb-2.5">
                <span className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-ink/70">
                  Application mapping
                </span>
                <span className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-muted">
                  05 sectors
                </span>
              </div>
              <ul>
                {applications.map((application) => (
                  <li key={application.number} className="border-b border-ink/15">
                    <a
                      href="#contact"
                      onClick={() =>
                        requestSpecification(`Application enquiry: ${application.title}`)
                      }
                      className="group grid grid-cols-[auto_1fr_auto] items-start gap-4 py-3.5 transition-colors duration-300 hover:bg-white sm:gap-5 sm:px-3"
                    >
                      <span className="mt-1 font-mono text-[11px] font-medium tracking-[0.12em] text-accent">
                        {application.number}
                      </span>
                      <span>
                        <span className="block font-display text-[clamp(1.15rem,1.5vw,1.35rem)] font-semibold uppercase leading-tight tracking-[-0.03em] text-ink transition-colors duration-300 group-hover:text-accent">
                          {application.title}
                        </span>
                        <span className="mt-1 block max-w-[48ch] text-[12.5px] leading-[1.6] text-body/75">
                          {application.description}
                        </span>
                      </span>
                      <span className="mt-1 grid h-8 w-8 place-items-center border border-ink/15 text-ink/50 transition-colors duration-300 group-hover:border-ink group-hover:bg-ink group-hover:text-white">
                        <ArrowUpRight size={14} strokeWidth={1.5} aria-hidden="true" />
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bottom Callout Banner */}
            <div
              data-reveal
              className="mt-6 flex flex-col justify-between gap-5 bg-ink p-5 text-white sm:flex-row sm:items-center sm:p-6"
            >
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/50">
                  Not sure where to start?
                </p>
                <p className="mt-1.5 max-w-[32ch] font-display text-[17px] font-medium leading-[1.25] tracking-[-0.02em]">
                  Share your application and we will review the requirement.
                </p>
              </div>
              <EditorialLink
                href="#contact"
                inverse
                onClick={() => requestSpecification('Application review request')}
                className="shrink-0"
              >
                Talk to our team
              </EditorialLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
