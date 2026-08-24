/* ==========================================================================
   Fersen & Lohse — dictation helper

   Wraps the browser's built-in speech recognition (Web Speech API) so any
   textarea can be filled by voice instead of by typing. One recogniser at a
   time: starting a second field stops the first.

   Chrome, Edge and Safari support this. Firefox does not — there the mic
   button hides itself and the field stays a normal textarea.

   The recogniser needs a real origin, so it works on the hosted draft
   (https) but not on a page opened straight from disk (file://), where the
   browser refuses microphone access.

   API
     FL_DICTATION.blocked()             null | "unsupported" | "file"
     FL_DICTATION.toggle(el, onState)   start on el, or stop if it is running
     FL_DICTATION.stop()                stop whatever is running
     FL_DICTATION.target()              the textarea currently recording

   onState(state, info) is called with:
     "start"                        recording began
     "stop"                         recording ended normally
     "error", {code, message}       denied | nomic | network | failed
   ========================================================================== */
(function () {
  "use strict";

  var Engine = window.SpeechRecognition || window.webkitSpeechRecognition || null;
  var isFile = window.location.protocol === "file:";

  var blocked = function () {
    if (!Engine) return "unsupported";
    if (isFile) return "file";
    return null;
  };

  var rec = null;         /* the live SpeechRecognition instance   */
  var target = null;      /* textarea being dictated into          */
  var notify = null;      /* onState callback of the active field  */
  var base = "";          /* field content when recording started  */
  var settled = "";       /* transcript finalised so far           */
  var wanted = false;     /* user wants to keep recording          */
  var restarts = 0;       /* guard against endless restart loops   */

  var ERRORS = {
    "not-allowed":         { code: "denied",  message: "Mikrofon nicht freigegeben — im Browser erlauben und erneut versuchen." },
    "service-not-allowed": { code: "denied",  message: "Mikrofon nicht freigegeben — im Browser erlauben und erneut versuchen." },
    "audio-capture":       { code: "nomic",   message: "Kein Mikrofon gefunden." },
    "network":             { code: "network", message: "Spracherkennung nicht erreichbar — Verbindung prüfen." }
  };

  /* Speech comes back as sentences. Glue them to what is already in the
     field without doubling or swallowing spaces. */
  var join = function (left, right) {
    if (!left) return right;
    if (!right) return left;
    if (/\s$/.test(left)) return left + right;
    if (/^[,.;:!?)\]]/.test(right)) return left + right;
    return left + " " + right;
  };

  var write = function (interim) {
    if (!target) return;
    target.value = join(base, join(settled, interim));
    /* Let the page's own input handler pick the text up. */
    var ev;
    try {
      ev = new Event("input", { bubbles: true });
    } catch (e) {
      ev = document.createEvent("Event");
      ev.initEvent("input", true, false);
    }
    target.dispatchEvent(ev);
  };

  var tell = function (state, info) {
    if (notify) notify(state, info || null);
  };

  var teardown = function (state, info) {
    var cb = notify;
    wanted = false;
    if (rec) {
      rec.onresult = rec.onerror = rec.onend = null;
      try { rec.stop(); } catch (e) { /* already stopped */ }
    }
    rec = null;
    target = null;
    notify = null;
    if (cb) cb(state, info || null);
  };

  var launch = function () {
    rec = new Engine();
    rec.lang = "de-DE";
    rec.continuous = true;
    rec.interimResults = true;

    rec.onresult = function (event) {
      var interim = "";
      for (var i = event.resultIndex; i < event.results.length; i += 1) {
        var text = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          settled = join(settled, text.trim());
          restarts = 0;
        } else {
          interim = join(interim, text);
        }
      }
      write(interim.trim());
    };

    rec.onerror = function (event) {
      if (event.error === "no-speech" || event.error === "aborted") return;
      var known = ERRORS[event.error];
      teardown("error", known || { code: "failed", message: "Diktieren nicht möglich." });
    };

    rec.onend = function () {
      /* Chrome ends the session after a pause even with continuous = true.
         Restart while the user still has the button switched on. */
      if (wanted && restarts < 60) {
        restarts += 1;
        try {
          rec.start();
          return;
        } catch (e) { /* fall through to a clean stop */ }
      }
      teardown("stop");
    };

    try {
      rec.start();
    } catch (e) {
      teardown("error", { code: "failed", message: "Diktieren nicht möglich." });
      return false;
    }
    return true;
  };

  window.FL_DICTATION = {
    blocked: blocked,

    target: function () { return target; },

    stop: function () {
      if (rec) teardown("stop");
    },

    toggle: function (el, onState) {
      if (blocked()) {
        if (onState) {
          onState("error", blocked() === "file"
            ? { code: "failed", message: "Diktieren braucht die Online-Fassung — lokal geöffnete Dateien dürfen nicht ans Mikrofon." }
            : { code: "failed", message: "Dieser Browser kann nicht diktieren — Chrome, Edge oder Safari nutzen." });
        }
        return false;
      }
      if (target === el) {
        this.stop();
        return false;
      }
      if (rec) teardown("stop");

      target = el;
      notify = onState || null;
      base = el.value || "";
      settled = "";
      wanted = true;
      restarts = 0;

      if (!launch()) return false;
      tell("start");
      return true;
    }
  };
})();
