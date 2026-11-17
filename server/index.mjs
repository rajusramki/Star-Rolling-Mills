import 'dotenv/config'
import express from 'express'
import nodemailer from 'nodemailer'
import { randomUUID } from 'node:crypto'
import { appendFile, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '..')
const distDir = path.join(projectRoot, 'dist')
const dataDir = path.resolve(projectRoot, process.env.ENQUIRY_DATA_DIR || 'data')
const dataFile = path.join(dataDir, 'enquiries.jsonl')

const PORT = Number(process.env.PORT || 8787)
const ENQUIRY_TYPES = new Set([
  'General enquiry',
  'Product specification',
  'Supply partnership',
  'Scrap / material sourcing',
  'Careers',
  'Other',
])

const app = express()
app.disable('x-powered-by')
app.set('trust proxy', 1)

app.use(express.json({ limit: '32kb' }))

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.setHeader('X-Frame-Options', 'SAMEORIGIN')
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  next()
})

/* ------------------------------------------------------------------ */
/* Rate limiting                                                       */
/* ------------------------------------------------------------------ */

const RATE_LIMIT = 8
const RATE_WINDOW_MS = 10 * 60 * 1000
const rateBuckets = new Map()

function isRateLimited(ip) {
  const now = Date.now()
  const bucket = rateBuckets.get(ip)

  if (!bucket || bucket.resetAt <= now) {
    rateBuckets.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS })
    return false
  }

  bucket.count += 1
  return bucket.count > RATE_LIMIT
}

setInterval(() => {
  const now = Date.now()
  for (const [ip, bucket] of rateBuckets) {
    if (bucket.resetAt <= now) rateBuckets.delete(ip)
  }
}, RATE_WINDOW_MS).unref()

/* ------------------------------------------------------------------ */
/* Persistence                                                         */
/* ------------------------------------------------------------------ */

let writeQueue = Promise.resolve()

function persistEnquiry(record) {
  writeQueue = writeQueue.then(async () => {
    await mkdir(dataDir, { recursive: true })
    await appendFile(dataFile, `${JSON.stringify(record)}\n`, 'utf8')
  })

  return writeQueue
}

/* ------------------------------------------------------------------ */
/* Optional email delivery                                             */
/* ------------------------------------------------------------------ */

const smtpConfigured = Boolean(process.env.SMTP_HOST && process.env.ENQUIRY_TO)

const transporter = smtpConfigured
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: String(process.env.SMTP_SECURE || 'false') === 'true',
      auth:
        process.env.SMTP_USER && process.env.SMTP_PASS
          ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
          : undefined,
    })
  : null

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

