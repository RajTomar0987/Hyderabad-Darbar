# Hyderabad Darbar — Restaurant Website

A modern, fast, mobile-first marketing + ordering website for **Hyderabad Darbar**, an authentic Hyderabadi restaurant in Dandenong, Melbourne (52D Foster Street, Dandenong VIC 3175).

Built with **React 19 + TypeScript + Vite + Tailwind CSS v4 + React Router + Framer Motion + Lenis**.

## Features

- **6 pages / routes:** Home (`/`), Menu (`/menu`), About (`/about`), Gallery (`/gallery`), Catering (`/catering`), Contact (`/contact`)
- **Home sections:** Hero, Intro, Featured Dishes, Menu preview, About, Gallery, Features, Testimonials, Catering CTA, Location / Hours
- **Menu system:** typed menu data in `src/data/menu.ts` with categories (Biryani, Curries, Tandoor, Starters, Vegetarian, Breads, Desserts, Drinks), veg / spicy / signature flags, prices, and images
- **Ordering + contact:** order-online link, click-to-call (`tel:`), Google Maps link, contact form UI, catering enquiry
- **UX polish:**
  - Lenis smooth scrolling (respects `prefers-reduced-motion`)
  - Scroll-to-top on route change
  - Sticky navbar, mobile sticky Call / Order CTA (`MobileCTA`)
  - Framer Motion reveal animations (`Reveal.tsx`)
  - Lucide icons throughout
- **SEO baked in:** semantic HTML, meta description, canonical, Open Graph / Twitter cards, `Restaurant` JSON-LD schema, static routes
- **Styling:** Tailwind CSS v4 (via `@tailwindcss/vite`), Fraunces + Manrope Google Fonts, dark warm theme

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 19, React DOM 19 |
| Language | TypeScript (~6.0) |
| Bundler | Vite 8 |
| Routing | React Router DOM 7 |
| Styling | Tailwind CSS 4, PostCSS, Autoprefixer |
| Animation | Framer Motion 13, Lenis 1.3 |
| Icons | Lucide React |
| Lint | Oxlint |
| Fonts | Fraunces (display), Manrope (body) |

## Getting Started

Prerequisites: **Node.js 18+** and npm / pnpm.

```bash
# install
npm install
# or
pnpm install

# dev server (HMR)
npm run dev

# production build (tsc + vite)
npm run build

# preview production build
npm run preview

# lint
npm run lint
```

Dev server defaults to `http://localhost:5173`.

## Project Structure

```
Restro_site/
├── index.html            # title, meta, OG tags, JSON-LD, fonts
├── vite.config.ts        # react + tailwindcss plugins
├── tsconfig*.json
├── public/
│   └── favicon.svg
├── src/
│   ├── main.tsx          # React root
│   ├── App.tsx           # Router, Lenis setup, Navbar/Footer/MobileCTA
│   ├── site.ts           # <-- edit name, phone, hours, links here
│   ├── index.css         # Tailwind + global styles
│   ├── data/
│   │   └── menu.ts       # <-- edit dishes, prices, categories here
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Hero.tsx
│   │   ├── FeaturedDishes.tsx
│   │   ├── MenuSection.tsx
│   │   ├── About.tsx / Intro.tsx
│   │   ├── Gallery.tsx
│   │   ├── Testimonials.tsx / Features.tsx
│   │   ├── CateringCTA.tsx / Location.tsx
│   │   ├── Footer.tsx / MobileCTA.tsx
│   │   └── Reveal.tsx / SectionHeading.tsx
│   └── pages/
│       ├── Home.tsx
│       ├── MenuPage.tsx
│       ├── AboutPage.tsx
│       ├── GalleryPage.tsx
│       ├── CateringPage.tsx
│       └── ContactPage.tsx
└── dist/                 # build output (after `npm run build`)
```

## Customization

All site-wide business info lives in one place:

```ts
// src/site.ts
export const SITE = {
  name: "Hyderabad Darbar",
  address: "52D Foster Street, Dandenong VIC 3175",
  phoneDisplay: "(03) 9791 0000",
  phoneHref: "tel:+61397910000",
  email: "hello@hyderabaddarbar.com.au",
  orderUrl: "/order",
  ...
};
```

- **Menu:** add/edit dishes in `src/data/menu.ts` (`MENU` array + `CATEGORIES`).
- **Hours:** edit `hours` in `src/site.ts` and the JSON-LD `openingHours` in `index.html`.
- **Ordering:** point `orderUrl` at your real POS (Square / Uber Eats / DoorDash / NextOrder).
- **SEO:** update `<title>`, `<meta name="description">`, `og:*`, canonical URL, and JSON-LD telephone in `index.html`.
- **Images:** currently hotlinked from Unsplash — replace with local `public/` images for production.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Type-check (`tsc -b`) + production build to `dist/` |
| `npm run preview` | Preview `dist/` locally |
| `npm run lint` | Run Oxlint |

## Deployment

Static output — deploy `dist/` anywhere:

- **Vercel / Netlify:** build command `npm run build`, output dir `dist`, SPA fallback to `index.html` (React Router).
- **GitHub Pages / S3 / Nginx:** serve `dist/` statically with SPA rewrite (`/* -> /index.html`).

> Note: `App.tsx` currently falls back unknown routes (`*`) to `Home`. For true 404 handling, add a dedicated `NotFound` page.

## Restaurant Info

- **Hyderabad Darbar** — Authentic Flavours. Rich Traditions.
- 52D Foster Street, Dandenong VIC 3175
- Mon–Thu 11:00 AM – 10:00 PM, Fri–Sun 11:00 AM – 10:30 PM
- Dine-in · Takeaway · Catering

## License

Private — all rights reserved.
