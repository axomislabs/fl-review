# Fersen & Lohse — website draft v1

A first design draft of the website, positioned around **IT Procurement as a Service**.
Five pages, built from the brand assets and the two source documents in the parent folder.

Everything is static HTML/CSS/JS. **No build step, no server, no external dependencies** —
double-click `index.html` and it runs. Nothing on any page contacts the internet.

---

## 1. Opening it

**Simplest:** double-click `index.html`. Everything works from `file://`, including the
review layer, the catalog search and the CSV export.

**Optional local server** (only needed if you want clean URLs):

```bash
cd website
python3 -m http.server 8080     # → http://localhost:8080
```

To send the draft to the customer, zip the whole `website/` folder — or upload it to any
static host (Netlify, Cloudflare Pages, GitHub Pages, plain web space). It is all static files.

---

## 2. The pages

| File | Purpose |
|---|---|
| `index.html` | Overview: hero, six services, expertise, four-step process, the ten domains, impact figures, references teaser |
| `references.html` | Client projects (Globe, Weiße Immobilien), the RACI delivery matrix, partner/vendor wall, testimonial |
| `catalog.html` | All **183 capabilities in 10 domains**, as searchable, foldable accordions |
| `contact.html` | Contact form plus WhatsApp / phone / email / LinkedIn / booking |
| `legal.html` | Imprint and privacy — skeleton only, see the warning below |

---

## 3. The review function (what the customer uses)

The whole point of this draft: the customer can comment on it directly in the browser.

1. Hovering any section shows a **speech bubble** in the right-hand margin.
2. Clicking it opens a small box: write the comment, optionally a name, save.
3. A commented section is marked with a teal bar and the bubble shows a counter.
4. The **Review** button at the bottom right opens a panel listing every comment,
   grouped by page, with jump-to-section and delete.
5. **Send feedback** does two things at once:
   - downloads `fersen-lohse-feedback-YYYY-MM-DD.csv`
   - opens the mail client with a pre-filled mail to **martin@axomislabs.com**
     containing all comments as text
   The mail asks the sender to attach the CSV, since a browser cannot attach it itself.
6. **Download CSV only** exports without opening the mail client.

Notes worth knowing:

- Comments are stored in the customer's **own browser** (`localStorage`) and are collected
  **across all five pages**. They survive reloads and closing the tab. Nothing is
  transmitted until the customer actively exports.
- Consequence: comments are per browser and per device. Two reviewers each send their own CSV.
- *Show comment markers* in the panel switches the review layer off, so the customer can
  view the site clean. A small **Review** tab on the right brings it back.
- The CSV opens correctly in both German and English Excel (UTF-8 BOM + `sep=,` line).
  Columns: `page, section_id, section_label, comment, author, created_at, url`.
- 36 sections are commentable across the five pages.

**Changing the recipient address:** `assets/js/review.js`, `CONFIG.recipient` at the top.

**Removing the review layer** before going live: delete `assets/css/review.css` and
`assets/js/review.js`, remove the two `<link>`/`<script>` lines from each page, and (optionally)
strip the `data-review-id` / `data-review-label` attributes. Nothing else depends on them.

---

## 4. What still needs to come from you

Placeholders are **visibly marked in cream/yellow** on the pages, so nothing gets forgotten.

**Contact details** — all in one place, `assets/js/site.js`, the `CONTACT` object at the top:
email, phone (display + `tel:` format), WhatsApp number, LinkedIn URL, booking link.
Every link and label on the site updates from there. Also the postal address and office
hours on `contact.html`.

**Content:**

- The three impact figures on the home page (average saving, cumulative savings, time to
  signature) — currently `XX`. These are the strongest trust signal on the site.
- Years of market experience in the hero.
- Case-study copy for Globe and Weiße Immobilien (challenge / approach / result).
- A client testimonial.
- Vendor and client **logo files**. The site currently shows dashed placeholder tiles.
  Logo usage should be checked against each vendor's brand guidelines.
- **Written consent from Globe and Weiße Immobilien** before their names go public.

**Legal — `legal.html` is a skeleton and has not been legally reviewed.** Company name and
legal form, address, managing director, register court and number, VAT ID, person responsible
for content, and the full GDPR privacy notice. An incomplete German imprint is subject to
warnings and fines, so this must be checked by a lawyer before launch.

**Contact form backend.** The form validates but has no server. On submit it opens a
pre-filled email instead. Wiring it up later means one `fetch()` in `assets/js/site.js`
(see `buildMailto()` for the exact field set) — plus the corresponding privacy section.

---

## 5. Structure

```
website/
├── index.html  references.html  catalog.html  contact.html  legal.html
├── README.md
└── assets/
    ├── css/  site.css        design system: colours, type, layout, components
    │         catalog.css     catalog page only
    │         review.css      review layer only
    ├── js/   site.js         nav, CONTACT config, contact form
    │         catalog.js      search, filter, expand/collapse
    │         catalog-data.js AUTO-GENERATED from the Excel — do not hand-edit
    │         review.js       review layer, CSV + mail export
    ├── fonts/CroissantOne-Regular.ttf
    └── img/  logo-full.png  logo-mark.png  logo-mark-white.png
```

### Corporate design

Colours sampled directly from `PNGs/Big Lotus Blue.png`:

| | Hex | Used for |
|---|---|---|
| Deep teal | `#117082` | Headlines, buttons, links, dark bands |
| Light teal | `#42AFC3` | Accents, icons, borders, highlights |
| Grey-blue | `#A9B5BA` | Wordmark, muted text |

Light teal is deliberately **never** used for body text — on white it only reaches about
2.4:1 contrast. Text is always deep teal or near-black.

**Croissant One** (the font of the logo wordmark) is self-hosted and used for the wordmark,
the hero headline and the large figures. Everything else uses the system sans, which stays
readable at paragraph size. The lotus mark reappears as a large, faint watermark in the
dark bands.

### Updating the catalog

`catalog-data.js` and the accordion markup in `catalog.html` were generated from
`../Website, Key words.xlsx` (Sheet1, columns B and C). If the workbook changes, both need
to be regenerated together rather than edited by hand — ask and it will be rebuilt in one step.

The RACI table on `references.html` comes from Sheet2 of the same workbook.

---

## 6. Verified

Tested in Chrome via an automated pass (30 checks), from `file://`:
all five pages load without console errors; catalog search, domain filters, expand/collapse,
empty state and deep links behave; the contact form prefills from `?topic=` and blocks empty
submits; review comments save, persist across reload, collect across pages, export to a valid
CSV and produce a correctly grouped mail body (long reviews truncate the mail but keep every
row in the CSV); no horizontal overflow at 375 px; and no page makes a single external request.
