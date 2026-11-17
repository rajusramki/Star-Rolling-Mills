/**
 * Local functional QA: verifies GSAP scroll reveals, layout basics,
 * reduced-motion behaviour and the enquiry form.
 *
 * Usage: node scripts/qa.mjs [baseUrl]
 */
import { spawn } from 'node:child_process'
import { mkdir, writeFile, rm } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'

const baseUrl = process.argv[2] || 'http://localhost:5173'
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const outDir = path.join(process.env.TEMP || '.', 'opencode', 'srm-qa')
const profileDir = path.join(process.env.TEMP || '.', 'opencode', 'srm-qa-profile')
const port = 9334

if (!existsSync(chromePath)) throw new Error(`Chrome not found at ${chromePath}`)

/* Direct API checks -------------------------------------------------- */
const api = { health: null, invalid: null }

try {
  const health = await fetch(`${baseUrl}/api/health`)
  api.health = { status: health.status, body: await health.json() }
} catch (error) {
  api.health = { error: error instanceof Error ? error.message : String(error) }
}

try {
  const invalid = await fetch(`${baseUrl}/api/enquiry`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: '', email: 'not-an-email', message: '' }),
  })
  api.invalid = { status: invalid.status, body: await invalid.json().catch(() => null) }
} catch (error) {
  api.invalid = { error: error instanceof Error ? error.message : String(error) }
}

await rm(profileDir, { recursive: true, force: true })
await mkdir(outDir, { recursive: true })

const chrome = spawn(
  chromePath,
  [
    '--headless=new',
    '--no-sandbox',
    '--disable-gpu',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${profileDir}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-extensions',
    '--disable-background-networking',
    '--disable-background-timer-throttling',
    '--disable-renderer-backgrounding',
    '--disable-backgrounding-occluded-windows',
    '--hide-scrollbars',
    '--window-size=1440,1000',
    'about:blank',
  ],
  { stdio: 'ignore' },
)

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

let ready = false
for (let attempt = 0; attempt < 60; attempt += 1) {
  try {
    const response = await fetch(`http://127.0.0.1:${port}/json/version`)
    if (response.ok) {
      ready = true
      break
    }
  } catch {
    // retry
  }
  await sleep(200)
}
if (!ready) throw new Error('Chrome DevTools endpoint did not start')

const target = await (
  await fetch(`http://127.0.0.1:${port}/json/new?${encodeURIComponent('about:blank')}`, {
    method: 'PUT',
  })
).json()

const socket = new WebSocket(target.webSocketDebuggerUrl)
await new Promise((resolve, reject) => {
  socket.addEventListener('open', resolve, { once: true })
  socket.addEventListener('error', reject, { once: true })
})

let messageId = 0
const pending = new Map()
const consoleErrors = []
const exceptions = []

socket.addEventListener('message', (event) => {
  const message = JSON.parse(event.data)
  if (message.method === 'Runtime.exceptionThrown') {
    exceptions.push(message.params.exceptionDetails?.text || 'Unknown exception')
  }
  if (message.method === 'Runtime.consoleAPICalled' && message.params.type === 'error') {
    consoleErrors.push(
      message.params.args
        .map((arg) => arg.value ?? arg.description ?? '')
        .join(' ')
        .slice(0, 500),
    )
  }
  if (!message.id) return
  const entry = pending.get(message.id)
  if (!entry) return
  pending.delete(message.id)
  if (message.error) entry.reject(new Error(JSON.stringify(message.error)))
  else entry.resolve(message.result)
})

function send(method, params = {}) {
  messageId += 1
  const id = messageId
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject })
    socket.send(JSON.stringify({ id, method, params }))
  })
}

async function evaluate(expression) {
  const result = await send('Runtime.evaluate', {
    expression,
    awaitPromise: true,
    returnByValue: true,
  })
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text || 'Evaluation failed')
  return result.result.value
}

async function waitFor(expression, timeout = 15000) {
  const started = Date.now()
  while (Date.now() - started < timeout) {
    if (await evaluate(expression)) return true
    await sleep(150)
  }
  return false
}

