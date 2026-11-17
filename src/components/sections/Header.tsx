import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowUpRight, Menu, Search, X } from 'lucide-react'
import { navItems, sectionLinks, company } from '../../data/site'
import { cn } from '../../lib/utils'
import { useActiveSection } from '../../hooks/useActiveSection'
import { Logo } from '../common/Logo'

const NAV_IDS = [...navItems.map((item) => item.id), 'contact']

function useBodyLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [locked])
}

type SearchOverlayProps = {
  onClose: () => void
}

function SearchOverlay({ onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return sectionLinks
    return sectionLinks.filter(
      (item) => item.label.toLowerCase().includes(q) || item.number.includes(q),
    )
  }, [query])

  useEffect(() => {
    inputRef.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[90] bg-ink/75 p-4 sm:p-8"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="search-title"
        className="mx-auto mt-[8vh] w-full max-w-2xl border border-ink/15 bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4 sm:px-7">
          <p id="search-title" className="label-ink">
            Search the site
          </p>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center border border-ink/15 text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white"
            aria-label="Close search"
          >
            <X size={16} strokeWidth={1.75} />
          </button>
        </div>
        <div className="flex items-center gap-4 border-b border-line px-5 py-5 sm:px-7">
          <Search size={20} strokeWidth={1.5} className="shrink-0 text-muted" aria-hidden="true" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Try “products”, “history”, “contact”…"
            className="w-full bg-transparent font-display text-xl text-ink outline-none placeholder:text-ink/35 sm:text-2xl"
            aria-label="Search sections"
          />
        </div>
        <ul className="max-h-[50vh] overflow-y-auto">
          {results.length ? (
            results.map((item) => (
              <li key={item.id} className="border-b border-line last:border-b-0">
                <a
                  href={`#${item.id}`}
                  onClick={onClose}
                  className="group flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-paper sm:px-7"
                >
                  <span className="flex items-baseline gap-4">
                    <span className="font-mono text-[10px] tracking-[0.14em] text-accent font-medium">
                      {item.number}
                    </span>
                    <span className="font-display text-[17px] font-medium text-ink group-hover:text-accent transition-colors">
                      {item.label}
                    </span>
                  </span>
                  <ArrowUpRight
                    size={16}
                    strokeWidth={1.5}
                    className="text-muted transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink"
                  />
                </a>
              </li>
            ))
          ) : (
            <li className="px-5 py-8 text-center text-sm text-muted sm:px-7">
              No sections matched “{query}”.
            </li>
          )}
        </ul>
        <div className="flex items-center justify-between border-t border-line px-5 py-3 sm:px-7">
          <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted">
            Star Rolling Mills — Site index
          </span>
          <span className="hidden font-mono text-[9px] uppercase tracking-[0.18em] text-muted sm:block">
            Esc to close
          </span>
        </div>
      </div>
    </div>
  )
}

type MobileMenuProps = {
  onClose: () => void
}

function MobileMenu({ onClose }: MobileMenuProps) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Site navigation"
      className="fixed inset-0 z-[85] overflow-y-auto bg-ink text-white"
    >
      <div className="pointer-events-none absolute inset-0 dot-grid-light opacity-[0.12]" aria-hidden="true" />
      <div className="relative flex min-h-svh flex-col">
        <div className="shell flex h-[72px] items-center justify-between border-b border-white/10">
          <Logo inverse />
          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 place-items-center border border-white/20 text-white transition-colors hover:border-accent hover:bg-accent"
            aria-label="Close menu"
          >
            <X size={18} strokeWidth={1.75} />
          </button>
        </div>

        <nav className="shell flex flex-1 flex-col justify-center py-12">
          <p className="label text-white/45">Navigation</p>
          <ul className="mt-6">
            {navItems.map((item, i) => (
              <li key={item.href} className="border-b border-white/10">
                <a
                  href={item.href}
                  onClick={onClose}
                  className="group flex items-center justify-between py-5"
                >
                  <span className="flex items-baseline gap-4 sm:gap-6">
                    <span className="font-mono text-[10px] tracking-[0.16em] text-accent">
                      0{i + 1}
                    </span>
                    <span className="display text-[clamp(2.1rem,9vw,3.5rem)] text-white transition-colors duration-300 group-hover:text-accent">
                      {item.label}
                    </span>
                  </span>
                  <ArrowUpRight
                    size={22}
                    strokeWidth={1.4}
                    className="text-white/35 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-accent"
                  />
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="label text-white/45">Registered office</p>
              <p className="mt-2 max-w-[28ch] text-sm leading-relaxed text-white/70">
                {company.address.line1} — {company.address.postalCode}, {company.address.state},{' '}
                {company.address.country}
              </p>
            </div>
            <a
              href="#contact"
              onClick={onClose}
              className="btn btn-accent w-full sm:w-auto"
            >
              Start an enquiry
              <ArrowUpRight size={15} strokeWidth={1.75} aria-hidden="true" />
            </a>
          </div>
        </nav>

        <div className="shell flex items-center justify-between border-t border-white/10 py-5">
          <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/40">
            Established {company.established}
          </span>
          <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/40">
            {company.sector}
          </span>
        </div>
      </div>
    </div>
  )
}

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const active = useActiveSection(NAV_IDS)

  useBodyLock(menuOpen || searchOpen)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-[80] border-b transition-colors duration-300',
          scrolled
            ? 'border-ink/10 bg-white/95 backdrop-blur-md shadow-sm'
            : 'border-ink/10 bg-paper/95 backdrop-blur-sm',
        )}
      >
        <div className="shell flex h-[72px] items-center justify-between md:h-[80px]">
          <a href="#top" aria-label="Star Rolling Mills — back to top" className="shrink-0">
            <Logo />
          </a>

          <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex xl:gap-9">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="nav-link"
                data-active={active === item.id}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-5 lg:flex">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="grid h-8 w-8 place-items-center text-ink/70 transition-colors hover:text-accent"
              aria-label="Search the site"
            >
              <Search size={17} strokeWidth={1.6} />
            </button>
            <span className="h-4 w-px bg-ink/15" aria-hidden="true" />
            <a href="#contact" className="nav-link hidden xl:inline-block" data-active={active === 'contact'}>
              Contact
            </a>
            <a href="#contact" className="btn btn-dark px-5 py-3 text-[10px]">
              Enquire Now
              <ArrowUpRight size={14} strokeWidth={1.75} aria-hidden="true" />
            </a>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="grid h-10 w-10 place-items-center text-ink"
              aria-label="Search the site"
            >
              <Search size={19} strokeWidth={1.6} />
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="grid h-10 w-10 place-items-center border border-ink/15 text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white"
              aria-label="Open navigation menu"
              aria-expanded={menuOpen}
            >
              <Menu size={19} strokeWidth={1.6} />
            </button>
          </div>
        </div>
      </header>

      {menuOpen ? <MobileMenu onClose={() => setMenuOpen(false)} /> : null}
      {searchOpen ? <SearchOverlay onClose={() => setSearchOpen(false)} /> : null}
    </>
  )
}
