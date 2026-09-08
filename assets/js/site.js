/* ==========================================================================
   Fersen & Lohse — shared site behaviour
   Classic script (no modules) so the draft also works from file://
   ========================================================================== */
(function () {
  "use strict";

  /* ----------------------------------------------------------------------
     CONTACT DETAILS — single source of truth.
     Replace the placeholder values here and every link on the site updates.
     ---------------------------------------------------------------------- */
  var CONTACT = {
    email:    "hello@fersen-lohse.de",          // TODO: real address
    phone:    "+49 (0) 000 000 000",            // TODO: display format
    phoneRaw: "+490000000000",                  // TODO: tel: format, digits and + only
    whatsapp: "490000000000",                   // TODO: wa.me number, digits only, no +
    linkedin: "https://www.linkedin.com/company/PLACEHOLDER",
    booking:  ""                                // TODO: Calendly/cal.com URL, empty = disabled
  };
  window.FL_CONTACT = CONTACT;

  /* ----------------------------------------------------------------------
     METRICS — the guided intake on the contact page (decision 17).

     "Ich möchte das und das challengen" → "okay, dann brauchen wir folgende
     Metriken" → Quote. The list below is what turns that into a page: the
     visitor picks the domain their contract sits in and immediately sees what
     we need in order to price it, instead of finding out on a call.

     BASE applies to every enquiry. The keys underneath are the exact option
     values of #cf-topic; anything not listed here (a general enquiry, or a
     single capability arriving via catalog.html?topic=…) falls back to BASE.

     FIRST DRAFT — derived from the capability catalog, not yet confirmed.
     ---------------------------------------------------------------------- */
  var METRICS_BASE = [
    "Current annual spend on the contract",
    "Contract end date and notice period",
    "Committed volume, licence count or tier",
    "Current vendor and the products in scope"
  ];

  var METRICS = {
    "Web Performance & Delivery": [
      "Monthly egress traffic in TB and requests per month",
      "Peak bandwidth in Gbps and peak requests per second",
      "Number of properties, domains and origins served",
      "Regions delivered into",
      "Security add-ons in scope: WAF, bot management, API and DDoS protection"
    ],
    "Cloud & Platform Operations": [
      "Monthly spend per cloud provider, list and effective",
      "Reserved instance or committed-use coverage today",
      "Number of accounts, subscriptions or projects",
      "Managed-service scope and hours covered",
      "Data volume under monitoring and log retention"
    ],
    "Network & SASE": [
      "Number of sites and remote users",
      "Bandwidth per site and per circuit",
      "Circuits, tunnels and breakouts in scope",
      "Security services bundled into the contract today",
      "Contract term and renewal date per site, if they differ"
    ],
    "Security & Identity": [
      "Number of identities and of endpoints under management",
      "Applications protected, internal and SaaS",
      "SOC / MDR coverage hours and response commitments",
      "Every security tool currently licensed, including the overlaps",
      "Compliance regimes you have to evidence"
    ],
    "Application & Code Security": [
      "Number of developers and of repositories",
      "Builds or pipeline runs per month",
      "Applications and APIs in scope",
      "Scanning types licensed today: SAST, DAST, SCA, secrets, container",
      "Where it has to run: IDE, pipeline, runtime"
    ],
    "FinOps, Risk & Governance": [
      "Annual cloud and SaaS spend under management",
      "Number of accounts and business units to allocate across",
      "Savings-plan or commitment coverage today",
      "Tooling licences already in place",
      "Reporting the finance side needs out of it"
    ],
    "Cloud Hosting & Infrastructure": [
      "Racks, units or instance counts by site",
      "Power draw and bandwidth commitments",
      "Colocation sites and their contract dates",
      "Hardware refresh cycle and what is due",
      "Support and remote-hands levels contracted"
    ],
    "Enterprise & SaaS Platforms": [
      "Licence count per tier or edition",
      "Actual active usage against what is licensed",
      "Modules and add-ons in scope",
      "Discount and uplift terms agreed today",
      "Renewal date and any auto-renewal clause"
    ],
    "Developer & Edge Platform": [
      "Invocations or requests per month",
      "Storage volume and monthly egress",
      "Environments in scope: production, staging, preview",
      "Committed tier and overage rates today",
      "Build minutes or compute hours consumed"
    ],
    "Video & Streaming Analytics": [
      "Monthly viewing hours delivered",
      "Peak concurrent viewers",
      "Number of streams, channels or titles",
      "Analytics events per month",
      "Players and devices that have to be covered"
    ],
    "Dependency & migration ROI analysis": [
      "Everything above for the contract in question",
      "Integrations and internal systems that depend on the vendor",
      "Custom configuration, rules or code built on the platform",
      "Team size and skills that would carry a migration",
      "Data volume to move and any residency constraint"
    ]
  };
  window.FL_METRICS = { base: METRICS_BASE, byTopic: METRICS };

  var isPlaceholder = function (value) {
    return !value || /PLACEHOLDER|0000000/.test(value);
  };

  /* ------------------------------------------------------------- nav -- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("primary-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      nav.setAttribute("data-open", String(!open));
    });
    nav.addEventListener("click", function (event) {
      if (event.target.tagName === "A" && window.innerWidth <= 959) {
        toggle.setAttribute("aria-expanded", "false");
        nav.setAttribute("data-open", "false");
      }
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        toggle.setAttribute("aria-expanded", "false");
        nav.setAttribute("data-open", "false");
        toggle.focus();
      }
    });
  }

  /* --------------------------------------- the sections on a phone -- */
  /* A wide screen drops each entry's panel on hover. A phone has no hover, so
     the sections used to be printed out under the pages they belong to and the
     menu was four pages and twenty-seven sections long - the whole map at once,
     which is the same as having no map. Each entry now carries a button that
     folds its own sections away, and the menu opens as four lines.

     One group open at a time, and every group shut when the menu comes down.
     Two of the four carry ten sections each, so two open together is most of
     the long list back - and opening the page you are already on for you would
     put ten of them above the other three pages, which is the overview this was
     supposed to give. The page you are on is already the teal one.

     Built here rather than written into the eight pages because it is a control
     for a menu that only exists when this script runs: no script, no burger
     button, nothing to fold. The markup stays what it is, and the panels keep
     working on hover from 960px up whether this ran or not. */
  if (nav) {
    var groups = [];

    Array.prototype.forEach.call(nav.querySelectorAll(".nav__item"), function (item, index) {
      var link = item.querySelector("a");
      var sub = item.querySelector(".nav__sub");
      if (!link || !sub) { return; }

      if (!sub.id) { sub.id = "nav-sections-" + (index + 1); }

      var button = document.createElement("button");
      button.type = "button";
      button.className = "nav__disclosure";
      button.setAttribute("aria-expanded", "false");
      button.setAttribute("aria-controls", sub.id);

      /* The chevron is drawn by CSS on ::before, so the button's own content is
         the name a screen reader reads out. Without it the control announces
         itself as "button" four times over. */
      var label = document.createElement("span");
      label.className = "sr-only";
      label.textContent = "Sections of " + (link.textContent || "").trim();
      button.appendChild(label);

      var group = {
        open: function (open) {
          item.setAttribute("data-open", String(open));
          button.setAttribute("aria-expanded", String(open));
        }
      };

      button.addEventListener("click", function () {
        var isOpen = button.getAttribute("aria-expanded") === "true";
        groups.forEach(function (other) { other.open(false); });
        group.open(!isOpen);
      });

      /* After the link and before the panel: the tab order is the page, the
         button that reveals its sections, then the sections themselves. */
      link.parentNode.insertBefore(button, link.nextSibling);
      group.open(false);
      groups.push(group);
    });

    /* The flag every folding rule in site.css hangs off, set last and only if
       there is something to fold. Until it is on the panels are open, so a
       stylesheet that arrives without its script - a cached site.js, a blocked
       one, an error thrown further up this file - leaves the sections where
       they were rather than hiding them behind a button that was never built. */
    if (groups.length) { nav.setAttribute("data-folds", "true"); }
  }

  /* --------------------------------------------------- contact links -- */
  var channelHref = {
    email: function () { return "mailto:" + CONTACT.email; },
    phone: function () { return "tel:" + CONTACT.phoneRaw; },
    whatsapp: function () { return "https://wa.me/" + CONTACT.whatsapp; },
    linkedin: function () { return CONTACT.linkedin; },
    booking: function () { return CONTACT.booking; }
  };

  Array.prototype.forEach.call(document.querySelectorAll("[data-contact]"), function (el) {
    var kind = el.getAttribute("data-contact");
    var href = channelHref[kind] ? channelHref[kind]() : "";
    if (href) {
      el.setAttribute("href", href);
      if (kind === "whatsapp" || kind === "linkedin" || kind === "booking") {
        el.setAttribute("target", "_blank");
        el.setAttribute("rel", "noopener");
      }
    } else {
      el.setAttribute("href", "contact.html");
    }
    if (isPlaceholder(href)) { el.setAttribute("data-placeholder", "true"); }
  });

  var setText = function (kind, value) {
    Array.prototype.forEach.call(
      document.querySelectorAll('[data-contact-text="' + kind + '"]'),
      function (el) { el.textContent = value; }
    );
  };
  setText("email", CONTACT.email);
  setText("phone", CONTACT.phone);

  /* ---------------------------------------------------------- footer -- */
  Array.prototype.forEach.call(document.querySelectorAll("[data-year]"), function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* --------------------------------------------------- contact form -- */
  var form = document.getElementById("contact-form");
  if (form) {
    var success = document.getElementById("contact-success");
    var topic = document.getElementById("cf-topic");
    var topicHint = document.getElementById("cf-topic-hint");
    var message = document.getElementById("cf-message");
    var lastMailto = "";

    /* Prefill from catalog deep links: contact.html?topic=<capability> */
    var params = new URLSearchParams(window.location.search);
    var wanted = params.get("topic");
    if (wanted && topic) {
      var match = Array.prototype.filter.call(topic.options, function (option) {
        return option.value.toLowerCase() === wanted.toLowerCase();
      })[0];
      if (match) {
        topic.value = match.value;
      } else {
        /* A specific capability rather than a domain — keep it verbatim. */
        var option = document.createElement("option");
        option.value = wanted;
        option.textContent = wanted;
        option.selected = true;
        topic.insertBefore(option, topic.firstChild.nextSibling);
        if (topicHint) {
          topicHint.hidden = false;
          topicHint.textContent = "Pre-selected from the capability catalog.";
        }
      }
      if (message && !message.value) {
        message.value = "We are interested in: " + wanted + "\n\n";
      }
    }

    /* ---- the metrics panel: topic in, list out (decision 17) ---------- */
    var metricsFor = document.getElementById("cf-metrics-for");
    var metricsList = document.getElementById("cf-metrics-list");
    var metricsFoot = document.getElementById("cf-metrics-foot");

    var currentMetrics = function () {
      var chosen = topic ? topic.value : "";
      var extra = METRICS[chosen];
      return extra ? METRICS_BASE.concat(extra) : METRICS_BASE.slice();
    };

    var renderMetrics = function () {
      if (!metricsList) { return; }
      var chosen = topic ? topic.value : "";
      var known = !!METRICS[chosen];
      metricsList.innerHTML = "";
      currentMetrics().forEach(function (line) {
        var li = document.createElement("li");
        li.textContent = line;
        metricsList.appendChild(li);
      });
      if (metricsFor) { metricsFor.textContent = known ? chosen : "For any contract"; }
      if (metricsFoot) {
        metricsFoot.textContent = known
          ? "Send whatever you have. Anything missing we work out together — nothing here has to be exact to start."
          : "Choose a domain above and this list becomes specific to it.";
      }
    };

    if (topic) { topic.addEventListener("change", renderMetrics); }
    renderMetrics();

    var showError = function (input, on) {
      var field = input.closest(".field");
      if (field) { field.classList.toggle("field--error", on); }
    };

    var validate = function () {
      var ok = true;
      var required = [
        document.getElementById("cf-name"),
        document.getElementById("cf-email"),
        document.getElementById("cf-message")
      ];
      required.forEach(function (input) {
        var invalid = !input.value.trim() ||
          (input.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(input.value.trim()));
        showError(input, invalid);
        if (invalid && ok) { input.focus(); }
        if (invalid) { ok = false; }
      });
      var consent = document.getElementById("cf-consent");
      var consentError = document.getElementById("cf-consent-error");
      if (consentError) { consentError.style.display = consent.checked ? "none" : "block"; }
      if (!consent.checked) { ok = false; }
      return ok;
    };

    var buildMailto = function () {
      var value = function (id) {
        var el = document.getElementById(id);
        return el ? el.value.trim() : "";
      };
      var body = [
        "Name:    " + value("cf-name"),
        "Company: " + (value("cf-company") || "—"),
        "Email:   " + value("cf-email"),
        "Phone:   " + (value("cf-phone") || "—"),
        "Topic:   " + (value("cf-topic") || "—"),
        "",
        "Message:",
        value("cf-message"),
        "",
        "Metrics requested for this enquiry:",
        currentMetrics().map(function (line) { return "  - " + line; }).join("\n"),
        "",
        "— sent from the Fersen & Lohse website draft"
      ].join("\n");
      return "mailto:" + CONTACT.email +
        "?subject=" + encodeURIComponent("Enquiry via website — " + (value("cf-company") || value("cf-name"))) +
        "&body=" + encodeURIComponent(body);
    };

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!validate()) { return; }
      lastMailto = buildMailto();
      form.style.display = "none";
      if (success) {
        success.setAttribute("data-visible", "true");
        var retry = document.getElementById("contact-mailto-retry");
        if (retry) { retry.setAttribute("href", lastMailto); }
        success.scrollIntoView({ block: "center" });
      }
      window.location.href = lastMailto;
    });

    form.addEventListener("input", function (event) {
      if (event.target.closest(".field--error")) {
        showError(event.target, false);
      }
    });

    var reset = document.getElementById("contact-reset");
    if (reset) {
      reset.addEventListener("click", function () {
        if (success) { success.setAttribute("data-visible", "false"); }
        form.style.display = "";
        form.scrollIntoView({ block: "center" });
      });
    }
  }
}());
