# 24x7 Automation — marketing site

Static marketing site for 24x7 Automation: custom automation for UK builders, wholesalers and shops.

No build step. Plain HTML, CSS and JavaScript, deployed on Vercel.

## Structure

| Path | Purpose |
| --- | --- |
| `index.html` | Page markup |
| `styles.css` | All styles (design tokens are CSS variables at the top) |
| `main.js` | Content data plus the animated hero demo, process bar, trade switcher, FAQ and booking form |
| `images/` | Photos for the photo strip, solution cards, product cards and the by-trade panel |
| `fonts/` | Instrument Sans (self-hosted) |
| `vercel.json` | Clean URLs, caching and security headers |

## Editing content

All copy for the solutions, process steps, trades, products, rules, pricing bands and FAQ lives in the arrays at the top of `main.js`. Hero and section headings are in `index.html`.

## Booking form

The form shows a confirmation on submit. To receive submissions, set `FORM_ENDPOINT` in `main.js` to a JSON webhook (Formspree, Make, n8n, Zapier and so on). The payload is a JSON object with `name`, `business`, `build`, `job`, `email`, `phone` and `page`.

## Book a demo button

Set `CALENDLY_URL` in `main.js` to your Calendly (or other scheduling) link. The "Book a demo" button under the form is hidden until it is set.

## Photo credits

All photos are from [Unsplash](https://unsplash.com) and used under the Unsplash License (free for commercial use, no permission needed). Where the file carried the photographer's name: Clay Banks (shop counter), Kylie DeDeo (roofing), LUXXCREATIVE (plumbing). Replace any image by dropping a new file over the same filename in `images/`.

## Local preview

```sh
npx serve .
```

## Deploy

Pushes to `main` deploy to production on Vercel; other branches get preview deployments.
