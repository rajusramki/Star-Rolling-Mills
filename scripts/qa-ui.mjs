/**
 * Local UI QA: search overlay, header anchors, enquiry prefill and the
 * mobile navigation menu. No enquiries are submitted by this script.
 *
 * Usage: node scripts/qa-ui.mjs [baseUrl]
 */
import { spawn } from 'node:child_process'
import { mkdir, writeFile, rm } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'

const baseUrl = process.argv[2] || 'http://localhost:5173'
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const outDir = path.join(process.env.TEMP || '.', 'opencode', 'srm-qa-ui')
const profileDir = path.join(process.env.TEMP || '.', 'opencode', 'srm-qa-ui-profile')
const port = 9335

if (!existsSync(chromePath)) throw new Error(`Chrome not found at ${chromePath}`)

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

async function waitFor(expression, timeout = 10000) {
  const started = Date.now()
  while (Date.now() - started < timeout) {
    if (await evaluate(expression)) return true
    await sleep(120)
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
  await waitFor(`document.readyState === 'complete'`)
  await evaluate(`document.fonts.ready.then(() => true)`)
  await sleep(1600)
}

await send('Page.enable')
await send('Runtime.enable')

/* Desktop ------------------------------------------------------------ */
await setViewport(1440, 900)
await loadPage()

await evaluate(`document.querySelector('header button[aria-label="Search the site"]').click(); true`)
await waitFor(`Boolean(document.querySelector('[role=dialog] input[aria-label="Search sections"]'))`)
await sleep(250)
await capture('desktop-search-open.png')

const searchOpen = await evaluate(`(() => {
  const input = document.querySelector('[role=dialog] input[aria-label="Search sections"]')
  return {
    open: Boolean(input),
    focused: document.activeElement === input,
    resultCount: document.querySelectorAll('[role=dialog] ul a').length,
  }
})()`)

await evaluate(`(() => {
  const input = document.querySelector('[role=dialog] input[aria-label="Search sections"]')
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set
  setter.call(input, 'products')
  input.dispatchEvent(new Event('input', { bubbles: true }))
  return true
})()`)
await sleep(300)

const searchResults = await evaluate(`(() =>
  Array.from(document.querySelectorAll('[role=dialog] ul a')).map((a) => a.textContent.replace(/\\s+/g, ' ').trim())
)()`)

await evaluate(`document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })); true`)
await sleep(300)
const searchClosed = await evaluate(`!document.querySelector('[role=dialog]')`)

await evaluate(`document.querySelector('header nav a[href="#products"]').click(); true`)
await sleep(1200)
const anchorNav = await evaluate(`(() => {
  const products = document.getElementById('products')
  return {
    hash: window.location.hash,
    active: Array.from(document.querySelectorAll('header a[data-active="true"]')).map((a) => a.textContent.trim()),
    sectionTop: Math.round(products.getBoundingClientRect().top),
  }
})()`)

await evaluate(`(() => {
  const link = Array.from(document.querySelectorAll('#products a[href="#contact"]'))
    .find((a) => a.textContent.includes('Request specifications'))
  link.click()
  return true
})()`)
await sleep(1400)
await capture('desktop-prefill.png')

const prefill = await evaluate(`(() => {
  const enquiry = document.getElementById('enquiry')
  const banner = enquiry?.querySelector('p')
  return {
    hash: window.location.hash,
    enquiryTop: Math.round(enquiry.getBoundingClientRect().top),
    enquiryType: enquiry.querySelector('[name=enquiryType]')?.value ?? null,
    message: enquiry.querySelector('[name=message]')?.value ?? null,
    banner: banner?.textContent?.replace(/\\s+/g, ' ').trim() ?? null,
    success: Boolean(enquiry.querySelector('[role=status]')),
  }
})()`)

/* Mobile ------------------------------------------------------------- */
await setViewport(390, 844)
await loadPage()

const mobileLayout = await evaluate(`(() => ({
  innerWidth: window.innerWidth,
  scrollWidth: document.documentElement.scrollWidth,
  overflow: document.documentElement.scrollWidth - window.innerWidth,
}))()`)

await evaluate(`document.querySelector('header button[aria-label="Open navigation menu"]').click(); true`)
await waitFor(`Boolean(document.querySelector('[role=dialog][aria-label="Site navigation"]'))`)
await sleep(300)
await capture('mobile-menu-open.png')

const mobileMenu = await evaluate(`(() => {
  const dialog = document.querySelector('[role=dialog][aria-label="Site navigation"]')
  return {
    open: Boolean(dialog),
    links: dialog ? Array.from(dialog.querySelectorAll('nav a')).map((a) => a.textContent.replace(/\\s+/g, ' ').trim()) : [],
    bodyOverflow: getComputedStyle(document.body).overflow,
  }
})()`)

await evaluate(`(() => {
  const dialog = document.querySelector('[role=dialog][aria-label="Site navigation"]')
  dialog.querySelector('nav a[href="#products"]').click()
  return true
})()`)
await sleep(1100)

const mobileAfterNav = await evaluate(`(() => ({
  menuClosed: !document.querySelector('[role=dialog][aria-label="Site navigation"]'),
  hash: window.location.hash,
  bodyOverflow: getComputedStyle(document.body).overflow,
  overflow: document.documentElement.scrollWidth - window.innerWidth,
}))()`)

console.log(
  JSON.stringify(
    {
      outDir,
      search: { ...searchOpen, results: searchResults, closed: searchClosed },
      anchorNav,
      prefill,
      mobile: { layout: mobileLayout, menu: mobileMenu, afterNav: mobileAfterNav },
      consoleErrors,
      exceptions,
    },
    null,
    2,
  ),
)

socket.close()
chrome.kill()
