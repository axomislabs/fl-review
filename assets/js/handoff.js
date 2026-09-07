/* ==========================================================================
   Fersen & Lohse — handing answers out of the browser

   Shared by the decision catalogue and the project plan. Both pages collect
   things in localStorage and then need the same four routes out: a CSV file,
   a pre-filled mail, a WhatsApp message, and the clipboard.

   ------------------------------------------------------------------------
   WHY THIS FILE EXISTS

   It was written after a real loss of content. The decision catalogue capped
   its mail body at 1 800 characters and its WhatsApp body at 1 500, then cut
   the text at the first question that did not fit and appended a "[Gekürzt]"
   line. A fully answered catalogue is 3 137 characters, so **ten of eighteen
   answers silently never left the browser.** The recipient had no way to know
   what was missing.

   Two things were wrong, and both are fixed here:

   1. The budgets were far too small, and measured the wrong thing. They
      counted raw characters, while what a browser and an app actually have to
      swallow is the percent-encoded URL — for German text with umlauts and
      newlines that is roughly 1.6× longer. So even the stated budget was not
      the real one. Budgets here are measured on the finished URL.

   2. Cutting is the wrong response to a text that is too long. Losing whole
      items is the most destructive thing the code can do, and it did it
      first. This module degrades instead: it is handed several renderings of
      the same content, from complete to terse, and picks the most complete
      one that fits. Every rendering carries every item; what shortens is the
      detail per item, never the number of them.

   Only if even the tersest rendering does not fit — which for these two pages
   cannot happen, the terse form of fifty tasks is about 2 kB — does anything
   get dropped, and then the caller is told so it can say it out loud rather
   than hiding a note at the bottom of a message nobody scrolls.

   ------------------------------------------------------------------------
   THE BUDGETS

   mail — the weak link is not the browser but the operating system's mail
   handler. macOS Mail, iOS, Android and modern Outlook all take far more than
   this; the number below is the conservative floor across them, and still
   four times the largest thing either page can produce.

   whatsapp — a WhatsApp text message holds 65 536 characters. The URL is the
   only constraint on the way there and browsers take far more than this.
   ========================================================================== */

window.FL = window.FL || {};

window.FL.handoff = (function () {
  "use strict";

  var LIMITS = {
    mail: 14000,      /* whole mailto: URL, percent-encoded */
    whatsapp: 30000   /* whole wa.me URL, percent-encoded */
  };

  /* What a route will really send: the base URL plus the encoded body. */
  var encodedLength = function (base, text) {
    return base.length + encodeURIComponent(text).length;
  };

  /* renderings: [{ text, complete, label }] ordered most complete first.
     Returns the first one that fits, plus what that cost. */
  var choose = function (renderings, base, limit) {
    for (var i = 0; i < renderings.length; i += 1) {
      if (encodedLength(base, renderings[i].text) <= limit) {
        return {
          text: renderings[i].text,
          complete: renderings[i].complete !== false,
          label: renderings[i].label || "",
          level: i,
          fits: true
        };
      }
    }
    var last = renderings[renderings.length - 1];
    return {
      text: last.text,
      complete: false,
      label: last.label || "",
      level: renderings.length - 1,
      fits: false
    };
  };

  /* ------------------------------------------------------------- routes -- */

  var downloadFile = function (name, content, mime) {
    var blob = new Blob([content], { type: mime || "text/plain;charset=utf-8;" });
    var url = URL.createObjectURL(blob);
    var link = document.createElement("a");
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
  };

  /* The BOM plus the sep= line is what makes the file open correctly in both
     German and English Excel without an import dialog. */
  var downloadCsv = function (name, csv) {
    downloadFile(name, "﻿" + csv, "text/csv;charset=utf-8;");
  };

  var csvCell = function (value) {
    var s = value === null || value === undefined ? "" : String(value);
    return '"' + s.replace(/"/g, '""') + '"';
  };

  var csvTable = function (header, rows) {
    var out = ["sep=,", header.map(csvCell).join(",")];
    rows.forEach(function (row) { out.push(row.map(csvCell).join(",")); });
    return out.join("\r\n") + "\r\n";
  };

  var sendMail = function (options) {
    var base = "mailto:" + (options.recipient || "") +
      "?subject=" + encodeURIComponent(options.subject || "") + "&body=";
    var picked = choose(options.renderings, base, LIMITS.mail);
    window.setTimeout(function () {
      window.location.href = base + encodeURIComponent(picked.text);
    }, options.delay || 0);
    return picked;
  };

  var sendWhatsApp = function (options) {
    /* An unset placeholder number opens WhatsApp without a recipient rather
       than sending the message into a number that does not exist. */
    var number = options.number && !/^0+$|0000000/.test(options.number) ? options.number : "";
    var base = "https://wa.me/" + number + "?text=";
    var picked = choose(options.renderings, base, LIMITS.whatsapp);
    window.open(base + encodeURIComponent(picked.text), "_blank", "noopener");
    return picked;
  };

  var copy = function (text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    /* Safari from file:// and older browsers land here. */
    return new Promise(function (resolve, reject) {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.top = "-1000px";
      document.body.appendChild(ta);
      ta.select();
      var ok = false;
      try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
      document.body.removeChild(ta);
      if (ok) resolve(); else reject(new Error("copy failed"));
    });
  };

  return {
    limits: LIMITS,
    encodedLength: encodedLength,
    choose: choose,
    csvCell: csvCell,
    csvTable: csvTable,
    downloadFile: downloadFile,
    downloadCsv: downloadCsv,
    mail: sendMail,
    whatsapp: sendWhatsApp,
    copy: copy
  };
})();
