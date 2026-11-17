const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const ENQUIRY_TYPES = new Set([
  'General enquiry',
  'Product specification',
  'Supply partnership',
  'Scrap / material sourcing',
  'Careers',
  'Other',
])

export const onRequestPost = async ({ request, env }: { request: Request; env: Record<string, any> }) => {
  let body: Record<string, any> = {}
  try {
    body = (await request.json()) ?? {}
  } catch {
    return new Response(
      JSON.stringify({ ok: false, message: 'Invalid JSON payload.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    )
  }

  // Honeypot field: silently accept to prevent bot retries
  const website = typeof body.website === 'string' ? body.website.trim() : ''
  if (website) {
    return new Response(
      JSON.stringify({ ok: true, reference: 'SRM-RECEIVED', message: 'Enquiry received.' }),
      { status: 201, headers: { 'Content-Type': 'application/json' } },
    )
  }

  const name = typeof body.name === 'string' ? body.name.trim() : ''
  const company = typeof body.company === 'string' ? body.company.trim() : ''
  const email = typeof body.email === 'string' ? body.email.trim() : ''
  const phone = typeof body.phone === 'string' ? body.phone.trim() : ''
  const enquiryType = typeof body.enquiryType === 'string' ? body.enquiryType.trim() : ''
  const message = typeof body.message === 'string' ? body.message.trim() : ''
  const consent = Boolean(body.consent)

  if (name.length < 2) {
    return new Response(
      JSON.stringify({ ok: false, message: 'Please provide your name (at least 2 characters).' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    )
  }

  if (!email || !emailPattern.test(email)) {
    return new Response(
      JSON.stringify({ ok: false, message: 'Please provide a valid email address.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    )
  }

  if (!ENQUIRY_TYPES.has(enquiryType)) {
    return new Response(
      JSON.stringify({ ok: false, message: 'Please select a recognized enquiry type.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    )
  }

  if (message.length < 10) {
    return new Response(
      JSON.stringify({ ok: false, message: 'Please provide a message with at least 10 characters.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    )
  }

  if (!consent) {
    return new Response(
      JSON.stringify({ ok: false, message: 'Please confirm consent for us to respond to your enquiry.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    )
  }

  const year = new Date().getFullYear()
  const reference = `SRM-${year}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`
  const receivedAt = new Date().toISOString()
  const clientIp = request.headers.get('cf-connecting-ip') || 'unknown'

  const record = {
    reference,
    receivedAt,
    name,
    company,
    email,
    phone,
    enquiryType,
    message,
    clientIp,
  }

  // If a KV namespace (e.g. ENQUIRIES_KV) is bound, persist to KV
  if (env?.ENQUIRIES_KV?.put) {
    try {
      await env.ENQUIRIES_KV.put(reference, JSON.stringify(record))
    } catch (err) {
      console.error('KV persist error:', err)
    }
  }

  // If a webhook (e.g. Slack/Discord/CRM/Zapier/Email endpoint) is configured
  if (typeof env?.ENQUIRY_WEBHOOK_URL === 'string' && env.ENQUIRY_WEBHOOK_URL.startsWith('http')) {
    try {
      await fetch(env.ENQUIRY_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record),
      })
    } catch (err) {
      console.error('Webhook forward error:', err)
    }
  }

  return new Response(
    JSON.stringify({
      ok: true,
      reference,
      message: 'Your enquiry has been logged successfully.',
    }),
    {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )
}
