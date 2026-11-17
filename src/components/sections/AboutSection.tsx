import { ArrowUpRight } from 'lucide-react'
import { company } from '../../data/site'
import { EditorialLink } from '../common/EditorialLink'
import { SectionHeader } from '../common/SectionHeader'

const facts = [
  { label: 'Established', value: '1967 — 59+ years' },
  { label: 'Structure', value: 'Private Limited Company' },
  { label: 'Sector', value: 'Iron & Steel' },
  { label: 'Registered office', value: 'Howrah, West Bengal' },
  { label: 'CIN', value: company.cin },
]

export function AboutSection() {
  return (
    <section id="about" aria-labelledby="about-heading" className="section-pad bg-white">
      <div className="shell">
        <div data-reveal>
          <SectionHeader
            label="The company"
            index="About / 02"
            headingId="about-heading"
            title={
              <>
                An industrial legacy.
                <br />
                <span className="text-ink/45">A forward-looking approach.</span>
              </>
            }
            description="A long-standing industrial identity, carried forward with clarity and purpose."
          />
        </div>

        <div className="mt-8 grid gap-8 lg:mt-10 lg:grid-cols-12 lg:gap-8 xl:gap-10">
          {/* Left Figure */}
          <figure className="lg:col-span-5">
            <div className="lg:sticky lg:top-24">
              <div
                data-clip
                className="group relative aspect-[4/4.8] overflow-hidden bg-ink border border-ink/10"
              >
                <img
                  src="/images/heritage-factory.webp"
                  alt="Industrial steel worker in a historic rolling mill environment, black and white"
                  width={1600}
                  height={2000}
                  loading="lazy"
                  decoding="async"
                  className="img-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
                />
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/75 via-transparent to-transparent"
                  aria-hidden="true"
                />
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/85">
                    Material / Process / Continuity
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/60">
                    1967
                  </span>
                </div>
              </div>
              <figcaption className="mt-3 flex items-start justify-between gap-4 border-t border-line pt-2.5">
                <span className="max-w-[36ch] font-mono text-[9px] uppercase leading-[1.5] tracking-[0.16em] text-muted">
                  Fig. 01 — Industrial operations / visual record
                </span>
                <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink/40">
                  SRM / 1967
                </span>
              </figcaption>
            </div>
          </figure>

          {/* Right Narrative & Metadata */}
          <div className="lg:col-span-7">
            <div data-reveal>
              <p className="font-display text-[clamp(1.3rem,1.9vw,1.85rem)] font-medium leading-[1.28] tracking-[-0.025em] text-ink">
                Star Rolling Mills Pvt. Ltd. is an Indian private limited company with a history
                that reaches back to 1967.
              </p>
            </div>

            <div data-reveal className="mt-5 grid gap-5 sm:grid-cols-2">
              <p className="text-[13.5px] leading-[1.75] text-body/85">
                From its base in Howrah, West Bengal, the company has maintained a long-standing
                presence in the iron and steel sector — a sector built on material knowledge,
                operational discipline and relationships that endure.
              </p>
              <p className="text-[13.5px] leading-[1.75] text-body/85">
                Our perspective is shaped by more than five decades of industrial continuity. We
                bring a considered, specification-led approach to every enquiry, connecting
                established industrial experience with the needs of modern business.
              </p>
            </div>

            <div data-reveal className="mt-6">
              <EditorialLink href="#history">Explore our company</EditorialLink>
            </div>

            {/* Facts Definition List */}
            <dl data-reveal className="mt-7 border-t border-ink/20">
              {facts.map((fact) => (
                <div
                  key={fact.label}
                  className="grid grid-cols-[130px_1fr] sm:grid-cols-[160px_1fr] items-baseline gap-4 border-b border-line py-2.5"
                >
                  <dt className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted">
                    {fact.label}
                  </dt>
                  <dd className="text-right font-mono text-[10px] font-medium uppercase tracking-[0.06em] text-ink/85">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>

            {/* Heritage Note Box */}
            <div data-reveal className="mt-6 flex items-start gap-3.5 border border-ink/10 bg-paper p-4 sm:p-5">
              <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center border border-ink/20 text-ink/70">
                <ArrowUpRight size={13} strokeWidth={1.5} aria-hidden="true" />
              </span>
              <p className="max-w-[46ch] text-[12px] leading-[1.65] text-body/80">
                Industrial heritage is not simply a date. It is the accumulated experience behind
                every material decision, commercial relationship and long-term commitment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
