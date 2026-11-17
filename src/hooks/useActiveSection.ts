import { useEffect, useState } from 'react'

export function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState('')

  useEffect(() => {
    let frame = 0

    const update = () => {
      frame = 0
      const marker = window.scrollY + Math.min(window.innerHeight * 0.32, 260)
      let current = ''
      let currentTop = -1

      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.offsetTop <= marker && el.offsetTop > currentTop) {
          current = id
          currentTop = el.offsetTop
        }
      }

      setActive(current)
    }

    const onScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [ids])

  return active
}
