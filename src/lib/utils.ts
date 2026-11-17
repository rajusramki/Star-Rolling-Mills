import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export const ENQUIRY_PREFILL_EVENT = 'srm:prefill-enquiry'

export function requestSpecification(topic: string) {
  if (typeof window === 'undefined') return
  window.dispatchEvent(
    new CustomEvent(ENQUIRY_PREFILL_EVENT, {
      detail: { topic },
    }),
  )
}

export function scrollToEnquiry() {
  document.getElementById('enquiry')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
