import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { AlertCircle, ArrowUpRight, Check, ChevronDown, Loader2 } from 'lucide-react'
import { enquiryTypes } from '../../data/site'
import { ENQUIRY_PREFILL_EVENT } from '../../lib/utils'

type FormValues = {
  name: string
  company: string
  email: string
  phone: string
  enquiryType: string
  message: string
  consent: boolean
  website: string
}

type FormErrors = Partial<Record<keyof FormValues, string>>

type Status = 'idle' | 'sending' | 'success' | 'error'

const initialValues: FormValues = {
  name: '',
  company: '',
  email: '',
  phone: '',
  enquiryType: 'General enquiry',
  message: '',
  consent: false,
  website: '',
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {}

  if (values.name.trim().length < 2) {
    errors.name = 'Please enter your name.'
  }

  if (!values.email.trim()) {
    errors.email = 'Please enter your email address.'
  } else if (!emailPattern.test(values.email.trim())) {
    errors.email = 'Please enter a valid email address.'
  }

  if (!values.enquiryType) {
    errors.enquiryType = 'Please select an enquiry type.'
  }

  if (values.message.trim().length < 10) {
    errors.message = 'Please add a little more detail (at least 10 characters).'
  }

  if (!values.consent) {
    errors.consent = 'Please confirm that we may respond to this enquiry.'
  }

  return errors
}

function inferEnquiryType(topic: string) {
  const normalised = topic.toLowerCase()

  if (normalised.includes('scrap')) return 'Scrap / material sourcing'
  if (normalised.includes('partnership')) return 'Supply partnership'
  if (normalised.includes('career')) return 'Careers'
  if (
    normalised.includes('specification') ||
    normalised.includes('catalogue') ||
    normalised.includes('material') ||
    normalised.includes('application') ||
    normalised.includes('industry') ||
    normalised.includes('infrastructure') ||
    normalised.includes('capability') ||
    normalised.includes('quality')
  ) {
    return 'Product specification'
  }

  return 'General enquiry'
}

