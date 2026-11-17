import { MapPin } from 'lucide-react'
import { company } from '../../data/site'
import { SectionLabel } from '../common/SectionHeader'
import { EnquiryForm } from './EnquiryForm'

const contactFacts = [
  {
    label: 'Registered office',
    value: `${company.address.line1} — ${company.address.postalCode}, ${company.address.state}, ${company.address.country}`,
  },
  { label: 'Corporate identity', value: company.cin },
  { label: 'Established', value: '14 March 1967' },
  { label: 'Company status', value: company.status },
  { label: 'Sector', value: 'Iron & Steel' },
]

export function ContactSection() {
  return (
    <section id="contact" aria-labelledby="contact-heading" className="section-pad bg-white">
      <div className="shell">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-8 xl:gap-10">
          {/* Left Column: Facts & Guidance */}
          <div className="lg:col-span-5">
            <div data-reveal>
              <SectionLabel index="10 / Contact">Contact &amp; enquiry</SectionLabel>
            </div>

            <h2
              id="contact-heading"
              data-reveal
              className="display mt-4 text-[clamp(2.2rem,3.8vw,4rem)] leading-[0.9] lg:mt-5"
            >
              Start a
              <br />
              conversation.
            </h2>

            <p data-reveal className="mt-3 max-w-[42ch] text-[13px] leading-[1.65] text-body/85">
              Share your material requirement, application or business enquiry. Submit the form and
              your enquiry is recorded for the company&apos;s review — with the context needed to
              respond properly.
            </p>

            {/* Facts Definition List */}
            <dl data-reveal className="mt-5 border-t border-ink/20">
              {contactFacts.map((fact) => (
                <div
                  key={fact.label}
                  className="grid grid-cols-[140px_1fr] sm:grid-cols-[160px_1fr] items-baseline gap-4 border-b border-line py-2 sm:py-2.5"
                >
                  <dt className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-muted">
                    {fact.label}
                  </dt>
                  <dd className="text-right font-mono text-[10.5px] font-medium uppercase leading-[1.5] tracking-[0.05em] text-ink/85">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>

            {/* Office Location Card */}
            <div data-reveal className="mt-4 flex items-start gap-3.5 border border-ink/10 bg-paper p-4 sm:p-5">
              <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center border border-ink/20 text-ink/70">
                <MapPin size={14} strokeWidth={1.5} aria-hidden="true" />
              </span>
              <div>
                <p className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-ink/70">
                  Registered in West Bengal
                </p>
                <p className="mt-1 max-w-[40ch] text-[12px] leading-[1.65] text-muted">
                  Star Rolling Mills Pvt. Ltd. is an Indian private limited company registered in
                  Howrah, West Bengal. Use the enquiry form for all business correspondence.
                </p>
              </div>
            </div>

            {/* Guidance Card */}
            <div
              data-reveal
              className="relative mt-3 overflow-hidden border border-ink bg-ink p-4 text-white sm:p-5"
            >
              <div
                className="pointer-events-none absolute inset-0 dot-grid-light opacity-15 [mask-image:linear-gradient(135deg,transparent_20%,black_100%)]"
                aria-hidden="true"
              />
              <div className="relative">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-white/55">
                    Before you send
                  </span>
                  <span className="h-1.5 w-1.5 bg-accent" aria-hidden="true" />
                </div>
                <p className="mt-2 max-w-[42ch] text-[12.5px] leading-[1.65] text-white/70">
                  If you know them, include the material grade, dimensions, quantity and required
                  delivery window. If not, describe the application — the team will review the
                  requirement with you.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Functional Enquiry Form */}
          <div className="lg:col-span-7">
            <div data-reveal>
              <EnquiryForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
