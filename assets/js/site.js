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
      if (event.target.tagName === "A" && window.innerWidth <= 900) {
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
