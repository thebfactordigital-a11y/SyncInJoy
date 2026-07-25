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
        window.innerWidth > 991.98 &&
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
  var navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

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
})();
