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

**On 8 September the two engagement cards were rebuilt.** A second round of comments came in
on `home.offers`, with a mock-up attached: give each card a small drawing, and stop the pair
being designed two different ways. Each card now carries an inline-SVG illustration of what
that engagement hands over, both cards are identical, and the tags read *Quick market check*
and *Full business case*. Section 10 has it in full.

**Later the same day the section got a picture of its own.** It was the only one on the home
page with a headline, a lead and two cards but nothing to look at; the seventh
`visual-*.webp` now sits beside its head like the other six, and the two sections below it
were mirrored so the pictures keep alternating sides down the page. It is card seven in the
hero tour. **The band under it also lost its tint**: `--light-tint` and `--paper-alt` are five points
apart, so the engagements section and the *What we do* section above it were reading as one long
band with no boundary. Section 11 has it in full.

**The coverage section got the ninth picture, the same day.** `home.coverage` had the market map
but nothing beside its prose; it now carries a bound reference volume with ten chapter tabs down
the fore-edge, and it is card nine in the hero tour. It sits **left**, which doubles against the
commercial model — the process banner sits between the two, and the alternative doubled against
*Why us* with nothing in between. Section 13 has it, including the one thing about it that is
wrong: the tab labels are not the ten domains the section is about.

**A second round of comments came back the same day, and this one is about the page rather
than about a picture in it.** Six of them: the hero held nine separate photographs in two
columns and should hold one object instead — a circle, a lotus, with the mark in the middle;
the navigation named four pages and said nothing about the sections inside them; the process
picture was three times the size of every other picture on the page; the commercial model was
the one dark band in an otherwise white and pale-teal page; the references teaser belonged on
the references page; and the contact tab had to say *Contact & about*. All six are done.
The hero index is now nine petals around the mark, every nav entry opens its own page's
sections, and the home page is one section shorter. Section 14 has it in full.

Everything is static HTML/CSS/JS. **No build step, no server, no external dependencies** —
double-click `index.html` and it runs. No page contacts the internet on its own; the single
exception is dictation, where the browser hands the audio to its own speech recognition while
the button is switched on — which is why that has a paragraph in the privacy notice.

The two working-layer stylesheets and `plan.js` carry a version marker
(`plan.css?v=20260906b`), the review layer does too since dictation moved into the comment box
(`review.js?v=20260907`, on all five pages), and **since 8 September `site.css` carries one as
well** (`site.css?v=20260908b` after the second round of that day, on all eight pages) — the engagement drawings are SVG that takes
its colours from that file, and a cached copy of it would render them as black rectangles. Browsers cache these files hard, and a
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
| `index.html` | Hero with the lotus index of the page, the problem, four buyer use cases, six services, the two named engagements, security exposure, the commercial model, the four-step process, the market map of the ten domains, expertise |
| `references.html` | The benchmark case in full, client projects (Globe, Weiße Immobilien), partner/vendor wall, testimonial |
| `catalog.html` | All **183 capabilities in 10 domains**, as searchable, foldable accordions |
| `contact.html` | The guided intake — challenge → metrics → quote — plus WhatsApp / phone / email / LinkedIn / booking, and **About us**: the three people, moved here on 7 September. The nav entry, the tab title and the breadcrumb all say **Contact & about** since 8 September |
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
- **High-resolution versions of the eight 500 px home-page pictures.** `assets/img/visual-*.webp`
  are held to about 500 px — six of them cut out of the two six-panel sheets, and
  `visual-benchmark-project.webp` and `visual-capability-book.webp` resized down from 1254 px
  originals still in `Resources/Pictures/`. (`visual-process-steps.webp` is the exception at
  1132 px; see section 12.) Sharp
  at tile size, soft much above that, and not good enough for the full-width band in the
  *How we are paid* section, which is held back to 760 px by `is-placeholder` until they are.
  `visual-benchmark-project.webp` is the one that would gain most: its own printed captions are
  the smallest type on any of them, and the source to re-export from is already there.

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
              visual-*.webp   the nine home-page pictures (placeholders, 500 px)
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

The lotus mark reappears as a large, faint watermark in the dark bands — on the home page it
sits under the pitch rather than in the bottom-right corner, because that corner now holds a
lotus that is not a watermark. **The hero's picture index is the mark itself**: nine petals in
CSS, clipped by one path, around the mark on a white disc, one petal per section of the page.
It is neither photograph nor SVG illustration, so it goes through neither the `.visual`
template nor `.offer__art` — section 14 has it.

**There is no dark band in the middle of the page any more.** The `--deep` modifier existed for
one section, the commercial model, and the review of 8 September asked why that section jumped
out of a page that is otherwise white and pale teal. The band is white, the modifier is gone,
and the only dark surfaces left are the hero and the closing call to action — the two ends of
the page rather than something in the middle of it.

**Pictures** go through one template, `.visual` in `site.css`. Three variants: `--split`
(picture beside prose, sides alternating down the page — eight of the nine), `--banner` (one
picture under a centred head — the process picture, section 12) and `--tile` (for a row of
parallel pictures, still unused). **`--banner` is capped at 780px** since the second review of
8 September: at the full 1132px of the container the one section built that way carried a
picture three times the area of every other section's. That cap replaced `is-placeholder`,
which had held the variant to 760px for the 500px sources and was the same idea twice. Pictures are
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
  `Before / Savings / After` under the three blocks, `1. BENCHMARK` and `2. PROJECT` under the
  two halves of the engagements picture. Strip those and nothing is left but a
  photograph — three blocks with numbers and no labels say nothing at all.

The four pictures that arrived with their headline burnt in were **retouched**, not cropped:
the headline, sub-line and corner claim were painted out and the space they occupied left
intact, so the HTML overlay sits exactly where the original type did. The fill interpolates
each column between the clean pixels above and below the erased area, which reproduces these
flat and smoothly graded backgrounds exactly; on the exploded contract it fills downward only,
because interpolating towards the bright edge of the paper smears a plume of light up through
the background. That is a placeholder technique — regeneration replaces these files.

**The seventh picture needed neither.** It arrived with no headline burnt into it and with its
own margins already inside the range the six tiles occupy — 16 % of the height empty at the top,
16 % at the bottom — so it is a straight resize from 1254 px to 500 px and nothing else. Its two
printed captions are labels, not a headline, and stay where they are; the HTML overlay goes in
the empty top-left, which is the same arrangement the glass cases use.

**Two things on the page are drawn rather than photographed**, and they do not go through
`.visual`: the illustrations in the two engagement cards. They are inline SVG in `index.html`,
styled from `.offer__art` in `site.css` so the palette stays in one place — flat line work in
the brand ramp, sharp at any width, with the words inside them (`OFFER 1`, `ROI`) still real
text. The same line between headline and label applies, from the other side: here *everything*
is text, because there is no photograph to burn it into. Their bars use the market map's
ordinal ramp. Section 10 has the reasoning.

