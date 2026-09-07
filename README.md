# Fersen & Lohse — website draft v2

The website, positioned around **IT Procurement as a Service**. Five customer-facing pages
built from the brand assets and the two source documents in the parent folder, plus a
three-page working layer that documents how the site got here and where it is going.

**v2 is the rework after Miguel's answers of 31 August 2026.** All eighteen questions in
the decision catalogue came back answered; the site was rebuilt around them. What changed
and why is recorded question by question on `decisions.html` — each answer sits under its
question, together with what it turned into and a link to that place on the site. That page
is the changelog; section 8 below is the short technical version.

**Since 2 September the working layer also carries a project plan.** Miguel's voice message
of 31 August, 18:21 describes how to proceed — two sessions, a launch, LinkedIn, an SDR
tool, blogs, a customer feedback round, and two goals. `plan.html` turns that into six
phases and fifty tasks; `project.html` is the hub the plan and every revision cycle hang
from. **On 6 September the plan was reshaped**: the phases are one chart, the tasks are one
table per phase, and pressing a phase filters the table to it. Same fifty tasks, same
feedback layer — a different shape. See section 4.

**On 7 September the comment box learned to listen.** The *Diktieren* button that the
decision catalogue and the project plan already had is now in the review layer's comment box
too, on all five customer pages — the same `dictation.js`, so feedback can be spoken instead
of typed. That was task **C7** on the plan. See section 3.

**The first review came back through it the same day: nine comments on the home page.** They
are worked through in section 9 — what each one asked for and what it turned into. Two whole
sections left the home page as a result (the benchmark case, the three people), so the page
is shorter than the v2 description in section 2 and 8.

Everything is static HTML/CSS/JS. **No build step, no server, no external dependencies** —
double-click `index.html` and it runs. No page contacts the internet on its own; the single
exception is dictation, where the browser hands the audio to its own speech recognition while
the button is switched on — which is why that has a paragraph in the privacy notice.

The two working-layer stylesheets and `plan.js` carry a version marker
(`plan.css?v=20260906b`), and since dictation moved into the comment box the review layer
does too (`review.js?v=20260907`, on all five pages). Browsers cache these files hard, and a
reviewer who reloads after an edit would otherwise keep the old one — and, now, wonder where
the microphone went. **Bump the marker whenever one of those files changes.** For anything
that needs a real origin — dictation, mainly — serve the folder instead:
`python3 -m http.server 8000 --bind 127.0.0.1`, then open `http://127.0.0.1:8000/index.html`
for the site or `.../plan.html` for the plan.

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
| `index.html` | Hero with a picture index of the page, the problem, four buyer use cases, six services, the two named engagements, security exposure, the commercial model, the four-step process, the market map of the ten domains, expertise, references teaser |
| `references.html` | The benchmark case in full, client projects (Globe, Weiße Immobilien), partner/vendor wall, testimonial |
| `catalog.html` | All **183 capabilities in 10 domains**, as searchable, foldable accordions |
| `contact.html` | The guided intake — challenge → metrics → quote — plus WhatsApp / phone / email / LinkedIn / booking, and **About us**: the three people, moved here on 7 September |
| `legal.html` | Imprint and privacy — skeleton only, see the warning below |

Three further pages are the **working layer** — German, dark, `noindex`, and not part of
the website a customer sees. They are reached through one set-apart nav entry,
*Projektdokumentation*, and are covered in section 4:

| File | Purpose |
|---|---|
| `project.html` | **Projektdokumentation** — the hub: what exists, how a revision cycle runs, and a chronicle |
| `plan.html` | **Projektplan** — six phases and fifty tasks, from Session 1 to the first customer |
| `decisions.html` | **Überarbeitungszyklus 1** — the decision catalogue: eighteen questions, Miguel's answers, and what each one changed |

---

## 3. The review function (what the customer uses)

The whole point of this draft: the customer can comment on it directly in the browser.

1. Hovering any section shows a **speech bubble** in the right-hand margin.
2. Clicking it opens a small box: write the comment, optionally a name, save.
   The comment can also be **spoken instead of typed** — see below.
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

- **Dictating a comment.** The comment box carries a *Dictate* button that uses the browser's
  built-in speech recognition, set to German. It transcribes continuously and appends to
  whatever is already in the field, so typing and speaking can be mixed; a second click stops
  it, and the button reads *Stop* while it records. It is the same mechanism the working layer
  uses (`assets/js/dictation.js`), now loaded on the five customer pages as well.
  - Chrome, Edge and Safari only. In Firefox the button is not rendered and the box stays a
    normal textarea.
  - It needs the hosted version. Opened from `file://` the browser refuses the microphone, and
    the box says so before anyone clicks.
  - **Chrome and Edge send the audio to the browser vendor's speech service.** It is the only
    outside connection this site can cause, and it is now on pages a customer sees — so it has
    its own paragraph in the privacy notice on `legal.html`.
- Comments are stored in the customer's **own browser** (`localStorage`) and are collected
  **across all five pages**. They survive reloads and closing the tab. Nothing is
  transmitted until the customer actively exports.
- Consequence: comments are per browser and per device. Two reviewers each send their own CSV.
- *Show comment markers* in the panel switches the review layer off, so the customer can
  view the site clean. A small **Review** tab on the right brings it back.
- The CSV opens correctly in both German and English Excel (UTF-8 BOM + `sep=,` line).
  Columns: `page, section_id, section_label, comment, author, created_at, url`.
- 42 sections are commentable across the five pages (36 before the v2 rework, 43 before the
  home page lost two sections and the contact page gained one on 7 September).

**Changing the recipient address:** `assets/js/review.js`, `CONFIG.recipient` at the top.

**Removing the review layer** before going live: delete `assets/css/review.css` and
`assets/js/review.js`, remove the `<link>` and the two `<script>` lines (`dictation.js` and
`review.js`) from each page, and (optionally) strip the `data-review-id` /
`data-review-label` attributes. Nothing else depends on them — `dictation.js` is only there
for the comment box, the working layer loads its own copy.

