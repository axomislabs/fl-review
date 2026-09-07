/* ==========================================================================
   Fersen & Lohse — Projektplan

   The page ships complete: fifty tasks in six phase tables, six phases on one
   chart, all readable and all printable. This file adds four things on top and
   nothing that the page depends on to make sense:

     1. the chart      — a phase is a button: pressing it filters the register
                         below to that phase, pressing it again releases it
     2. filtering      — by person, by phase, by block, by status
     3. feedback       — a progress mark and a note per task, a note per phase
                         and a note per area, typed or dictated, in localStorage
     4. handing it out — CSV, mail, WhatsApp, clipboard, print

   The feedback panels are built here rather than shipped in the HTML: fifty
   collapsed forms would triple the file for something most readers never
   open, and without JS they could not be saved anyway. What the HTML ships is
   the plan; what this adds is the ability to answer it.

   Length budgeting for the mail and WhatsApp routes is handoff.js's job — see
   the header of that file for why it is not done here, and what it cost the
   last time it was.
   ========================================================================== */

(function () {
  "use strict";

  var root = document.getElementById("pl-groups");
  if (!root) return;

  var HANDOFF = window.FL && window.FL.handoff;

  var CONFIG = {
    recipient: "martin@axomislabs.com",
    project: "Fersen & Lohse",
    storageKey: "fl-plan-v1"
  };

  var MARKS = {
    done:  "erledigt",
    run:   "in Arbeit",
    block: "blockiert"
  };

  var $ = function (sel, scope) { return (scope || document).querySelector(sel); };
  var $$ = function (sel, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(sel));
  };

  /* ==================================================== state handling == */

  var state = { version: 1, who: "", items: {}, updatedAt: "" };

  var entry = function (id) {
    if (!state.items[id]) state.items[id] = { mark: "", note: "" };
    return state.items[id];
  };

  var hasContent = function (e) {
    return !!(e && (e.mark || (e.note && e.note.trim())));
  };

  var countFeedback = function () {
    var n = 0;
    Object.keys(state.items).forEach(function (id) {
      if (hasContent(state.items[id])) n += 1;
    });
    return n;
  };

  var load = function () {
    try {
      var raw = window.localStorage.getItem(CONFIG.storageKey);
      if (!raw) return;
      var saved = JSON.parse(raw);
      if (!saved || typeof saved !== "object") return;
      state.who = typeof saved.who === "string" ? saved.who : "";
      state.updatedAt = typeof saved.updatedAt === "string" ? saved.updatedAt : "";
      if (saved.items && typeof saved.items === "object") {
        Object.keys(saved.items).forEach(function (id) {
          var v = saved.items[id];
          if (!v || typeof v !== "object") return;
          state.items[id] = {
            mark: typeof v.mark === "string" ? v.mark : "",
            note: typeof v.note === "string" ? v.note : ""
          };
        });
      }
    } catch (e) { /* corrupt or unavailable storage: start clean */ }
  };

  var saveTimer = null;

  var save = function () {
    state.updatedAt = new Date().toISOString();
    try {
      window.localStorage.setItem(CONFIG.storageKey, JSON.stringify(state));
      setStatus("Gespeichert in diesem Browser", "ok");
    } catch (e) {
      setStatus("Speichern nicht möglich — bitte den Text vor dem Verlassen exportieren.", "warn");
    }
    renderProgress();
  };

  var saveSoon = function () {
    window.clearTimeout(saveTimer);
    saveTimer = window.setTimeout(save, 500);
  };

  /* ========================================================== plumbing == */

  var statusLine = $("#pl-status-line");
  var statusTimer = null;

  function setStatus(text, kind) {
    if (!statusLine) return;
    statusLine.textContent = text;
    statusLine.className = "wl-status" + (kind ? " is-" + kind : "");
    window.clearTimeout(statusTimer);
    if (text) statusTimer = window.setTimeout(function () { statusLine.textContent = ""; }, 4000);
  }

  var pad = function (n) { return (n < 10 ? "0" : "") + n; };

  var stampDay = function () {
    var d = new Date();
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  };

  var stampFull = function () {
    var d = new Date();
    return pad(d.getDate()) + "." + pad(d.getMonth() + 1) + "." + d.getFullYear() +
      ", " + pad(d.getHours()) + ":" + pad(d.getMinutes());
  };

  /* Every task and phase, read straight off the markup so the data lives in
     exactly one place — the page itself. */
  var TASKS = $$(".pl-item", root).map(function (el) {
    var meta = $$(".pl-detail__meta b", el);
    return {
      id: el.getAttribute("data-task"),
      el: el,
      stream: el.getAttribute("data-stream"),
      phase: el.getAttribute("data-phase"),
      status: el.getAttribute("data-status"),
      who: (el.getAttribute("data-who") || "").split(/\s+/).filter(Boolean),
      title: (($(".pl-row__title", el) || {}).textContent || "").trim(),
      whoText: ((meta[0] || {}).textContent || "").trim(),
      whenText: ((meta[1] || {}).textContent || "").trim(),
      statusText: (($(".pl-pill", el) || {}).textContent || "").trim()
    };
  });

  var GROUPS = $$(".pl-group", root).map(function (el) {
    return {
      key: el.getAttribute("data-phase"),
      el: el,
      title: el.getAttribute("data-phase-title") || ""
    };
  });

  var groupId = function (key) { return "PHASE-" + key; };

  /* The six areas — Website, Marke, Agenten, LinkedIn, Feedback, Steuerung.
     The register is ordered by time window, so an area has no table of its
     own any more; what applies to a whole area regardless of phase gets its
     own note at the end of the register. Their ids stay BLOCK-x, so notes
     written before the reorder are still theirs. */
  var AREAS = $$(".pl-fb--area", root).map(function (el) {
    return {
      key: (el.getAttribute("data-fb") || "").replace("BLOCK-", ""),
      el: el,
      title: el.getAttribute("data-area") || ""
    };
  });

  /* ================================================ the feedback panels == */

  var MIC_SVG =
    '<svg viewBox="0 0 24 24" aria-hidden="true">' +
    '<path d="M12 3a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3z"></path>' +
    '<path d="M5 11a7 7 0 0 0 14 0"></path><path d="M12 18v3"></path></svg>';

  var micBlocked = window.FL_DICTATION ? window.FL_DICTATION.blocked() : "unsupported";

  var micButton = function (fieldId) {
    if (micBlocked) return "";
    return '<button type="button" class="wl-mic" data-mic="' + fieldId + '" ' +
      'aria-label="Diktieren statt tippen">' + MIC_SVG +
      '<span class="wl-mic__label">Diktieren</span></button>';
  };

  var PANEL = {
    task:  { label: "Rückmeldung",                 field: "Stand, Hindernis, Frage",
             hint: "Was ist der Stand? Was fehlt?" },
    phase: { label: "Anmerkung zur ganzen Phase",  field: "Was gilt für diese Phase?",
             hint: "Gilt für alle Aufgaben dieser Phase …" },
    area:  { label: "",                            field: "Was gilt für diesen Bereich?",
             hint: "Gilt für alle Aufgaben dieses Bereichs …" }
  };

  var panelHtml = function (id, kind, title) {
    var text = PANEL[kind];
    var fieldId = "pl-note-" + id;
    var marks = kind !== "task" ? "" :
      '<div class="pl-marks" role="group" aria-label="Fortschritt">' +
      Object.keys(MARKS).map(function (key) {
        return '<button class="pl-mark pl-mark--' + key + '" type="button" data-mark="' + key +
          '" aria-pressed="false">' + MARKS[key] + '</button>';
      }).join("") +
      '</div>';

    return '<button class="pl-fb__toggle" type="button" aria-expanded="false" aria-controls="pl-body-' + id + '">' +
             '<span class="pl-fb__caret" aria-hidden="true">›</span>' +
             '<span class="pl-fb__label">' + (text.label || title) + '</span>' +
             '<span class="pl-fb__flag" hidden></span>' +
           '</button>' +
           '<div class="pl-fb__body" id="pl-body-' + id + '" hidden>' +
             marks +
             '<div class="pl-note">' +
               '<div class="pl-note__head">' +
                 '<label for="' + fieldId + '">' + text.field + '</label>' +
                 micButton(fieldId) +
               '</div>' +
               '<textarea id="' + fieldId + '" data-note="' + id + '" rows="3" ' +
                 'placeholder="' + text.hint + '"></textarea>' +
               '<p class="pl-note__status" id="pl-mic-' + fieldId + '"></p>' +
             '</div>' +
           '</div>';
  };

  $$(".pl-fb", root).forEach(function (host) {
    var id = host.getAttribute("data-fb");
    var kind = id.indexOf("PHASE-") === 0 ? "phase"
             : id.indexOf("BLOCK-") === 0 ? "area" : "task";
    host.innerHTML = panelHtml(id, kind, host.getAttribute("data-area") || "");
  });

  /* Reflect stored feedback into a panel, and mark the collapsed header so a
     filled-in note is visible without opening anything. */
  var paint = function (id) {
    var host = root.querySelector('.pl-fb[data-fb="' + id + '"]');
    if (!host) return;
    var e = entry(id);
    var area = $("textarea", host);
    if (area && area.value !== e.note) area.value = e.note;
    $$(".pl-mark", host).forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-mark") === e.mark));
    });

    var bits = [];
    if (e.mark) bits.push(MARKS[e.mark]);
    if (e.note && e.note.trim()) bits.push("Anmerkung");
    var text = bits.join(" · ");

    var flag = $(".pl-fb__flag", host);
    if (flag) {
      flag.hidden = bits.length === 0;
      flag.textContent = text;
      flag.className = "pl-fb__flag" + (e.mark ? " pl-fb__flag--" + e.mark : "");
    }
    host.classList.toggle("is-filled", hasContent(e));

    /* The same word again on the closed row, so a filled-in task is visible
       in the table without opening anything. */
    var item = host.closest(".pl-item");
    if (item) {
      item.classList.toggle("is-marked", hasContent(e));
      var rowFlag = $(".pl-row__flag", item);
      if (rowFlag) {
        rowFlag.hidden = bits.length === 0;
        rowFlag.textContent = text;
        rowFlag.className = "pl-row__flag" + (e.mark ? " pl-row__flag--" + e.mark : "");
      }
    }
  };

  var paintAll = function () {
    TASKS.forEach(function (t) { paint(t.id); });
    GROUPS.forEach(function (g) { paint(groupId(g.key)); });
    AREAS.forEach(function (a) { paint("BLOCK-" + a.key); });
  };

  /* Open a task from anywhere: undo a filter that hides it, unfold it, put it
     in the middle of the screen and mark it for a moment. */
  var reveal = function (id) {
    var item = document.getElementById("t-" + id);
    if (!item) return;
    var group = item.closest(".pl-group");
    if (item.hidden || (group && group.hidden)) resetFilter();

    var btn = $(".pl-row__btn", item);
    var detail = $(".pl-detail", item);
    if (btn && btn.getAttribute("aria-expanded") !== "true") {
      btn.setAttribute("aria-expanded", "true");
      if (detail) detail.hidden = false;
      item.classList.add("is-open");
    }

    var soft = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    item.scrollIntoView({ behavior: soft ? "auto" : "smooth", block: "center" });
    item.classList.remove("is-target");
    void item.offsetWidth;                       /* restart the mark */
    item.classList.add("is-target");
    window.setTimeout(function () { item.classList.remove("is-target"); }, 1900);
    if (btn) btn.focus({ preventScroll: true });
  };

  root.addEventListener("click", function (event) {
    /* A brief points at the tasks it needs and at the ones waiting for it.
       Those live in other phases, and the filter may be hiding them. */
    var ref = event.target.closest(".pl-ref");
    if (ref) {
      event.preventDefault();
      reveal(ref.getAttribute("data-ref"));
      return;
    }

    /* A task opens on its title: description, the four facts, and the panel. */
    var rowBtn = event.target.closest(".pl-row__btn");
    if (rowBtn) {
      var detail = document.getElementById(rowBtn.getAttribute("aria-controls"));
      var isOpen = rowBtn.getAttribute("aria-expanded") === "true";
      rowBtn.setAttribute("aria-expanded", String(!isOpen));
      if (detail) detail.hidden = isOpen;
      var item = rowBtn.closest(".pl-item");
      if (item) item.classList.toggle("is-open", !isOpen);
      return;
    }

    var toggle = event.target.closest(".pl-fb__toggle");
    if (toggle) {
      var body = document.getElementById(toggle.getAttribute("aria-controls"));
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      if (body) body.hidden = open;
      return;
    }

    var mark = event.target.closest(".pl-mark");
    if (mark) {
      var host = mark.closest(".pl-fb");
      var id = host.getAttribute("data-fb");
      var e = entry(id);
      var value = mark.getAttribute("data-mark");
      e.mark = e.mark === value ? "" : value;   /* clicking the set mark clears it */
      paint(id);
      save();
    }
  });

  root.addEventListener("input", function (event) {
    var area = event.target.closest ? event.target.closest("textarea[data-note]") : null;
    if (!area) return;
    entry(area.getAttribute("data-note")).note = area.value;
    var id = area.getAttribute("data-note");
    var host = root.querySelector('.pl-fb[data-fb="' + id + '"]');
    if (host) host.classList.toggle("is-filled", hasContent(entry(id)));
    saveSoon();
  });

  /* ========================================================= dictation == */

  var micStatus = function (fieldId, text, kind) {
    var el = document.getElementById("pl-mic-" + fieldId);
    if (!el) return;
    el.textContent = text || "";
    el.className = "pl-note__status" + (kind ? " is-" + kind : "");
  };

  var micVisual = function (button, live) {
    button.classList.toggle("is-live", live);
    var label = $(".wl-mic__label", button);
    if (label) label.textContent = live ? "Stopp" : "Diktieren";
    button.setAttribute("aria-label", live ? "Diktat beenden" : "Diktieren statt tippen");
  };

  root.addEventListener("click", function (event) {
    var button = event.target.closest ? event.target.closest(".wl-mic") : null;
    if (!button || !window.FL_DICTATION) return;
    var fieldId = button.getAttribute("data-mic");
    var field = document.getElementById(fieldId);
    if (!field) return;

    /* Only one field records at a time — reset whatever was live before. */
    var live = document.querySelector(".wl-mic.is-live");
    if (live && live !== button) micVisual(live, false);

    window.FL_DICTATION.toggle(field, function (ev, info) {
      if (ev === "start") {
        micVisual(button, true);
        micStatus(fieldId, "Hört zu — einfach sprechen. Nochmal klicken zum Beenden.", "live");
        field.focus();
      } else if (ev === "stop") {
        micVisual(button, false);
        micStatus(fieldId, "");
        entry(field.getAttribute("data-note")).note = field.value;
        paint(field.getAttribute("data-note"));
        save();
      } else {
        micVisual(button, false);
        micStatus(fieldId, (info && info.message) || "Diktieren nicht möglich.", "warn");
      }
    });
  });

  /* =========================================================== filters ==

     Four dimensions over one list: person, phase, block, status. The chart
     above and the phase select are the same filter seen twice — whichever
     is used, both follow.
     ---------------------------------------------------------------------- */

  var filter = { who: "all", phase: "all", stream: "all", status: "all" };

  var countEl = $("#pl-count");
  var emptyEl = $("#pl-empty");
  var resetBtn = $("#pl-reset-filter");
  var phaseSel = $("#pl-phase");
  var streamSel = $("#pl-stream");
  var statusSel = $("#pl-status");
  var phaseRows = $$(".pl-grow");

  var matches = function (t) {
    if (filter.who !== "all" && t.who.indexOf(filter.who) === -1) return false;
    if (filter.phase !== "all" && t.phase !== filter.phase) return false;
    if (filter.stream !== "all" && t.stream !== filter.stream) return false;
    if (filter.status !== "all" && t.status !== filter.status) return false;
    return true;
  };

  var applyFilter = function () {
    var shown = 0;
    TASKS.forEach(function (t) {
      var ok = matches(t);
      t.el.hidden = !ok;
      if (ok) shown += 1;
    });

    GROUPS.forEach(function (g) {
      var live = $$(".pl-item:not([hidden])", g.el).length;
      g.el.hidden = live === 0;
      var count = $("[data-group-count]", g.el);
      if (count) count.textContent = String(live);
    });

    if (countEl) {
      countEl.textContent = shown === TASKS.length
        ? "Alle " + TASKS.length + " Aufgaben."
        : shown + " von " + TASKS.length + " Aufgaben.";
    }

    /* Phase 0 is done and has no tasks left in the register — an empty table
       there is the right answer, not a broken filter. */
    if (emptyEl) {
      emptyEl.hidden = shown !== 0;
      emptyEl.textContent = filter.phase === "P0"
        ? "Phase 0 ist abgeschlossen — sie hat keine offenen Aufgaben mehr."
        : "Keine Aufgabe passt auf diesen Filter.";
    }

    var active = filter.who !== "all" || filter.phase !== "all" ||
                 filter.stream !== "all" || filter.status !== "all";
    if (resetBtn) resetBtn.hidden = !active;

    $$(".pl-chip").forEach(function (chip) {
      chip.setAttribute("aria-pressed",
        String(filter[chip.getAttribute("data-group")] === chip.getAttribute("data-value")));
    });

    phaseRows.forEach(function (row) {
      row.setAttribute("aria-pressed", String(row.getAttribute("data-phase") === filter.phase));
    });

    /* Lets the table light up the person being filtered for, in CSS. */
    root.setAttribute("data-who", filter.who);

    if (phaseSel && phaseSel.value !== filter.phase) phaseSel.value = filter.phase;
    if (streamSel && streamSel.value !== filter.stream) streamSel.value = filter.stream;
    if (statusSel && statusSel.value !== filter.status) statusSel.value = filter.status;
  };

  var resetFilter = function () {
    filter = { who: "all", phase: "all", stream: "all", status: "all" };
    applyFilter();
  };

  $$(".pl-chip").forEach(function (chip) {
    chip.addEventListener("click", function () {
      var group = chip.getAttribute("data-group");
      var value = chip.getAttribute("data-value");
      /* Clicking the active chip clears that part of the filter. */
      filter[group] = filter[group] === value ? "all" : value;
      applyFilter();
    });
  });

  if (phaseSel) phaseSel.addEventListener("change", function () {
    filter.phase = phaseSel.value; applyFilter();
  });
  if (streamSel) streamSel.addEventListener("change", function () {
    filter.stream = streamSel.value; applyFilter();
  });
  if (statusSel) statusSel.addEventListener("change", function () {
    filter.status = statusSel.value; applyFilter();
  });
  if (resetBtn) resetBtn.addEventListener("click", resetFilter);

  /* ============================================================= chart ==

     Pressing a phase filters the register to it and goes there; pressing the
     same phase again releases the filter and stays put. Everything else the
     chart does is CSS.
     ---------------------------------------------------------------------- */

  /* The line under each phase is in the markup as a fallback and recomputed
     here from the register, so a task moved between phases cannot leave a
     wrong count behind. */
  (function () {
    var words = { block: "blockierend", run: "läuft", later: "im Backlog" };
    phaseRows.forEach(function (row) {
      var el = $(".pl-grow__count", row);
      if (!el) return;
      var key = row.getAttribute("data-phase");
      var mine = TASKS.filter(function (t) { return t.phase === key; });
      if (!mine.length) { el.textContent = "keine Aufgabe im Register"; return; }
      /* The number, plus the one qualifier that changes what you do about it.
         The full breakdown is one click away in the table. */
      var line = mine.length + " Aufgabe" + (mine.length === 1 ? "" : "n");
      var found = ["block", "run", "later"].some(function (k) {
        var n = mine.filter(function (t) { return t.status === k; }).length;
        if (n) line += " · " + n + " " + words[k];
        return !!n;
      });
      if (!found) line += " · alle offen";
      el.textContent = line;
    });
  })();

  var goTo = function (key) {
    var target = document.getElementById("tasks-" + key.toLowerCase()) ||
                 document.getElementById("aufgaben");
    if (!target) return;
    var soft = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: soft ? "auto" : "smooth", block: "start" });
  };

  phaseRows.forEach(function (row) {
    row.addEventListener("click", function () {
      var key = row.getAttribute("data-phase");
      var pressed = filter.phase === key;
      filter.phase = pressed ? "all" : key;
      applyFilter();
      if (!pressed) goTo(key);
    });
  });

  /* A link into a phase must not land on a table the filter has hidden. */
  $$('a[href^="#tasks-"]').forEach(function (link) {
    link.addEventListener("click", function () {
      var target = document.querySelector(link.getAttribute("href"));
      if (target && target.hidden) resetFilter();
    });
  });

  /* Today, on the chart. Read from the clock rather than written into the
     markup, so the line cannot go stale; outside the ten months it is simply
     not drawn. */
  (function () {
    var chart = $("#pl-gantt");
    var label = $("#pl-now");
    if (!chart) return;
    var start = Date.UTC(2026, 7, 1);        /* 1 August 2026, left edge */
    var end = Date.UTC(2027, 5, 1);          /* 1 June 2027, right edge  */
    var now = Date.now();
    if (now < start || now > end) return;
    var pct = ((now - start) / (end - start)) * 100;
    chart.style.setProperty("--pl-today", pct.toFixed(2) + "%");
    if (label) label.hidden = false;
  })();

  /* ========================================================== progress == */

  var progressFill = $("#pl-progress-fill");
  var progressText = $("#pl-progress-text");

  function renderProgress() {
    var n = countFeedback();
    var total = TASKS.length;
    if (progressFill) progressFill.style.width = Math.min(100, (n / total) * 100) + "%";
    if (progressText) {
      progressText.textContent = n === 0
        ? "noch keine Rückmeldung"
        : n + " Rückmeldung" + (n === 1 ? "" : "en");
    }
  }

  /* ============================================================ export == */

  var withFeedback = function () {
    var out = [];
    TASKS.forEach(function (t) {
      var e = state.items[t.id];
      if (hasContent(e)) out.push({ kind: "task", t: t, e: e });
    });
    GROUPS.forEach(function (g) {
      var e = state.items[groupId(g.key)];
      if (hasContent(e)) out.push({ kind: "phase", g: g, e: e });
    });
    AREAS.forEach(function (a) {
      var e = state.items["BLOCK-" + a.key];
      if (hasContent(e)) out.push({ kind: "area", a: a, e: e });
    });
    return out;
  };

  /* The CSV is the complete record: every task, whether it was touched or
     not, so the file doubles as the plan itself. */
  var buildCsv = function () {
    var when = stampFull();
    var rows = TASKS.map(function (t) {
      var e = state.items[t.id] || {};
      return ["Aufgabe", t.id, t.title, t.stream, t.whenText, t.whoText,
              t.statusText, e.mark ? MARKS[e.mark] : "", (e.note || "").trim(),
              state.who || "", when];
    });
    GROUPS.forEach(function (g) {
      var e = state.items[groupId(g.key)] || {};
      rows.push(["Phase", g.key, g.title, "", g.key, "", "", "", (e.note || "").trim(),
                 state.who || "", when]);
    });
    AREAS.forEach(function (a) {
      var e = state.items["BLOCK-" + a.key] || {};
      rows.push(["Bereich", a.key, a.title, a.key, "", "", "", "", (e.note || "").trim(),
                 state.who || "", when]);
    });
    return HANDOFF.csvTable(
      ["typ", "nr", "aufgabe", "block", "phase", "wer", "status_plan",
       "fortschritt", "rueckmeldung", "von", "stand"],
      rows);
  };

  var head = function () {
    return [
      "Fersen & Lohse — Rückmeldung zum Projektplan",
      "Von: " + (state.who || "ohne Namen"),
      "Stand: " + stampFull(),
      "Rückmeldungen: " + countFeedback() + " von " + TASKS.length + " Aufgaben"
    ];
  };

  /* Three renderings, complete to terse. Every one of them lists every item
     that has feedback — what shrinks is the detail, never the count. */
  var textFull = function () {
    var lines = head();
    withFeedback().forEach(function (item) {
      if (item.kind !== "task") {
        lines.push("", item.kind === "phase"
          ? "== " + item.g.title + " =="
          : "== Bereich " + item.a.title + " ==");
        lines.push("   " + item.e.note.trim());
        return;
      }
      lines.push("", item.t.id + " " + item.t.title + "  [" + item.t.whenText + " · " + item.t.whoText + "]");
      if (item.e.mark) lines.push("   Fortschritt: " + MARKS[item.e.mark]);
      if (item.e.note && item.e.note.trim()) lines.push("   " + item.e.note.trim());
    });
    return lines.join("\n");
  };

  var textNoNotes = function () {
    var items = withFeedback();
    var notes = items.filter(function (i) { return i.e.note && i.e.note.trim(); }).length;
    var lines = head();
    lines.push("");
    items.forEach(function (item) {
      if (item.kind !== "task") {
        lines.push((item.kind === "phase" ? item.g.title : "Bereich " + item.a.title) +
          ": Anmerkung vorhanden");
        return;
      }
      lines.push(item.t.id + " " + item.t.title +
        (item.e.mark ? " → " + MARKS[item.e.mark] : "") +
        (item.e.note && item.e.note.trim() ? " (+Anmerkung)" : ""));
    });
    if (notes) {
      lines.push("", "[" + notes + " Anmerkung" + (notes === 1 ? "" : "en") +
        " im Volltext in der CSV-Datei — hier ist kein Platz dafür.]");
    }
    return lines.join("\n");
  };

  var textCompact = function () {
    var lines = head();
    lines.push("");
    withFeedback().forEach(function (item) {
      if (item.kind !== "task") {
        lines.push((item.kind === "phase" ? item.g.key : item.a.key) + " +");
        return;
      }
      lines.push(item.t.id + (item.e.mark ? " " + MARKS[item.e.mark] : "") +
        (item.e.note && item.e.note.trim() ? " +" : ""));
    });
    lines.push("", "[Kurzfassung. Alles vollständig in der CSV-Datei.]");
    return lines.join("\n");
  };

  var renderings = function () {
    return [
      { text: textFull(),    complete: true,  label: "vollständig" },
      { text: textNoNotes(), complete: false, label: "ohne Anmerkungstexte" },
      { text: textCompact(), complete: false, label: "Kurzfassung" }
    ];
  };

  var reportRoute = function (picked, route) {
    if (picked.complete && picked.fits) {
      setStatus("Alle " + countFeedback() + " Rückmeldungen " + route + " übergeben.", "ok");
      return;
    }
    setStatus("Für " + route + " auf „" + picked.label + "“ verkürzt — jeder Punkt ist " +
      "drin, die Texte stehen in der CSV-Datei.", "warn");
  };

  var downloadCsv = function () {
    HANDOFF.downloadCsv("fersen-lohse-projektplan-" + stampDay() + ".csv", buildCsv());
  };

  var guard = function () {
    if (countFeedback() > 0) return true;
    setStatus("Noch keine Rückmeldung — bitte mindestens eine Aufgabe kommentieren oder markieren.", "warn");
    return false;
  };

  var sendMail = function () {
    downloadCsv();
    var attach = "\n\nDie CSV-Datei mit allen " + TASKS.length +
      " Aufgaben wurde heruntergeladen — bitte an diese E-Mail anhängen.";
    reportRoute(HANDOFF.mail({
      recipient: CONFIG.recipient,
      subject: "Rückmeldung Projektplan – " + CONFIG.project +
        (state.who ? " – " + state.who : "") + " – " + stampDay(),
      renderings: renderings().map(function (r) {
        return { text: r.text + attach, complete: r.complete, label: r.label };
      }),
      delay: 350
    }), "per E-Mail");
  };

  var sendWhatsApp = function () {
    reportRoute(HANDOFF.whatsapp({
      number: (window.FL_CONTACT || {}).whatsapp,
      renderings: renderings()
    }), "per WhatsApp");
  };

  var copyText = function (button) {
    var done = function (ok) {
      if (!button) return;
      var label = button.getAttribute("data-label") || button.textContent;
      button.setAttribute("data-label", label);
      button.textContent = ok ? "Kopiert ✓" : "Kopieren nicht möglich";
      window.setTimeout(function () { button.textContent = label; }, 2200);
    };
    HANDOFF.copy(textFull()).then(function () { done(true); }, function () { done(false); });
  };

  var resetAll = function () {
    if (!window.confirm("Alle Rückmeldungen in diesem Browser löschen? Das lässt sich nicht rückgängig machen.")) return;
    state.items = {};
    state.who = "";
    try { window.localStorage.removeItem(CONFIG.storageKey); } catch (e) { /* nothing to clear */ }
    var who = $("#pl-who");
    if (who) who.value = "";
    paintAll();
    renderProgress();
    setStatus("Alle Rückmeldungen gelöscht", "warn");
    closeSheet();
  };

  /* ======================================================== send sheet == */

  var sheet = $("#pl-sheet");
  var lastFocus = null;

  var openSheet = function () {
    if (!sheet || !guard()) return;
    lastFocus = document.activeElement;
    var summary = $("#pl-sheet-summary");
    if (summary) {
      summary.textContent = countFeedback() + " Rückmeldung" + (countFeedback() === 1 ? "" : "en") +
        (state.who ? " · " + state.who : " · noch ohne Namen");
    }
    sheet.hidden = false;
    document.body.classList.add("wl-sheet-open");
    var first = sheet.querySelector("button");
    if (first) first.focus();
  };

  function closeSheet() {
    if (!sheet || sheet.hidden) return;
    sheet.hidden = true;
    document.body.classList.remove("wl-sheet-open");
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  document.addEventListener("click", function (event) {
    var action = event.target.closest ? event.target.closest("[data-pl-action]") : null;
    if (!action) return;
    var what = action.getAttribute("data-pl-action");
    if (what === "open-sheet") { openSheet(); return; }
    if (what === "close-sheet") { closeSheet(); return; }
    if (what === "mail") { sendMail(); return; }
    if (what === "whatsapp") { sendWhatsApp(); return; }
    if (what === "csv") { downloadCsv(); return; }
    if (what === "copy") { copyText(action); return; }
    if (what === "print") { closeSheet(); window.setTimeout(function () { window.print(); }, 120); return; }
    if (what === "reset") { resetAll(); }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && sheet && !sheet.hidden) closeSheet();
  });

  if (sheet) sheet.addEventListener("click", function (event) {
    if (event.target === sheet) closeSheet();
  });

  /* Dictation needs a real origin and a browser that has it. When it is
     missing the buttons are never drawn, so the page says why once instead of
     leaving a silent gap where a microphone should be. */
  (function () {
    var hint = $("#pl-mic-hint");
    if (!hint || !micBlocked) return;
    if (micBlocked === "file") {
      hint.textContent = "Diktieren geht nur in der gehosteten Fassung — von der Festplatte " +
        "geöffnet verweigert der Browser das Mikrofon. Tippen funktioniert überall.";
    } else {
      hint.textContent = "Dieser Browser kann nicht diktieren. In Chrome, Edge oder Safari " +
        "erscheint bei jedem Feld ein Mikrofon — alternativ die Diktierfunktion des Systems nutzen.";
    }
    hint.hidden = false;
  })();

  /* ============================================================== boot == */

  load();
  paintAll();
  applyFilter();
  renderProgress();

  var whoField = $("#pl-who");
  if (whoField) {
    whoField.value = state.who || "";
    whoField.addEventListener("input", function () {
      state.who = whoField.value.trim();
      saveSoon();
    });
  }

  /* Exposed so a later backend can post exactly what the CSV contains. */
  window.FL_PLAN_STATE = {
    state: function () { return JSON.parse(JSON.stringify(state)); },
    csv: buildCsv,
    text: textFull
  };
})();