The wash rides on the overlay rather than on the picture, and clears by 46 % of the height, so
it protects the text without greying out the diagram beneath. The wash is on the overlay so
that a picture used without a line of text over it would keep its full contrast; as the page
stands all nine carry an overlay, the security one having been given its line back in cycle 1.
All nine carry the lotus mark. Where the overlay is used, contrast is measured on the rendered page by
diffing against a text-hidden render rather than assumed. All nine were measured together on
8 September, four widths each, zero changed pixels outside the overlay boxes: the worst text on
the page is **4.31:1**, the accent half of the process headline at 900 px, where the requirement
for text that size is 3:1. Per section, worst of ink / accent / sub: problem 18.48, use cases
5.14, services 6.15, engagements 5.22, security 4.64, model 5.08, process 4.31, coverage 5.07,
why us 11.75.

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
of the site. The photographs are desaturated and dimmed against the teal and come up to full colour on hover. Below 1080 px the cards drop under the pitch, three across, two on a phone. **A seventh card joined on 8 September** when the engagements section got a picture — see section 11; at seven the grid leaves one card alone on the last row at every width, which is open. *(First built as a thumbnail strip under the hero facts; moved and given the overlays after the follow-up on 7 September.)* |
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
as `Resources/Pictures/sheet-six-visuals-labelled.png` (a 3×2 contact sheet, this
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

---

## 10. The engagements card, 8 September

Two comments on `home.offers`, dictated into the comment box with a picture attached — a
mock-up of the pair of cards with a small drawing in each. What they asked for and what
they became:

| # | The comment | What was done |
|---|---|---|
| 1 | Extend the display after the new example so that a small illustration comes into each box — not just text. And the two tiles are designed differently: *The way in* has the green pill, and at the bottom, at *Start a benchmark* / *Scope an analysis*, it is exactly the other way round. Take the left tile as the model: the tag plain, and the call to action as a dark filled pill | A drawing in each card, and the pair made identical. Details below |
| 2 | Change the headings — *The way in* and *The bigger question* become **QUICK MARKET CHECK → FULL BUSINESS CASE** | The two tags now read *Quick market check* and *Full business case*. The card titles (*Market benchmark*, *Dependency & migration ROI analysis*) and the section headline are unchanged — the comment named the two tags |

**The inconsistency the comment caught was real, and it was in two places at once.** The right
card carried a filled dark pill at the *top*, on the tag, and an outline button at the bottom.
The left card carried a plain tag at the top and a filled dark button at the *bottom*. Each
card had exactly one dark element and they sat at opposite ends, so the pair read as two
designs rather than as one comparison. Both cards now follow the left one: plain tag, one dark
pill at the bottom where the call to action is.

**The brand-coloured edge on the second card went with it.** It was added in cycle 1 (comment 5
of 7 September) to stop that card reading as a hole in the tinted band — but the hole was
caused by its `--light-tint` fill, which is the colour of the band, and that fill is long gone.
On a white surface the ordinary `--line` border is enough, so both cards now carry the same
border, the same background and no shadow. The `.offer--second` modifier no longer exists.
**What that costs:** the larger engagement is no longer marked as the larger one by the card
itself. The new tags carry it instead — *quick market check* then *full business case* is a
progression, which is what the arrow in the comment was saying. Say the word if it should be
weighted visually again; it is one rule.

**The two drawings are inline SVG, not image files.** Everything else on the page that carries
a picture goes through the `.visual` template and a `.webp`; these two do not, for three
reasons. They are flat two-colour line work in the brand ramp, which is exactly what SVG is
for and what a photograph is not. They have to stay sharp from a 250 px phone card to a 520 px
desktop column. And the words inside them — `OFFER 1`, `OFFER 2`, `OFFER 3`, `ROI` — stay real
text, editable and translatable, which is the same rule section 6 states for picture headlines.
They sit in `index.html` rather than in a file of their own because there is no build step to
inline them with.

- **Market benchmark** — three offers fanned out, the front one in ink and the two behind it
  turned and greyed, against a three-step bar chart with a trend line rising over it.
- **Dependency & migration ROI analysis** — a server stack under a padlock, an arrow to a
  calculator, an arrow to a document headed `ROI`. The chain the engagement runs: the estate
  you are locked into, the cost of it worked out, the paper that comes out the other end.
- Both use the same 520 × 180 frame, so at equal column widths they render at the same height.
- The bars in both take three steps off the **same ordinal ramp the market map uses**
  (`#7ac2d2 · #2b8095 · #0a4653`), so a rising bar means the same thing everywhere on the page.
- The drawing is capped at its drawn width of 520 px and centred. Below 820 px the cards stack
  full-width, and without the cap the paperwork grows to the size of the text it illustrates.
- Each is a `role="img"` with a `<title>`, so a screen reader gets one sentence rather than the
  loose words inside the drawing.

**The rows of the two cards are held level by `grid-template-rows: subgrid`.** The left intro
is two lines and the right one is three, so left to itself the right card sat a line lower all
the way down — drawing, checklist and button each about 23 px out of step, which is very
visible when the whole point of the pair is that you compare them. The card hands its six rows
back to the outer grid, which sizes each row to the taller of the two. Row gap inside the band
goes to zero because the spacing is already carried by the elements' own margins. A browser
without subgrid falls back to the flex column that was there before and simply staggers, which
is what the section did until now.

**`site.css` now carries a cache marker** (`site.css?v=20260908`) on all eight pages. It never
had one, and this is the first change where a stale copy would look broken rather than merely
old: an SVG without its stylesheet falls back to solid black fills, so a reviewer reloading on
a cached stylesheet would have seen three black rectangles where the offers are. Same rule as
the working-layer files — **bump it when `site.css` changes.**

**Checked after the change**, headless Chrome at 390, 768, 1280 and 1600 px:

- No horizontal overflow at any of the four widths — the document is exactly as wide as the
  viewport at each.
- At 1280 and 1600 px the two cards are level to the pixel: both drawings start at the same y,
  both checklists at the same y, both buttons at the same y. Measured on the rendered page, not
  assumed. At 768 px and below the cards stack, where the question does not arise.
- Both drawings render at 488 px wide inside the two-column layout and hit the 520 px cap when
  the cards stack.
- The tags are plain on both cards and the two buttons are both `btn--primary`; `offer--second`
  appears nowhere in the HTML or the CSS any more.
- **390 px is again reported at 500 px.** Headless Chrome will not lay out narrower than 500 px
  in this harness, which is the same limit section 9 ran into. The phone case was read off the
  500 px render and the stacked layout below 820 px, not measured at 390.

---

## 11. The engagements picture, 8 September

`home.offers` was the one section on the home page carrying a headline, a lead and two cards but
no picture. A picture for it was supplied — a single sheet headed *Market Benchmark* read through
a magnifying glass, an arrow, and a stack of tabbed folders headed *Project* beside a laptop, the
two halves captioned *1. Benchmark — a clear view of the market, no commitment* and *2. Project —
deeper analysis, real options, measurable impact.* It is now the seventh picture, built exactly
like the other six.

**The file.** `assets/img/visual-benchmark-project.webp`, 500 × 500, cut from
`Resources/Pictures/offers-benchmark-project.png` (1254 × 1254) by a straight
Lanczos resize at webp quality 90 — 30 KB, which is the middle of the range the other six sit in.
**Nothing was cropped and nothing was retouched**, and both of those are decisions rather than
omissions:

- **No crop.** The frame's own margins were measured against the six shipped tiles before
  deciding: 16 % of the height empty at the top and 16 % at the bottom, where the six run from
  0 % to 32 % at the top and 0 % to 19 % at the bottom. It is already inside the house range, so
  trimming it would have made this one picture tighter than its neighbours rather than more
  consistent with them.
- **No retouch.** The four pictures that were retouched had a headline burnt into them that had
  to come out so the HTML overlay could take its place. This one has no headline. What it does
  have at the bottom is two captions, and those are labels in the sense section 6 draws the line
  — they are the argument the picture makes, the same role `Before / Savings / After` plays on
  the savings picture — so they stay in the file.

**Where it sits.** `.visual--split` with the section head in the `visual__body`, which is how the
use-case and services sections are built. The overlay is `--onLight`, anchored `top-left`: the
left half of the frame is empty from the top edge down to 38 % of the height, which is where the
sheet begins, and that is the only block of quiet space in the picture. The lotus mark takes the
opposite corner, bottom-right, below where the captions end. The headline is *Our iterative
**engagement approach.*** — the accent takes the second half rather than a second sentence, which
is the same two-tone construction the other six use — over *Check the benchmark and find out
what’s possible.*

**The two sections below it are mirrored, and that is the point of the change.** Split pictures
alternate sides down the page, and the new one lands between the services picture (right) and the
security picture (left), so on either side it would have doubled up. Security therefore moves to
the right column and the commercial model to the left. That is two class tokens: `visual--first`
comes off `home.security` and goes on `home.model`. Down the page the pictures now read
**right · left · right · left · right · left · right**, measured on the rendered page rather than
assumed.

**The band lost its tint, and that was the second comment on the same change.** The section was
`section--tint`. `--light-tint` is `#eef7f9`; `--paper-alt`, which is the *What we do* band
directly above it, is `#f3f8f9` — five points apart in red and green, one in blue. Side by side
down the page they do not read as two bands, they read as one long section with the boundary
missing, which is exactly what came back: *engagement and what we do need to be two different
sections; it's shown as one section, like the same background.* The engagements band is now plain
paper and the security section below it takes `--alt`, so the page keeps the white / tinted rhythm
it uses everywhere else and every boundary is visible. Measured on the rendered page: no two
adjacent sections on the home page share a background any more.

**This is the same fault the cycle-1 review found one level down.** Comment 5 of 7 September was
*the second card is the same colour as the band behind it* — a `--light-tint` card on a
`--light-tint` band. This one is a `--light-tint` band against a `--paper-alt` band. The two
tokens are close enough that anything using both at once disappears; the rule worth keeping is
**never put `--light-tint` next to `--paper-alt`.** `section--tint` is now unused on the home
page and survives only on `references.html`, where its neighbours are white.

**One thing this sweep found and did not change:** on `legal.html` the draft disclaimer and the
imprint are both plain `.section`, so they share a background too. It reads differently there —
the disclaimer is a boxed note, not a band of its own — and that page was not what the comment
was about, so it is left as it is. Worth a look if the same eye goes over it.

**The hero tour has seven cards.** The new one sits fourth, in page order, hinting *Benchmark,
then project* and captioned *Our engagements* — which is close to the section's own eyebrow
(*Engagements*) and reads in the same register as the other six captions. **This was the open
item:** the grid is three columns below 1080 px and two above it, so seven cards left one alone
on the last row at every width. The card was added first, deliberately, so the shape of the
problem could be seen before it was solved — and the process picture solved it the same day by
making the tour eight cards. Section 12.

**The sub-line was narrowed twice, and the second time it was a measurement that said so.** It
began as *The benchmark commits you to nothing. The project answers the harder question.* — 78
characters, longer than any of the other six subs and a near-repeat of the lead sitting next to
it. Cut to the first sentence, it still failed at one width: at 900 px, where the split is active
and the picture is at its narrowest, the last two glyphs of line one reached past the horizontal
fade of the scrim and on to the coffee mug, 25 pixels at 4.17:1 against a 4.5:1 requirement.
`--sw` from 24ch to 20ch pulls the wrap in ahead of that, and the worst pixel is now 6.94:1.

**Then the copy was rewritten, because it described the wrong thing.** *One sheet. Or the whole
file. / The benchmark commits you to nothing.* named the two deliverables by their thickness and
sold the first one on costing nothing — it read as a disclaimer, and the picture already carries
*no commitment* in its own caption underneath. What the two engagements actually are is a
sequence, so the overlay now names the sequence: *Our iterative **engagement approach.*** over
*Check the benchmark and find out what’s possible.*

**That copy is 81 characters against the old 64, and the overlay grew to match.** The headline
goes from two lines to three at every width, and the block runs deeper into the frame than
anything else on the page does:

| width | overlay ends (old) | overlay ends (new) |
| --- | --- | --- |
| 390 px | 44.8 % | 52.2 % |
| 500 px | 34.4 % | 40.3 % |
| 768 px | 31.6 % | 36.0 % |
| 860 px | 67.0 % | 76.5 % |
| 900 px | 63.6 % | 72.8 % |
| 1280 px | 44.1 % | 51.0 % |

The 38 % figure above is where the sheet begins in the artwork, not a limit the overlay has to
respect — the old copy already ran to 67 % at 860 px. What decides it is the scrim, and that was
measured rather than assumed.

**`--tw`/`--sw` stay at 15ch/20ch, and that was a measurement too.** Headless Chrome over the
DevTools protocol, eight widths from 390 to 1600 px, three renders per width: animations frozen
and every image forced eager, then all three text colours set transparent and differenced against
the normal render, with each glyph pixel attributed to the colour it is actually set in and scored
against the background behind it. Every run came clean — zero changed pixels outside the overlay
box, scroll position asserted identical across each pair.

| setting | headline ink | accent | sub-line | worst |
| --- | --- | --- | --- | --- |
| **15ch / 20ch (shipped)** | 13.94 | 5.22 | 5.82 | **5.22:1** |
| 17ch / 22ch | 13.94 | 4.24 | 5.82 | 4.24:1 |
| old copy, 15ch / 20ch | 13.94 | 4.69 | 6.11 | 4.69:1 |

Widening to 17ch would pull the headline back to two lines at the desktop widths, but it pushes
the accent line further right into the folder stack and costs a point of contrast; the narrow
setting is both the safer and the better-measured one, and at 5.22:1 the new copy clears the
shipped baseline's 4.69:1. The tightest spot is 860 px, the narrowest the picture gets with the
split still active: there the sub-line sits over the top edge of the benchmark sheet at 6.39:1,
legible but closer than the old copy was.

**Checked after the change**, headless Chrome at 390, 500, 768, 900, 1000, 1280 and 1600 px:

- No console errors and no failed asset loads at any width; no horizontal overflow.
- **No two adjacent sections share a background.** Read off the computed styles of every
  `main > section`, on all five customer pages, not judged from a screenshot. The home page runs
  gradient · alt · white · alt · white · alt · deep · alt · white · alt · white · gradient. The
  one pair that does share a background anywhere is the disclaimer and the imprint on
  `legal.html`, noted above.
- All seven tour cards resolve to a section that exists, and each card shows the same file that
  its section shows — compared by `src`, not by eye.
- The picture sides alternate right/left all the way down at every width above the 860 px
  collapse.
- **The overlay text was measured, not judged.** Three renders per width, each making one colour
  group transparent, differenced against a fourth with all of it transparent, so every glyph is
  attributed to the colour it is actually set in. Worst pixel anywhere: headline ink 13.94:1,
  headline accent 4.69:1, sub-line 6.94:1 — against 4.5:1, which the headline clears even though
  at 28 px and up it only needs 3:1.
- The white hint over the seven hero cards: worst pixel 14.03:1.
- **390 px was measured this time.** Sections 9 and 10 both had to read the phone case off a
  500 px render, because headless Chrome will not size a window below 500 px. Loading the page
  into a 390 px `<iframe>` inside a 500 px window gives the inner document a real 390 px viewport,
  media queries and `vw` units included. The picture stacks under the head, the overlay sits in
  the empty top-left with room to spare, and nothing is clipped.

## 12. The process picture, 8 September

*How it works* was the last section on the home page with a head, a lead and four cards but
nothing to look at. It now has the eighth `visual-*.webp`, and it is the first picture on the
site that is not square.

**The file.** `assets/img/visual-process-steps.webp`, 1132 × 906, a straight Lanczos resize of
`Resources/Pictures/ChatGPT Image 8. Sept. 2026, 11_44_48.png` (1402 × 1122) at webp quality 90.
Nothing cropped, nothing retouched: it arrived with no headline burnt into it, and what it does
carry — `01`–`04` on the plinths and `REQUIREMENTS & BASELINE`, `MARKET SCAN & SHORTLIST`,
`NEGOTIATION & COUNTER-OFFERS`, `AWARD & HANDOVER` underneath — are labels in the sense section 6
draws the line, so they stay in the file.

**It is 82 KB against the 15–40 KB the other seven sit in, and that is the resolution, not the
compression.** They are 500 px wide for a 500 px slot; this one is 1132 px, which is the inner
width of the container (1180 px less two × `--s5`), so it renders 1:1 at 1280 px and above and is
never upscaled. Per pixel it is the cheapest file of the eight.

**This is the first use of `--banner`.** The variant has been in `site.css` since the template was
written — *one picture carrying a statement across the full column* — and had no user. It is the
right one here: the picture is 5:4 and reads left to right across four stages, so it wants the
full column under a centred head rather than a column of its own beside prose. `is-placeholder`,
which holds the banner back to 760 px for the 500 px sources, is **not** used. The variant needed
one line added — `margin-block-end: var(--s7)` — because like `--split` it is always followed by
more of the section, and only `--split` had been given that.

**The four step cards are untouched** (decision 14: nothing gets cut to make room for a picture).
The picture goes between the head and the cards, and the cards' own `01`–`04` line up under the
plinths.

**The overlay is *From requirement **to signature.*** over *Every step leaves a document behind
it.*** The head above it already says *A procurement process that stands up to audit* and *four
stages, fixed deliverables, and a documented decision trail*, and the picture's own captions name
the four stages, so the overlay deliberately says neither: it names the span the arrows draw
(`REQUIREMENTS` to a signed `CONTRACT`) and the thing every plinth is holding. `--tw:16ch`,
`--sw:26ch`, anchored `top-left` into the empty top band, mark bottom-right.

**Measured, at nine widths from 390 to 1600 px.** Headless Chrome over the DevTools protocol:
animations frozen, every image forced eager, the three text colours set transparent and
differenced against the normal render, each glyph pixel attributed to the colour it is set in and
scored against the background behind it. Zero changed pixels outside the overlay box at every
width, scroll position asserted identical across each pair.

| | worst |
| --- | --- |
| headline ink | 12.96:1 |
| headline accent | **4.31:1** at 900 px |
| sub-line | 6.74:1 |

The accent is the worst text on the page now, ahead of the engagements headline's 4.69:1. At
900 px the headline is ~36 px at weight 650, so the requirement is 3:1, and it clears that with
room. Both lines stay at two lines at every width; no horizontal overflow, no failed asset loads
and no console errors anywhere.

**`Emulation.setDeviceMetricsOverride` gives a real 390 px viewport.** Sections 9 and 10 read the
phone case off a 500 px render because headless Chrome will not size a *window* below 500 px, and
section 11 worked around it with a 390 px `<iframe>` inside a 500 px window. Overriding the device
metrics over CDP needs neither: media queries and `vw` units all resolve against 390 px. Worth
using directly from here on.

**The hero tour gets an eighth card**, in page order between *Our pricing model* and *Why us*,
hinting *From requirement to signature* and captioned *How it works*.

> **Superseded the same day.** Two things in this section were undone by the second round of
> comments on 8 September: the picture is no longer the full width of the container (the variant
> is capped at 780px), and the card grid this section counts rows for no longer exists — the
> hero index is a lotus of nine petals, so the orphan-row question below is closed by the
> layout being gone rather than by a tenth picture. The overlay's sub-line changed too:
> *Every step leaves a document behind it* was called constructed, and reads *Four steps to
> success*. Section 14.

**The open item from section 11 moved rather than closed, and the ninth picture is why.** With
seven cards one sat alone on the last row at every width. Eight would have cleared it at the two
2-column ranges. A ninth picture landed on the coverage section the same hour, so the tour is
nine cards, and measured on the rendered page it now goes:

| grid | widths | rows |
| --- | --- | --- |
| 3 columns | 560–1080 px | 3 · 3 · 3 — exactly full |
| 2 columns | below 560 px, and 1080 px up | 2 · 2 · 2 · 2 · 1 — one alone |

So the orphan is gone in the middle range and still there at the top and bottom. A tenth picture
would clear the 2-column ranges and leave one alone at three columns; there is no card count that
suits both, which makes this a layout question rather than a counting one — the honest fix is a
rule for the last row, not another picture.

**The coverage picture is not documented here.** It arrived while this section was being written;
only its contrast is included in the section 6 figures above, because that number is a claim about
the whole page. Section 13 has it.

---

## 13. The coverage picture, 8 September

`home.coverage` was the last section on the home page with a head, a lead and a diagram but
nothing beside the prose. It now has the ninth `visual-*.webp`: a bound reference volume on a
stone surface, titled *Technology Capabilities — a complete market overview*, with ten coloured
chapter tabs running down the fore-edge and *Explore. Compare. Plan.* at the foot of the cover.

**The file.** `assets/img/visual-capability-book.webp`, 500 × 500, a straight Lanczos resize of
`Resources/Pictures/coverage-capability-book.png` (1254 × 1254) at webp quality 90 — 35 KB,
inside the 15–39 KB the other eight 500 px files occupy. Nothing cropped and nothing retouched:

- **No crop.** The other square sources have quiet bands to trim; this one does not. Its shadows
  and floor detail run to all four edges, so there is no empty margin to take off — cropping it
  would mean cutting into the composition rather than tightening it.
- **No retouch, and the cover type is the reason to say so.** The four pictures that were
  retouched had a *headline* burnt into the artwork that had to come out so the HTML overlay could
  take its place. The type here is not that: it is printed on a depicted book, the same way
  `Before / Savings / After` is printed on the blocks in the savings picture. It is the object,
  not a caption over the object, so it stays.

**Where it sits.** `.visual--split` with the section head in the `visual__body`, `--onLight`,
anchored `top-left`, mark bottom-right, `--tw:14ch` / `--sw:24ch`.

**Media left, and that is a choice between two doubles rather than a clean alternation.** The
splits alternate down the page, and this one lands between the commercial model (left) and *Why
us* (right), so one side had to double up. Measured on the rendered page at 900 px and above, the
pictures now go **right · left · right · left · right · left · [banner] · left · right**:

- **Left doubles against the commercial model** — but the full-width process banner sits between
  the two, so the eye never has both left-hand pictures in one view.
- **Right would have doubled against *Why us*,** which is the section immediately below, with
  nothing between the two frames.

Mirroring *Why us* instead would have given a clean alternation, and was not done: it is a dark
portrait in a `grid--2`, not a split, so moving it is a bigger change than this picture is worth.

**The sub-line went from two lines to one, because the second line landed on the book's own
printed title.** It began as *Every domain we buy in, and what sits behind each tab.* — at
`--sw:24ch` that wraps to two lines, and the second sat directly across `TECHNOLOGY CAPABILITIES`
on the cover, whose first ink is at 25 % of the frame. Two blocks of type on top of each other, legible
but unreadable as a composition. Cut to *Every domain we buy in.*, the overlay is two headline
lines and one sub-line at every width from 390 to 1600 px, and the last glyph now ends between
16.2 % and 33.1 % of the frame depending on width:

| width | picture | last glyph ends |
| --- | --- | --- |
| 500 px | 437 px | 22.3 % |
| 768 px | 705 px | 16.2 % |
| 900 px | 358 px | **33.1 %** |
| 1000 px | 408 px | 29.9 % |
| 1280 px | 534 px | 23.7 % |
| 1600 px | 534 px | 23.7 % |

**900 px is the tightest, for the reason section 11 found on the engagements picture:** it is the
narrowest the picture gets with the split still active — 358 px — while the type is sized off the
viewport, so the overlay is at its largest relative to the frame. There the sub-line still passes
over the top of the cover title and the printed words ghost through the scrim. It was compared
against the shipped engagements picture at the same width before being accepted: that one runs to
76.5 % of its frame with a three-line headline over the sheet and the mug, so at 33.1 % this is
the shallower of the two, and the ghosting is fainter than what already ships.

**Contrast, measured the way section 12 measures it** — one render per colour group with that
group set transparent, differenced against a render with all three transparent, each glyph pixel
attributed to the colour it is actually set in and scored against the background behind it. The
first pass was wrong twice and both mistakes are worth writing down: diffing each group against
the *all-transparent* render isolates every group but the one intended, and a fixed diff threshold
admits only the darkest colour, because the teal accent against near-white differs by ~158 in
luminance where the ink differs by ~209. The threshold has to be a fraction of each colour's own
peak.

| | 390 px | 500 px | 768 px | 900 px | 1280 px |
| --- | --- | --- | --- | --- | --- |
| headline ink | 13.73 | 13.73 | 13.73 | 13.73 | 13.73 |
| accent | 5.13 | 5.17 | 5.16 | **5.07** | 5.08 |
| sub-line | 6.87 | 6.88 | 7.00 | 6.93 | 6.88 |

Worst anywhere 5.07:1 against a 4.5:1 requirement — ahead of the process picture's 4.31:1 and
just behind the engagements picture's 5.22:1, so it changes nothing about which text on the page
is the tightest. The tour card's white hint over the thumbnail measures 14.58:1, in line with the
14.03:1 the other cards were measured at.

**It is card nine in the hero tour**, in page order between *How it works* and *Why us*, hinting
*Ten domains, one catalog* and captioned *Our coverage*. The grid arithmetic that comes with a
ninth card is in section 12. *(The cards became petals later the same day — section 14. The
picture is still ninth, and its hint line is one of the two things the flower dropped.)*

**Checked after the change**, at 500, 768, 900, 1000, 1280 and 1600 px: no console errors, no
failed asset loads, no horizontal overflow; all nine tour cards resolve to a section that exists
and each shows the same file its section shows, compared by `src` rather than by eye; no two
adjacent `main > section` share a background. 390 px was read through a 390 px `<iframe>` inside a
500 px window — section 12's `Emulation.setDeviceMetricsOverride` is the better instrument and
should be used from here on.

**One thing is wrong with the picture and is not fixed: the tabs are not our domains.** The
section is *183 capabilities across ten technology domains* and the artwork has exactly ten tabs,
which is why it reads as well as it does — but only four of the labels are ours. The book says
Security & Identity, Cloud & Platform Operations, Network & SASE and FinOps & Governance, which
match, then Applications, Data & AI, Developer Tools, Collaboration, Infrastructure and Other,
where the catalog has Web Performance & Delivery, Application & Code Security, Developer & Edge,
Enterprise SaaS, Cloud Hosting and Video. The market map directly underneath names all ten
correctly, so the page contradicts itself for anyone who reads the tabs. The alt text describes
the tabs as they are rather than as we would like them, so it is at least not lying. **Re-generate
the artwork with the ten real domain names** — the counts and the exact labels are in
`catalog-data.js` — and the mismatch goes away without anything else on the page changing.

---

## 14. The home-page review of 8 September, second round

Six comments, dictated into the comment box after the four pictures of that day went in. Five
are about the home page and one is about the contact tab. What each asked for and what it
became:

| # | Section | The comment | What was done |
|---|---|---|---|
| 1 | Hero | Too many separate pictures in those two columns — arrange them differently; a circle, a lotus form, with the logo somehow in the middle | The nine cards are **one object**: nine petals around the mark on a white disc, each named outside its own tip. The photographs are still in the petals and still clickable, held back to a blended third of themselves and coming up whole on hover |
| 2 | Hero | The sub-points are missing from the navigation bar — which sections are there | Every nav entry now opens its own page's sections: nine on the home page, four on references, the ten domains on the catalog, four on contact. CSS only, no script |
| 3 | How it works | The picture is disproportionately large next to all the other chapters; and *From requirement to signature* is fine, but *Every step leaves a document behind it* sounds constructed — call it *Four steps to success* | `--banner` capped at 780px, so 780 × 624 against the 534 × 534 of the split pictures instead of 1132 × 906. The sub-line reads *Four steps to success.* |
| 4 | How we are paid | The only section that stands out in colour — why is this one dark when the others are white and pale blue | It is white. The `--deep` modifier is gone from `site.css` with it, and the light/tinted alternation runs straight through the middle of the page |
| 5 | References teaser | The references can come off the home page completely — that is what the references page is for | The whole section is gone from `index.html`. Cycle 1 had already taken the benchmark case out of it for the same reason; this is the rest |
| 6 | Contact — page header | The tab has to be called *Contact and about* | The nav entry reads **Contact & about** on all eight pages, and so do the tab title and the breadcrumb. The page's own eyebrow already said it |

### The lotus index

`index.html`, the hero. Nine petals at 40° to each other, base of each petal on the centre of
the flower, pushed out along its own axis, with the mark on a white disc over the middle. All
the geometry is relative to the square the flower sits in, so one set of numbers covers every
width from 680px up:

| | | |
| --- | --- | --- |
| `--pw` / `--ph` | 16.5% / 24% of the figure | the petal box |
| `--gap` | 20% of a petal height | how far the base sits off the centre |
| `--lr` | per petal, in `cqw` | where the label sits |
| `--lw` | 17cqw | the label box |
| core | 22% of the figure | the white disc |

Three details are worth writing down because they are the ones that go wrong:

- **The label radius cannot be one number.** A label beside the flower has to clear the petal
  tip by half its *width*; a label above it by half its *height*. One radius for all nine
  strands the top and bottom labels 40px out in space. Each petal carries its own
  `--lr = 28.8 + 1.5 + 8.5·|sin a| + 3.4·|cos a|` in `cqw`, written into the markup.
- **A percentage inside a `translate()` measures the element, not the container.** The first
  build used `--lr: 40%` and put all nine labels on top of each other in the middle of the
  flower, behind the disc, because 40% of a 15px label is 6px. The label numbers are `cqw`,
  which is why `.lotus` carries `container-type: inline-size`.
- **The petal is one `clipPath` in `objectBoundingBox` units**, in `index.html` — a tip at the
  top, the widest point two thirds down, a rounded base at the heart. Object-bounding-box units
  scale it from the 480px figure to the 42px thumbnail with no second path. The photograph
  inside is counter-rotated by the same `--a` that rotates the petal, so it stays upright, and
  is oversized to 190% so no corner of the petal runs off it.

**Why the photographs are held back rather than dropped.** Cycle 1 asked for exactly this
overview of the pictures, so removing them would answer one review by undoing another. Nine
photographs of nine different subjects at a third of full strength read as nine blotches, so
they are blended for luminosity — they take the teal of the petal and the band and what is left
of each is its light and shade. Slightly blurred as well, because at this size the legible
fragments of a document in a photograph read as dirt. Pointing at a petal brings its picture
back whole and pushes the petal out 7px.

**What the flower dropped:** the hint line each card used to carry over its thumbnail
(*Same price. Different deal.*, *Exposure hits later.*). There is no room for nine of them
around a ring, and the sections themselves still carry them over their own pictures.

**Three layouts, not one.** Above 1080px the flower is 480px wide in the right-hand column of
the hero, vertically centred against the pitch. Between 680 and 1080 it is 560px and has the
full width to itself under the pitch. Below 680 the ring is dropped altogether — no rotation,
no clip, no core — and the same nine links become a two-column list with round thumbnails, unblended and
barely desaturated, because a ring of nine labels needs about 460px to be legible and a phone does not
have it.

**The figure is wider than it is tall** (`aspect-ratio: 1.22`) although the flower is round: the
labels reach 39.4% of the width sideways and 33.7% of it upwards, so a square box carried about
100px of empty band above and below.

**A soft wash sits under the whole thing.** It seats the flower on the band, and it is what
makes the labels legible: measured on the rendered page, white 11.5px type over the lightest
part of the gradient the flower sits on comes to 4.43:1, which is under the 4.5:1 that size
needs. With the wash the worst label anywhere is **6.69:1**. The labels are full white rather
than the `.78` the old card captions used — at `.78` they measured 3.40:1.

### The sections in the navigation

Every top-level entry is a `.nav__item`: the page link, a chevron, and a panel of that page's
sections. It opens on `:hover` and on `:focus-within`, and **focusing the parent link is itself
focus-within**, so a keyboard opens the panel by arriving at the entry and walks into it by
tabbing on. The panel is hidden with `visibility`, which keeps its links out of the tab order
until it is open. A transparent strip on top of the panel bridges the 18px gap under the entry,
so the pointer does not cross unhovered ground on the way in. No JavaScript anywhere in it.

On a phone there is no hover, so the sections are simply there, indented under the page they
belong to — and the panel is four pages plus twenty-seven sections long, so `.nav` gained
`max-height: calc(100dvh - 76px)` and scrolls inside itself.

The catalog's menu is the ten domains and goes to the ten accordions, which `catalog.js` opens
from the hash it already listened for. The rest go to `rev-*` section ids that already existed
for the review layer.

### What this closes, and what it opens

- **Section 12's orphan row is closed** — not by a tenth picture but by the grid being gone.
- **The home page no longer links to the references page from its body.** The teaser was the
  only place it did. The header does, on every page, and now names what is on it; the footer
  does as well. If the references need a pull from the page itself, the closing call to action
  is where it would go.
- **`decisions.html` has one more dangling jump link.** The cycle-1 catalogue links to
  `index.html#rev-home-references`, which no longer exists — as `#rev-home-case` and
  `#rev-home-team` already did not, both removed in cycle 1. That page is a record of what was
  decided in cycle 1 rather than a map of the site, which is why it has been left alone, but
  three dead jumps is the point at which it is worth a pass.

### Checked after the change

Headless Chrome, `file://`, at 390 (through a 390px `<iframe>` in a 500px window), 768, 900,
1280 and 1600px:

- No console errors and no failed asset loads on any of the eight pages.
- **No horizontal overflow** on any of the five customer pages at 390, 768 and 1280px, measured
  by walking every element in `body` and comparing its box against the viewport, with the review
  layer's off-canvas drawer excluded.
- **Every fragment link on the site resolves to an id that exists** — all 27 new nav sub-links
  and all nine petals, checked against the target file rather than by eye. The three known dead
  ones on `decisions.html` are listed above.
- **Label contrast measured, not judged**: the page rendered twice, once with `.lotus__name` and
  the tour head set transparent, differenced, and every fully inked glyph pixel scored against
  the pixel behind it. Worst anywhere **6.69:1** at 768px, against 4.5:1 required — 6.76 at 900,
  7.08 at 1280, 6.98 at 1600.
- The flower measured at each width: 480px square-ish above 1080, 560 between 680 and 1080,
  and the plain list below it, with the petal at 79 × 115 and the core at 106 in the first case.
- Both dark bands are still the hero and the closing call to action, and no two adjacent
  sections of the home page share a background.

---

## 15. The home-page review of 8 September, third round

Three comments, all on the home page, all dictated into the comment box after the second round
went in. What each asked for and what it became:

| # | Section | The comment | What was done |
|---|---|---|---|
| 1 | How it works | The picture sits below the section, but on the others we have it inside the section, left or right — keep that here too | The `--banner` is gone. The picture is a `--split` like the other seven: head, lead and eyebrow in the left column, picture in the right |
| 2 | Market map | Instead of *Every domain we buy in* we could say *browse our capabilities* | The overlay's sub-line reads **Browse our capabilities.** |
| 3 | Hero | The lotus turned out very well. Can the petals be bigger — maybe only on hover — or the whole thing bigger and pulled further right; when a petal becomes active I would like to see more of the actual picture | All three. The flower's column goes 540 → 600px from 1280 up and is pulled out of the container's right gutter; a petal opens a quarter wider when it is pointed at, and the photograph inside it is counter-scaled so that what grows is the window, not the zoom |

### The process picture moves into its section

`--banner` was the one arrangement on the page that put a picture *under* its section rather than
in it — a centred head with the picture full width beneath. It now matches the other seven:
`--split`, head in the `visual__body`, picture beside it.

**Media right.** With the banner out of the middle, the run down the page alternates the whole
way — right, left, right, left, right, left, **right**, left, right — and the double-left that
section 13 had to reason its way around is gone. The comment in `index.html` above the coverage
picture, which argued for left on the strength of the banner sitting between the two halves of
that double, has been rewritten: left is now simply the next side along.

**What it costs.** This is the only picture on the site that is not square. At 780px it was
780 × 624 with its four stage captions — `REQUIREMENTS & BASELINE` and the rest — comfortably
legible; in a half-column it is 534 × 427 and those captions are small. They are not carrying
anything the page does not already say twice: the four step cards directly underneath give all
four names at full size, and the `alt` text describes every plinth. The consistency is worth
more than the caption size.

**The file is unchanged at 1132 × 906.** It was cut to that width because it used to render 1:1
at 1280px; it now renders at half that, so it is a 2× asset for a 534px slot. At 82 KB that is
not worth a re-encode, but it is no longer true that it is the cheapest of the nine per pixel.

**`--banner` stays in `site.css` with no user**, which is what `--tile` has always been: one of
the three cases the template was designed to cover, nine lines long. Its comment now says so.

### The flower: bigger, further right

Two rules, both above 1280px, and 1280 rather than 1080 for one reason:

> `IT&nbsp;Procurement` is one unbreakable run at `--fs-hero`'s 4.2rem ceiling and measures
> **550px**. Its column is 544px at 1280 and 386px at 1080, so the word already overhangs into
> the 48px gap at every width this two-column hero exists at. That overhang is exactly what a
> wider flower column spends.

| | 1080–1279 | 1280 up |
| --- | --- | --- |
| flower's column | 540px | **600px** |
| pulled out of the right gutter by | — | **32–88px**, half the gutter |
| headline's right edge to the label ring | 41px | 87px at 1440+, 31px at 1280 |

The 31px at 1280 is boxes, not ink: the headline's long line is its first, and the label nearest
it *vertically* is *Why us*, 140px away. Below 1280 nothing changes — there is no gutter to take
and no overhang to spend.

**The bleed is `clamp(var(--s6), (100vw - var(--rail, 0px) - var(--container)) / 2, var(--s9))`.**
Half of whatever the window has over the 1180px container, floored at 32 so 1280 still gets the
shift and capped at 88 so the flower drifts toward the edge of a wide window without hugging it.
`--rail` is the 58px strip the review layer reserves down the right for comment bubbles: it comes
out of the gutter before the halving, so the flower stays clear of it, and it falls back to `0px`
for a build without that layer. The width is already `100%` of the grid area, so the negative
right margin cannot widen the box — `margin-left: auto` takes the bleed up instead and slides the
whole figure across.

### The petal opens, and the photograph does not

Two custom properties on `.lotus`, and the pairing is the whole idea:

| | | |
| --- | --- | --- |
| `--grow` | 1.24 | how far the petal opens when it is pointed at |
| `--unzoom` | .8 | what the photograph inside is scaled by at the same time |

`1.24 × .8 = .99`. The photograph stays the size it was, to within a percent, and the petal
becomes a **wider window on it** — a quarter more each way, about 56% more picture. Scale the
petal on its own, which is what "make the petals bigger on hover" asks for literally, and the
picture scales with it: the same crop at a larger size, and nothing visible that was not visible
before. Measured on the rendered page at 1440px: the petal's box goes 133 × 118 → 165 × 146 while
the photograph's goes 188 × 224 → 187 × 222.

`transform-origin` is the base of the petal and the scale is written *after* the push, so the
petal opens outward from the heart rather than swelling around its own middle. What it has to
clear is the ring of labels, and that was **hit-tested rather than computed**: a rotated petal's
bounding box overshoots its own tip by tens of pixels, so the boxes say four petals overlap their
labels when none of them do. Walking outward from each label box and asking
`document.elementFromPoint` what is there — which honours `clip-path`, as the boxes do not —
the tightest clear ground around any label is **32px with nothing open and 8px with a petal
open** at the 600px figure, 7px at 560. The 8px case is *What we do*, with its own petal open.
Nothing overlaps.

**Two stacking fixes come with it.** The nine petals overlap the way a real flower's do and the
last one in the source order wins, so an opened petal has to come up over its neighbours —
`z-index: 2` on the hovered `.lotus__shot`, which works because `.lotus` is the stacking context
(`container-type: inline-size` contains layout). And every petal's base runs in *under* the white
disc at the centre, so the core needs `z-index: 3` or an opened petal paints over the mark.

**Frozen in two places.** Below 680px the petals are round 42px thumbnails with no angle and the
photograph is already whole, so neither half applies — pulling it back there would show the edge
of the circle. Under `prefers-reduced-motion` both go, not one: the opening and the counter-scale
are one gesture and half of it reads as a glitch rather than as less motion. What is left is what
was always left — the picture comes up to full colour, unblurred, in a petal that has not moved.

### A bug this uncovered: the photographs were never 190% wide

`.lotus__img` asks for `width: 190%`, and the comment beside it says the photograph is oversized
"so no corner of the petal runs off it". It was not. The reset at the top of `site.css` sets
`img { max-width: 100% }`, **a max-width beats a width**, and so the photograph has been exactly
as wide as its petal box for as long as the flower has existed — 99px, not 188.

A photograph exactly as wide as the box does not cover that box once it is rotated inside it.
Measured against the clip outline itself rather than the box around it — the four cubics of the
`#petal` path sampled at 800 points, each mapped into the photograph's own rotated frame — eight
of the nine petals had a sliver of bare petal along one edge, and the worst needed **1.185×**
what it had:

| petal | 0° | 40° | 80° | 120° | 160° | 200° | 240° | 280° | 320° |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| before, at rest | 1.000 | 1.132 | **1.185** | 1.152 | 1.096 | 1.096 | 1.152 | 1.185 | 1.132 |
| after, on hover | 0.658 | 0.745 | 0.780 | 0.758 | 0.722 | 0.722 | 0.758 | 0.780 | 0.745 |

*(ratio of what the outline needs to what the photograph has; ≤ 1.000 is covered)*

It has been invisible because at rest the picture is a blurred third of itself, luminosity-blended
over a translucent petal — a missing sliver looks like the rest of the petal. It stops being
invisible the moment the picture comes up to full colour, and `--unzoom` would have made it 39%
worse. `max-width: none` on `.lotus__img` fixes it, and the fix is free: the visible window and
the photograph's rendered scale are both set by the *height*, so nothing about the flower at rest
changes except that the corners which were bare are now picture.

### The wash had to reach further out

The soft dark disc under the flower was `radial-gradient(closest-side, …)`. The box is wider than
it is tall, so closest-side sized the wash to the half-*height* and it died well inside the ring:
the labels at the sides — the ones furthest out — sat on bare gradient, and moving the flower
right put them on lighter ground still. Deepening the wash did nothing at all, which is what
identified the problem: they were outside it.

`farthest-side` carries it under all nine. The stops come down as the reach goes out, so it is no
heavier over the flower itself than it was — `.24` at the middle against `.26` — and what it
gains is out at the ring.

### Checked after the change

Headless Chrome over the DevTools protocol, `file://`, device metrics overridden so 390 is a real
390px viewport:

- **Eight pages × six widths** (390, 768, 900, 1280, 1440, 1600): no console errors, no failed
  network loads, no broken images, and no element overflowing the viewport, with the review
  layer's own off-canvas furniture excluded.
  - The one exception is **pre-existing and not on a customer page**: `plan.html` at 900px runs
    the last label of the Gantt month scale (*Mai ff.*) 46px past the viewport. It is inside
    `.pl-gantt`, styled by `plan.css`, which this round did not touch, and it does not widen the
    document — the Gantt scrolls inside itself. Worth a pass, not this pass.
- **The hover geometry, driven for real** rather than assumed — `Input.dispatchMouseEvent` onto a
  point found by hit-testing through the clip path, because `clip-path` clips hit-testing too and
  a petal's bounding-box centre is often not on the petal. Petal opens and photograph holds still
  at 1440; nothing moves at 1440 under `prefers-reduced-motion`, at 390, or at 390 with reduced
  motion.
- **Every petal covered by its photograph**, at rest and opened, at both the 600px and the 560px
  figure — the outline test in the table above.
- **No petal reaches a label**, opened or at rest, at 900, 1280 and 1440px — the hit-test above.
- **Contrast measured, not judged.** The page rendered twice per run, the second time with one
  run of text set to `color: transparent`, differenced, and every *fully* inked glyph pixel
  scored against the pixel behind it in the second render.

| | worst | where |
| --- | --- | --- |
| lotus labels | **5.19:1** | 1280px — 4.5:1 required at 11.5–13.5px/600 |
| process overlay, headline accent | **4.19:1** | 1280px and up — 3:1 required at 31px/650 |
| process overlay, headline ink | 12.57:1 | 1280px and up |
| process overlay, sub-line | 6.75:1 | 900px — 4.5:1 required |

The labels were 4.84:1 at 1280 before this round and 4.73:1 after the flower moved onto lighter
ground; the wash change is what takes them to 5.19. The process accent was 4.31:1 as a banner and
is 4.19:1 in a half-column — it is the worst text on the page either way, and it is large text,
so its bar is 3:1.

---

## 16. The home-page review of 8 September, fourth round

Two comments, both on the *Overview* title above the lotus, both caused by the third round.

| # | The comment | What was done |
|---|---|---|
| 1 | The title has slipped — it is no longer together and central; centre it better over the picture | The bleed moved off `.lotus` and onto `.hero__tour`, so the head and the flower are shifted by one rule instead of two. Head centre against flower centre: **0px** at every width from 768 up |
| 2 | It can be more marked, it hardly sets itself apart from the actual texts — from the individual chapters | A step larger and heavier than the largest chapter label, full white instead of `.82`, and the site's own eyebrow rule in `--light` mirrored either side of it |

### Why it had slipped

Section 15 put the gutter bleed on `.lotus`, which is inside `.hero__tour`, and left `.hero__tour-head`
where it was — centred on the grid column. So the flower moved right by the bleed and its title did
not, and the two came apart by exactly that much:

| | 900 | 1080 | 1280 | 1440 and up |
| --- | --- | --- | --- | --- |
| head centre − flower centre, before | 0 | 0 | −32px | −88px |
| after | 0 | 0 | **0** | **0** |

The fix is one line in a different place: `margin-inline: var(--bleed) calc(-1 * var(--bleed))` on
`.hero__tour`, the element that contains both. Equal and opposite, so the box stays the width of its
grid area and only its position moves, and there is no second number that can drift out of step with
the first. The `.lotus` rule is gone.

### Why it read as a tenth label

It was `--fs-xs` (12.6px) at weight 650 in **.82 white**. The nine chapter names it sits over are up
to 13.5px at weight 600 in **full white** — so the title was smaller, lighter in weight than nothing
in particular, and *dimmer* than the labels. Nothing about it said it was the head of the thing.

Three changes, and the third is the one that does the work:

| | before | after |
| --- | --- | --- |
| size | 12.6px | 15.2px — a step over the largest label |
| weight / tracking | 650 / .14em | 700 / .2em |
| colour | `rgba(255,255,255,.82)` | `#fff` |
| rule | — | 22 × 2px of `--light`, both sides |

The rule is the site's own eyebrow ornament, which every section head on the site already carries —
ranged left, one dash. This head is centred, so it takes one on each side. `--light` appears nowhere
else in the flower, and a colour no label can have is what stops the eye filing the word with them.

**No `text-indent`.** Centred letterspaced type normally wants one to pay back the trailing space
after its last glyph. Here the `::after` rule takes that space instead, so adding the indent as well
overshoots — measured, the word sits dead on the flower's centre without it and 2px right of it with
it.

### Checked after the change

- **Head centred on the flower to 0px** at 768, 900, 1080, 1280, 1440, 1600 and 1920 — measured with
  a `Range` over the head's text, against the centre of the white disc, not against either box.
- **Contrast, same method as section 15.** The head is **4.73:1** at its worst (390px), 5.35 at 768
  and 900, 5.12–5.21 above. At 15.2px/700 it is not large text, so it needs 4.5:1. It was `.82`
  white before, which measured worse everywhere.
- Eight pages × six widths clean of console errors, failed loads, broken images and overflow, with
  the same one pre-existing exception on `plan.html` noted in section 15.

---

## 17. The phone menu, 8 September

One comment, on the burger menu: *we have the complete list, so it is hard to have an overview —
maybe a dropdown for each sub-menu instead.* And a question with it, which is answered at the end of
this section: whether the overview in the menu could be laid out as the lotus.

### What was wrong

Section 14 put every page's sections into the header. On a wide screen they are behind a hover
panel, so the header is still four words. On a phone there is no hover, so they were simply printed
out under the pages they belong to and the menu was **four pages, twenty-seven sections, a call to
action and three working-layer links** — a panel about 1130px long inside a phone screen about 700px
tall, which is why `.nav` was given a scroll of its own at the time. The whole map at once is the
same as no map: nothing at the top of it tells you the site has four pages, because you cannot see
the fourth.

### What it is now

Each entry folds behind its own button. The menu opens as **four lines** — 434px with the call to
action and the working-layer block under them, against the 1130 it was — and one tap opens one page's
sections.

| | |
| --- | --- |
| the row | page link on the left, a 44px disclosure button on the right |
| closed | `max-height: 0` and `visibility: hidden` |
| open | `max-height: 34rem`, eased over .26s |
| how many at once | one |
| on opening the menu | all four shut |

Four decisions are worth the lines they cost:

- **The button is beside the link, not around it.** Tapping *Catalog* has to go to the catalog. A
  disclosure that swallows its own page link is the standard way this gets built and the standard way
  it gets broken.
- **One group at a time.** Two of the four carry ten sections each. Two of those open together is
  most of the long list back.
- **Nothing opens by itself, including the page you are on.** Auto-opening the current page reads
  well on References or Contact, where it adds four lines, and badly on Home or Catalog, where it
  adds ten and pushes the other three pages off the bottom of a 780px screen — the menu measures
  704px against 434. The page you are on is already the teal one. It is one line in `site.js`
  (`if (link.getAttribute("aria-current") === "page")`) if it is ever wanted.
- **It is built in `site.js`, not written into the eight pages.** The control belongs to a menu that
  only exists when that script runs — no script, no burger button, nothing to fold — and the panels
  still open on hover above 900px whether it ran or not.

### Two things that went wrong on the way, both worth writing down

**The keyboard walked through twenty-seven hidden links.** `.nav__item:focus-within .nav__sub` is
what opens the panel for a keyboard on a wide screen, and it is not inside a media query — it cannot
be, the desktop needs it. Focusing a page link is itself focus-within, so tabbing onto *Home* on a
phone unfolded its ten sections behind a button that still said `aria-expanded="false"`, and Tab went
straight into them. The phone block now puts `visibility: hidden` back on `:hover` and
`:focus-within` at the same weight and later in the file, with the open state later still, so a panel
that is genuinely open stays open when focus enters it. Measured by pressing Tab, not by reading the
CSS: the order is now page, its button, next page, its button.

**A closed panel was still 12px tall.** `box-sizing: border-box` floors the *content* height at zero
under `max-height: 0`, not the box — the 12px of bottom padding survived, four times over, as gaps
between rows that were supposed to be shut. The space under the last section is a margin on the last
link now, which is inside the box and clips away with everything else.

### The lotus in the menu — why not

Worth answering with a measurement rather than an opinion, so the flower was squeezed to **342px**,
which is what a 390px phone has left after the menu panel's padding, and rendered:

| | at 480px (the hero) | at 342px (a menu panel) |
| --- | --- | --- |
| petal | 79 × 115 | **56 × 67** |
| white core over it | 106 | 75 — half of every petal |
| labels on two lines | 0 | **8 of 9**, and one on three |
| height for nine links | — | **280px** |

Three things break at once. The core covers the inner half of every petal, so the flower reads as a
white disc with leaf tips and the photographs — the whole point of it — are gone. Eight of the nine
labels break to two lines and *Our pricing model* to three, so the ring of names is bigger than the
flower inside it. And 280px is what **one** of the four groups would cost, against 434px for the
entire folded menu.

Two more reasons that do not need measuring. A lotus is a nine-fold form and the menu is 10, 4, 10
and 4 — four flowers of four different sizes is not a navigation. And the flower is the mark of the
home page; putting it inside the menu on all eight pages is the fastest way to make it ordinary.

**On the home page itself nothing changes, and should not.** The flower is already dropped below
680px — section 14, *three layouts, not one* — for the same reason this measurement shows: a ring of
nine labels needs about 460px. Above that it stays exactly as it is.

### Checked after the change

Headless Chrome, `file://`, all eight pages at 320, 360, 390, 430, 768 and 900px, and the desktop
menu re-checked at 901, 1080, 1280 and 1600:

- **Four buttons per page**, each 44 × 44, each `aria-controls` pointing at an id that exists and no
  two the same, each labelled *Sections of …* for a screen reader.
- **Collapsed is collapsed**: all four panels 0px tall and `visibility: hidden` on every page.
- **Tab order** walked with real key presses: page, button, page, button, page, button, page, button,
  *Get in touch*, Projektdokumentation. No hidden section link is reachable.
- **The catalog's ten domains** — the longest panel — open to 414px inside the 34rem cap with no link
  clipped and none wrapping, at every width from 320 to 900.
- Tapping a section link still closes the whole menu; tapping a disclosure button does not; Escape
  still closes the menu; exactly one group is ever open.
- **The desktop is untouched**: at 901px and above the disclosure buttons are `display: none`, the
  panel is still `position: absolute` with no `max-height`, and it still opens on both hover and
  focus-within.
- No console errors on any page.

### The fold shipped broken, and why

Reported straight after the change: *now I really only have the top pages — I have to be able to get
to the sections somehow.* Exactly right, and it was not a matter of the button being hard to find.
There was no button.

`site.css` is linked with `?v=` on all eight pages. `site.js` was linked with nothing. So a browser
that already had the site took the **new stylesheet** and kept the **old script** — and the new
stylesheet is the half that hides the panels. Four page names, twenty-seven section links sitting in
the HTML, and nothing in the document able to open them. Reproduced rather than guessed: current
`site.css` served with the previous `site.js`, and the menu comes up with 0 buttons and 0 of 28
sections reachable.

Two fixes, and the second is the one that matters:

1. **`site.js` is versioned now**, `?v=20260908d`, the same as the stylesheet beside it. That
   repairs this instance.
2. **The fold hangs off a flag the script sets.** `site.js` puts `data-folds="true"` on the nav, last
   and only if the buttons actually went in, and every folding rule in `site.css` is scoped to it.
   The unfolded panel — open, indented under its page — is the unconditional rule again, which is
   what it was before this change. A stylesheet must not hide what only a script can bring back;
   that is the class of bug, and the flag is what closes it rather than the version number.

Measured three ways at 390px: script runs — 4 buttons, menu 433px, sections folded. Stale cached
script — no buttons, **28 of 28 sections reachable**, menu 1410px. JavaScript off entirely — the
same. Long, but nothing is lost.

**The chevron also went from `--mute` to `--ink-3` and from 10 to 12px.** `--mute` is the grey of the
wordmark and of disabled type. Beside a hover panel on a desktop the chevron is a hint; on a phone it
is the only door to the sections under it, and a control that is the only door has to look like one.

### An inconsistency this exposed

The versioning across the site is uneven, and this bug is what that costs. Versioned:
`site.css`, `site.js`, `review.css`, `review.js`, `plan.css`, `plan.js`. Not versioned:
`handoff.js` on seven pages, `catalog.js`, `catalog-data.js`, `decisions.js`, `decisions-data.js`,
`catalog.css`, `decisions.css`. And `dictation.js` and `workspace.css` are versioned on some pages
and bare on others, so the same file has two cache entries.

It only bites when a versioned file starts depending on an unversioned one — which is precisely what
happened here. Left as it is for now; it is worth one pass that puts the same stamp on everything.

### One thing this did not cause, found while checking it

Between **901 and 959px** the header overflows the window by 40px — the desktop nav row plus the
Projektdokumentation block is 739px wide and the container has 843 for it and the brand together, so
`.nav__doc` hangs off the right edge and the page gets a horizontal scrollbar. It is a narrow band:
900 and below is the burger, 960 and above fits. A small tablet held in landscape lands in it.

**It is not from this change.** Measured both ways — the working tree, and a copy of it with the
disclosure buttons and their stylesheet rule taken back out — and both overflow by exactly the same
40px at 901 and 940 and are clean at 960. It arrived with section 14, when the four nav entries each
gained a chevron and the row grew about 52px.

The fix is one number, and which number is a design decision rather than a bug fix: moving the burger
breakpoint from 900 to 960 hands that band to the phone menu — which now has somewhere sensible to
put twenty-seven sections — while dropping `.nav__doc` to a second line under the nav keeps the
desktop row down there instead. Left alone for now because it is the first of the two that changes
what the site looks like at a width you have not asked about.
