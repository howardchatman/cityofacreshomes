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

1. **Verify the remaining facts marked "verify"** across the site (search for
   the word `verify` in each `.html` file). Web research has already resolved
   most of this — see below — but confirm before publishing broadly:
   - The exact current legal boundary to use for any filing (Super
     Neighborhood boundary vs. annexation-ordinance boundary).
   - Founding families/developers beyond W.W. Mount and the Wright Land
     Company.
   - Southside Place's incorporation year (sources conflict: 1931 vs. 1934).
   - Texas House district, Texas Senate district, and Harris County
     Commissioner precinct for Acres Homes specifically — ZIP-level web
     search returned ambiguous/conflicting districts, so look these up by
     street address at [wrm.capitol.texas.gov](https://wrm.capitol.texas.gov/)
     and [harriscountytx.gov](https://www.harriscountytx.gov/Harris-County-Commissioner-Court-Precincts).
   - That Tarsha Jackson (Houston City Council District B) and Rodney Ellis
     (likely Harris County Precinct 1) are still the current officeholders
     at time of publishing.

   Already confirmed via Texas State Historical Association (Handbook of
   Texas), Wikipedia, and City of Houston records: Acres Homes was founded
   during WWI (~1917-18); annexed into Houston in two phases (725 acres in
   1967, 1,469 acres in 1974); and the incorporation years for every
   comparison city in `why-incorporate.html`.
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