---

## 4. Projektdokumentation — the working layer

Three pages that are *about* the website rather than part of it: a hub, the project plan,
and the first revision cycle. They share one nav entry, one palette and one rule — nothing
here goes live with the site.

```
project.html   Projektdokumentation — the hub
├── plan.html        Projektplan — six phases, fifty tasks
└── decisions.html   Überarbeitungszyklus 1 — eighteen questions, answered
```

Until 2 September the nav entry was called *Überarbeitungszyklen* and pointed straight at
`decisions.html`. It now points at the hub, because there is more than one document to
hang there and there will be more cycles. **Every further revision goes in the same place,
in the same format** — that is the whole point of the hub existing.

**They are deliberately set apart from the site.** The group sits at the far right of the
navigation, *behind* the Get in touch button and separated by a divider (`nav__doc` in
`site.css`), and all three run on a dark palette while the other five stay light — so
nobody mistakes the working layer for a page of the website.

**Both documents are named in the header, not hidden in a menu.** *Projektdokumentation*
carries *Projektplan* and *Überarbeitungszyklus 1* under it as a second line. There are only
ever going to be a handful, and a hover menu would hide exactly what the group exists to
make obvious. The current page is marked by weight rather than by site.css's underline bar,
which inside a two-line stack would sit on top of the second line.

