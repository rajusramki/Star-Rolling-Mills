import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Orchestrates subtle, high-performance scroll choreography across the site.
 * All animations are automatically disabled when prefers-reduced-motion is active.
 */
export function useScrollAnimations() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return

    const ctx = gsap.context(() => {
      // 1. Subtle, disciplined section content reveals
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        gsap.from(el, {
          y: 20,
          autoAlpha: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            once: true,
          },
        })
      })

      // 2. Staggered reveals for grouped items (e.g. product cards, stats, timeline)
      gsap.utils.toArray<HTMLElement>('[data-stagger]').forEach((container) => {
        const items = container.querySelectorAll('[data-stagger-item]')
        if (!items.length) return

        gsap.from(items, {
          y: 22,
          autoAlpha: 0,
          duration: 0.75,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: container,
            start: 'top 88%',
            once: true,
          },
        })
      })

      // 3. Technical mechanical clip reveals for image frames
      gsap.utils.toArray<HTMLElement>('[data-clip]').forEach((el) => {
        gsap.fromTo(
          el,
          { clipPath: 'inset(12% 0 0 0)' },
          {
            clipPath: 'inset(0% 0 0 0)',
            duration: 1.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              once: true,
            },
          },
        )
      })

      // 4. Restrained, physical image parallax (subtle vertical shift only)
      gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
        const wrap = el.closest<HTMLElement>('[data-parallax-wrap]') ?? el.parentElement
        if (!wrap) return

        gsap.fromTo(
          el,
          { yPercent: -3 },
          {
            yPercent: 3,
            ease: 'none',
            scrollTrigger: {
              trigger: wrap,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.8,
            },
          },
        )
      })

      // 5. Line and divider reveals (drafting/blueprint precision)
      gsap.utils.toArray<HTMLElement>('[data-line]').forEach((el) => {
        gsap.fromTo(
          el,
          { scaleX: 0 },
          {
            scaleX: 1,
            transformOrigin: 'left center',
            duration: 1.1,
            ease: 'power3.inOut',
            scrollTrigger: {
              trigger: el,
              start: 'top 92%',
              once: true,
            },
          },
        )
      })
    })

    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    void document.fonts?.ready.then(refresh)

    return () => {
      window.removeEventListener('load', refresh)
      ctx.revert()
    }
  }, [])
}
