/* ==========================================================================
   Fersen & Lohse — decision catalogue behaviour

   Renders the fifteen questions from decisions-data.js, keeps the answers in
   localStorage (same approach as the review layer: nothing leaves the browser
   until the reviewer exports), adds dictation to every free-text field and
   offers three ways out of the browser — email, WhatsApp and a CSV file.

   Classic script, no modules, no build step, no external calls.
   ========================================================================== */
(function () {
  "use strict";

  var DATA = window.FL_DECISIONS;
  if (!DATA) return;

  var DECISIONS = DATA.items;
  var BLOCKS = DATA.blocks;
  var CLOSING = DATA.closingId;

  var CONFIG = {
    /* Where "per email" addresses the message. */
    recipient: "martin@axomislabs.com",
    project: "Fersen & Lohse",
    storageKey: "fl-decisions-v1",
    /* mailto: and wa.me URLs are length-limited by browsers and apps. */
    mailBodyLimit: 1800,
    waBodyLimit: 1500
  };

  /* ==================================================== state handling == */

  var state = { version: 1, who: "", answers: {}, updatedAt: "" };

  var load = function () {
    try {
      var raw = window.localStorage.getItem(CONFIG.storageKey);
      if (!raw) return;
      var saved = JSON.parse(raw);
      if (saved && typeof saved === "object") {
        state.who = typeof saved.who === "string" ? saved.who : "";
        state.answers = saved.answers && typeof saved.answers === "object" ? saved.answers : {};
        state.updatedAt = typeof saved.updatedAt === "string" ? saved.updatedAt : "";
      }
    } catch (e) {
      /* Private mode or disabled storage: the page still works, answers just
         do not survive a reload. */
    }
  };

  var persist = function () {
    state.updatedAt = stampFull();
    try {
      window.localStorage.setItem(CONFIG.storageKey, JSON.stringify(state));
      setStatus("Gespeichert · " + state.updatedAt, "ok");
    } catch (e) {
      setStatus("Dieser Browser speichert nicht — bitte am Ende exportieren", "warn");
    }
    renderMeta();
  };

  var saveTimer = null;
  var saveSoon = function () {
    setStatus("Speichern …");
    window.clearTimeout(saveTimer);
    saveTimer = window.setTimeout(persist, 500);
  };

  var answer = function (id) {
    var a = state.answers[id];
    if (!a) {
      a = { choice: null, note: "" };
      state.answers[id] = a;
    }
    if (typeof a.note !== "string") a.note = "";
    return a;
  };

  var isAnswered = function (d) {
    var a = state.answers[d.id];
    if (!a) return false;
    if (d.type === "multi") return Array.isArray(a.choice) && a.choice.length > 0;
    return !!a.choice || (typeof a.note === "string" && a.note.trim().length > 0);
  };

  var countDone = function () {
    var n = 0;
    DECISIONS.forEach(function (d) { if (isAnswered(d)) n += 1; });
    return n;
  };

  var pickedLabels = function (d) {
    var a = state.answers[d.id] || {};
    var chosen = d.type === "multi"
      ? (Array.isArray(a.choice) ? a.choice : [])
      : (a.choice ? [a.choice] : []);
    var out = [];
    d.opts.forEach(function (o) { if (chosen.indexOf(o.v) > -1) out.push(o.label); });
    return out;
  };

  /* ========================================================== helpers == */

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

  var esc = function (value) {
    return String(value === undefined || value === null ? "" : value)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  };

  var $ = function (sel) { return document.querySelector(sel); };

  /* =========================================================== render == */

  var main = $("#dec-main");
  var rail = $("#dec-rail");
  if (!main) return;

  var card = function (d) {
    var a = answer(d.id);
    var multi = d.type === "multi";
    var noteId = "note-" + d.id;
    var h = '<article class="dec-card' + (d.flag ? " is-flag" : "") + '" id="q-' + d.id + '">';

    h += '<div class="dec-card__top">' +
         '<span class="dec-card__n">Frage ' + esc(d.n) + '</span>' +
         (d.flag ? '<span class="dec-tag dec-tag--flag">Grundsatzfrage</span>' : "") +
         (multi ? '<span class="dec-tag">Mehrfachauswahl</span>' : "") +
         '</div>';

    h += '<h3 class="dec-card__q">' + esc(d.q) + "</h3>";

    h += '<div class="dec-delta">' +
         '<div class="dec-delta__col dec-delta__col--now"><h4>Website heute</h4><p>' + d.now + "</p></div>" +
         '<div class="dec-delta__col dec-delta__col--voice"><h4>Sprachnachricht</h4><p>' + d.voice + "</p></div>" +
         "</div>";

    if (d.why) h += '<p class="dec-card__why">' + d.why + "</p>";

    h += '<div class="dec-opts" role="' + (multi ? "group" : "radiogroup") +
         '" aria-label="' + esc(d.q) + '">';
    d.opts.forEach(function (o) {
      var on = multi
        ? (Array.isArray(a.choice) && a.choice.indexOf(o.v) > -1)
        : (a.choice === o.v);
      h += '<button type="button" class="dec-opt' + (multi ? " dec-opt--multi" : "") + '"' +
           ' data-q="' + esc(d.id) + '" data-v="' + esc(o.v) + '" data-multi="' + (multi ? "1" : "0") + '"' +
           (multi
             ? ' aria-pressed="' + (on ? "true" : "false") + '"'
             : ' role="radio" aria-checked="' + (on ? "true" : "false") + '"') +
           '><span class="dec-opt__mark" aria-hidden="true"></span>' +
           '<span class="dec-opt__body"><span class="dec-opt__label">' + esc(o.label) + "</span>" +
           (o.hint ? '<span class="dec-opt__hint">' + esc(o.hint) + "</span>" : "") +
           "</span></button>";
    });
    h += "</div>";

    h += noteField(noteId, d.id, "Ergänzung, Einwand, eigene Formulierung",
      "Optional — hier zählt auch ein halber Gedanke.", a.note);

    h += "</article>";
    return h;
  };

  /* Free-text field with its dictation button. */
  var noteField = function (fieldId, storeId, label, placeholder, value) {
    return '<div class="dec-note">' +
      '<div class="dec-note__head">' +
        '<label for="' + fieldId + '">' + esc(label) + "</label>" +
        micButton(fieldId) +
      "</div>" +
      '<textarea id="' + fieldId + '" data-note="' + esc(storeId) + '" rows="3" placeholder="' +
        esc(placeholder) + '">' + esc(value || "") + "</textarea>" +
      '<p class="dec-note__status" data-mic-status="' + fieldId + '" role="status"></p>' +
      "</div>";
  };

  var MIC_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
    '<path d="M12 3.5a2.7 2.7 0 0 1 2.7 2.7v5.4a2.7 2.7 0 1 1-5.4 0V6.2A2.7 2.7 0 0 1 12 3.5Z"/>' +
    '<path d="M6.2 11.2a5.8 5.8 0 0 0 11.6 0"/><path d="M12 17v3.5"/><path d="M9 20.5h6"/></svg>';

  var micButton = function (fieldId) {
    if (window.FL_DICTATION && window.FL_DICTATION.blocked() === "unsupported") return "";
    return '<button type="button" class="dec-mic" data-mic="' + fieldId + '"' +
      ' aria-pressed="false" title="Antwort diktieren statt tippen">' +
      MIC_SVG + '<span class="dec-mic__label">Diktieren</span>' +
      '<span class="sr-only"> — Text in dieses Feld sprechen</span></button>';
  };

  var closingCard = function () {
    var a = answer(CLOSING);
    return '<section class="dec-closing" id="q-' + CLOSING + '">' +
      "<h3>Was fehlt in diesem Katalog?</h3>" +
      "<p>Alles, was oben nicht vorkommt — eine Zielgruppe, die wir falsch angenommen haben, " +
      "ein Angebot, das wir übersehen haben, ein Satz auf der Seite, der so nicht stimmt.</p>" +
      noteField("note-" + CLOSING, CLOSING, "Freitext", "Was uns noch fehlt …", a.note) +
      "</section>";
  };

  var renderMain = function () {
    var html = "";
    var lastBlock = null;
    DECISIONS.forEach(function (d, i) {
      if (d.block !== lastBlock) {
        html += '<section class="dec-block"><div class="dec-block__head">' +
          "<h2>" + esc(BLOCKS[d.block].t) + "</h2><p>" + esc(BLOCKS[d.block].d) + "</p></div>";
        lastBlock = d.block;
      }
      html += card(d);
      var next = DECISIONS[i + 1];
      if (!next || next.block !== d.block) html += "</section>";
    });
    html += closingCard();
    main.innerHTML = html;
  };

  var renderRail = function () {
    if (!rail) return;
    var html = "";
    var lastBlock = null;
    DECISIONS.forEach(function (d) {
      if (d.block !== lastBlock) {
        if (lastBlock !== null) html += "</div>";
        html += '<div class="dec-rail__grp"><h4>' + esc(BLOCKS[d.block].t) + "</h4>";
        lastBlock = d.block;
      }
      var cls = [];
      if (isAnswered(d)) cls.push("is-done");
      if (d.flag) cls.push("is-flag");
      var short = d.q.length > 44 ? d.q.slice(0, 42).replace(/\s+\S*$/, "") + "…" : d.q;
      html += '<a href="#q-' + esc(d.id) + '" class="' + cls.join(" ") + '">' +
        '<span class="dec-rail__dot" aria-hidden="true"></span><span>' +
        esc(d.n) + " · " + esc(short) + "</span></a>";
    });
    html += "</div>";
    rail.innerHTML = html;
  };

  var renderProgress = function () {
    var done = countDone();
    var total = DECISIONS.length;
    var fill = $("#dec-progress-fill");
    var text = $("#dec-progress-text");
    if (fill) fill.style.width = Math.round((done / total) * 100) + "%";
    if (text) text.textContent = done + " / " + total + " beantwortet";
  };

  var renderMeta = function () {
    var meta = $("#dec-meta");
    if (!meta) return;
    meta.textContent = state.updatedAt
      ? "Zuletzt gespeichert: " + state.updatedAt + (state.who ? " · " + state.who : "")
      : "Noch nichts beantwortet";
  };

  var setStatus = function (message, kind) {
    var el = $("#dec-status");
    if (!el) return;
    el.textContent = message || "";
    el.className = "dec-status" + (kind ? " is-" + kind : "");
  };

  /* ====================================================== interaction == */

  document.addEventListener("click", function (event) {
    var opt = event.target.closest ? event.target.closest(".dec-opt") : null;
    if (!opt) return;
    var id = opt.getAttribute("data-q");
    var value = opt.getAttribute("data-v");
    var multi = opt.getAttribute("data-multi") === "1";
    var a = answer(id);

    if (multi) {
      if (!Array.isArray(a.choice)) a.choice = [];
      var at = a.choice.indexOf(value);
      if (at > -1) a.choice.splice(at, 1); else a.choice.push(value);
      Array.prototype.forEach.call(opt.parentNode.querySelectorAll(".dec-opt"), function (el) {
        el.setAttribute("aria-pressed", a.choice.indexOf(el.getAttribute("data-v")) > -1 ? "true" : "false");
      });
    } else {
      a.choice = a.choice === value ? null : value;
      Array.prototype.forEach.call(opt.parentNode.querySelectorAll(".dec-opt"), function (el) {
        el.setAttribute("aria-checked", el.getAttribute("data-v") === a.choice ? "true" : "false");
      });
    }
    saveSoon();
    renderRail();
    renderProgress();
  });

  document.addEventListener("input", function (event) {
    var el = event.target;
    if (el.id === "dec-who") {
      state.who = el.value;
      saveSoon();
      return;
    }
    var id = el.getAttribute && el.getAttribute("data-note");
    if (!id) return;
    answer(id).note = el.value;
    saveSoon();
    renderRail();
    renderProgress();
  });

  /* ========================================================= dictation == */

  var micStatus = function (fieldId, message, kind) {
    var el = document.querySelector('[data-mic-status="' + fieldId + '"]');
    if (!el) return;
    el.textContent = message || "";
    el.className = "dec-note__status" + (kind ? " is-" + kind : "");
  };

  var micVisual = function (button, live) {
    if (!button) return;
    button.setAttribute("aria-pressed", live ? "true" : "false");
    button.classList.toggle("is-live", !!live);
    var label = button.querySelector(".dec-mic__label");
    if (label) label.textContent = live ? "Stopp" : "Diktieren";
  };

  document.addEventListener("click", function (event) {
    var button = event.target.closest ? event.target.closest(".dec-mic") : null;
    if (!button) return;
    event.preventDefault();

    var fieldId = button.getAttribute("data-mic");
    var field = document.getElementById(fieldId);
    if (!field || !window.FL_DICTATION) return;

    /* Whatever else was recording stops on its own — clear its button too. */
    var running = window.FL_DICTATION.target();
    if (running && running !== field) {
      var old = document.querySelector('.dec-mic.is-live');
      micVisual(old, false);
      if (old) micStatus(old.getAttribute("data-mic"), "");
    }

    window.FL_DICTATION.toggle(field, function (event2, info) {
      if (event2 === "start") {
        micVisual(button, true);
        micStatus(fieldId, "Hört zu — einfach sprechen. Nochmal klicken zum Beenden.", "live");
        field.focus();
      } else if (event2 === "stop") {
        micVisual(button, false);
        micStatus(fieldId, "");
        saveSoon();
      } else {
        micVisual(button, false);
        micStatus(fieldId, (info && info.message) || "Diktieren nicht möglich.", "warn");
      }
    });
  });

  /* ============================================================ export == */

  var csvCell = function (value) {
    return '"' + String(value === undefined || value === null ? "" : value).replace(/"/g, '""') + '"';
  };

  var buildCsv = function () {
    var header = ["nr", "block", "frage", "antwort", "ergaenzung", "beantwortet_von", "stand"];
    var when = stampFull();
    var rows = DECISIONS.map(function (d) {
      var a = state.answers[d.id] || {};
      return [
        d.n,
        BLOCKS[d.block].t,
        d.q,
        pickedLabels(d).join(" / "),
        (a.note || "").trim(),
        state.who || "",
        when
      ].map(csvCell).join(",");
    });
    var closing = state.answers[CLOSING];
    rows.push([
      "Zusatz", "—", "Was fehlt in diesem Katalog?", "",
      closing && closing.note ? closing.note.trim() : "", state.who || "", when
    ].map(csvCell).join(","));
    /* "sep=," makes Excel parse this correctly in both German and English locales. */
    return "sep=,\r\n" + header.map(csvCell).join(",") + "\r\n" + rows.join("\r\n") + "\r\n";
  };

  /* Readable summary for email, WhatsApp and the clipboard. `limit` keeps the
     URL-borne variants inside what browsers and apps accept. */
  var buildText = function (options) {
    var opts = options || {};
    var limit = opts.limit || 0;
    var lines = [
      "Fersen & Lohse — Entscheidungen zum Website-Entwurf",
      "Von: " + (state.who || "ohne Namen"),
      "Stand: " + stampFull(),
      "Beantwortet: " + countDone() + " von " + DECISIONS.length
    ];
    var truncated = false;
    var lastBlock = null;

    for (var i = 0; i < DECISIONS.length; i += 1) {
      var d = DECISIONS[i];
      var a = state.answers[d.id] || {};
      var picked = pickedLabels(d);
      var note = (a.note || "").trim();
      if (!picked.length && !note) continue;

      var block = [];
      if (d.block !== lastBlock) {
        block.push("", "== " + BLOCKS[d.block].t + " ==");
      }
      block.push(d.n + " " + d.q);
      block.push("   → " + (picked.length ? picked.join(" / ") : "keine Option gewählt"));
      if (note) block.push("   Ergänzung: " + note);

      if (limit && lines.concat(block).join("\n").length > limit) {
        truncated = true;
        break;
      }
      lines = lines.concat(block);
      lastBlock = d.block;
    }

    var closing = state.answers[CLOSING];
    var closingNote = closing && closing.note ? closing.note.trim() : "";
    if (closingNote) {
      var tail = ["", "== Was fehlt ==", closingNote];
      if (limit && lines.concat(tail).join("\n").length > limit) truncated = true;
      else lines = lines.concat(tail);
    }

    if (truncated) {
      lines.push("", "[Gekürzt — die vollständigen Antworten stehen in der CSV-Datei.]");
    }
    return lines.join("\n");
  };

  var hasAnswers = function () {
    if (countDone() > 0) return true;
    var closing = state.answers[CLOSING];
    return !!(closing && closing.note && closing.note.trim());
  };

  var guard = function () {
    if (hasAnswers()) return true;
    setStatus("Noch keine Antwort ausgewählt — bitte mindestens eine Frage beantworten.", "warn");
    var first = document.querySelector(".dec-opt");
    if (first) first.focus();
    return false;
  };

  var downloadCsv = function () {
    var blob = new Blob(["﻿" + buildCsv()], { type: "text/csv;charset=utf-8;" });
    var url = URL.createObjectURL(blob);
    var link = document.createElement("a");
    link.href = url;
    link.download = "fersen-lohse-entscheidungen-" + stampDay() + ".csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
  };

  var sendMail = function () {
    downloadCsv();
    var subject = "Entscheidungen Website-Entwurf – " + CONFIG.project +
      (state.who ? " – " + state.who : "") + " – " + stampDay();
    var body = buildText({ limit: CONFIG.mailBodyLimit }) +
      "\n\nDie CSV-Datei mit allen Antworten wurde heruntergeladen — bitte an diese E-Mail anhängen.";
    var href = "mailto:" + CONFIG.recipient +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(body);
    window.setTimeout(function () { window.location.href = href; }, 350);
  };

  var sendWhatsApp = function () {
    /* WhatsApp takes text only — a file cannot be attached from a link, so the
       summary travels as the message and the CSV stays a separate download. */
    var text = buildText({ limit: CONFIG.waBodyLimit });
    var contact = window.FL_CONTACT || {};
    var number = contact.whatsapp && !/^0+$|0000000/.test(contact.whatsapp) ? contact.whatsapp : "";
    var url = "https://wa.me/" + number + "?text=" + encodeURIComponent(text);
    window.open(url, "_blank", "noopener");
  };

  var copyText = function (button) {
    var text = buildText({});
    var done = function (ok) {
      if (!button) return;
      var label = button.getAttribute("data-label") || button.textContent;
      button.setAttribute("data-label", label);
      button.textContent = ok ? "Kopiert ✓" : "Kopieren nicht möglich";
      window.setTimeout(function () { button.textContent = label; }, 2200);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); });
      return;
    }
    var helper = document.createElement("textarea");
    helper.value = text;
    helper.setAttribute("readonly", "readonly");
    helper.style.position = "fixed";
    helper.style.opacity = "0";
    document.body.appendChild(helper);
    helper.select();
    var ok = false;
    try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
    document.body.removeChild(helper);
    done(ok);
  };

  var resetAll = function () {
    if (!window.confirm("Alle Antworten in diesem Browser löschen? Das lässt sich nicht rückgängig machen.")) return;
    state.answers = {};
    state.who = "";
    state.updatedAt = "";
    try { window.localStorage.removeItem(CONFIG.storageKey); } catch (e) { /* nothing to clear */ }
    var who = $("#dec-who");
    if (who) who.value = "";
    renderMain();
    renderRail();
    renderProgress();
    renderMeta();
    setStatus("Alle Antworten gelöscht", "warn");
    closeSheet();
  };

  /* ======================================================== send sheet == */

  var sheet = $("#dec-sheet");
  var lastFocus = null;

  var openSheet = function () {
    if (!sheet || !guard()) return;
    lastFocus = document.activeElement;
    var summary = $("#dec-sheet-summary");
    if (summary) {
      summary.textContent = countDone() + " von " + DECISIONS.length + " Fragen beantwortet" +
        (state.who ? " · " + state.who : " · noch ohne Namen");
    }
    sheet.hidden = false;
    document.body.classList.add("dec-sheet-open");
    var first = sheet.querySelector("button");
    if (first) first.focus();
  };

  var closeSheet = function () {
    if (!sheet || sheet.hidden) return;
    sheet.hidden = true;
    document.body.classList.remove("dec-sheet-open");
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  };

  document.addEventListener("click", function (event) {
    var action = event.target.closest ? event.target.closest("[data-dec-action]") : null;
    if (!action) return;
    var what = action.getAttribute("data-dec-action");

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

  /* ============================================================== boot == */

  load();
  renderMain();
  renderRail();
  renderProgress();
  renderMeta();

  var whoField = $("#dec-who");
  if (whoField) whoField.value = state.who || "";

  if (state.updatedAt) setStatus("Gespeichert · " + state.updatedAt, "ok");

  /* Dictation is unavailable from file:// — say so once instead of failing
     silently when someone clicks the microphone. */
  var hint = $("#dec-mic-hint");
  if (hint && window.FL_DICTATION) {
    var why = window.FL_DICTATION.blocked();
    if (why === "file") {
      hint.textContent = "Hinweis: Das Mikrofon funktioniert nur in der Online-Fassung. " +
        "Lokal geöffnete Dateien dürfen nicht aufs Mikrofon zugreifen.";
      hint.hidden = false;
    } else if (why === "unsupported") {
      hint.textContent = "Hinweis: Dieser Browser kann nicht diktieren. " +
        "In Chrome, Edge oder Safari erscheint bei jedem Feld ein Mikrofon — " +
        "alternativ die Diktierfunktion des Betriebssystems nutzen.";
      hint.hidden = false;
    }
  }

  /* Exposed so a later backend can post exactly what the CSV contains. */
  window.FL_DECISIONS_STATE = {
    answers: function () { return JSON.parse(JSON.stringify(state)); },
    csv: buildCsv,
    text: function () { return buildText({}); }
  };
})();