**What the three share** lives in `workspace.css` and `handoff.js`: the dark palette (site
css's own tokens redefined on `body.dec-page`), the four corrections where site.css
hardcodes white, the print block that turns the whole thing back into ink, the dictation
button (`.wl-mic`), the fixed savebar and the send sheet (`.wl-bar`, `.wl-sheet`,
`.wl-route`…), and the four routes out of the browser. Page-specific ids keep their own
prefix — `dec-` on the catalogue, `pl-` on the plan — so the `wl-` prefix always means
"shared". Load order on all three pages is `site.css → workspace.css → (plan.css |
decisions.css)`.

**Removing the whole layer before going live:** delete `project.html`, `plan.html`,
`decisions.html`, `assets/css/workspace.css`, `assets/css/plan.css`,
`assets/css/decisions.css`, `assets/js/plan.js`, `assets/js/decisions.js`,
`assets/js/decisions-data.js`, `assets/js/handoff.js` and `assets/js/dictation.js`, then
take the `nav__doc` block out of the nav and the *Projektdokumentation* link out of the
footer of the other five pages, and drop the `.nav .nav__doc` rules from `site.css`.
Nothing else depends on them.

---

### 4.1 `project.html` — the hub

Three cards: the plan, cycle 1, and cycle 2 as a dashed placeholder that is deliberately
**not** a link — it does not exist yet, and a card that looks clickable but is not is worse
than one that plainly says *noch nicht begonnen*. Under them, a chronicle of what happened
when, from the v1 draft to now.

It used to also explain how a revision cycle runs, in four steps. That is gone: the cycle
explains itself by being on the page next to the plan, and the section was a page of theory
in front of two documents.

The hub is static — no JavaScript beyond `site.js` for the nav and the year.

---

### 4.2 `plan.html` — the Projektplan

Built from Miguel's voice message of **31 August 2026, 18:21** — the one that came an hour
*before* the eighteen answers and describes how to proceed rather than what to decide. It is
transcribed in full in `../Resources/Transkript-3.md`.

**Six phases and fifty tasks.** The phases come straight from the message: the finished
draft round; Session 1 with all four for the *Schematik*; the homework round ending in
Session 2; the launch; the flanking work (LinkedIn, blogs, Noel's SDR tool, the chatbot);
and the external feedback round that becomes cycle 2. The last two do not end — they are
operations, not project. Every task also carries a block — **A** the open points of the
website itself (the same list as section 5 below), **B** brand and graphics, **C** agents and
chatbots, **D** LinkedIn and content, **E** external feedback, **F** steering and the two
goals — but the block is a filter now, not the order of the page.

**The chart is the phase section, two lines to a row.** First line: number, name and how
many tasks are in it. Second: the timeframe in bold and the one sentence that says what the
phase is. The bar sits on a shared ten-month scale to the right. It was five stacked lines
per phase in the first version, which turned one chart into six blocks — a Gantt only works
if the rows sit close enough together to be compared. That is the only place the phases are
described, so there is one place to read them and one place to change them. **Pressing a
phase filters the register below to it and jumps there; pressing the same phase again
releases the filter.** The count says the number plus the one qualifier that changes what you
do about it — *18 Aufgaben · 2 blockierend* — and is recomputed by `plan.js` from the
register, so it cannot drift. The *heute* line is read from the clock rather than written
into the page: it cannot go stale, and outside the ten months it is simply not drawn. Below
900 px the row stacks, label above bar, and the month scale moves above the whole chart, so
the bars stay comparable on a phone rather than being dropped.

**The register is one table per phase, in the order the phases run — the time window
decides where a task sits, not its subject.** A row is six facts wide — number, task,
Bereich, who, effort, status — and opens on click into a full brief: two to five sentences
on what is actually to be done and why, an *Ergebnis* line that says what has to exist for
the task to be finished, the tasks it needs and the tasks waiting on it, where on the site
it sits, and the feedback panel. **The brief is written for someone who does not have the
rest of the context in their head** — a row is a name, and a name is not an instruction. The first version was fifty cards grouped by subject: readable,
but impossible to coordinate, because what a phase actually contains was spread over six
places. Now every phase mixes Website, Marke, Agenten, LinkedIn, Feedback and Steuerung, the
head of each table names which of them occur, and the *Bereich* column says which is which —
deliberately muted, so the eye keeps reading by phase and not by subject. **Every dependency is a link, and it names the phase it points into** — *A14 · Die neuen
Seiten bauen* needs *A13 · Seitenplan aus Session 1*, which sits in phase 1, and the link
says so before it is clicked. Following one undoes a filter that would hide the target,
unfolds it, puts it in the middle of the screen and marks it for two seconds; `plan.js`
derives the *Hängt daran* direction from the same list, so a dependency is written once.
**Blockers sort to the top of their phase**, then what is running, then open, then backlog. Phase 0 is finished
and has no tasks left; pressing it says so instead of going blank. What belongs to no phase
is the last group, *Backlog*.

**Everything is tight on purpose.** A row is one line, a phase head two, the filter one, and
the six open questions stand two abreast. The same fifty tasks were a 15,000 px page as
cards and a 9,000 px page as roomy tables; they are 6,500 px now, and the plan is a working
document that gets scanned, not a landing page.

**Filtering by person is the point of the filter.** One line: five chips — Miguel, Fredrik,
Noel, Martin, Anwalt — answer *which tasks are mine*; a task marked *alle vier* shows up for
all four, and the person being filtered for lights up in every row that stays. Three selects
narrow further by phase, Bereich and status. (*Block* is the word in the data and in the CSV;
the interface says *Bereich*, because the letters A–F are a label on a task, not the shape of
the page any more.) The chart and the phase select are the same
filter seen twice, so using one moves the other. Everything combines, empty phases hide with
their tasks, an impossible combination says so instead of going blank, and *Filter aufheben*
appears only while something is filtered. A link into a phase — from the footer, say — clears
the filter first if that phase is currently hidden, so a jump can never land on nothing.

**Every task, every phase and every area takes feedback.** A panel inside the opened row
holds a progress mark (*erledigt · in Arbeit · blockiert*) and a note, typed or dictated;
each phase has a note of its own for what applies to all of it. The six areas keep their
notes too, in six collapsed lines at the end of the register — the register runs on time
windows, but the work still has subjects, and *what holds for all of Marke und Grafik* has
to be sayable somewhere. Their ids are still `BLOCK-A`…`BLOCK-F`, so a note written before
the reorder is still there. A closed row still says what it holds — the
mark and the word *Anmerkung* sit next to the task name, so nothing depends on the colour of
an edge. Everything is kept in this browser's `localStorage` (`fl-plan-v1`) and saves itself
half a second after the last keystroke, same rule as the catalogue. Nothing leaves the
browser until someone exports.

**Getting it out:** the same five routes as the catalogue, from the same shared sheet — CSV,
mail (which downloads the CSV alongside), WhatsApp, clipboard, print. The CSV is the complete
record: all fifty tasks whether touched or not, plus the six phase notes and the six area
notes, with columns
`typ, nr, aufgabe, block, phase, wer, status_plan, fortschritt, rueckmeldung, von, stand`.
**Printing ignores the filter, opens every task and every written note**, and leaves the
untouched forms out — paper carries the whole plan rather than whatever was on screen,
without fifty empty boxes.

**Nothing in the plan is a commitment.** Every date is relative to Session 1, which has not
been scheduled; the page says so in three places. The six things the plan cannot answer —
starting with that date, and with who instructs the lawyer — are collected in their own
section rather than smuggled in as tasks. Three items are **not** from the voice message but
from the conversation with Martin on 2 September, and say so on the page: the graphic
templates, the business cards that mirror the site, and Instagram as a low-priority option.

**Editing it:** the page is generated, and the source of truth for the tasks is the markup
itself — `plan.js` reads the fifty `<tbody class="pl-item">` elements and their `data-stream`,
`data-phase`, `data-status` and `data-who` attributes. Adding a task means adding one `tbody`
to the table of its phase; the counts, the filter, the chart's count lines and both exports
follow from it. The brief inside it is plain markup — `<p class="pl-brief">`, a
`<dl class="pl-facts">`, and `<a class="pl-ref" data-ref="…">` for each dependency, which is
all `plan.js` needs to make the jump work. `data-who` holds normalised keys (`miguel fredrik noel martin extern`), which
is what the person filter and the highlighting match on; the detail row's `colspan` is 6. A phase is two things that must
agree: a `<button class="pl-grow" data-phase="…">` in the chart, where the bar's position is
a `grid-column` on the ten-month scale, and a `<section class="pl-group" data-phase="…"
id="tasks-…">` in the register.

---

### 4.3 `decisions.html` — Überarbeitungszyklus 1

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

**It now also carries the answers.** Miguel answered all eighteen on 31 August 2026 at
19:23, three of them with an addition. Those answers are in `decisions-data.js` in their own
`ANSWERED` block, deliberately separate from the questions: per question the option that was
chosen, the addition verbatim from the CSV, **what was changed on the site because of it**,
what stayed open, and jump links to the relevant sections. They render as a green panel under
the options — green because the page already uses teal for what this browser has selected and
red for a Grundsatzfrage, and none of the three states relies on colour alone.

The questions stay answerable. What a visitor selects still goes to `localStorage` and never
touches Miguel's answers, so the page works unchanged for a second round.

The jump links point at `rev-…` anchors. `review.js` derives those from `data-review-id`
(`home.model` → `rev-home-model`); the pages now also carry them as real `id` attributes, so
the jump works whether or not the review layer has loaded.

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
- The mechanism sits in `assets/js/dictation.js` and is independent of this page. **It is now
  wired into the review layer's comment box as well** — same helper, same button, English
  labels there because that panel is English. See section 3.

**Getting the answers out of the browser.** *Antworten senden* in the bottom bar opens a sheet
with five routes. **The mail and WhatsApp routes used to lose content — see section 4.4.**
The five routes:

| Route | What happens |
|---|---|
| Per E-Mail senden | Downloads the CSV and opens a pre-filled mail to `martin@axomislabs.com`. The mail asks the sender to attach the CSV, since a browser cannot attach it itself. |
| Per WhatsApp senden | Opens WhatsApp with all answers as message text, recipient chosen in the app. Text only — a link cannot attach a file, so the CSV stays a separate download. |
| Nur die CSV-Datei herunterladen | `fersen-lohse-entscheidungen-YYYY-MM-DD.csv`, UTF-8 with BOM and a `sep=,` line, so it opens correctly in German and English Excel. Columns: `nr, block, frage, antwort, ergaenzung, beantwortet_von, stand`. This is the file to attach in a WhatsApp chat by hand. |
| Text kopieren | The whole summary on the clipboard. |
| Als PDF drucken | Print stylesheet: rail, bottom bar and microphones drop out, cards do not break across pages. |

*Alle Antworten löschen* at the bottom of the sheet clears this browser's answers after a
confirmation — useful when two people review on the same machine.

**Changing the recipient address:** `assets/js/decisions.js`, `CONFIG.recipient` at the top.
The WhatsApp route uses `CONTACT.whatsapp` from `assets/js/site.js` once that placeholder is
replaced; until then it opens WhatsApp without a preselected recipient.

**Editing the questions:** `assets/js/decisions-data.js` holds all eighteen entries with their
options, and below them the `ANSWERED` block with Miguel's replies. Never renumber an `id` —
both the stored answers and the `ANSWERED` lookup hang on it. Adding a block means one entry
in `BLOCKS`; the rail, the progress bar and both exports read their counts from the data.

---

### 4.4 Handing work out of the browser — and the bug that was in it

Three places collect something in `localStorage` and then need the same routes out: the
decision catalogue, the project plan, and the review layer the customer uses. That machinery
is now one file, `assets/js/handoff.js`, because it was wrong — and it was wrong in all
three.

**What went wrong.** The decision catalogue capped its mail body at 1 800 characters and its
WhatsApp body at 1 500, and when the text passed the cap it stopped at the first question
that did not fit and appended a `[Gekürzt]` line. A fully answered catalogue is 3 137
characters. **Miguel received fourteen of eighteen answers; with the free-text additions
filled in, the same run produces eight.** Nothing in the message said which four were
missing, and the note that something had been cut sat at the very bottom.

**Two separate mistakes, both fixed:**

1. *The budgets were far too small, and measured the wrong thing.* They counted raw
   characters, while what a browser and an app have to carry is the percent-encoded URL —
   for German text with umlauts and newlines roughly 1.6× longer. So even the stated budget
   was not the real one. `handoff.js` measures the finished URL, and the ceilings are now
   14 000 for the whole `mailto:` URL and 30 000 for `wa.me`. A WhatsApp text message holds
   65 536 characters; the old limit of 1 500 was off by a factor of forty.
2. *Cutting is the wrong response to a text that is too long.* Losing whole items is the
   most destructive thing the code can do, and it did it first. Each page now hands
   `handoff.js` **three renderings of the same content**, complete to terse, and it picks the
   most complete one that fits. Every rendering carries every item; what shrinks between them
   is the detail per item, never the number of them. For the catalogue: full → without the
   free-text additions → one line per question. For the plan: full → without the note texts →
   one line per task.

If even the tersest rendering does not fit — which cannot happen at these sizes; fifty terse
tasks are about 2 kB — the caller is told, and **says so in the status line** rather than
hiding it at the bottom of a message. The same is true one level up: whenever a route has to
step down a level, the bar says which level it used and that the full text is in the CSV.

**The review layer had the identical bug**, and it is the one a customer touches. Same
1 800-character cut, same stop-at-the-first-comment-that-does-not-fit. Twenty commented
sections on the home page at a realistic comment length is about 3 kB, so a reviewer with a
lot to say sent roughly half of it and had no way to know. It now degrades the same way, but
along a different axis, because the comments *are* the content: level 0 is every comment in
full, level 1 caps each comment at 240 characters, level 2 at 80. Every level carries every
comment. It also keeps a fallback: if `handoff.js` is missing for any reason the button
still sends the full text, because a dead button on the customer's side is worse than a mail
client complaining about a long URL.

The clipboard route has no length limit and always gets the complete text.

There is a regression test for exactly the reported case: eighteen questions answered with
realistic additions, exported to WhatsApp, and asserted to contain all eighteen. A second
stuffs 36 kB of notes in and asserts that all eighteen questions still appear, in less
detail, with the UI saying so. The plan is tested the same way at fifty tasks, and the review
layer at every commentable section of the home page — the mail call is intercepted and every
comment counted in what it would have sent.

---

## 5. What still needs to come from you

Placeholders are **visibly marked in cream/yellow** on the pages, so nothing gets forgotten.
After the v2 rework the list is shorter but three items on it are now blocking rather than
cosmetic.

This list is also **block A of the project plan**, where each item carries an owner, a
phase, a rough size and a place to record progress — `plan.html`, block filter *A · Website*.
The two lists are kept in step by hand; if one changes, change the other.

**Blocking — the page says something that is not yet settled:**

- **A legal check on the commercial model.** `index.html`, the dark *How we are paid* band.
  A success share plus compensation from the delivery side is a defensible model, but in
  Germany advertising advice as independent while taking undisclosed vendor-side compensation
  is attackable as misleading. The disclosure wording and the percentage itself need a lawyer
  before launch. The percentage is not named anywhere yet. The picture now in that band
  shows an illustrative € 500,000 → € 380,000 example; those figures are invented and need
  the same check, or wording that says so plainly. The on-page note covers this for now.
- **The ten metric lists.** `assets/js/site.js`, the `METRICS` object. They are a first draft
  derived from the capability catalog and decide whether an enquiry arrives usable. One pass
  through them, please.
- **The 95 % figure** in the problem band is currently framed as *"in our assessment"*. As a
  hard number it needs a source.

**Content:**

- The three short profiles under *Who you are actually working with* — surnames for Fredrik
  and Noel, the three roles, two or three sentences each.
- Case-study copy for Globe and Weiße Immobilien (challenge / approach / result), plus
  **written consent from both** before their names go public.
- Further benchmark examples alongside the anonymised case, as noted in answer 05.
- A client testimonial.
- Vendor and client **logo files**. The site currently shows dashed placeholder tiles.
  Logo usage should be checked against each vendor's brand guidelines.
- The scope of the *Security exposure review*: what is inside it, who delivers it, how it is
  priced. It is named on the site as a service but not yet defined.
- **High-resolution versions of the six home-page pictures.** `assets/img/visual-*.webp` are
  placeholders cut out of the two six-panel sheets, so each one is only about 500 px — sharp
  at tile size, soft much above that, and not good enough for the full-width band in the
  *How we are paid* section, which is held back to 760 px by `is-placeholder` until they are.

  **What must survive regeneration, and what must not.** The headline, the sub-line and any
  corner claim are branding and belong in HTML — they are already there, and the four pictures
  that arrived with them burnt in have been retouched so the overlay sits in the space the
  original type occupied. What must stay in the file are the labels: the leader lines on the
  exploded contract and the € 120,000 printed on it, the two feature lists with `OFFER A` /
  `OFFER B`, the `PRODUCT / MODEL / PRICE / Δ (3M)` columns, and `Before / Savings / After`
  with `Our fee (from savings)`. So the brief for each regenerated picture is: **the diagram
  and its labels, no headline, no sub-line, no claim, no logo.**

  Also at regeneration: set the label type **larger than looks right at full size**. It has to
  survive being shown about 350 px wide on a phone, which is where these currently sit at the
  edge of legibility — a type-size problem, not a resolution one, and more pixels alone will
  not fix it. Pull the red and green accents towards the brand teal where the colour is only
  decorative. On the market board, the Δ column sits about half a row high against the product
  names, so the first value lines up with the column header rather than with
  *Cloud Infrastructure* — worth straightening.

  `SAME GOALS. A STRONGER TOMORROW.`, `BEYOND THE PRICE. A STRONGER TOMORROW.` and
  `STAY AHEAD. BUY SMARTER.` appear in the generated versions but are not ratified taglines —
  they are in no decision, transcript or brief. They have been painted out and are not on the
  site. Two of the six show a person, and both are men — worth a deliberate look.

  Note that putting pictures on the home page at all settles part of **B7 *Bild- und
  Iconsprache*** ahead of its phase and ahead of **B2**, its stated prerequisite. Decision 13
  had picked only the market map, and *"no graphics, stay purely typographic"* was on the
  table. `plan.html` records this against B7; icons and diagram style are still open.

**Contact details** — all in one place, `assets/js/site.js`, the `CONTACT` object at the top:
email, phone (display + `tel:` format), WhatsApp number, LinkedIn URL, booking link.
Every link and label on the site updates from there. Also the postal address and office
hours on `contact.html`.

**Legal — `legal.html` is a skeleton and has not been legally reviewed.** Company name and
legal form, address, managing director, register court and number, VAT ID, person responsible
for content, and the full GDPR privacy notice. An incomplete German imprint is subject to
warnings and fines, so this must be checked by a lawyer before launch.

**Contact form backend.** The form validates but has no server. On submit it opens a
pre-filled email instead — which now carries the metric list for the chosen domain in the
body. Wiring it up later means one `fetch()` in `assets/js/site.js` (see `buildMailto()` for
the exact field set) — plus the corresponding privacy section.

## 6. Structure

```
website/
├── index.html  references.html  catalog.html  contact.html  legal.html
├── project.html  plan.html  decisions.html          the working layer
├── README.md
└── assets/
    ├── css/  site.css        design system: colours, type, layout, components
    │         catalog.css     catalog page only
    │         review.css      review layer only
    │         workspace.css   the working layer, shared by all three of its pages:
    │                         dark palette, mic button, savebar, send sheet, print
    │         plan.css        hub and project plan
    │         decisions.css   decision catalogue only
    ├── js/   site.js         nav, CONTACT config, contact form
    │         catalog.js      search, filter, expand/collapse
    │         catalog-data.js AUTO-GENERATED from the Excel — do not hand-edit
    │         review.js       review layer: comments, dictation, CSV + mail export
    │         handoff.js      CSV / mail / WhatsApp / clipboard, and the length
    │                         budgeting both working pages depend on — see 4.4
    │         plan.js         project plan: chart, filters, feedback, exports
    │         decisions.js    decision catalogue: answers, dictation, exports
    │         decisions-data.js the eighteen questions — edit the wording here
    │         dictation.js    speech-to-text helper, on any textarea: the comment
    │                         box, the decision catalogue, the plan
    ├── fonts/CroissantOne-Regular.ttf
    └── img/  logo-full.png  logo-mark.png  logo-mark-white.png
              visual-*.webp   the six home-page pictures (placeholders, 500 px)
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

The **market map** on the home page uses a five-step ordinal ramp of the same teal —
`#7ac2d2 · #54a9bd · #2b8095 · #156476 · #0a4653`, light to dark with the capability count.
One hue, monotone lightness, the light end still clearing the white surface, and ink on the
two light steps against white on the three dark ones so every label passes 4.5:1. Area, not
colour, carries the number, and every tile is labelled — the ramp only reinforces it.

**Croissant One** (the font of the logo wordmark) is self-hosted and used for exactly three
things: the wordmark, the hero headline and the large figures (stat tiles, step numbers, case
results). Everything else — every section title, every card title, the picture headlines and the
claim lines — uses the system sans, which stays readable at paragraph size.

The line is deliberate and worth keeping: Croissant One is a display face with a single weight
(400), so it neither reads at paragraph size nor takes a real bold. It marks *the brand and the
numbers*, never a heading level. Picture headlines and claim lines used to be set in it too, but
they sit at almost the same size as a neighbouring `<h2>` and in the same section — two fonts on
one hierarchy level read as an accident, not as a system, so they moved to the sans at weight 650.

The lotus mark reappears as a large, faint watermark in the dark bands.

**Pictures** go through one template, `.visual` in `site.css`. Three variants: `--split`
(picture beside prose, sides alternating down the page), `--banner` (one picture carrying a
statement across the column) and `--tile` (for a row of parallel pictures). Pictures are
**never cropped** — `object-fit: cover` is deliberately not used, because these carry labels
hard against the edge of the frame and cover would quietly cut the part that makes them mean
anything. The file's own proportions decide the height.

The rule the template exists to enforce is the line between *headline* and *labels*:

- The **headline, the sub-line and the mark are HTML** — `.visual__title`, `.visual__sub` and
  `.visual__brand` inside `.visual__overlay`. Burnt into a file they could not be edited,
  translated, searched or set at a readable size on a phone. `--onDark` / `--onLight` set the
  tone, `data-anchor` picks the corner, and `--tw` / `--sw` narrow the two text blocks per
  picture where the quiet part of that photograph is narrow. An `<em>` inside the title takes
  the accent colour, which is how the two-tone headlines of the original artwork are rebuilt.
  The mark normally sits in the corner opposite the text; `data-brand` overrides that where
  the picture already has something there — on the two glass cases, `OFFER A` and `OFFER B`
  occupy both bottom corners, so the mark goes up beside the headline.
- The **explanatory labels stay in the picture.** They are the argument it is making, not
  decoration: the leader lines on the exploded contract, the two feature lists on the glass
  cases, the `PRODUCT / MODEL / PRICE / Δ (3M)` columns on the market board,
  `Before / Savings / After` under the three blocks. Strip those and nothing is left but a
  photograph — three blocks with numbers and no labels say nothing at all.

The four pictures that arrived with their headline burnt in were **retouched**, not cropped:
the headline, sub-line and corner claim were painted out and the space they occupied left
intact, so the HTML overlay sits exactly where the original type did. The fill interpolates
each column between the clean pixels above and below the erased area, which reproduces these
flat and smoothly graded backgrounds exactly; on the exploded contract it fills downward only,
because interpolating towards the bright edge of the paper smears a plume of light up through
the background. That is a placeholder technique — regeneration replaces these files.

The wash rides on the overlay rather than on the picture, and clears by 46 % of the height, so
it protects the text without greying out the diagram beneath. A picture used without a line of
text keeps its full contrast: the security one is the only one used that way, because the
headline beside it already says the line and its own printed detail is the point. All six
carry the lotus mark. Where the overlay is used, contrast is measured on the rendered page by
diffing against a text-hidden render rather than assumed — currently 5.9:1 at worst.

### Updating the catalog

`catalog-data.js` and the accordion markup in `catalog.html` were generated from
`../Website, Key words.xlsx` (Sheet1, columns B and C). If the workbook changes, both need
to be regenerated together rather than edited by hand — ask and it will be rebuilt in one step.

The per-domain counts are also hard-coded in three further places, and all three have to move
together with the catalog: the market map on `index.html` (the `--w` weights *and* the row
weights, which are the row totals), the domain list in `#cf-topic` on `contact.html`, and the
`METRICS` keys in `site.js`.

Sheet2 of the workbook fed the RACI matrix on `references.html`. That section was removed in
v2 with GlobalDots (answer 02); the `.matrix`, `.role` and `.legend` rules are still in
`site.css` should it ever come back in anonymised form.

---

## 7. Verified

Tested in Chrome via an automated pass (30 checks), from `file://`:
all five pages load without console errors; catalog search, domain filters, expand/collapse,
empty state and deep links behave; the contact form prefills from `?topic=` and blocks empty
submits; review comments save, persist across reload, collect across pages, export to a valid
CSV and produce a correctly grouped mail body; and no page makes a single external request.

*One line of that is no longer true and has been fixed:* long reviews used to truncate the
mail — they now keep every comment and shorten each one instead. See section 4.4.

The decision catalogue was tested the same way (52 checks, Chrome via the DevTools protocol):
all questions and both question types render and store; answers, name and multi-select
survive a reload; dictation was driven through a stubbed speech engine — text lands in the
right field, a second dictation appends instead of overwriting, only one field records at a
time, and a refused microphone produces a readable message rather than a dead button; the CSV
carries its BOM and one row per question plus the closing row; the WhatsApp link stays under
2 000 characters; mail, print, copy and reset all do what the sheet promises; and the print
stylesheet turns the dark page back into ink on white.

**The v2 rework was checked in headless Chrome** (41 assertions plus a layout sweep):

- No console errors on any of the six pages.
- **No horizontal overflow** on any page at 390, 768 or 1280 px — which meant fixing one that
  was already there: `#contact-layout` was an inline two-column grid that never collapsed, so
  the contact page scrolled sideways on every phone (74 px at 375). It is now a
  `.contact-layout` class that stacks below 880 px.
- The guided intake: the base list stands before a choice is made, a domain swaps in its own
  five metrics, a non-domain topic falls back to the base list, and `?topic=` from a catalog
  deep link drives the list as well as the select.
- The decision catalogue: eighteen verdict panels, eighteen marked options, three additions,
  the empty closing answer noted — and answering a question in the browser still stores
  independently of Miguel's answer.
- **All 26 jump links resolve**, each one checked against the `id` on the page it points to.
- The market map holds its proportions at 1000, 1100, 1280 and 1600 px (row heights within
  2 px of the exact ratio) and clips no label at any width; below 1000 px it becomes the
  two-column list.
- The map's colour ramp was validated rather than eyeballed: monotone lightness, adjacent
  step gap ≥ 0.06, light end ≥ 2:1 against white, single hue — all pass.

**The working layer is checked in headless Chrome over the DevTools protocol** — 190
assertions in three passes (`plan`, `export`, `integration`):

*Hygiene, all eight pages.* No console errors, no external request, and no horizontal
overflow at 390, 768 or 1280 px. That last one caught a real bug the first time round: the
`sr-only` span inside each timeline bar is absolutely positioned, and with no positioned bar
to anchor to it resolved against `.section`, escaped the chart's scroll container and
dragged the page 122 px sideways on a phone.

*The navigation.* All eight pages carry the group; the parent reads *Projektdokumentation*;
the two sub-items are *Projektplan* and *Überarbeitungszyklus 1* and point at the right
files; **all three are laid out and measurable without any interaction**, so the assertion
that this is not a hover menu is a test rather than a claim; and each of the three pages
marks itself current inside the group.

*The hub.* The cycle explainer is gone — section, heading and the link to it. Three
documents, cycle 2 a `div` rather than an `a` so a placeholder cannot be clicked, five
chronicle entries, the not-going-live note kept.

*The plan.* Fifty tasks, six blocks, six phases, one phase component rather than a chart
plus six cards. Every block link in the timeline resolves, and **every count on those links
is checked against the tasks it claims to count**, so a chip cannot drift from reality.

*Feedback.* Fifty task panels and six block panels, all collapsed on arrival. A toggle opens
its panel and says so through `aria-expanded`. A mark sets, clears when clicked again, and
survives a reload together with the note. The collapsed header's flag reads *in Arbeit ·
Anmerkung* — words, not only a colour. The savebar counts it.

*The person filter.* A chip per person; filtering by Martin shows only tasks that are his; a
task owned by *alle vier* appears for Noel too, and one owned only by Martin does not; person
plus block plus status combine; empty blocks hide with their tasks; an impossible combination
shows the empty state rather than a blank page; reset restores all fifty; and a block link
from the timeline clears a conflicting filter so the jump cannot land on something hidden.

*The export bug, as reported.* Eighteen questions answered with realistic additions and sent
to WhatsApp arrive as eighteen — the case that used to arrive as eight. The status line says
it went whole. The mail route downloads the CSV alongside. Then the same run with 36 kB of
notes: still eighteen questions, in less detail, with the UI saying out loud that it
shortened. The plan is tested the same way at fifty. The budgeting itself is tested
directly: realistic ceilings, measurement on the encoded URL rather than raw characters,
stepping down a rendering rather than cutting, and reporting when even the last one will not
fit.

*Print.* With a filter active on screen, print shows all fifty tasks and all six blocks, and
**opens every written note** so paper carries what was typed. Chips, savebar, timeline strip
and mic drop out; the dark ground goes back to ink on white — on all three pages.

*The shared refactor did not break the catalogue.* Eighteen questions and eighteen verdict
panels still render, the savebar is still fixed with 92 px of room under it, the sheet still
opens with five routes and still locks the body, and the plan gets the same furniture from
the same file. Dictation correctly refuses from `file://` on both pages and each says why
instead of leaving a silent gap.

**Dictation in the comment box was tested the same way** — headless Chrome over the DevTools
protocol, 50 assertions, the site served over `http://` so the microphone is not blocked for
the wrong reason, and a stubbed speech engine standing in for the real one:

- All five customer pages load `dictation.js` and `review.js` without console errors, and each
  one has the button in its comment box.
- The recogniser is started with the settings it is supposed to have (German, continuous,
  interim results). While it runs the button carries `is-live`, `aria-pressed="true"` **and the
  word *Stop***, so the state is never colour alone.
- Spoken text lands in the field; a second sentence appends rather than overwrites; and
  dictation appends to text that was typed by hand instead of replacing it.
- **The four moments that would otherwise paste old text back into an emptied field are each
  asserted**: saving a comment, opening another section's box, closing the popover, and loading
  an existing comment to edit all stop the recogniser first. This is the one real bug the
  wiring can have — dictation remembers the field's content from when it started.
- A refused microphone produces a readable English line and a button that still works
  afterwards, not a dead one.
- The Firefox case is produced deliberately (both engines deleted, `blocked()` returns
  `unsupported`): no button is rendered, the box still saves a typed comment, and its label
  stays on the textarea.
- From `file://` the button stays visible, says why it cannot work **before** it is clicked, and
  starts no recogniser when it is.
- Layout: the box still fits a 390 px phone with the mic row in it, the row does not widen the
  popover, no horizontal overflow, and in print the whole review layer including the mic is
  gone. The new `?v=` markers were checked from `file://` as well — a query string on a local
  stylesheet is exactly the kind of thing that silently does not load.

Not re-run since v1: the review-layer CSV/mail export beyond the one save-and-store path the
dictation pass exercises.

---

## 8. What v2 changed, in one page

The full record is on `decisions.html` — answer, consequence and a jump link per question.
The short version:

| # | Answer | What it changed |
|---|---|---|
| 01 | Vendor-financed, free for the client | New dark *How we are paid* band; the "no referral fee" claim is gone from home and references |
| 02 | Take GlobalDots out entirely | Removed from both vendor walls; the whole RACI delivery section is gone from `references.html` |
| 03 | English stays | No change |
| 04 | Tell the case, anonymised | In full on `references.html`. The home page carried it too until the 7 September review took it off as a duplicate — section 9 |
| 05 | Figures out, the case instead | The `XX` impact tiles and the two `XX` hero facts are gone |
| 06 | Copy and releases are coming | Both client cards stay; the note now says what is coming |
| 07 | A team presence, slim | *Who you are actually working with* — three short profiles, no photos, no sixth page. On `contact.html` since 7 September, not on the home page — section 9 |
| 08 | The problem first, compact | A narrow band under the hero with the 95 % claim and three points |
| 09 | The benchmark stays one of six | The card is reworded and leads the list; it also appears as the entry engagement |
| 10 | 183 stays in front | Unchanged; the ~120 vendors join as the third hero figure |
| 11 | Build security out as a service | *The second kind of mistake*, with a named Security exposure review |
| 12 | Keep the four steps | No change |
| 13 | Market map of the ten domains | A proportional map replaces the ten-card list |
| 14 | Do not shorten | Nothing cut; the page is longer |
| 15 | No price, make it a strength | *There is no price list. Your success is our success* |
| 16 | Use cases as their own section | *Four things you can actually do with us* |
| 17 | A guided metrics form | The contact page is now challenge → metrics → quote |
| 18 | The dependency analysis as a second product | *Initial benchmark versus actual project*, with the ROI analysis named beside the benchmark (retitled 7 September) |

Two judgement calls worth knowing about, both flagged on the decision page itself:

- **The €10,000 from the case is not on the site.** Answer 15 said no price. Next to the
  €1.5m saving that number would immediately read as an entry price, which is exactly what
  "no price" rules out. It is one line to put back if that is wrong.
- **The RACI matrix was deleted, not anonymised.** Answer 02's option said "neither logo nor
  RACI example" and named the cost. An anonymised version — *Client · Platform vendor ·
  Integration partner · Carrier* — would keep the delivery argument without the name, and the
  CSS for it is still in place.

---

## 9. The home-page review of 7 September

Nine comments, dictated into the comment box the same morning it was built, exported through
*Send feedback*. What each one asked for and what it became:

| # | Section | The comment | What was done |
|---|---|---|---|
| 1 | Hero | An overview of the pictures, small, clickable, and it has to survive the strong turquoise | Six cards, **in the right-hand column beside the pitch** — the claim on the left, what the page holds on the right. Each card carries a short line laid over the picture and a caption underneath; the line over the picture is a hint, not the section's headline, because the full sentence is unreadable at 180 px. **Renamed on 8 September** so the page reads as benefits rather than as descriptions: the
captions are now *The challenge · Your benefits · What we do · Security exposure · Our pricing
model · Why us*, and the market card's line over the picture became *Procurement expertise*.
**The sections were pulled along**: the eyebrows of the problem, use-case and commercial-model
sections now read *The challenge*, *Your benefits* and *Our pricing model* too. Two places in
the working layer still name the old ones — the jump links on `decisions.html` (*Startseite ·
How we are paid*, *· Why this is hard*, *· For the buyer*) and task A9 on `plan.html`, which
calls the band *How we are paid*. Both are records of what was decided in cycle 1, so they
were left alone; the three link labels are worth updating if that page is still used as a map
of the site. The photographs are desaturated and dimmed against the teal and come up to full colour on hover. Below 1080 px the cards drop under the pitch, three across, two on a phone. *(First built as a thumbnail strip under the hero facts; moved and given the overlays after the follow-up on 7 September.)* |
| 2 | Use cases | The four points look disordered; the *the main one* chip distorts the format; two columns, or drop the chip, or one row | All four in one row, chip gone. They keep their numbers and get a rule each, so the row reads as one band. **No connector line between them** — they are alternatives, not stages, and a connector would promise a sequence that is not there. The intro already says most engagements start with the first |
| 3 | Services | The area behind the text reaches into the middle of the picture and is too conspicuous — crop it tighter | The wash is no longer the size of the picture. It is the size of its own text block, and it fades on two axes: a vertical gradient for the paint, a horizontal mask for how far across it carries. On the market picture it now stops before the price board instead of washing the whole top of the frame |
| 4 | Benchmark case | Already on the references page — take it off the home page | The whole section is gone from `index.html`. It stands in full on `references.html`, where it was already told with more detail |
| 5 | Engagements | *Two ways in — one of them very small* sounds generated; and the second card is the same colour as the band behind it | Retitled **Initial benchmark versus actual project**. The second card was filled with `--light-tint`, which is exactly the colour of the tinted section — it now has the same white surface as the first, a brand-coloured edge and a filled tag |
| 6 | Security | The text overlay is missing on this picture — check the initial version | Added, in the words the original artwork carried: *Overpaying hits the budget. Exposure hits later.* / *We help you see both.* Anchored bottom-left, over the quiet part of the desk, so the two documents stay readable |
| 7 | Commercial model | Big headline, no subtext, an oversized picture and no air before the three points | The picture moved beside the lead, the way the two sections above are built, at half the width. A subtext line was added under the lead, and the three points get a full band of space |
| 8 | The people | Does not belong on the home page — put it with contact and about | Moved to `contact.html` as **About us** (`#about`), with a jump link in the page header and an entry in every footer. The page introduces itself as *Contact & about* |
| 9 | References teaser | The case is a reference and belongs on the references page | The *Mexican retail group* card is gone from the teaser; the teaser now points at the case rather than repeating it |

**A tenth thing came out of the same round: the smeared corner of the market picture.** The
six pictures were prepared by painting the burnt-in headline and strapline out of the
generated artwork. On five of them that was clean. On `visual-market-moved.webp` the retouch
was a wide vertical smear: it took *STAY AHEAD. BUY SMARTER.* but also half the vendor quote
and the whole right-hand background — the washed patch beside the lotus that the review kept
pointing at. It is repaired from the original generation, which is still in the parent folder
as `Resources/Pictures/ChatGPT Image 7. Sept. 2026, 11_42_57.png` (a 3×2 contact sheet, this
is the top-right tile): the tile was aligned to the shipped crop by a scale-and-offset search,
the strapline alone was removed by diffusing the surrounding bokeh into it, the tone was
matched on a strip both still share, and the result was grafted back with a feathered edge.
The document reads *VENDOR QUOTE* again. **The other five were checked the same way and are
untouched** — two of them were cropped rather than retouched, which is why their alignment
scores look wrong.

**One consequence worth stating plainly:** with 4 and 9 both done, the €1.5m saving no longer
appears anywhere on the home page. The proof is one click away on `references.html` and the
teaser leads there, but the home page itself no longer carries a number that a sceptical
reader can weigh. That was the explicit instruction twice over; it is one paragraph to put
back if the effect is not what was wanted.

**Checked after the change**, headless Chrome at 390, 768, 1280 and 1600 px — 80 assertions:

- No console errors on any page, and no horizontal overflow at any of the four widths.
- Every jump link in the hero cards resolves to a section that exists on the page, and each
  card shows the same picture that section shows.
- Every card carries both lines, they say different things, and neither is clipped. The cards
  sit beside the pitch at 1280 px and under it at 900 px.
- The white lines over the six hero cards were measured against the band under them: the
  weakest is 5.0:1 against a 4.5:1 requirement.
- The text over the six pictures was measured rather than judged: the glyph boxes were
  photographed with the letters made transparent, and the pixels behind them read back as
  contrast ratios. At 768, 1280 and 1600 px every line clears its threshold — the worst
  pixel anywhere is 6.8:1 against a 4.5:1 requirement.
- **The phone width was checked by eye, not by that measurement.** The clipped screenshot the
  harness uses comes back shifted by a few dozen pixels at 390 px, which lands the sample on
  the wrong part of the photograph; the computed styles and a plain screenshot both show the
  wash where it belongs, so this is a limit of the measurement, not a finding about the page.
