import { ArrowRight, ArrowUp, ArrowUpRight } from 'lucide-react'
import { company, navItems, products } from '../../data/site'
import { Logo } from '../common/Logo'
import { requestSpecification } from '../../lib/utils'

const primaryLinks = [
  { id: 'applications', label: 'Applications' },
  { id: 'process', label: 'Process' },
  { id: 'history', label: 'History' },
  { id: 'contact', label: 'Contact' },
]

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative overflow-hidden bg-ink text-white">
      <div
        className="pointer-events-none absolute inset-0 dot-grid-light opacity-[0.08] [mask-image:linear-gradient(180deg,black,transparent_70%)]"
        aria-hidden="true"
      />

      <div className="shell relative pb-6 pt-10 lg:pt-12">
        {/* Row 1: Brand, Navigation & Materials (12-Col Grid) */}
        <div className="grid gap-8 border-b border-white/15 pb-8 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <a href="#top" aria-label="Star Rolling Mills — back to top" className="inline-block">
              <Logo inverse size="lg" />
            </a>
            <p className="mt-4 max-w-[38ch] text-[13px] leading-[1.7] text-white/60">
              An established Indian iron and steel company, built on industrial continuity,
              material expertise and long-term business relationships.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
              <span className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-white/45">
                Established 1967
              </span>
              <span className="h-3 w-px bg-white/15" aria-hidden="true" />
              <span className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-white/45">
                Howrah, West Bengal
              </span>
            </div>

            <div className="mt-5">
              <a
                href="#contact"
                onClick={() => requestSpecification('Footer enquiry')}
                className="group inline-flex items-center gap-3 border border-white/30 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-white transition-all duration-300 hover:border-accent hover:bg-accent"
              >
                <span>Start a conversation</span>
                <ArrowUpRight
                  size={14}
                  strokeWidth={1.6}
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </a>
            </div>
          </div>

          <nav aria-label="Footer navigation" className="lg:col-span-3 lg:col-start-7">
            <p className="font-mono text-[9.5px] uppercase tracking-[0.22em] text-white/40">
              Navigate
            </p>
            <ul className="mt-3">
              {navItems.map((item) => (
                <li key={item.href} className="border-b border-white/10">
                  <a
                    href={item.href}
                    className="group flex items-center justify-between gap-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-white/70 transition-colors duration-300 hover:text-accent"
                  >
                    <span>{item.label}</span>
                    <ArrowRight
                      size={13}
                      strokeWidth={1.5}
                      className="text-white/25 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-accent"
                      aria-hidden="true"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <p className="font-mono text-[9.5px] uppercase tracking-[0.22em] text-white/40">
              Materials
            </p>
            <ul className="mt-3">
              {products.map((product) => (
                <li key={product.number} className="border-b border-white/10">
                  <a
                    href="#products"
                    className="group flex items-center justify-between gap-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-white/70 transition-colors duration-300 hover:text-accent"
                  >
                    <span>{product.name}</span>
                    <span className="font-mono text-[8.5px] tracking-[0.14em] text-white/25 transition-colors duration-300 group-hover:text-accent">
                      {product.number}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Row 2: Corporate Details & Site Index */}
        <div className="grid gap-6 border-b border-white/15 py-6 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <p className="font-mono text-[9.5px] uppercase tracking-[0.22em] text-white/40">
              Registered office
            </p>
            <p className="mt-2 max-w-[34ch] text-[12.5px] leading-[1.65] text-white/60">
              {company.address.line1} — {company.address.postalCode}
              <br />
              {company.address.state}, {company.address.country}
            </p>
          </div>
          <div className="lg:col-span-3 lg:col-start-7">
            <p className="font-mono text-[9.5px] uppercase tracking-[0.22em] text-white/40">
              Corporate identity
            </p>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.1em] text-white/60">
              CIN {company.cin}
            </p>
            <p className="mt-1 text-[11.5px] leading-[1.6] text-white/45">{company.status}</p>
          </div>
          <div className="lg:col-span-3">
            <p className="font-mono text-[9.5px] uppercase tracking-[0.22em] text-white/40">
              Site index
            </p>
            <ul className="mt-2 grid grid-cols-2 gap-x-5 gap-y-1.5">
              {primaryLinks.map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    className="font-mono text-[9.5px] uppercase tracking-[0.12em] text-white/55 transition-colors duration-300 hover:text-accent"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Row 3: Industrial Statement Sign-Off */}
        <div className="flex flex-col justify-between gap-4 border-b border-white/15 py-6 sm:flex-row sm:items-end">
          <p className="display max-w-[16ch] text-[clamp(2.2rem,5vw,5rem)] text-white/90">
            Industrial
            <br />
            strength<span className="text-accent">.</span>
          </p>
          <a
            href="#top"
            className="group inline-flex w-fit items-center gap-3 font-mono text-[9.5px] uppercase tracking-[0.18em] text-white/50 transition-colors duration-300 hover:text-white"
          >
            <span>Back to top</span>
            <span className="grid h-8 w-8 place-items-center border border-white/20 transition-colors duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-white">
              <ArrowUp
                size={14}
                strokeWidth={1.6}
                className="transition-transform duration-300 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </span>
          </a>
        </div>

        {/* Row 4: Copyright and Legal Disclaimer */}
        <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-mono text-[8.5px] uppercase leading-[1.8] tracking-[0.14em] text-white/35">
              © {year} Star Rolling Mills Pvt. Ltd. All rights reserved.
            </p>
            <p className="mt-1.5 max-w-[70ch] font-mono text-[8.5px] leading-[1.7] tracking-[0.06em] text-white/30">
              Product categories and imagery are indicative. Grades, dimensions, certifications and
              delivery schedules are confirmed on enquiry. Imagery is licensed stock photography,
              not a company photograph.
            </p>
          </div>
          <span className="shrink-0 font-mono text-[8.5px] uppercase tracking-[0.16em] text-white/30">
            SRM / {company.established} — {year}
          </span>
        </div>
      </div>
    </footer>
  )
}
