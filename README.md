# City of Acres Homes — Incorporation Campaign Site

A static website (cityofacreshomes.com) supporting the resident-led effort for Acres
Homes, Houston, TX to incorporate as an independent city.

## Structure

Static HTML/CSS/JS site with a small serverless API backing the forms (Neon
Postgres via Vercel). No frontend build step required.

```
index.html          Home (petition form lives here too)
about.html           History and current character of Acres Homes
why-incorporate.html Benefits + comparison table of nearby incorporated cities
process.html         Texas incorporation law overview + the detachment/deannexation issue
faq.html             Frequently asked questions
get-involved.html    Petition, volunteer sign-up, contact-officials info
contact.html         Contact form + committee info
css/style.css        Shared styles
js/main.js           Nav toggle + form submission (fetch -> /api/*)
images/              Photos + logo/skyline SVGs
api/petition.js      Serverless function: insert a petition signature
api/volunteer.js     Serverless function: insert a volunteer sign-up
api/contact.js       Serverless function: insert a contact message
api/_lib/db.js       Shared Neon connection helper
sql/schema.sql       Run once in Neon's SQL editor to create the tables
```

### Forms / database setup

The petition, volunteer, and contact forms POST as JSON to `/api/petition`,
`/api/volunteer`, and `/api/contact`, which insert into Postgres via the
[Neon serverless driver](https://github.com/neondatabase/serverless).

1. In the Vercel project, connect a Neon Postgres database (Storage tab ->
   Create Database -> Neon). This auto-adds a connection string to your
   project's Environment Variables — check the exact name (commonly
   `DATABASE_URL` or `POSTGRES_URL`); `api/_lib/db.js` already checks both.
2. Run `sql/schema.sql` once in Neon's SQL Editor to create the
   `petition_signatures`, `volunteers`, and `contact_messages` tables.
3. Redeploy (or just push — Vercel redeploys on push). Submissions should
   start landing in the database.
4. **To view signatures**: use Neon's SQL Editor —
   `select * from petition_signatures order by created_at desc;` — rather
   than a public-facing admin page, since this data (names, addresses,
   emails, phone numbers) is sensitive.

Each form also has a hidden honeypot field (`_gotcha`) for basic spam
filtering — real users never fill it in; if it's non-empty the API silently
pretends success without inserting a row.

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
3. **Finish the database setup** described above (connect Neon, run
   `sql/schema.sql`) if you haven't already — until then, form submissions
   will fail with a 500 error.
4. **Replace placeholder contact info** in `contact.html` and
   `get-involved.html` (email, phone, social links, officials' names/districts).
5. **Add more real photos** — the hero and About page now use real photos
   (see `images/`), but `why-incorporate.html`, `process.html`, and
   `get-involved.html` are still text-only.

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
