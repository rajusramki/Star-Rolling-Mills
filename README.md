# Star Rolling Mills Pvt. Ltd.

A premium, single-page corporate website for Star Rolling Mills Pvt. Ltd. — an established iron and steel company incorporated in 1967 in Howrah, West Bengal.

The design follows an editorial industrial direction: sharp edges, oversized Space Grotesk headlines, fine rules, a restrained palette of paper, white, black and orange, and full-bleed material photography.

## Stack

- React 18 + TypeScript + Vite
- Tailwind CSS
- GSAP + ScrollTrigger
- Lucide React
- Express + Nodemailer for the enquiry API

## Getting started

```bash
npm install
npm run dev
```

`npm run dev` starts both:

- Vite at `http://localhost:5173`
- Enquiry API at `http://127.0.0.1:8787` (proxied through Vite at `/api`)

To run either side separately:

```bash
npm run dev:web
npm run server
```

## Form backend

The enquiry form posts JSON to `/api/enquiry`. It never shows a success state until the API returns HTTP `201`.

- Enquiries are appended to `data/enquiries.jsonl` (created automatically; ignored by git).
- Optional email delivery uses SMTP. Copy `.env.example` to `.env` and configure:

```env
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=...
SMTP_PASS=...
ENQUIRY_TO=business@example.com
ENQUIRY_FROM=website@example.com
```

Without SMTP settings, enquiries are still persisted locally and the API logs that email delivery is not configured. Set `ENQUIRY_TO` to the company's real inbox before launch.

The API includes:

- Server-side validation for every field
- A honeypot field for basic bot filtering
- In-memory rate limiting (8 submissions per IP per 10 minutes)
- Optional email notification with `Reply-To` set to the enquirer
- Security headers and JSON error responses

## Build and production

```bash
npm run build
npm start
```

The Express server serves the built `dist/` directory and the API from a single process. Default port: `8787` (override with `PORT`).

For a reverse proxy, forward `/` and `/api` to the Node process. Terminate TLS at the proxy.

## Content integrity

This site deliberately avoids unverified company claims.

- Confirmed facts: legal name, 1967 incorporation date, CIN `U29241WB1967PTC027031`, active private limited status, iron & steel sector, Howrah/West Bengal registered office.
- Product categories are presented as an indicative catalogue framework. Grades, dimensions, certifications and delivery schedules are explicitly marked as available on request, pending catalogue verification.
- The history timeline shows only the verified incorporation date, general continuity and the present. Detailed milestones require company verification before publication.
- No email address, phone number, social profile, certification, tonnage, capacity, employee count or customer reference is invented.
- Photography is licensed Pexels stock, downloaded locally. Source IDs and licences are recorded in `public/images/credits.json`. Captions identify it as indicative imagery, not company photographs.

Before launch, replace indicative imagery and product framing with verified company material where available, and configure the SMTP recipient for enquiries.

## Project structure

```text
src/
  components/
    common/       Logo, section headers, editorial links
    sections/     All page sections, header, footer and enquiry form
  data/site.ts    Company facts and section content
  hooks/          Active navigation + GSAP scroll choreography
  lib/utils.ts    Class helpers, enquiry prefill event, scroll helper
  index.css       Type system, palette, component classes
server/
  index.mjs       Enquiry API, persistence, optional SMTP, static serving
public/images/    Local optimised WebP photography
```

## Accessibility and motion

- Semantic landmarks, skip link, labelled form fields and visible focus states.
- Full keyboard support for navigation, search and the mobile menu.
- `prefers-reduced-motion` disables GSAP choreography, smooth scrolling, counters, dot-grid drift and transitions.
- Responsive layouts avoid horizontal overflow; the hero retains its split panel on larger screens and stacks on mobile.

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Vite + API together |
| `npm run dev:web` | Frontend only |
| `npm run server` | API only |
| `npm run build` | Type-check and production build |
| `npm run preview` | Preview the Vite build |
| `npm start` | Serve `dist/` and the API with Express |
