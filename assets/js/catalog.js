/* ==========================================================================
   Fersen & Lohse — capability catalog: search, filter, expand/collapse.
   The accordion markup is already in catalog.html, so the catalog is fully
   readable without JavaScript; this only layers the interaction on top.
   ========================================================================== */
(function () {
  "use strict";

  var root = document.getElementById("catalog");
  if (!root) { return; }

  var search = document.getElementById("catalog-search");
  var clearBtn = document.getElementById("catalog-clear");
  var counter = document.getElementById("catalog-count");
  var emptyState = document.getElementById("catalog-empty");
  var emptyTerm = document.getElementById("catalog-empty-term");
  var chipList = document.getElementById("catalog-chips");

  var panels = Array.prototype.slice.call(root.querySelectorAll(".cat"));
  var TOTAL = panels.reduce(function (sum, panel) {
    return sum + panel.querySelectorAll(".cat__item").length;
  }, 0);

  var activeFilter = "all";
  var term = "";

  /* Cache the original label of every item so highlighting is reversible. */
  var entries = [];
  panels.forEach(function (panel) {
    Array.prototype.forEach.call(panel.querySelectorAll(".cat__item"), function (li) {
      var nameEl = li.querySelector(".cat__item-name");
      entries.push({
        li: li,
        panel: panel,
        nameEl: nameEl,
        text: nameEl.textContent,
        lower: nameEl.textContent.toLowerCase()
      });
    });
  });

  var escapeHtml = function (value) {
    return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  };

  var highlight = function (entry, needle) {
    if (!needle) {
      entry.nameEl.textContent = entry.text;
      return;
    }
    var at = entry.lower.indexOf(needle);
    if (at < 0) {
      entry.nameEl.textContent = entry.text;
      return;
    }
    entry.nameEl.innerHTML =
      escapeHtml(entry.text.slice(0, at)) +
      "<mark>" + escapeHtml(entry.text.slice(at, at + needle.length)) + "</mark>" +
      escapeHtml(entry.text.slice(at + needle.length));
  };

  var plural = function (n) { return n === 1 ? "capability" : "capabilities"; };

  var apply = function (options) {
    var opts = options || {};
    var needle = term.toLowerCase();
    var visibleTotal = 0;
    var visiblePanels = 0;

    panels.forEach(function (panel) {
      var inFilter = activeFilter === "all" || panel.id === activeFilter;
      var shown = 0;

      entries.forEach(function (entry) {
        if (entry.panel !== panel) { return; }
        var categoryHit = needle &&
          panel.getAttribute("data-category").toLowerCase().indexOf(needle) > -1;
        var hit = !needle || categoryHit || entry.lower.indexOf(needle) > -1;
        entry.li.hidden = !(hit && inFilter);
        if (hit && inFilter) { shown += 1; }
        highlight(entry, needle && !categoryHit ? needle : "");
      });

      panel.hidden = !inFilter || shown === 0;
      if (!panel.hidden) {
        visiblePanels += 1;
        visibleTotal += shown;
      }

      var countEl = panel.querySelector("[data-count-visible]");
      if (countEl) { countEl.textContent = String(shown); }

      var emptyMsg = panel.querySelector(".cat__empty");
      if (emptyMsg) { emptyMsg.hidden = shown > 0; }

      /* A search auto-opens matching panels; clearing it collapses them again. */
      if (needle && !panel.hidden) {
        panel.open = true;
      } else if (!needle && opts.collapseOnClear) {
        panel.open = false;
      }
    });

    if (counter) {
      counter.textContent = needle || activeFilter !== "all"
        ? visibleTotal + " of " + TOTAL + " " + plural(visibleTotal)
        : TOTAL + " capabilities";
    }
    if (emptyState) {
      emptyState.hidden = visiblePanels > 0;
      if (emptyTerm) { emptyTerm.textContent = "“" + term + "”"; }
    }
    if (clearBtn) { clearBtn.hidden = !term; }
  };

  /* ------------------------------------------------------------ search -- */
  if (search) {
    var timer = null;
    search.addEventListener("input", function () {
      window.clearTimeout(timer);
      timer = window.setTimeout(function () {
        var next = search.value.trim();
        var cleared = term && !next;
        term = next;
        apply({ collapseOnClear: cleared });
      }, 110);
    });
    search.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && search.value) {
        event.preventDefault();
        search.value = "";
        term = "";
        apply({ collapseOnClear: true });
      }
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", function () {
      search.value = "";
      term = "";
      apply({ collapseOnClear: true });
      search.focus();
    });
  }

  /* ------------------------------------------------------------ chips -- */
  if (chipList) {
    chipList.addEventListener("click", function (event) {
      var chip = event.target.closest("[data-filter]");
      if (!chip) { return; }
      activeFilter = chip.getAttribute("data-filter");
      Array.prototype.forEach.call(chipList.querySelectorAll(".chip"), function (el) {
        el.classList.toggle("chip--active", el === chip);
      });
      apply({ collapseOnClear: activeFilter === "all" && !term });
      if (activeFilter !== "all") {
        var panel = document.getElementById(activeFilter);
        if (panel) { panel.open = true; }
      }
    });
  }

  /* --------------------------------------------------- expand/collapse -- */
  document.addEventListener("click", function (event) {
    var button = event.target.closest("[data-expand]");
    if (!button) { return; }
    var mode = button.getAttribute("data-expand");
    if (mode === "reset") {
      if (search) { search.value = ""; }
      term = "";
      activeFilter = "all";
      if (chipList) {
        Array.prototype.forEach.call(chipList.querySelectorAll(".chip"), function (el) {
          el.classList.toggle("chip--active", el.getAttribute("data-filter") === "all");
        });
      }
      apply({ collapseOnClear: true });
      return;
    }
    panels.forEach(function (panel) {
      if (!panel.hidden) { panel.open = mode === "all"; }
    });
  });

  /* ------------------------------------------------------- deep links -- */
  var openFromHash = function () {
    var id = window.location.hash.replace("#", "");
    if (!id) { return; }
    var panel = document.getElementById(id);
    if (!panel || !panel.classList.contains("cat")) { return; }
    panel.open = true;
    panel.classList.add("cat--targeted");
    window.setTimeout(function () { panel.classList.remove("cat--targeted"); }, 1800);
    window.requestAnimationFrame(function () {
      panel.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  window.addEventListener("hashchange", openFromHash);
  openFromHash();
  apply();
}());
