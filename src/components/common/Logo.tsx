import { cn } from '../../lib/utils'

type LogoProps = {
  inverse?: boolean
  size?: 'sm' | 'lg'
  className?: string
}

export function Logo({ inverse = false, size = 'sm', className }: LogoProps) {
  const large = size === 'lg'

  return (
    <span className={cn('inline-flex items-center', large ? 'gap-4' : 'gap-3', className)}>
      <span
        className={cn(
          'relative grid shrink-0 place-items-center overflow-hidden',
          large ? 'h-12 w-12' : 'h-10 w-10',
          inverse ? 'bg-white' : 'bg-ink',
        )}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 48 48"
          className={cn(large ? 'h-9 w-9' : 'h-7 w-7')}
          fill="none"
        >
          <path
            d="M24 5 27.8 20.2 43 24 27.8 27.8 24 43 20.2 27.8 5 24 20.2 20.2Z"
            fill="#E7472E"
          />
          <rect x="10" y="38" width="28" height="1.5" fill={inverse ? '#111111' : '#FFFFFF'} opacity="0.85" />
        </svg>
      </span>
      <span className="flex flex-col">
        <span
          className={cn(
            'block font-display font-semibold uppercase leading-none tracking-[0.12em]',
            large ? 'text-[20px]' : 'text-[15px]',
            inverse ? 'text-white' : 'text-ink',
          )}
        >
          Star
        </span>
        <span
          className={cn(
            'mt-1.5 block font-mono uppercase leading-none tracking-[0.24em]',
            large ? 'text-[8.5px]' : 'text-[7.5px]',
            inverse ? 'text-white/60' : 'text-muted',
          )}
        >
          Rolling Mills
        </span>
      </span>
    </span>
  )
}
