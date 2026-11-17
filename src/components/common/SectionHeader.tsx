import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'

type SectionLabelProps = {
  children: ReactNode
  index?: string
  inverse?: boolean
  className?: string
}

export function SectionLabel({ children, index, inverse = false, className }: SectionLabelProps) {
  return (
    <div className={cn('flex items-center justify-between gap-6', className)}>
      <span
        className={cn(
          'inline-flex items-center gap-2 font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.24em]',
          inverse ? 'text-white/70' : 'text-ink/70',
        )}
      >
        <span className="h-1.5 w-1.5 shrink-0 bg-accent" aria-hidden="true" />
        {children}
      </span>
      {index ? (
        <span
          className={cn(
            'font-mono text-[9.5px] font-medium tracking-[0.16em]',
            inverse ? 'text-white/45' : 'text-muted',
          )}
        >
          {index}
        </span>
      ) : null}
    </div>
  )
}

type SectionHeaderProps = {
  label: string
  index?: string
  headingId?: string
  title: ReactNode
  description?: ReactNode
  inverse?: boolean
  className?: string
  titleClassName?: string
  descriptionClassName?: string
}

export function SectionHeader({
  label,
  index,
  headingId,
  title,
  description,
  inverse = false,
  className,
  titleClassName,
  descriptionClassName,
}: SectionHeaderProps) {
  return (
    <div className={className}>
      <SectionLabel index={index} inverse={inverse}>
        {label}
      </SectionLabel>
      <div
        className={cn(
          'mt-5 grid gap-6 border-t pt-5 lg:mt-6 lg:grid-cols-12 lg:gap-8 lg:pt-6',
          inverse ? 'border-white/15' : 'border-ink/15',
        )}
      >
        <h2
          id={headingId}
          className={cn(
            'display text-[clamp(2.2rem,4.2vw,4.6rem)] leading-[0.88] lg:col-span-8',
            inverse && 'text-white',
            titleClassName,
          )}
        >
          {title}
        </h2>
        {description ? (
          <div
            className={cn(
              'flex flex-col justify-end lg:col-span-4 lg:items-start',
              inverse ? 'text-white/65' : 'text-muted',
              descriptionClassName,
            )}
          >
            <p className="max-w-[36ch] text-[13.5px] leading-[1.65] md:text-[14px]">{description}</p>
          </div>
        ) : null}
      </div>
    </div>
  )
}
