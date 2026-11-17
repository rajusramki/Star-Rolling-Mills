import { ArrowUpRight } from 'lucide-react'
import { capabilities } from '../../data/site'
import { requestSpecification } from '../../lib/utils'
import { EditorialLink } from '../common/EditorialLink'
import { SectionHeader } from '../common/SectionHeader'

function CapabilityLink({ title, inverse = false }: { title: string; inverse?: boolean }) {
  return (
    <EditorialLink
      href="#contact"
      inverse={inverse}
      onClick={() => requestSpecification(`Capability enquiry: ${title}`)}
    >
      Explore capability
    </EditorialLink>
  )
}

export function CapabilitiesSection() {
  const [processing, rolling, supply, infrastructure, inspection, solutions] = capabilities

  return (
    <section id="capabilities" aria-labelledby="capabilities-heading" className="section-pad bg-paper">
      <div className="shell">
        <div data-reveal>
          <SectionHeader
            label="Core capabilities"
            index="03 / Capability"
            headingId="capabilities-heading"
            title={
              <>
                Capabilities built
                <br />
                around industry.
              </>
            }
            description="A focused industrial offer shaped by decades of sector experience — from steel processing and material supply to the business relationships that keep industry moving."
          />
        </div>

        {/* Capabilities Grid */}
        <div className="mt-8 grid grid-cols-12 gap-x-6 gap-y-8 lg:mt-10 lg:gap-x-8 lg:gap-y-10">
          {/* 01 Primary Hero Capability */}
          <article data-reveal className="group col-span-12 lg:col-span-7">
            <div data-clip className="relative aspect-[16/10] overflow-hidden bg-ink border border-ink/10">
              <img
                src={processing.image}
                alt={processing.imageAlt}
                width={1400}
                height={1050}
                loading="lazy"
                decoding="async"
                className="img-cover media-zoom"
              />
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-ink/20"
                aria-hidden="true"
              />
              <div className="absolute left-4 top-4 flex items-center gap-2">
                <span className="h-1.5 w-1.5 bg-accent" aria-hidden="true" />
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/85">
                  {processing.number} / Processing
                </span>
              </div>
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
                <h3 className="display max-w-[12ch] text-[clamp(1.8rem,3vw,3.1rem)] text-white">
                  {processing.title}
                </h3>
                <span className="grid h-10 w-10 shrink-0 place-items-center border border-white/35 text-white transition-colors duration-300 group-hover:border-white group-hover:bg-white group-hover:text-ink">
                  <ArrowUpRight
                    size={16}
                    strokeWidth={1.5}
                    className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-3 border-t border-ink/15 pt-3.5 sm:flex-row sm:items-start sm:justify-between">
              <p className="max-w-[48ch] text-[13px] leading-[1.7] text-body/80">
                {processing.description}
              </p>
              <CapabilityLink title={processing.title} />
            </div>
          </article>

          {/* 02 Complementary Capability */}
          <article data-reveal className="group col-span-12 lg:col-span-5 flex flex-col">
            <div data-clip className="aspect-[16/10] overflow-hidden bg-ink border border-ink/10">
              <img
                src={rolling.image}
                alt={rolling.imageAlt}
                width={1400}
                height={1050}
                loading="lazy"
                decoding="async"
                className="img-cover media-zoom"
              />
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-ink/15 pt-3">
              <span className="index-number text-accent">{rolling.number}</span>
              <span className="font-mono text-[8.5px] uppercase tracking-[0.18em] text-muted">
                Rolling operations
              </span>
            </div>
            <h3 className="mt-2.5 font-display text-[clamp(1.4rem,1.8vw,1.75rem)] font-semibold uppercase leading-[1.1] tracking-[-0.035em] text-ink group-hover:text-accent transition-colors duration-300">
              {rolling.title}
            </h3>
            <p className="mt-2 max-w-[42ch] text-[13px] leading-[1.7] text-body/80">
              {rolling.description}
            </p>
            <div className="mt-auto pt-4">
              <CapabilityLink title={rolling.title} />
            </div>
          </article>

          {/* 03, 04, 05 Supporting Trio */}
          {[supply, infrastructure, inspection].map((item) => (
            <article
              key={item.number}
              data-reveal
              className="group col-span-12 sm:col-span-6 lg:col-span-4 flex flex-col"
            >
              <div data-clip className="relative aspect-[4/3] overflow-hidden bg-ink border border-ink/10">
                <img
                  src={item.image}
                  alt={item.imageAlt}
                  width={1400}
                  height={1050}
                  loading="lazy"
                  decoding="async"
                  className="img-cover media-zoom"
                />
                <span className="absolute left-3.5 top-3.5 font-mono text-[9.5px] tracking-[0.14em] text-white/90 drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]">
                  {item.number}
                </span>
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent"
                  aria-hidden="true"
                />
              </div>
              <div className="mt-3.5 flex items-center justify-between border-t border-ink/15 pt-2.5">
                <span className="font-mono text-[8.5px] uppercase tracking-[0.18em] text-muted">
                  Capability
                </span>
                <span className="font-mono text-[8.5px] uppercase tracking-[0.18em] text-ink/40">
                  SRM / {item.number}
                </span>
              </div>
              <h3 className="mt-2.5 font-display text-[17.5px] font-semibold uppercase leading-[1.12] tracking-[-0.03em] text-ink group-hover:text-accent transition-colors duration-300">
                {item.title}
              </h3>
              <p className="mt-1.5 text-[12.5px] leading-[1.65] text-body/75">{item.description}</p>
              <div className="mt-auto pt-3.5">
                <CapabilityLink title={item.title} />
              </div>
            </article>
          ))}

          {/* 06 Business Solutions Full-Width Feature */}
          <article
            data-reveal
            className="col-span-12 mt-1 grid overflow-hidden border border-ink/15 lg:grid-cols-12"
          >
            <div className="relative order-2 flex flex-col justify-between bg-accent p-6 text-white sm:p-7 lg:order-1 lg:col-span-5 lg:p-8">
              <div
                className="pointer-events-none absolute inset-0 dot-grid-light opacity-25"
                aria-hidden="true"
              />
              <div className="relative flex items-center justify-between">
                <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-white/75">
                  06 / Business
                </span>
                <span className="h-1.5 w-1.5 bg-white/60" aria-hidden="true" />
              </div>
              <div className="relative my-6 lg:my-auto">
                <h3 className="display max-w-[12ch] text-[clamp(1.7rem,2.4vw,2.5rem)] text-white">
                  {solutions.title}
                </h3>
                <p className="mt-3 max-w-[36ch] text-[13px] leading-[1.7] text-white/85">
                  {solutions.description}
                </p>
                <div className="mt-5">
                  <EditorialLink
                    href="#contact"
                    inverse
                    onClick={() => requestSpecification(`Capability enquiry: ${solutions.title}`)}
                  >
                    Start a conversation
                  </EditorialLink>
                </div>
              </div>
              <div className="relative border-t border-white/20 pt-2.5 text-white/50">
                <span className="font-mono text-[8.5px] uppercase tracking-[0.16em]">
                  Industrial commercial relationships
                </span>
              </div>
            </div>
            <div className="group relative order-1 aspect-[16/10] overflow-hidden bg-ink lg:order-2 lg:col-span-7 lg:aspect-auto">
              <img
                src={solutions.image}
                alt={solutions.imageAlt}
                width={1400}
                height={1050}
                loading="lazy"
                decoding="async"
                className="img-cover media-zoom"
              />
            </div>
          </article>
        </div>

        {/* Bottom Technical Note */}
        <div
          data-reveal
          className="mt-8 flex flex-col justify-between gap-3 border-t border-ink/15 pt-4 sm:flex-row sm:items-start"
        >
          <p className="max-w-[64ch] font-mono text-[9px] leading-[1.65] tracking-[0.06em] text-muted">
            Capability scope, equipment and operating parameters are subject to company
            verification. Contact our team for current operational details.
          </p>
          <span className="shrink-0 font-mono text-[8.5px] uppercase tracking-[0.18em] text-ink/40">
            SRM / Capability record
          </span>
        </div>
      </div>
    </section>
  )
}