async function capture(name) {
  const result = await send('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: false,
    fromSurface: true,
  })
  const filePath = path.join(outDir, name)
  await writeFile(filePath, Buffer.from(result.data, 'base64'))
  return filePath
}

async function loadPage() {
  await send('Page.navigate', { url: baseUrl })
  await waitFor(`document.readyState === 'complete'`)
  await evaluate(`document.fonts.ready.then(() => true)`)
}

await send('Page.enable')
await send('Runtime.enable')
await send('Emulation.setDeviceMetricsOverride', {
  width: 1440,
  height: 1000,
  deviceScaleFactor: 1,
  mobile: false,
})
await loadPage()
await sleep(2400)

/* Hero + initial layout ---------------------------------------------- */
const hero = await evaluate(`(() => {
  const line = document.querySelector('[data-hero-line-inner]')
  const panel = document.querySelector('[data-hero-panel]')
  const heroGrid = document.querySelector('#top > div')
  return {
    lineTransform: getComputedStyle(line).transform,
    panelOpacity: getComputedStyle(panel).opacity,
    panelVisibility: getComputedStyle(panel).visibility,
    heroColumns: getComputedStyle(heroGrid).gridTemplateColumns,
    headingFont: getComputedStyle(document.querySelector('#hero-heading')).fontFamily,
    bodyFont: getComputedStyle(document.body).fontFamily,
    innerWidth: window.innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }
})()`)

/* Scroll through the page so every ScrollTrigger enters its range. --- */
await evaluate(`(() => {
  document.documentElement.style.scrollBehavior = 'auto'
  return true
})()`)

await evaluate(`(async () => {
  const step = 400
  for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
    window.scrollTo(0, y)
    await new Promise((resolve) => setTimeout(resolve, 90))
  }
  window.scrollTo(0, document.documentElement.scrollHeight)
  await new Promise((resolve) => setTimeout(resolve, 2200))
  return true
})()`)

const reveals = await evaluate(`(() => {
  const hidden = Array.from(document.querySelectorAll('[data-reveal]')).filter((el) => {
    const cs = getComputedStyle(el)
    return cs.visibility === 'hidden' || Number(cs.opacity) < 0.05
  })
  const clipped = Array.from(document.querySelectorAll('[data-clip]')).filter((el) => {
    const clip = getComputedStyle(el).clipPath
    return clip !== 'none' && clip.includes('100%')
  })
  const hiddenSamples = hidden.slice(0, 8).map((el) => {
    const section = el.closest('section')
    return (section?.getAttribute('aria-label') || section?.id || 'section') + ': ' + (el.textContent || '').trim().replace(/\\s+/g, ' ').slice(0, 40)
  })
  const counter = document.querySelector('section[aria-label="Company statistics"] .tabular-nums')
  const brokenImages = Array.from(document.images).filter((img) => img.complete && img.naturalWidth === 0)
  return {
    revealCount: document.querySelectorAll('[data-reveal]').length,
    hiddenRevealCount: hidden.length,
    hiddenRevealSamples: hiddenSamples,
    clipCount: document.querySelectorAll('[data-clip]').length,
    clippedCount: clipped.length,
    clippedSamples: clipped.slice(0, 5).map((el) => {
      const section = el.closest('section')
      return section?.getAttribute('aria-label') || section?.id || 'section'
    }),
    counter: counter?.textContent?.trim() ?? null,
    imageCount: document.images.length,
    brokenImages: brokenImages.map((img) => img.currentSrc || img.src),
    scrollY: window.scrollY,
    innerHeight: window.innerHeight,
    scrollHeight: document.documentElement.scrollHeight,
    overflow: document.documentElement.scrollWidth - window.innerWidth,
  }
})()`)

/* Header scrollspy --------------------------------------------------- */
const scrollspy = await evaluate(`(async () => {
  const ids = ['about', 'capabilities', 'products', 'industries', 'infrastructure', 'contact']
  const result = {}
  for (const id of ids) {
    const section = document.getElementById(id)
    window.scrollTo(0, section.getBoundingClientRect().top + window.scrollY - 100)
    await new Promise((resolve) => setTimeout(resolve, 350))
    const active = Array.from(document.querySelectorAll('header a[data-active="true"]'))
      .map((el) => el.textContent.trim())
    result[id] = active
  }
  return result
})()`)

