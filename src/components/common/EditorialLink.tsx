import type { ReactNode } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '../../lib/utils'

type EditorialLinkProps = {
  children: ReactNode
  href?: string
  onClick?: () => void
  inverse?: boolean
  className?: string
  ariaLabel?: string
}

export function EditorialLink({
  children,
  href = '#contact',
  onClick,
  inverse = false,
  className,
  ariaLabel,
}: EditorialLinkProps) {
  return (
    <a
      href={href}
      onClick={onClick}
      aria-label={ariaLabel}
      className={cn(
        'group inline-flex items-center gap-3 font-mono text-[10px] font-medium uppercase tracking-[0.2em] transition-colors duration-300',
        inverse ? 'text-white/80 hover:text-white' : 'text-ink hover:text-accent',
        className,
      )}
    >
      <span>{children}</span>
      <ArrowUpRight
        size={14}
        strokeWidth={1.75}
        className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        aria-hidden="true"
      />
    </a>
  )
}
