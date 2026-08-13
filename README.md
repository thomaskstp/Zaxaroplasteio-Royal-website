# Ζαχαροπλαστείο Royal — Pâtisserie Website

A bilingual static website for Zaxaroplasteio Royal built with pure HTML, CSS, and JavaScript.

## Overview

This is a modern, responsive website for a fine pastry shop in Spata, Athens. The site showcases products, services, and the pâtisserie's story across five main pages.

- **Homepage** (index.html) — hero carousel, value propositions, featured products, and story section
- **Products** (products.html) — full catalog of 57 pastries, cakes, and ice creams with filtering by category
- **Services** (services.html) — custom orders, events, and wholesale options
- **About** (about.html) — the shop's history and craftsmanship
- **Contact** (contact.html) — contact form powered by Formspree, with phone and address info

## Language Support

The site is fully bilingual (Greek/English) via **data-en** attributes and a simple JavaScript toggle:
- Markup contains Greek text by default
- English translations are stored in `data-en` attributes on each element
- Users switch languages via the GR|EN toggle in the navbar
- Preference is stored locally and persists across sessions

## Build & Deployment

This is a static site with no build step:
1. Clone the repository
2. Serve locally or upload files to a web server
3. Deployed to GitHub Pages from the repository root

DNS is configured for a custom domain (zaxaroplasteioroyal.gr) using:
- A records pointing to GitHub Pages
- CNAME record for www subdomain

HTTPS is automatic via GitHub Pages.

## Features

- **Responsive Design** — Mobile-first layout, tested on phones, tablets, and desktop
- **Image Optimization** — jpg/webp image pairs with lazy loading for below-fold content
- **SEO** — meta descriptions, Open Graph tags, canonical links, robots.txt, and XML sitemap
- **Contact Form** — AJAX-based form submission via Formspree (currently set to temporary email relay)
- **Product Catalog** — CSS Grid with category filtering (Cakes, Pastries, Ice Cream, Syrup Sweets)
- **Carousel** — Auto-advancing hero carousel with manual dot navigation
- **Smooth Scrolling** — In-page anchor links with smooth scroll behavior
- **Accessibility** — semantic HTML, ARIA labels, keyboard navigation support

## File Structure

```
.
├── index.html, products.html, services.html, about.html, contact.html
├── style.css
├── i18n.js           — bilingual text swap
├── animations.js     — carousel, hamburger menu, smooth scrolling
├── contact.js        — AJAX form submission
├── images/           — photos, logos, favicons, carousel slides
├── robots.txt        — SEO crawl directives
├── sitemap.xml       — SEO page index
└── README.md         — this file
```

## Contact Form Setup

The contact form is currently wired to **k.kostop1974@gmail.com** as a temporary Formspree relay. To activate submissions:

1. Check the email for a confirmation link from Formspree
2. Click the link to confirm the form endpoint
3. Submissions will then be relayed to the configured email

Once a business email (info@zaxaroplasteioroyal.gr) is available, update the form action in contact.html and re-confirm with Formspree.

## Customization

- **Colors:** Edit CSS variables in `:root` (style.css, lines 16–27)
- **Fonts:** Google Fonts (Allura, Cormorant Garamond, Inter) linked in `<head>`
- **Product Images:** Add new .jpg/.webp pairs to the `images/` folder; reference in catalog HTML
- **Social Links:** Update URLs in footer social buttons (index.html, footer-social div)
- **Domain:** Update og:url, canonical, and domain references when live on custom domain

## License

© 2026 Royal Pâtisserie — All rights reserved.

---

Made with ❤️ by [@thomaskstp](https://github.com/thomaskstp)