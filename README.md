# City of Acres Homes — Incorporation Campaign Site

A static website (cityofacreshomes.com) supporting the resident-led effort for Acres
Homes, Houston, TX to incorporate as an independent city.

## Structure

Plain HTML/CSS/JS, no build step required.

```
index.html          Home
about.html           History and current character of Acres Homes
why-incorporate.html Benefits + comparison table of nearby incorporated cities
process.html         Texas incorporation law overview + the detachment/deannexation issue
faq.html             Frequently asked questions
get-involved.html    Petition, volunteer sign-up, contact-officials info
contact.html         Contact form + committee info
css/style.css        Shared styles
js/main.js           Nav toggle + form status handling
images/logo.svg       Placeholder emblem (replace with real branding)
```

## Before you launch, do these things

1. **Verify every fact marked "verify"** across the site (search for the word
   `verify` in each `.html` file). These include: founding/annexation dates,
   population, boundaries, incorporation years for comparison cities, current
   officeholders and districts. Cross-check against the Texas State Historical
   Association's *Handbook of Texas*, Houston Public Library archives, City of
   Houston records, and U.S. Census data.
2. **Get a real legal review of `process.html`.** It is written from general
   knowledge, not a Texas attorney's review, and is explicitly labeled as such
   on the page. Have municipal law counsel confirm the disannexation and
   incorporation pathways before this page is treated as authoritative.
3. **Connect the forms.** `get-involved.html` and `contact.html` have forms
   with `action="REPLACE_WITH_FORM_ENDPOINT"`. Until you set a real endpoint,
   submissions show a "not connected" message (see `js/main.js`). Easiest
   options:
   - [Formspree](https://formspree.io) — free tier, just change the `action`
     attribute to your form URL.
   - Netlify Forms — if hosting on Netlify, add `data-netlify="true"` to each
     `<form>` and follow their docs.
4. **Replace placeholder contact info** in `contact.html` and
   `get-involved.html` (email, phone, social links, officials' names/districts).
5. **Add real branding** — swap `images/logo.svg` for an actual logo, and add
   real neighborhood photos in place of the `.map-placeholder` blocks in
   `about.html`.

## Local preview

No build tools needed — open `index.html` directly in a browser, or serve the
folder locally:

```
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Deployment

Any static host works: GitHub Pages, Netlify, Vercel, or standard shared
hosting pointed at `cityofacreshomes.com`. No server-side code is required
unless you add one for form handling.