async function sendEnquiryEmail(record) {
  if (!transporter) return { sent: false, reason: 'smtp-not-configured' }

  const from = process.env.ENQUIRY_FROM || process.env.SMTP_USER || 'no-reply@localhost'
  const lines = [
    ['Reference', record.reference],
    ['Received', record.receivedAt],
    ['Name', record.name],
    ['Company', record.company || '—'],
    ['Email', record.email],
    ['Phone', record.phone || '—'],
    ['Enquiry type', record.enquiryType],
    ['Page', record.page || '—'],
  ]

  const text = [
    `New website enquiry — ${record.reference}`,
    '',
    ...lines.map(([label, value]) => `${label}: ${value}`),
    '',
    'Message:',
    record.message,
  ].join('\n')

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;color:#111;line-height:1.6;max-width:680px">
      <h1 style="font-size:20px;margin:0 0 4px">New website enquiry</h1>
      <p style="margin:0 0 20px;color:#777;font-size:13px">Reference ${escapeHtml(record.reference)}</p>
      <table style="border-collapse:collapse;width:100%;font-size:14px">
        ${lines
          .map(
            ([label, value]) =>
              `<tr><td style="padding:8px 12px;border-bottom:1px solid #e4e4e4;color:#777;width:140px">${escapeHtml(label)}</td><td style="padding:8px 12px;border-bottom:1px solid #e4e4e4">${escapeHtml(value)}</td></tr>`,
          )
          .join('')}
      </table>
      <h2 style="font-size:15px;margin:24px 0 8px">Message</h2>
      <p style="white-space:pre-wrap;font-size:14px;margin:0">${escapeHtml(record.message)}</p>
    </div>
  `

  const info = await transporter.sendMail({
    from,
    to: process.env.ENQUIRY_TO,
    replyTo: record.email,
    subject: `Website enquiry — ${record.reference} — ${record.enquiryType}`,
    text,
    html,
  })

  return { sent: true, messageId: info.messageId }
}

/* ------------------------------------------------------------------ */
/* API                                                                 */
/* ------------------------------------------------------------------ */

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'star-rolling-mills-enquiry-api',
    time: new Date().toISOString(),
    storage: 'jsonl',
    email: smtpConfigured ? 'configured' : 'not-configured',
  })
})

app.post('/api/enquiry', async (req, res) => {
  if (isRateLimited(req.ip || 'unknown')) {
    res.status(429).json({
      ok: false,
      message: 'Too many enquiries from this connection. Please wait a few minutes and try again.',
    })
    return
  }

  const body = req.body ?? {}
  const website = typeof body.website === 'string' ? body.website.trim() : ''

  // Honeypot: silently accept without storing, so bots do not retry.
  if (website) {
    res.status(201).json({ ok: true, reference: 'SRM-RECEIVED', message: 'Enquiry received.' })
    return
  }

  const name = typeof body.name === 'string' ? body.name.trim() : ''
  const company = typeof body.company === 'string' ? body.company.trim() : ''
  const email = typeof body.email === 'string' ? body.email.trim() : ''
  const phone = typeof body.phone === 'string' ? body.phone.trim() : ''
  const enquiryType = typeof body.enquiryType === 'string' ? body.enquiryType.trim() : ''
  const message = typeof body.message === 'string' ? body.message.trim() : ''
  const page = typeof body.page === 'string' ? body.page.slice(0, 200) : ''

  const errors = []

  if (name.length < 2 || name.length > 120) {
    errors.push('Please provide a name between 2 and 120 characters.')
  }
  if (company.length > 160) {
    errors.push('Company name is too long.')
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 200) {
    errors.push('Please provide a valid email address.')
  }
  if (phone.length > 40) {
    errors.push('Phone number is too long.')
  }
  if (!ENQUIRY_TYPES.has(enquiryType)) {
    errors.push('Please select a valid enquiry type.')
  }
  if (message.length < 10 || message.length > 2000) {
    errors.push('Please provide a message between 10 and 2000 characters.')
  }
  if (body.consent !== true) {
    errors.push('Consent to be contacted is required.')
  }

  if (errors.length) {
    res.status(422).json({ ok: false, message: errors[0], errors })
    return
  }

  const record = {
    reference: `SRM-${new Date().getUTCFullYear()}-${randomUUID().slice(0, 8).toUpperCase()}`,
    receivedAt: new Date().toISOString(),
    name,
    company,
    email,
    phone,
    enquiryType,
    message,
    consent: true,
    page,
  }

  try {
    await persistEnquiry(record)
  } catch (error) {
    console.error('[enquiry] Failed to persist enquiry:', error)
    res.status(500).json({
      ok: false,
      message: 'The enquiry could not be recorded. Please try again shortly.',
    })
    return
  }

  if (transporter) {
    try {
      await sendEnquiryEmail(record)
      console.info(`[enquiry] ${record.reference} stored and emailed`)
    } catch (error) {
      console.error(`[enquiry] ${record.reference} stored, but email delivery failed:`, error)
    }
  } else {
    console.info(
      `[enquiry] ${record.reference} stored to ${path.relative(projectRoot, dataFile)} (email delivery not configured)`,
    )
  }

  res.status(201).json({
    ok: true,
    reference: record.reference,
    message: 'Enquiry received.',
  })
})

app.use('/api', (_req, res) => {
  res.status(404).json({ ok: false, message: 'API route not found.' })
})

/* ------------------------------------------------------------------ */
/* Static build (production)                                           */
/* ------------------------------------------------------------------ */

if (existsSync(distDir)) {
  app.use(
    '/assets',
    express.static(path.join(distDir, 'assets'), {
      immutable: true,
      maxAge: '1y',
    }),
  )
  app.use(
    express.static(distDir, {
      maxAge: '1h',
      setHeaders(res, filePath) {
        if (filePath.endsWith('index.html')) {
          res.setHeader('Cache-Control', 'no-cache')
        }
      },
    }),
  )

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) {
      next()
      return
    }
    res.sendFile(path.join(distDir, 'index.html'))
  })
}

app.use((error, _req, res, _next) => {
  if (error?.type === 'entity.parse.failed') {
    res.status(400).json({ ok: false, message: 'Invalid JSON body.' })
    return
  }

  console.error('[server] Unhandled error:', error)
  res.status(500).json({ ok: false, message: 'Unexpected server error.' })
})

const server = app.listen(PORT, () => {
  console.log(`[server] Enquiry API listening on http://127.0.0.1:${PORT}`)
  console.log(
    `[server] Enquiries persist to ${path.relative(projectRoot, dataFile)}; email ${
      smtpConfigured ? 'delivery configured' : 'delivery not configured'
    }.`,
  )
})

function shutdown(signal) {
  console.log(`[server] ${signal} received, shutting down.`)
  server.close(() => process.exit(0))
  setTimeout(() => process.exit(1), 5000).unref()
}

process.on('SIGINT', () => shutdown('SIGINT'))
process.on('SIGTERM', () => shutdown('SIGTERM'))