export function EnquiryForm() {
  const [values, setValues] = useState<FormValues>(initialValues)
  const [errors, setErrors] = useState<FormErrors>({})
  const [status, setStatus] = useState<Status>('idle')
  const [serverMessage, setServerMessage] = useState('')
  const [reference, setReference] = useState<string | null>(null)
  const [prefillTopic, setPrefillTopic] = useState<string | null>(null)

  const formRef = useRef<HTMLDivElement>(null)
  const successRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onPrefill = (event: Event) => {
      const detail = (event as CustomEvent<{ topic?: string }>).detail
      const topic = detail?.topic?.trim()
      if (!topic) return

      setPrefillTopic(topic)
      setValues((prev) => ({
        ...prev,
        enquiryType: inferEnquiryType(topic),
        message: prev.message.trim() ? prev.message : topic,
      }))
      setErrors({})
      setServerMessage('')

      if (status === 'success') {
        setStatus('idle')
        setReference(null)
      }

      window.setTimeout(() => {
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        formRef.current?.scrollIntoView({
          behavior: reduce ? 'auto' : 'smooth',
          block: 'start',
        })
      }, 80)
    }

    window.addEventListener(ENQUIRY_PREFILL_EVENT, onPrefill)
    return () => window.removeEventListener(ENQUIRY_PREFILL_EVENT, onPrefill)
  }, [status])

  useEffect(() => {
    if (status === 'success') {
      successRef.current?.focus()
    }
  }, [status])

  const setField = <K extends keyof FormValues,>(key: K, value: FormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => {
      if (!prev[key]) return prev
      const next = { ...prev }
      delete next[key]
      return next
    })
    if (status === 'error') {
      setStatus('idle')
      setServerMessage('')
    }
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = event.target
    const key = target.name as keyof FormValues

    if (target instanceof HTMLInputElement && target.type === 'checkbox') {
      setField(key, target.checked as FormValues[typeof key])
      return
    }

    setField(key, target.value as FormValues[typeof key])
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (status === 'sending') return

    const nextErrors = validate(values)
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors)
      setStatus('idle')
      const firstField = Object.keys(nextErrors)[0]
      const field = firstField ? formRef.current?.querySelector<HTMLElement>(`[name="${firstField}"]`) : null
      field?.focus()
      return
    }

    setStatus('sending')
    setServerMessage('')

    try {
      const response = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: values.name.trim(),
          company: values.company.trim(),
          email: values.email.trim(),
          phone: values.phone.trim(),
          enquiryType: values.enquiryType,
          message: values.message.trim(),
          consent: values.consent,
          website: values.website,
          page: window.location.pathname,
        }),
      })

      const payload = (await response.json().catch(() => null)) as
        | { message?: string; reference?: string }
        | null

      if (response.status !== 201) {
        throw new Error(
          payload?.message ??
            'The enquiry could not be submitted. Please try again, or check back shortly.',
        )
      }

      setReference(payload?.reference ?? null)
      setStatus('success')
      setPrefillTopic(null)
      setValues(initialValues)
      setErrors({})
    } catch (error) {
      setStatus('error')
      setServerMessage(
        error instanceof Error
          ? error.message
          : 'The enquiry could not be submitted. Please try again.',
      )
    }
  }

  const resetForm = () => {
    setStatus('idle')
    setReference(null)
    setServerMessage('')
    setValues(initialValues)
    setErrors({})
    setPrefillTopic(null)
  }

  return (
    <div
      ref={formRef}
      id="enquiry"
      className="scroll-mt-28 border border-ink/15 bg-paper p-5 sm:p-6 lg:p-7 shadow-sm"
    >
      <div className="flex items-center justify-between gap-4 border-b border-ink/15 pb-3">
        <div className="flex items-center gap-2.5">
          <span className="h-1.5 w-1.5 bg-accent" aria-hidden="true" />
          <span className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-ink/70">
            Enquiry form / 01
          </span>
        </div>
        <span className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-muted">
          SRM / Contact
        </span>
      </div>

      {status === 'success' ? (
        <div
          ref={successRef}
          tabIndex={-1}
          role="status"
          className="py-8 outline-none sm:py-12"
        >
          <span className="grid h-12 w-12 place-items-center bg-ink text-white">
            <Check size={20} strokeWidth={1.7} aria-hidden="true" />
          </span>
          <p className="mt-6 font-mono text-[9.5px] uppercase tracking-[0.22em] text-accent font-medium">
            Enquiry received
          </p>
          <h3 className="mt-3 max-w-[18ch] font-display text-[clamp(1.8rem,3vw,2.6rem)] font-semibold uppercase leading-[0.95] tracking-[-0.04em] text-ink">
            Thank you.
            <br />
            Your enquiry is logged.
          </h3>
          <p className="mt-4 max-w-[44ch] text-[13.5px] leading-[1.75] text-body/80">
            Your details have been received by the Star Rolling Mills enquiry desk. Keep the
            reference below for your records.
          </p>
          {reference ? (
            <div className="mt-6 flex items-center justify-between border-y border-ink/15 py-3.5">
              <span className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-muted">
                Reference
              </span>
              <span className="font-mono text-[12px] font-semibold tracking-[0.12em] text-ink">{reference}</span>
            </div>
          ) : null}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={resetForm} className="btn btn-dark">
              Send another enquiry
              <ArrowUpRight size={15} strokeWidth={1.7} aria-hidden="true" />
            </button>
            <a href="#products" className="btn btn-outline">
              Browse materials
            </a>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="pt-4">
          {prefillTopic ? (
            <div className="mb-4 flex items-start justify-between gap-4 border border-ink/15 bg-white px-4 py-2.5">
              <p className="font-mono text-[9.5px] uppercase leading-[1.7] tracking-[0.12em] text-ink/70">
                <span className="text-accent font-medium">Regarding:</span> {prefillTopic}
              </p>
              <button
                type="button"
                onClick={() => setPrefillTopic(null)}
                className="shrink-0 font-mono text-[9.5px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-accent"
                aria-label="Dismiss enquiry topic"
              >
                Clear
              </button>
            </div>
          ) : null}

          <div className="grid gap-x-5 gap-y-3.5 sm:grid-cols-2">
            <div>
              <label htmlFor="enquiry-name" className="field-label">
                Full name <span className="text-accent">*</span>
              </label>
              <input
                id="enquiry-name"
                name="name"
                type="text"
                value={values.name}
                onChange={handleChange}
                autoComplete="name"
                placeholder="Your name"
                maxLength={120}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? 'enquiry-name-error' : undefined}
                className="field-input"
              />
              {errors.name ? (
                <p id="enquiry-name-error" className="field-error">
                  {errors.name}
                </p>
              ) : null}
            </div>

            <div>
              <label htmlFor="enquiry-company" className="field-label">
                Company
              </label>
              <input
                id="enquiry-company"
                name="company"
                type="text"
                value={values.company}
                onChange={handleChange}
                autoComplete="organization"
                placeholder="Company name"
                maxLength={160}
                className="field-input"
              />
            </div>

            <div>
              <label htmlFor="enquiry-email" className="field-label">
                Email <span className="text-accent">*</span>
              </label>
              <input
                id="enquiry-email"
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                autoComplete="email"
                placeholder="you@company.com"
                maxLength={200}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'enquiry-email-error' : undefined}
                className="field-input"
              />
              {errors.email ? (
                <p id="enquiry-email-error" className="field-error">
                  {errors.email}
                </p>
              ) : null}
            </div>

            <div>
              <label htmlFor="enquiry-phone" className="field-label">
                Phone
              </label>
              <input
                id="enquiry-phone"
                name="phone"
                type="tel"
                value={values.phone}
                onChange={handleChange}
                autoComplete="tel"
                placeholder="Include country code"
                maxLength={40}
                className="field-input"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="enquiry-type" className="field-label">
                Enquiry type <span className="text-accent">*</span>
              </label>
              <div className="relative">
                <select
                  id="enquiry-type"
                  name="enquiryType"
                  value={values.enquiryType}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.enquiryType)}
                  aria-describedby={errors.enquiryType ? 'enquiry-type-error' : undefined}
                  className="field-select"
                >
                  {enquiryTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={15}
                  strokeWidth={1.6}
                  className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-ink/50"
                  aria-hidden="true"
                />
              </div>
              {errors.enquiryType ? (
                <p id="enquiry-type-error" className="field-error">
                  {errors.enquiryType}
                </p>
              ) : null}
            </div>

            <div className="sm:col-span-2">
              <div className="flex items-baseline justify-between gap-4">
                <label htmlFor="enquiry-message" className="field-label">
                  Message <span className="text-accent">*</span>
                </label>
                <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted">
                  {values.message.length} / 2000
                </span>
              </div>
              <textarea
                id="enquiry-message"
                name="message"
                rows={4}
                value={values.message}
                onChange={handleChange}
                placeholder="Tell us about the material, quantity or requirement…"
                maxLength={2000}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={errors.message ? 'enquiry-message-error' : undefined}
                className="field-input resize-y"
              />
              {errors.message ? (
                <p id="enquiry-message-error" className="field-error">
                  {errors.message}
                </p>
              ) : null}
            </div>

            <div className="absolute -left-[9999px] top-auto h-0 w-0 overflow-hidden" aria-hidden="true">
              <label htmlFor="enquiry-website">Website</label>
              <input
                id="enquiry-website"
                name="website"
                type="text"
                value={values.website}
                onChange={handleChange}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>
          </div>

          <div className="mt-4 border-t border-ink/15 pt-3.5">
            <label className="flex cursor-pointer items-start gap-3">
              <span className="relative mt-0.5 grid h-4 w-4 shrink-0 place-items-center border border-ink/35 bg-white">
                <input
                  type="checkbox"
                  name="consent"
                  checked={values.consent}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.consent)}
                  aria-describedby={errors.consent ? 'enquiry-consent-error' : undefined}
                  className="peer absolute inset-0 cursor-pointer opacity-0"
                />
                <Check
                  size={12}
                  strokeWidth={2.2}
                  className="pointer-events-none text-ink opacity-0 transition-opacity peer-checked:opacity-100"
                  aria-hidden="true"
                />
              </span>
              <span className="max-w-[52ch] text-[12px] leading-[1.65] text-body/75">
                I agree that Star Rolling Mills may use these details to respond to my enquiry. No
                marketing list, no third-party sharing.
              </span>
            </label>
            {errors.consent ? (
              <p id="enquiry-consent-error" className="field-error">
                {errors.consent}
              </p>
            ) : null}
          </div>

          {status === 'error' ? (
            <div role="alert" className="mt-4 flex items-start gap-3 border border-accent bg-white px-4 py-2.5">
              <AlertCircle size={16} strokeWidth={1.7} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
              <p className="text-[12.5px] leading-[1.6] text-body/85">{serverMessage}</p>
            </div>
          ) : null}

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-ink/10 pt-4">
            <p className="font-mono text-[9px] uppercase leading-[1.7] tracking-[0.14em] text-muted">
              Required fields <span className="text-accent">*</span> — details are stored only to
              respond to this enquiry.
            </p>
            <button
              type="submit"
              disabled={status === 'sending'}
              className="btn btn-dark w-full shrink-0 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {status === 'sending' ? (
                <>
                  Sending
                  <Loader2 size={15} strokeWidth={1.7} className="animate-spin" aria-hidden="true" />
                </>
              ) : (
                <>
                  Send enquiry
                  <ArrowUpRight size={15} strokeWidth={1.7} aria-hidden="true" />
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
