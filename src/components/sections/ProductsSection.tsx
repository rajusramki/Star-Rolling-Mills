import { ArrowUpRight } from 'lucide-react'
import { products } from '../../data/site'
import { requestSpecification } from '../../lib/utils'
import { SectionHeader } from '../common/SectionHeader'

export function ProductsSection() {
  return (
    <section id="products" aria-labelledby="products-heading" className="section-pad bg-white">
      <div className="shell">
        <div data-reveal>
          <SectionHeader
            label="Materials & products"
            index="05 / Catalogue"
            headingId="products-heading"
            title={
              <>
                Materials that
                <br />
                move industry.
              </>
            }
            description="A catalogue framework covering reinforcement, structural and long-product categories. Confirmed grades, dimensions and delivery schedules are provided on enquiry."
          />
        </div>

        {/* Subheader Meta Bar */}
        <div
          data-reveal
          className="mt-5 flex flex-col justify-between gap-3 border-t border-ink/15 pt-3 sm:flex-row sm:items-center"
        >
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-ink/60">
              Catalogue framework
            </span>
            <span className="h-3 w-px bg-ink/15" aria-hidden="true" />
            <span className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-ink/60">
              06 material categories
            </span>
          </div>
          <span className="inline-flex items-center gap-2.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-muted">
            <span className="h-1.5 w-1.5 bg-accent" aria-hidden="true" />
            Specifications supplied on request
          </span>
        </div>

        {/* Products Grid */}
        <div className="mt-6 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:mt-8 lg:grid-cols-3 lg:gap-y-10">
          {products.map((product) => (
            <article key={product.number} data-reveal className="group flex flex-col h-full">
              {/* Product Image Frame */}
              <div className="relative aspect-[16/11] overflow-hidden bg-paper border border-ink/10">
                <img
                  src={product.image}
                  alt={product.imageAlt}
                  width={1200}
                  height={900}
                  loading="lazy"
                  decoding="async"
                  className="img-cover media-zoom"
                />
                <span className="absolute left-3.5 top-3.5 bg-white px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-ink border border-ink/15 shadow-sm">
                  {product.category}
                </span>
                <span className="absolute right-3.5 top-3.5 font-mono text-[10px] tracking-[0.14em] text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)]">
                  /{product.number}
                </span>
              </div>

              {/* Product Content Block */}
              <div className="mt-3.5 flex flex-1 flex-col border-t border-ink/15 pt-3">
                <div className="flex items-center justify-between gap-4">
                  <span className="index-number text-accent font-medium">Product {product.number}</span>
                  <span className="font-mono text-[8.5px] uppercase tracking-[0.16em] text-muted">
                    On request
                  </span>
                </div>
                <h3 className="mt-1.5 font-display text-[clamp(1.2rem,1.5vw,1.45rem)] font-semibold uppercase leading-tight tracking-[-0.03em] text-ink transition-colors duration-300 group-hover:text-accent">
                  {product.name}
                </h3>
                <p className="mt-1.5 text-[12.5px] leading-[1.65] text-body/80">
                  {product.description}
                </p>

                {/* Common Baseline Action Link */}
                <div className="mt-auto pt-3.5">
                  <a
                    href="#contact"
                    onClick={() =>
                      requestSpecification(`Specifications required: ${product.name}`)
                    }
                    className="group/link flex items-center justify-between border-t border-ink/10 pt-2.5 font-mono text-[9.5px] font-medium uppercase tracking-[0.18em] text-ink transition-colors duration-300 hover:text-accent"
                  >
                    <span>Request specifications</span>
                    <ArrowUpRight
                      size={14}
                      strokeWidth={1.6}
                      className="transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom Banner */}
        <div
          data-reveal
          className="mt-8 flex flex-col justify-between gap-5 border-t border-ink/15 pt-4 sm:flex-row sm:items-start"
        >
          <p className="max-w-[70ch] font-mono text-[9.5px] leading-[1.7] tracking-[0.06em] text-muted">
            Product profiles shown are indicative and pending catalogue verification. No grade,
            dimension or certification is implied. Confirmed specifications are available on
            enquiry.
          </p>
          <a
            href="#contact"
            onClick={() => requestSpecification('Full product catalogue request')}
            className="btn btn-dark shrink-0"
          >
            Request the catalogue
            <ArrowUpRight size={15} strokeWidth={1.7} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  )
}
