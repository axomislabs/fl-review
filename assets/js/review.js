/* ==========================================================================
   Fersen & Lohse — draft review layer

   Lets the customer attach comments to any section marked with
   data-review-id / data-review-label, then export everything as a CSV file
   and a pre-filled email.

   Storage is local only: nothing is transmitted until the reviewer clicks
   "Download CSV" or "Send feedback". Works from file:// — no modules, no
   fetch, no external dependencies.
   ========================================================================== */
(function () {
  "use strict";

  var CONFIG = {
    /* Where "Send feedback" addresses the email. */
    recipient: "martin@axomislabs.com",
    project: "Fersen & Lohse",
    storageKey: "fl-review-v1",
    /* Length budgeting for the mail route lives in handoff.js. It used to be
       a mailBodyLimit of 1800 here, enforced by cutting the list at the first
       comment that did not fit — so a reviewer with a lot to say silently
       sent only part of it. See the header of handoff.js. */
  };

  /* ===================================================== state handling == */

  var state = {
    version: 1,
    author: "",
    enabled: true,
    comments: []
  };

  var load = function () {
    try {
      var raw = window.localStorage.getItem(CONFIG.storageKey);
      if (!raw) { return; }
      var parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.comments)) {
        state.comments = parsed.comments;
        state.author = parsed.author || "";
        state.enabled = parsed.enabled !== false;
      }
    } catch (error) {
      /* Private mode or corrupted entry — carry on with an empty review. */
    }
  };

  var save = function () {
    try {
      window.localStorage.setItem(CONFIG.storageKey, JSON.stringify(state));
    } catch (error) {
      /* Storage unavailable: comments stay for this page view only. */
    }
  };

  var uid = function () {
    return "c" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  };

  var pageName = document.body.getAttribute("data-page") || document.title;
  var pagePath = (window.location.pathname.split("/").pop() || "index.html");

  var commentsFor = function (sectionId) {
    return state.comments.filter(function (comment) {
      return comment.sectionId === sectionId && comment.page === pageName;
    });
  };

  /* ========================================================== dom setup == */

  var sections = Array.prototype.slice.call(document.querySelectorAll("[data-review-id]"));
  if (!sections.length) { return; }

  sections.forEach(function (section) {
    if (!section.id) {
      section.id = "rev-" + section.getAttribute("data-review-id").replace(/[^\w-]/g, "-");
    }
  });

  var svgBubble =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12a8 8 0 0 1-8 8H8l-5 3 1.5-4.4A8 8 0 1 1 21 12Z"/></svg>';

  /* ---------------------------------------------------------- launcher -- */

  var launcher = document.createElement("button");
  launcher.type = "button";
  launcher.className = "fl-launcher";
  launcher.innerHTML = svgBubble + "<span>Review</span>" +
    '<span class="fl-launcher__n" data-total>0</span>';
  document.body.appendChild(launcher);

  var handle = document.createElement("button");
  handle.type = "button";
  handle.className = "fl-handle";
  handle.textContent = "Review";
  handle.hidden = true;
  document.body.appendChild(handle);

  /* ------------------------------------------------------------ drawer -- */

  var drawer = document.createElement("aside");
  drawer.className = "fl-drawer";
  drawer.setAttribute("data-open", "false");
  drawer.setAttribute("aria-label", "Review comments");
  drawer.innerHTML = [
    '<div class="fl-drawer__head">',
    '  <h2>Review comments <button type="button" class="fl-drawer__close" aria-label="Close review panel">×</button></h2>',
    '  <p><span data-total>0</span> comment(s) on this draft</p>',
    "</div>",
    '<div class="fl-drawer__body" data-list></div>',
    '<div class="fl-drawer__foot">',
    '  <button type="button" class="btn btn--primary btn--sm btn--block" data-act="send">Send feedback</button>',
    '  <button type="button" class="btn btn--ghost btn--sm btn--block" data-act="csv">Download CSV only</button>',
    '  <div class="fl-meta">',
    '    <label class="fl-switch"><input type="checkbox" data-act="toggle" checked> Show comment markers</label>',
    '    <button type="button" data-act="clear">Delete all</button>',
    "  </div>",
    "</div>"
  ].join("");
  document.body.appendChild(drawer);

  var drawerList = drawer.querySelector("[data-list]");
  var toggleInput = drawer.querySelector('[data-act="toggle"]');

  /* ----------------------------------------------------------- popover -- */

  var pop = document.createElement("div");
  pop.className = "fl-pop";
  pop.hidden = true;
  pop.innerHTML = [
    '<div class="fl-pop__head">',
    '  <span class="fl-pop__label" data-label></span>',
    '  <button type="button" class="fl-pop__close" aria-label="Close">×</button>',
    "</div>",
    '<div class="fl-pop__existing" data-existing></div>',
    '<label class="sr-only" for="fl-pop-text">Your comment</label>',
    '<textarea id="fl-pop-text" placeholder="What should change in this section?"></textarea>',
    '<label class="sr-only" for="fl-pop-author">Your name</label>',
    '<input type="text" id="fl-pop-author" placeholder="Your name (optional)">',
    '<div class="fl-pop__actions">',
    '  <button type="button" class="btn btn--primary btn--sm" data-act="save">Save comment</button>',
    '  <button type="button" class="btn btn--ghost btn--sm" data-act="cancel">Cancel</button>',
    "</div>",
    '<p class="fl-pop__hint">Stored in this browser only. Nothing is sent until you click “Send feedback”.</p>'
  ].join("");
  document.body.appendChild(pop);

  var popText = pop.querySelector("textarea");
  var popAuthor = pop.querySelector("input");
  var popLabel = pop.querySelector("[data-label]");
  var popExisting = pop.querySelector("[data-existing]");

  var openSection = null;   /* section element the popover belongs to */
  var editingId = null;     /* comment being edited, if any */

  /* ------------------------------------------------------------ bubbles -- */

  var bubbles = sections.map(function (section) {
    var button = document.createElement("button");
    button.type = "button";
    button.className = "fl-bubble";
    button.innerHTML = svgBubble;
    button.setAttribute("data-count", "0");
    button.setAttribute(
      "aria-label",
      "Comment on: " + (section.getAttribute("data-review-label") || section.id)
    );
    document.body.appendChild(button);
    button.addEventListener("click", function (event) {
      event.stopPropagation();
      if (openSection === section) { closePop(); return; }
      openPop(section, button);
    });
    return { section: section, button: button };
  });

  /* Keep every bubble pinned near the top of its own section, but never let
     it scroll out of view while that section is on screen. */
  var HEADER_SAFE = 92;
  var ticking = false;

  var placeBubbles = function () {
    var railInset = parseInt(
      window.getComputedStyle(document.documentElement).getPropertyValue("--rail-inset"), 10
    ) || 14;
    var rail = parseInt(
      window.getComputedStyle(document.documentElement).getPropertyValue("--rail"), 10
    ) || 0;
    var right = rail > 0 ? (rail - 34) / 2 + railInset / 2 : railInset;

    bubbles.forEach(function (entry) {
      var rect = entry.section.getBoundingClientRect();
      var offscreen = rect.bottom < 40 || rect.top > window.innerHeight - 20;
      entry.button.style.display = offscreen ? "none" : "grid";
      if (offscreen) { return; }
      var top = Math.min(
        Math.max(rect.top + 14, HEADER_SAFE),
        Math.max(rect.bottom - 46, HEADER_SAFE)
      );
      entry.button.style.top = Math.round(top) + "px";
      entry.button.style.right = Math.round(right) + "px";
    });
  };

  var requestPlace = function () {
    if (ticking) { return; }
    ticking = true;
    window.requestAnimationFrame(function () {
      ticking = false;
      if (state.enabled) { placeBubbles(); }
    });
  };

  window.addEventListener("scroll", requestPlace, { passive: true });
  window.addEventListener("resize", requestPlace);

  /* ============================================================ rendering = */

  var escapeHtml = function (value) {
    return String(value)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  };

  var formatDate = function (iso) {
    var date = new Date(iso);
    if (isNaN(date.getTime())) { return iso; }
    var pad = function (n) { return (n < 10 ? "0" : "") + n; };
    return pad(date.getDate()) + "." + pad(date.getMonth() + 1) + "." + date.getFullYear() +
      ", " + pad(date.getHours()) + ":" + pad(date.getMinutes());
  };

  var renderCounts = function () {
    Array.prototype.forEach.call(document.querySelectorAll("[data-total]"), function (el) {
      el.textContent = String(state.comments.length);
    });
    bubbles.forEach(function (entry) {
      var id = entry.section.getAttribute("data-review-id");
      var n = commentsFor(id).length;
      entry.button.setAttribute("data-count", String(n));
      entry.section.classList.toggle("fl-has-comments", n > 0);
    });
  };

  var renderDrawer = function () {
    if (!state.comments.length) {
      drawerList.innerHTML = [
        '<div class="fl-banner">',
        "  <strong>How to review this draft.</strong> Hover any section and click the speech-bubble ",
        "  on the right to leave a comment. Comments are collected across all pages. When you are ",
        "  done, use <em>Send feedback</em> — it downloads a CSV and opens a pre-filled email.",
        "</div>",
        '<div class="fl-empty">' + svgBubble + "<p>No comments yet.</p></div>"
      ].join("");
      return;
    }

    var groups = {};
    var order = [];
    state.comments.forEach(function (comment) {
      if (!groups[comment.page]) { groups[comment.page] = []; order.push(comment.page); }
      groups[comment.page].push(comment);
    });

    var html = [
      '<div class="fl-banner">',
      "  <strong>" + state.comments.length + " comment(s)</strong> across " + order.length +
      " page(s). Use <em>Send feedback</em> below to download the CSV and open a pre-filled email to " +
      escapeHtml(CONFIG.recipient) + ".",
      "</div>"
    ];

    order.forEach(function (page) {
      html.push('<div class="fl-group"><h3>' + escapeHtml(page) + " · " + groups[page].length + "</h3>");
      groups[page].forEach(function (comment) {
        html.push(
          '<article class="fl-item">',
          '  <button type="button" class="fl-item__section" data-goto="' + escapeHtml(comment.id) + '">' +
          escapeHtml(comment.sectionLabel) + "</button>",
          "  <p>" + escapeHtml(comment.text) + "</p>",
          '  <div class="fl-note__meta">',
          "    <span>" + escapeHtml(comment.author || "Anonymous") + " · " + formatDate(comment.createdAt) + "</span>",
          '    <button type="button" data-act="delete" data-id="' + escapeHtml(comment.id) + '">Delete</button>',
          "  </div>",
          "</article>"
        );
      });
      html.push("</div>");
    });

    drawerList.innerHTML = html.join("");
  };

  var render = function () {
    renderCounts();
    renderDrawer();
    if (state.enabled) { requestPlace(); }
  };

  /* ============================================================== popover = */

  var positionPop = function (anchor) {
    var rect = anchor.getBoundingClientRect();
    pop.hidden = false;
    var width = pop.offsetWidth;
    var height = pop.offsetHeight;
    var left = rect.left - width - 12;
    if (left < 12) { left = Math.max(12, rect.right + 12); }
    if (left + width > window.innerWidth - 12) { left = window.innerWidth - width - 12; }
    var top = Math.min(
      Math.max(12, rect.top - 8),
      Math.max(12, window.innerHeight - height - 12)
    );
    pop.style.left = Math.round(left) + "px";
    pop.style.top = Math.round(top) + "px";
  };

  var renderExisting = function (sectionId) {
    var list = commentsFor(sectionId);
    if (!list.length) { popExisting.innerHTML = ""; return; }
    popExisting.innerHTML = list.map(function (comment) {
      return [
        '<div class="fl-note">',
        "  <p>" + escapeHtml(comment.text) + "</p>",
        '  <div class="fl-note__meta">',
        "    <span>" + escapeHtml(comment.author || "Anonymous") + " · " + formatDate(comment.createdAt) + "</span>",
        '    <button type="button" data-act="edit" data-id="' + escapeHtml(comment.id) + '">Edit</button>',
        '    <button type="button" data-act="delete" data-id="' + escapeHtml(comment.id) + '">Delete</button>',
        "  </div>",
        "</div>"
      ].join("");
    }).join("");
  };

  function openPop(section, anchor) {
    openSection = section;
    editingId = null;
    popLabel.textContent = section.getAttribute("data-review-label") || section.id;
    popText.value = "";
    popAuthor.value = state.author;
    renderExisting(section.getAttribute("data-review-id"));
    positionPop(anchor);
    bubbles.forEach(function (entry) {
      entry.button.classList.toggle("is-active", entry.section === section);
    });
    window.setTimeout(function () { popText.focus(); }, 20);
  }

  function closePop() {
    pop.hidden = true;
    openSection = null;
    editingId = null;
    bubbles.forEach(function (entry) { entry.button.classList.remove("is-active"); });
  }

  var saveComment = function () {
    var text = popText.value.trim();
    if (!text || !openSection) { popText.focus(); return; }
    state.author = popAuthor.value.trim();

    if (editingId) {
      state.comments.forEach(function (comment) {
        if (comment.id === editingId) {
          comment.text = text;
          comment.author = state.author;
          comment.editedAt = new Date().toISOString();
        }
      });
    } else {
      state.comments.push({
        id: uid(),
        page: pageName,
        path: pagePath,
        sectionId: openSection.getAttribute("data-review-id"),
        sectionLabel: openSection.getAttribute("data-review-label") || openSection.id,
        anchor: openSection.id,
        text: text,
        author: state.author,
        createdAt: new Date().toISOString(),
        url: window.location.href.split("#")[0]
      });
    }
    save();
    render();
    renderExisting(openSection.getAttribute("data-review-id"));
    popText.value = "";
    editingId = null;
    popText.focus();
  };

  pop.addEventListener("click", function (event) {
    var action = event.target.closest("[data-act]");
    if (event.target.closest(".fl-pop__close")) { closePop(); return; }
    if (!action) { return; }

    var act = action.getAttribute("data-act");
    if (act === "save") { saveComment(); return; }
    if (act === "cancel") { closePop(); return; }

    var id = action.getAttribute("data-id");
    if (act === "delete" && id) {
      state.comments = state.comments.filter(function (comment) { return comment.id !== id; });
      save();
      render();
      if (openSection) { renderExisting(openSection.getAttribute("data-review-id")); }
      return;
    }
    if (act === "edit" && id) {
      var found = state.comments.filter(function (comment) { return comment.id === id; })[0];
      if (found) {
        editingId = id;
        popText.value = found.text;
        popAuthor.value = found.author || "";
        popText.focus();
      }
    }
  });

  popText.addEventListener("keydown", function (event) {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      saveComment();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape") { return; }
    if (!pop.hidden) { closePop(); return; }
    if (drawer.getAttribute("data-open") === "true") { setDrawer(false); }
  });

  document.addEventListener("click", function (event) {
    if (pop.hidden) { return; }
    if (pop.contains(event.target) || event.target.closest(".fl-bubble")) { return; }
    closePop();
  });

  /* =============================================================== drawer = */

  function setDrawer(open) {
    drawer.setAttribute("data-open", String(open));
    launcher.setAttribute("data-open", String(open));
    if (open) { closePop(); }
  }

  launcher.addEventListener("click", function () { setDrawer(true); });
  drawer.querySelector(".fl-drawer__close").addEventListener("click", function () { setDrawer(false); });

  drawer.addEventListener("click", function (event) {
    var action = event.target.closest("[data-act], [data-goto]");
    if (!action) { return; }

    var goto = action.getAttribute("data-goto");
    if (goto) {
      var comment = state.comments.filter(function (c) { return c.id === goto; })[0];
      if (!comment) { return; }
      setDrawer(false);
      if (comment.page === pageName) {
        var target = document.getElementById(comment.anchor);
        if (target) { target.scrollIntoView({ behavior: "smooth", block: "start" }); }
      } else {
        window.location.href = comment.path + "#" + comment.anchor;
      }
      return;
    }

    var act = action.getAttribute("data-act");
    if (act === "delete") {
      var id = action.getAttribute("data-id");
      state.comments = state.comments.filter(function (c) { return c.id !== id; });
      save();
      render();
    } else if (act === "clear") {
      if (window.confirm("Delete all " + state.comments.length + " comments? This cannot be undone.")) {
        state.comments = [];
        save();
        render();
      }
    } else if (act === "csv") {
      downloadCsv();
    } else if (act === "send") {
      sendFeedback();
    }
  });

  toggleInput.addEventListener("change", function () {
    setEnabled(toggleInput.checked);
  });

  handle.addEventListener("click", function () { setEnabled(true); });

  function setEnabled(on) {
    state.enabled = on;
    save();
    document.body.classList.toggle("fl-review-on", on);
    launcher.hidden = !on;
    handle.hidden = on;
    toggleInput.checked = on;
    bubbles.forEach(function (entry) {
      entry.button.hidden = !on;
      /* placeBubbles() writes an inline display; clear it when switching off. */
      entry.button.style.display = on ? "grid" : "none";
    });
    if (!on) { closePop(); setDrawer(false); } else { requestPlace(); }
  }

  /* ================================================================ export */

  var stamp = function () {
    var now = new Date();
    var pad = function (n) { return (n < 10 ? "0" : "") + n; };
    return now.getFullYear() + "-" + pad(now.getMonth() + 1) + "-" + pad(now.getDate());
  };

  var csvCell = function (value) {
    var text = String(value === undefined || value === null ? "" : value);
    return '"' + text.replace(/"/g, '""') + '"';
  };

  var buildCsv = function () {
    var header = ["page", "section_id", "section_label", "comment", "author", "created_at", "url"];
    var rows = state.comments.map(function (comment) {
      return [
        comment.page, comment.sectionId, comment.sectionLabel, comment.text,
        comment.author || "", comment.createdAt, comment.url
      ].map(csvCell).join(",");
    });
    /* "sep=," makes Excel parse this correctly in both German and English locales. */
    return "sep=,\r\n" + header.map(csvCell).join(",") + "\r\n" + rows.join("\r\n") + "\r\n";
  };

  function downloadCsv() {
    if (!state.comments.length) {
      window.alert("There are no comments to export yet.");
      return false;
    }
    var blob = new Blob(["﻿" + buildCsv()], { type: "text/csv;charset=utf-8;" });
    var url = URL.createObjectURL(blob);
    var link = document.createElement("a");
    link.href = url;
    link.download = "fersen-lohse-feedback-" + stamp() + ".csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
    return true;
  }

  /* Three renderings of the same comments, complete to terse. Every one of
     them carries every comment — what shortens is each comment's text, never
     the number of comments. handoff.js picks the most complete one that fits
     the mail route. This is the layer the customer actually uses, so losing a
     comment here is the worst thing the export could do. */
  var mailHead = function () {
    return [
      "Review feedback on the " + CONFIG.project + " website draft",
      "Date: " + stamp(),
      "Reviewer: " + (state.author || "not specified"),
      "Comments: " + state.comments.length
    ];
  };

  var buildMailBody = function (cap) {
    var lines = mailHead();
    var currentPage = "";
    var shortened = 0;

    for (var i = 0; i < state.comments.length; i += 1) {
      var comment = state.comments[i];
      if (comment.page !== currentPage) {
        currentPage = comment.page;
        lines.push("", "== " + currentPage + " ==");
      }
      var text = comment.text;
      if (cap && text.length > cap) {
        text = text.slice(0, cap).replace(/\s+\S*$/, "") + " […]";
        shortened += 1;
      }
      lines.push("- [" + comment.sectionLabel + "] " + text);
    }

    lines.push("");
    if (shortened) {
      lines.push("[" + shortened + " comment" + (shortened === 1 ? "" : "s") +
        " shortened here — the full text of every one is in the attached CSV.]");
    }
    lines.push("The CSV file with all comments has been downloaded; please attach it to this email.");
    return lines.join("\n");
  };

  var mailRenderings = function () {
    return [
      { text: buildMailBody(0),   complete: true,  label: "full" },
      { text: buildMailBody(240), complete: false, label: "shortened comments" },
      { text: buildMailBody(80),  complete: false, label: "first line of each comment" }
    ];
  };

  function sendFeedback() {
    if (!state.comments.length) {
      window.alert("Please add at least one comment before sending feedback.");
      return;
    }
    downloadCsv();
    var subject = "Website review – " + CONFIG.project + " – " + stamp();

    /* This is the button a customer presses. If handoff.js is missing for any
       reason, send the full text rather than doing nothing — a mail client
       that chokes on a long URL is a visible failure the sender can react to;
       a dead button is not. */
    if (!window.FL || !window.FL.handoff) {
      window.setTimeout(function () {
        window.location.href = "mailto:" + CONFIG.recipient +
          "?subject=" + encodeURIComponent(subject) +
          "&body=" + encodeURIComponent(buildMailBody(0));
      }, 350);
      return;
    }

    window.FL.handoff.mail({
      recipient: CONFIG.recipient,
      subject: subject,
      renderings: mailRenderings(),
      delay: 350
    });
  }

  /* ============================================================ public API =

     Exposed so a later backend can post the same payload the CSV contains:
       window.FL_REVIEW.comments()   → array of comment objects
       window.FL_REVIEW.csv()        → the CSV text
       window.FL_REVIEW.mailBody()   → the plain-text email body
       window.FL_REVIEW.recipient    → configured recipient address
     -------------------------------------------------------------------- */

  window.FL_REVIEW = {
    recipient: CONFIG.recipient,
    comments: function () { return state.comments.slice(); },
    csv: buildCsv,
    mailBody: buildMailBody,
    downloadCsv: downloadCsv,
    send: sendFeedback,
    setEnabled: setEnabled
  };

  /* ================================================================= init = */

  load();
  setEnabled(state.enabled);
  render();

  /* Cross-page jumps from the drawer land on #rev-… anchors. */
  if (/^#rev-/.test(window.location.hash)) {
    var target = document.getElementById(window.location.hash.slice(1));
    if (target) {
      window.setTimeout(function () {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 60);
    }
  }

  window.addEventListener("load", requestPlace);
  window.setTimeout(requestPlace, 400);
}());
