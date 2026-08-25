# Fersen & Lohse — website draft v1

A first design draft of the website, positioned around **IT Procurement as a Service**.
Six pages, built from the brand assets and the two source documents in the parent folder.

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
| `decisions.html` | **Überarbeitungszyklen** — the decision catalogue: eighteen questions on where the draft should go, answerable in the browser (German, dark layout, see section 4) |
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

## 4. Überarbeitungszyklen — the decision catalogue (`decisions.html`)

The review layer collects remarks paragraph by paragraph. The decision catalogue does the
opposite: it puts the **eighteen questions where the direction of the site is actually decided**
on one page — money model, language, the Akamai case, the placeholder figures, a team page,
which number leads, how much text goes, whether a price is named. Each question shows what
the website says today next to what the voice messages of 24 August say, then offers three to
six answer options plus a free-text field.

Blocks A–D (questions 01–15) come from the two midday voice messages. **Block E (16–18)** was
added afterwards from the three evening messages, which respond to this draft directly: a
use-case layer for the buyer, the metrics-driven intake, and whether the dependency analysis
becomes a second product. It is kept as its own block rather than woven into A–D so the later
batch stays recognisable as a batch — and so no existing number has to move. Content and interface are German; the audience for
this page is Miguel and Fredrik, not the end customer.

**It is deliberately set apart from the site.** The tab sits at the far right of the
navigation, *behind* the Get in touch button and separated by a divider (`nav__draft` in
`site.css`), and the page itself runs on a dark palette while the other five stay light —
so nobody mistakes the working layer for a page of the website. The dark values are simply
site.css's own tokens redefined on `body.dec-page` at the top of `decisions.css`; the
components underneath are unchanged. Printing switches the whole thing back to ink on white.

**Answering.** Name in the bottom bar, one option per question (question 13 takes several),
free text wherever an option does not fit. Answers save themselves to `localStorage`
after half a second — same rule as the review layer, nothing leaves the browser until
someone exports. The progress bar counts answered questions, the left-hand rail jumps
between them and marks what is done.

**Dictating instead of typing.** Every free-text field carries a *Diktieren* button that
uses the browser's built-in speech recognition, set to German. It transcribes continuously,
appends to whatever is already in the field, and a second click stops it. Only one field
records at a time.

- Works in Chrome, Edge and Safari. In Firefox the button does not appear at all and the
  field stays a normal textarea.
- Needs the hosted version. Opened straight from disk (`file://`) the browser refuses
  microphone access — the page says so at the top instead of failing on click.
- **Chrome and Edge send the audio to the browser vendor's speech service for recognition.**
  Nothing else on this site contacts the internet, so this is worth knowing before the page
  goes to anyone who cares about it — and worth a line in the privacy notice if the page
  ever stays up beyond the review.
- The mechanism sits in `assets/js/dictation.js` and is independent of this page. Wiring the
  same button into the review layer's comment box later is a small change.

**Getting the answers out of the browser.** *Antworten senden* in the bottom bar opens a sheet
with five routes:

| Route | What happens |
|---|---|
| Per E-Mail senden | Downloads the CSV and opens a pre-filled mail to `martin@axomislabs.com`. The mail asks the sender to attach the CSV, since a browser cannot attach it itself. |
| Per WhatsApp senden | Opens WhatsApp with all answers as message text, recipient chosen in the app. Text only — a link cannot attach a file, so long answer sets are shortened with a note. |
| Nur die CSV-Datei herunterladen | `fersen-lohse-entscheidungen-YYYY-MM-DD.csv`, UTF-8 with BOM and a `sep=,` line, so it opens correctly in German and English Excel. Columns: `nr, block, frage, antwort, ergaenzung, beantwortet_von, stand`. This is the file to attach in a WhatsApp chat by hand. |
| Text kopieren | The whole summary on the clipboard. |
| Als PDF drucken | Print stylesheet: rail, bottom bar and microphones drop out, cards do not break across pages. |

*Alle Antworten löschen* at the bottom of the sheet clears this browser's answers after a
confirmation — useful when two people review on the same machine.

**Changing the recipient address:** `assets/js/decisions.js`, `CONFIG.recipient` at the top.
The WhatsApp route uses `CONTACT.whatsapp` from `assets/js/site.js` once that placeholder is
replaced; until then it opens WhatsApp without a preselected recipient.

**Editing the questions:** `assets/js/decisions-data.js` holds all eighteen entries with their
options. Never renumber an `id` — the stored answers hang on it. Adding a block means one entry
in `BLOCKS`; the rail, the progress bar and both exports read their counts from the data.

**Removing it before going live:** delete `decisions.html`, `assets/css/decisions.css`,
`assets/js/decisions.js`, `assets/js/decisions-data.js` and `assets/js/dictation.js`, then take
the *Überarbeitungszyklen* link out of the nav and footer of the other five pages and drop the
`.nav a.nav__draft` rules from `site.css`. Nothing else depends on them.

---

## 5. What still needs to come from you

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

## 6. Structure

```
website/
├── index.html  references.html  catalog.html  contact.html  legal.html
├── decisions.html
├── README.md
└── assets/
    ├── css/  site.css        design system: colours, type, layout, components
    │         catalog.css     catalog page only
    │         review.css      review layer only
    │         decisions.css   decision catalogue only
    ├── js/   site.js         nav, CONTACT config, contact form
    │         catalog.js      search, filter, expand/collapse
    │         catalog-data.js AUTO-GENERATED from the Excel — do not hand-edit
    │         review.js       review layer, CSV + mail export
    │         decisions.js    decision catalogue: answers, dictation, exports
    │         decisions-data.js the eighteen questions — edit the wording here
    │         dictation.js    speech-to-text helper, reusable on any textarea
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

## 7. Verified

Tested in Chrome via an automated pass (30 checks), from `file://`:
all five pages load without console errors; catalog search, domain filters, expand/collapse,
empty state and deep links behave; the contact form prefills from `?topic=` and blocks empty
submits; review comments save, persist across reload, collect across pages, export to a valid
CSV and produce a correctly grouped mail body (long reviews truncate the mail but keep every
row in the CSV); no horizontal overflow at 375 px; and no page makes a single external request.

The decision catalogue was tested the same way (52 checks, Chrome via the DevTools protocol):
all questions and both question types render and store; answers, name and multi-select
survive a reload; dictation was driven through a stubbed speech engine — text lands in the
right field, a second dictation appends instead of overwriting, only one field records at a
time, and a refused microphone produces a readable message rather than a dead button; the CSV
carries its BOM and one row per question plus the closing row; the WhatsApp link stays under
2 000 characters; mail, print, copy and reset all do what the sheet promises; no console errors
on any of the six pages; no horizontal overflow at 390 px; the tab is the last item of the
navigation on all six pages; and the print stylesheet turns the dark page back into ink on white.

**That run predates Block E.** It covered the catalogue at fifteen questions in four blocks.
Questions 16–18 were added afterwards and have only been checked statically: the data file
parses, ids and option values are unique, every entry carries all its fields, and the block is
registered in `BLOCKS`. Section rendering, the rail, the progress bar and both exports derive
their grouping and counts from the data, so no code change was needed — but the browser run has
not been repeated. Worth doing before this goes to Miguel and Fredrik.
