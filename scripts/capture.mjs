/**
 * Local visual QA harness. Launches headless Chrome, disables motion,
 * loads lazy images, and captures full-page + per-section screenshots.
 *
 * Usage: node scripts/capture.mjs [baseUrl]
 */
import { spawn } from 'node:child_process'
import { mkdir, writeFile, rm } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'

const baseUrl = process.argv[2] || 'http://localhost:5173'
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const outDir = path.join(process.env.TEMP || '.', 'opencode', 'srm-shots')
const profileDir = path.join(process.env.TEMP || '.', 'opencode', 'srm-chrome-profile')
const port = 9333

if (!existsSync(chromePath)) {
  throw new Error(`Chrome not found at ${chromePath}`)
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
    '--hide-scrollbars',
    '--force-prefers-reduced-motion',
    '--window-size=1440,900',
    'about:blank',
  ],
  { stdio: 'ignore' },
)

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function waitForChrome() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/version`)
      if (response.ok) return
    } catch {
      // retry
    }
    await sleep(200)
  }
  throw new Error('Chrome did not start')
}

await waitForChrome()

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

socket.addEventListener('message', (event) => {
  const message = JSON.parse(event.data)
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
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.text || 'Page evaluation failed')
  }
  return result.result.value
}

async function setViewport(width, height) {
  await send('Emulation.setDeviceMetricsOverride', {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: width <= 480,
  })
}

async function loadPage() {
  await send('Page.navigate', { url: baseUrl })
  for (let attempt = 0; attempt < 100; attempt += 1) {
    const state = await evaluate('document.readyState')
    if (state === 'complete') break
    await sleep(150)
  }

  await evaluate(`(async () => {
    const step = Math.max(400, window.innerHeight * 0.8)
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y)
      await new Promise((resolve) => setTimeout(resolve, 90))
    }
    window.scrollTo(0, 0)
    await new Promise((resolve) => setTimeout(resolve, 250))
    return document.body.scrollHeight
  })()`)

  await evaluate(`Promise.race([
    Promise.all(Array.from(document.images).map((image) =>
      image.complete ? Promise.resolve() : new Promise((resolve) => {
        image.addEventListener('load', resolve, { once: true })
        image.addEventListener('error', resolve, { once: true })
      })
    )).then(() => document.fonts.ready).then(() => true),
    new Promise((resolve) => setTimeout(() => resolve(true), 8000)),
  ])`)

  await evaluate('window.scrollTo(0, 0); true')
  await sleep(400)
}

async function capture(name, clip, scale = 1, beyondViewport = true) {
  const params = {
    format: 'png',
    captureBeyondViewport: beyondViewport,
    fromSurface: true,
  }
  if (clip) {
    params.clip = { ...clip, scale }
  }
  const result = await send('Page.captureScreenshot', params)
  const filePath = path.join(outDir, name)
  await writeFile(filePath, Buffer.from(result.data, 'base64'))
  return filePath
}

await send('Page.enable')
await send('Runtime.enable')

const widths = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 834, height: 1112 },
  { name: 'laptop', width: 1024, height: 768 },
  { name: 'mobile', width: 390, height: 844 },
]

const report = {}

for (const viewport of widths) {
  await setViewport(viewport.width, viewport.height)
  await loadPage()

  const metrics = await evaluate(`(() => {
    const sections = Array.from(document.querySelectorAll('main > section, footer')).map((el, index) => {
      const rect = el.getBoundingClientRect()
      return {
        index,
        id: el.id || el.getAttribute('aria-label') || el.tagName.toLowerCase(),
        top: Math.round(rect.top + window.scrollY),
        height: Math.round(rect.height),
      }
    })
    const figure = document.querySelector('main > figure')
    const figureRect = figure ? figure.getBoundingClientRect() : null
    return {
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      scrollWidth: document.documentElement.scrollWidth,
      bodyScrollWidth: document.body.scrollWidth,
      pageHeight: Math.round(document.documentElement.scrollHeight),
      sections,
      figure: figureRect ? {
        id: 'industrial-image',
        top: Math.round(figureRect.top + window.scrollY),
        height: Math.round(figureRect.height),
      } : null,
      headingFont: getComputedStyle(document.querySelector('h1')).fontFamily,
      bodyFont: getComputedStyle(document.body).fontFamily,
    }
  })()`)

  report[viewport.name] = metrics

  await capture(`${viewport.name}-top.png`, null, 1, false)

  const sectionTargets = viewport.name === 'desktop'
    ? metrics.sections
    : metrics.sections.filter((section) =>
        ['top', 'about', 'capabilities', 'industries', 'process', 'contact', 'footer'].includes(section.id),
      )

  for (const section of sectionTargets) {
    const safeId = String(section.id).replace(/[^a-z0-9-]/gi, '-').toLowerCase()
    await capture(`${viewport.name}-section-${String(section.index).padStart(2, '0')}-${safeId}.png`, {
      x: 0,
      y: section.top,
      width: viewport.width,
      height: section.height,
    })
  }

  if (metrics.figure) {
    await capture(`${viewport.name}-section-industrial-image.png`, {
      x: 0,
      y: metrics.figure.top,
      width: viewport.width,
      height: metrics.figure.height,
    })
  }
}

await writeFile(path.join(outDir, 'report.json'), JSON.stringify(report, null, 2), 'utf8')
console.log(JSON.stringify({ outDir, report }, null, 2))

socket.close()
chrome.kill()
