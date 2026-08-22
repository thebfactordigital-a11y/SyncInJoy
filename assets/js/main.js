/* ==========================================================================
   MAIN.JS  
   ========================================================================== */

(function () {
  "use strict";

  var header = document.getElementById("siteHeader");
  var navToggle = document.getElementById("navToggle");
  var navLinks = document.getElementById("navLinks");
  var navBackdrop = document.getElementById("navBackdrop");
  var navClose = document.getElementById("navClose");

  /* ---------------------------------------------------------------------
    1. Mobile / tablet off-canvas nav 
     --------------------------------------------------------------------- */
  var scrollY = 0;
  var lastFocusedEl = null;

  function getFocusableEls() {
    return navLinks.querySelectorAll("a[href], button:not([disabled])");
  }

  function trapFocus(e) {
    if (e.key !== "Tab") return;
    var focusable = getFocusableEls();
    if (!focusable.length) return;
    var first = focusable[0];
    var last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function openNav() {
    scrollY = window.scrollY;
    lastFocusedEl = document.activeElement;

    document.body.style.position = "fixed";
    document.body.style.top = "-" + scrollY + "px";
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";

    if (header) header.classList.add("is-nav-open");

    navLinks.classList.add("is-open");
    navToggle.classList.add("is-open");
    navToggle.setAttribute("aria-expanded", "true");
    navToggle.setAttribute("aria-label", "Close menu");
    if (navBackdrop) {
      navBackdrop.hidden = false;
      requestAnimationFrame(function () {
        navBackdrop.classList.add("is-open");
      });
    }

    document.addEventListener("keydown", trapFocus);

    // Move focus into the panel once it's visible
    requestAnimationFrame(function () {
      if (navClose) {
        navClose.focus();
      } else {
        var focusable = getFocusableEls();
        if (focusable.length) focusable[0].focus();
      }
    });
  }

  function closeNav() {
    navLinks.classList.remove("is-open");
    navToggle.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
    if (navBackdrop) {
      navBackdrop.classList.remove("is-open");
      setTimeout(function () {
        navBackdrop.hidden = true;
      }, 400);
    }

    document.removeEventListener("keydown", trapFocus);

    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.left = "";
    document.body.style.right = "";
    document.body.style.width = "";

    var prevBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "auto";
    window.scrollTo(0, scrollY);
    document.documentElement.style.scrollBehavior = prevBehavior;

    if (header) {
      header.classList.remove("is-nav-open");
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    }

    if (lastFocusedEl) lastFocusedEl.focus();
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
    // Nav Toggle to open the hamburger menu
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
    1.1  Sticky header once page has scrolled
     --------------------------------------------------------------------- */
  function onScroll() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------------------------------------------------------------------
    1.2 Active nav link tracking via IntersectionObserver
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
   2. WHAT I OFFER 
   ========================================================================== */

  (function () {
    "use strict";

    var prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion || !("IntersectionObserver" in window)) return;

    function initReveal(selector) {
      var els = document.querySelectorAll(selector);
      if (!els.length) return;

      els.forEach(function (el) {
        el.classList.add("js-reveal");
      });

      var observer = new IntersectionObserver(
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

      els.forEach(function (el) {
        observer.observe(el);
      });
    }

    initReveal(
      "#offer .offer-item, #about .story-block, #about .story-image-card, #about .story-tl-item, #about .story-quote-box, #credentials .timeline-h-item, #gallery .gallery-item",
    );
  })();

  /* ---------------------------------------------------------------------
   8. FAQ — accordion (single-open)
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
    BACK TO TOP
   ========================================================================== */

  (function () {
    const btn = document.getElementById("backToTop");
    if (!btn) return;

    const toggleVisibility = () => {
      if (window.scrollY > window.innerHeight * 0.8) {
        btn.classList.add("is-visible");
      } else {
        btn.classList.remove("is-visible");
      }
    };

    window.addEventListener("scroll", toggleVisibility, { passive: true });
    toggleVisibility();

    btn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  })();

  /* ==========================================================================
   10. CONTACT FORM VALIDATION
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
      input.setAttribute("aria-invalid", "false");
      if (errorEl) errorEl.textContent = "";
    }

    function validateRequired(input, errorEl, message) {
      var isEmpty = input.value.trim() === "";
      input.classList.toggle("is-invalid", isEmpty);
      input.setAttribute("aria-invalid", isEmpty ? "true" : "false");
      if (errorEl) errorEl.textContent = isEmpty ? message : "";
      return !isEmpty;
    }

    function validateEmail(input, errorEl) {
      var value = input.value.trim();
      if (value === "") {
        input.classList.add("is-invalid");
        input.setAttribute("aria-invalid", "true");
        if (errorEl) errorEl.textContent = "Please enter your email.";
        return false;
      }
      var isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      input.classList.toggle("is-invalid", !isValid);
      input.setAttribute("aria-invalid", isValid ? "false" : "true");
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
        setStatus("Please fix the highlighted fields above.", "is-error");

        if (!nameValid) {
          nameInput.focus();
        } else if (!emailValid) {
          emailInput.focus();
        } else if (!messageValid) {
          messageInput.focus();
        }
        return;
      }

      if (submitBtn) submitBtn.setAttribute("disabled", "disabled");
      setStatus("Sending…", "");

      var controller = new AbortController();
      var timeoutId = setTimeout(function () {
        controller.abort();
      }, 10000); // 10s timeout

      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encodeForNetlify(form),
        signal: controller.signal,
      })
        .then(function (response) {
          if (!response.ok) throw new Error("Network response was not ok");
          setStatus("Thanks — I'll get back to you shortly.", "is-success");
          form.reset();
          clearFieldError(nameInput, nameError);
          clearFieldError(emailInput, emailError);
          clearFieldError(messageInput, messageError);
        })
        .catch(function (err) {
          if (err.name === "AbortError") {
            setStatus("Request timed out. Please try again.", "is-error");
          } else {
            setStatus("Something went wrong. Please try again.", "is-error");
          }
        })
        .finally(function () {
          clearTimeout(timeoutId);
          if (submitBtn) submitBtn.removeAttribute("disabled");
        });
    });
  })();
})();
