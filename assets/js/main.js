/* ==========================================================================
   SYNC IN JOY — MAIN.JS
   Vanilla JS only (locked, no framework). Handles:
   1. Mobile nav open/close
   2. Sticky header scrolled state
   3. Active nav-link sync on scroll (basic, extends as sections are added)
   ========================================================================== */

(function () {
  "use strict";

  var header = document.getElementById("siteHeader");
  var navToggle = document.getElementById("navToggle");
  var navLinks = document.getElementById("navLinks");
  var navBackdrop = document.getElementById("navBackdrop");
  var navClose = document.getElementById("navClose");

  /* ---------------------------------------------------------------------
     Mobile / tablet off-canvas nav (opens from the right, 80% width)
     --------------------------------------------------------------------- */
  var scrollY = 0;

  function openNav() {
    scrollY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = "-" + scrollY + "px";
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";

    navLinks.classList.add("is-open");
    navToggle.classList.add("is-open");
    navToggle.setAttribute("aria-expanded", "true");
    if (navBackdrop) {
      navBackdrop.hidden = false;
      requestAnimationFrame(function () {
        navBackdrop.classList.add("is-open");
      });
    }
  }

  function closeNav() {
    navLinks.classList.remove("is-open");
    navToggle.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    if (navBackdrop) {
      navBackdrop.classList.remove("is-open");
      setTimeout(function () {
        navBackdrop.hidden = true;
      }, 400);
    }

    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.left = "";
    document.body.style.right = "";
    document.body.style.width = "";
    window.scrollTo(0, scrollY);
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      if (navLinks.classList.contains("is-open")) {
        closeNav();
      } else {
        openNav();
      }
    });

    // Close menu when a link is tapped
    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        if (navLinks.classList.contains("is-open")) closeNav();
      });
    });

    // Close when tapping the dimmed backdrop
    if (navBackdrop) {
      navBackdrop.addEventListener("click", closeNav);
    }

    // Close when tapping the explicit X button
    if (navClose) {
      navClose.addEventListener("click", closeNav);
    }

    // Close on Escape
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && navLinks.classList.contains("is-open"))
        closeNav();
    });

    // If the viewport is resized back to desktop while open, reset state
    window.addEventListener("resize", function () {
      if (
        window.innerWidth > 1030.98 &&
        navLinks.classList.contains("is-open")
      ) {
        closeNav();
      }
    });
  }

  /* ---------------------------------------------------------------------
     Sticky header shadow/border once page has scrolled
     --------------------------------------------------------------------- */
  function onScroll() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------------------------------------------------------------------
     Active nav link tracking via IntersectionObserver
     Works automatically as more <section id="..."> elements are added.
     --------------------------------------------------------------------- */
  var sections = document.querySelectorAll("main section[id]");
  var navAnchors = document.querySelectorAll(
    '.nav-links a[href^="#"]:not(.btn-editorial)',
  );

  if (
    sections.length &&
    navAnchors.length &&
    "IntersectionObserver" in window
  ) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = entry.target.getAttribute("id");
            navAnchors.forEach(function (a) {
              a.classList.toggle("active", a.getAttribute("href") === "#" + id);
            });
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  /* ==========================================================================
   WHAT I OFFER — scroll-reveal enhancement (progressive, vanilla JS)
   Purely decorative. Rows are visible by default in CSS; this only adds
   the .js-reveal class (opt-in) so nothing breaks if JS fails to load,
   and skips entirely under prefers-reduced-motion.
   ========================================================================== */

  (function () {
    "use strict";

    var offerRows = document.querySelectorAll("#offer .offer-item");
    if (!offerRows.length) return;

    var prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion || !("IntersectionObserver" in window)) return;

    offerRows.forEach(function (row) {
      row.classList.add("js-reveal");
    });

    var revealObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -60px 0px" },
    );

    offerRows.forEach(function (row) {
      revealObserver.observe(row);
    });
  })();

  /* ---------------------------------------------------------------------
   FAQ — accordion (single-open)
   --------------------------------------------------------------------- */
  (function () {
    "use strict";
    var faqList = document.getElementById("faqList");
    if (!faqList) return;

    var buttons = faqList.querySelectorAll(".faq-q");

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var expanded = btn.getAttribute("aria-expanded") === "true";
        var panel = document.getElementById(btn.getAttribute("aria-controls"));

        buttons.forEach(function (other) {
          if (other !== btn) {
            other.setAttribute("aria-expanded", "false");
            var otherPanel = document.getElementById(
              other.getAttribute("aria-controls"),
            );
            if (otherPanel) otherPanel.hidden = true;
          }
        });

        btn.setAttribute("aria-expanded", String(!expanded));
        if (panel) panel.hidden = expanded;
      });
    });
  })();
  /* ==========================================================================
   9. CONTACT FORM — vanilla JS
   Per-field inline validation (name, email format, message) runs before
   submit. On pass, submits via fetch() as a standard Netlify Forms AJAX
   POST. Form must also exist as static HTML with data-netlify="true" for
   Netlify's build-bot to register it (see contact-final.html).
   ========================================================================== */

  (function () {
    "use strict";

    var form = document.getElementById("contactForm");
    if (!form) return;

    var statusEl = document.getElementById("contactFormStatus");
    var submitBtn = form.querySelector(".contact-submit");

    var nameInput = form.querySelector("#cf-name");
    var emailInput = form.querySelector("#cf-email");
    var messageInput = form.querySelector("#cf-message");

    var nameError = document.getElementById("cf-name-error");
    var emailError = document.getElementById("cf-email-error");
    var messageError = document.getElementById("cf-message-error");

    function setStatus(message, type) {
      if (!statusEl) return;
      statusEl.textContent = message;
      statusEl.classList.remove("is-error", "is-success");
      if (type) statusEl.classList.add(type);
    }

    function clearFieldError(input, errorEl) {
      input.classList.remove("is-invalid");
      if (errorEl) errorEl.textContent = "";
    }

    function validateRequired(input, errorEl, message) {
      var isEmpty = input.value.trim() === "";
      input.classList.toggle("is-invalid", isEmpty);
      if (errorEl) errorEl.textContent = isEmpty ? message : "";
      return !isEmpty;
    }

    function validateEmail(input, errorEl) {
      var value = input.value.trim();
      if (value === "") {
        input.classList.add("is-invalid");
        if (errorEl) errorEl.textContent = "Please enter your email.";
        return false;
      }
      var isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      input.classList.toggle("is-invalid", !isValid);
      if (errorEl)
        errorEl.textContent = isValid
          ? ""
          : "Please enter a valid email address.";
      return isValid;
    }

    // Clear a field's error as soon as the person starts fixing it
    [
      [nameInput, nameError],
      [emailInput, emailError],
      [messageInput, messageError],
    ].forEach(function (pair) {
      var input = pair[0];
      var errorEl = pair[1];
      input.addEventListener("input", function () {
        if (input.classList.contains("is-invalid")) {
          clearFieldError(input, errorEl);
        }
      });
    });

    function encodeForNetlify(formEl) {
      var formData = new FormData(formEl);
      var params = new URLSearchParams();
      formData.forEach(function (value, key) {
        params.append(key, value);
      });
      return params.toString();
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var nameValid = validateRequired(
        nameInput,
        nameError,
        "Please enter your name.",
      );
      var emailValid = validateEmail(emailInput, emailError);
      var messageValid = validateRequired(
        messageInput,
        messageError,
        "Please share a short message.",
      );

      if (!nameValid || !emailValid || !messageValid) {
        setStatus("", "");
        return;
      }

      if (submitBtn) submitBtn.setAttribute("disabled", "disabled");
      setStatus("Sending…", "");

      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encodeForNetlify(form),
      })
        .then(function (response) {
          if (!response.ok) throw new Error("Network response was not ok");
          setStatus("Thanks — I'll get back to you shortly.", "is-success");
          form.reset();
          clearFieldError(nameInput, nameError);
          clearFieldError(emailInput, emailError);
          clearFieldError(messageInput, messageError);
        })
        .catch(function () {
          setStatus("Something went wrong. Please try again.", "is-error");
        })
        .finally(function () {
          if (submitBtn) submitBtn.removeAttribute("disabled");
        });
    });
  })();
})();