/* Enquiry form: invalid submit --------------------------------------- */
await evaluate(`(() => {
  const form = document.querySelector('#enquiry')
  window.scrollTo(0, form.getBoundingClientRect().top + window.scrollY - 80)
  return true
})()`)
await sleep(700)

await evaluate(`(() => {
  document.querySelector('#enquiry form').requestSubmit()
  return true
})()`)
await sleep(600)
await capture('form-validation.png')

const validation = await evaluate(`(() => {
  const errors = Array.from(document.querySelectorAll('#enquiry .field-error')).map((el) => el.textContent.trim())
  const active = document.activeElement?.getAttribute('name') || document.activeElement?.tagName
  return { errors, active }
})()`)

/* Enquiry form: valid submit ----------------------------------------- */
await evaluate(`(() => {
  const setValue = (el, value) => {
    const proto = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype
    const setter = Object.getOwnPropertyDescriptor(proto, 'value').set
    setter.call(el, value)
    el.dispatchEvent(new Event('input', { bubbles: true }))
  }
  setValue(document.querySelector('#enquiry [name=name]'), 'QA Test Enquiry')
  setValue(document.querySelector('#enquiry [name=company]'), 'OpenCode QA')
  setValue(document.querySelector('#enquiry [name=email]'), 'qa@example.com')
  setValue(document.querySelector('#enquiry [name=phone]'), '+91 00000 00000')
  setValue(document.querySelector('#enquiry [name=message]'), 'This is an automated QA enquiry for the Star Rolling Mills contact form. Please ignore.')

  const select = document.querySelector('#enquiry [name=enquiryType]')
  const selectSetter = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value').set
  selectSetter.call(select, 'Product specification')
  select.dispatchEvent(new Event('change', { bubbles: true }))

  const consent = document.querySelector('#enquiry [name=consent]')
  if (!consent.checked) consent.click()

  return true
})()`)
await sleep(300)

await evaluate(`document.querySelector('#enquiry form').requestSubmit(); true`)

const success = await waitFor(`Boolean(document.querySelector('#enquiry [role=status]'))`, 20000)
await sleep(600)
await capture('form-success.png')

const submission = await evaluate(`(() => {
  const status = document.querySelector('#enquiry [role=status]')
  const text = status?.textContent?.replace(/\\s+/g, ' ').trim() ?? null
  const reference = (text?.match(/SRM-\\d{4}-[A-F0-9]{8}/) || [])[0] ?? null
  return {
    statusText: text,
    reference,
    error: document.querySelector('#enquiry [role=alert]')?.textContent?.trim() ?? null,
    submitDisabled: document.querySelector('#enquiry button[type=submit]')?.disabled ?? null,
  }
})()`)
submission.success = success

/* Reduced motion ----------------------------------------------------- */
await send('Emulation.setEmulatedMedia', {
  features: [{ name: 'prefers-reduced-motion', value: 'reduce' }],
})
await loadPage()
await sleep(1200)

const reducedMotion = await evaluate(`(() => {
  const hidden = Array.from(document.querySelectorAll('[data-reveal]')).filter((el) => {
    const cs = getComputedStyle(el)
    return cs.visibility === 'hidden' || Number(cs.opacity) < 0.05
  })
  const counter = document.querySelector('section[aria-label="Company statistics"] .tabular-nums')
  const line = document.querySelector('[data-hero-line-inner]')
  return {
    hiddenReveals: hidden.length,
    counter: counter?.textContent?.trim() ?? null,
    heroLineTransform: getComputedStyle(line).transform,
    scrollY: window.scrollY,
    overflow: document.documentElement.scrollWidth - window.innerWidth,
  }
})()`)

console.log(
  JSON.stringify(
    {
      outDir,
      api,
      hero,
      reveals,
      scrollspy,
      validation,
      submission,
      reducedMotion,
      consoleErrors,
      exceptions,
    },
    null,
    2,
  ),
)

socket.close()
chrome.kill()
