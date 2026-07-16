/* ═══════════════════════════════════════════════════════════
   KAWSAYPAC · The Living Apothecary (page behavior)
   Progressive enhancement only. With JS off the full page
   renders unfiltered and every plate is fully expanded.
   ═══════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  /* Signal JS is live: accordion panels collapse only under html.js */
  document.documentElement.classList.add("js");

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var scrollBehavior = prefersReduced ? "auto" : "smooth";

  /* ── accordion: real buttons, aria-expanded, smooth height ── */
  (function () {
    function expand(panel, btn) {
      btn.setAttribute("aria-expanded", "true");
      panel.classList.add("open");
      if (panel.__end) { panel.removeEventListener("transitionend", panel.__end); panel.__end = null; }
      if (prefersReduced) { panel.style.height = "auto"; return; }
      panel.style.height = panel.scrollHeight + "px";
      panel.__end = function (e) {
        if (e.target !== panel || e.propertyName !== "height") return;
        if (panel.classList.contains("open")) panel.style.height = "auto";
        panel.removeEventListener("transitionend", panel.__end);
        panel.__end = null;
      };
      panel.addEventListener("transitionend", panel.__end);
    }

    function collapse(panel, btn) {
      btn.setAttribute("aria-expanded", "false");
      panel.classList.remove("open");
      if (panel.__end) { panel.removeEventListener("transitionend", panel.__end); panel.__end = null; }
      if (prefersReduced) { panel.style.height = ""; return; }
      /* from current rendered height (may be auto) down to 0 */
      panel.style.height = panel.scrollHeight + "px";
      panel.getBoundingClientRect(); /* force reflow so the next write animates */
      panel.style.height = "0px";
    }

    document.querySelectorAll(".acc-btn").forEach(function (btn) {
      var panel = document.getElementById(btn.getAttribute("aria-controls"));
      if (!panel) return;
      btn.addEventListener("click", function () {
        var isOpen = btn.getAttribute("aria-expanded") === "true";
        if (isOpen) collapse(panel, btn);
        else expand(panel, btn);
      });
    });
  })();

  /* ── concern filter ── */
  var CONCERNS = {
    all: "All Products",
    sleep: "Sleep & Relaxation",
    digestive: "Digestive Health",
    womens: "Women's Wellness",
    mens: "Men's Wellness",
    immune: "Auto-Immune Support",
    nervous: "Nervous System",
    energy: "Energy & Vitality",
    joints: "Joint & Mobility",
    heart: "Heart Health",
    liver: "Liver Support",
    kidney: "Kidney Support",
    lung: "Lung Support",
    hormone: "Hormone Balance",
    detox: "Full Body Detox"
  };

  var pills = Array.prototype.slice.call(document.querySelectorAll(".concern-pill"));
  var plates = Array.prototype.slice.call(document.querySelectorAll("#herbGrid .plate"));
  var blends = Array.prototype.slice.call(document.querySelectorAll("#blendGrid .blend-card"));
  var kits = Array.prototype.slice.call(document.querySelectorAll("#kitGrid .kit-card"));
  var herbsEmpty = document.getElementById("herbsEmpty");
  var blendsEmpty = document.getElementById("blendsEmpty");
  var kitsHead = document.getElementById("kitsHead");
  var chip = document.getElementById("filterChip");
  var chipLabel = document.getElementById("filterChipLabel");
  var chipClear = document.getElementById("filterChipClear");
  var herbsSection = document.getElementById("herbs");

  function concernsOf(el) {
    return (el.getAttribute("data-concerns") || "")
      .split(",")
      .map(function (s) { return s.trim(); })
      .filter(Boolean);
  }

  function filterList(list, slug) {
    var shown = 0;
    list.forEach(function (el) {
      var show = slug === "all" || concernsOf(el).indexOf(slug) > -1;
      el.classList.toggle("is-hidden", !show);
      if (show) shown++;
    });
    return shown;
  }

  function applyFilter(slug, opts) {
    opts = opts || {};
    slug = (slug || "all").toLowerCase().trim();
    var known = Object.prototype.hasOwnProperty.call(CONCERNS, slug);
    var effective = known ? slug : "all";

    pills.forEach(function (p) {
      var on = p.getAttribute("data-concern") === effective;
      p.classList.toggle("active", on);
      p.setAttribute("aria-pressed", on ? "true" : "false");
    });

    var nPlates = filterList(plates, effective);
    var nBlends = filterList(blends, effective);
    var nKits = filterList(kits, effective);

    if (herbsEmpty) herbsEmpty.hidden = nPlates !== 0;
    if (blendsEmpty) blendsEmpty.hidden = (nBlends + nKits) !== 0;
    if (kitsHead) kitsHead.hidden = nKits === 0;

    if (chip && chipLabel) {
      if (!known) {
        chipLabel.textContent = "No exact match for that concern, showing the full archive";
        chip.hidden = false;
      } else if (effective !== "all") {
        chipLabel.textContent = "Showing: " + CONCERNS[effective];
        chip.hidden = false;
      } else {
        chip.hidden = true;
      }
    }

    if (opts.updateUrl !== false && window.history && history.replaceState) {
      var q = effective !== "all" ? "?concern=" + effective : "";
      history.replaceState(null, "", window.location.pathname + q);
    }

    if (opts.animate !== false) animateFilterEntrance();

    if (opts.scroll && herbsSection) {
      window.scrollTo({ top: herbsSection.getBoundingClientRect().top + window.scrollY - 110, behavior: scrollBehavior });
    }
  }

  /* FLIP-lite: surviving cards re-enter with a quick fade + rise.
     No layout measurement; skipped without GSAP or with reduced motion. */
  function animateFilterEntrance() {
    if (prefersReduced || typeof gsap === "undefined") return;
    var visible = plates.concat(blends, kits).filter(function (el) {
      return !el.classList.contains("is-hidden");
    });
    if (visible.length) {
      gsap.fromTo(visible,
        { autoAlpha: 0, y: 14 },
        {
          autoAlpha: 1, y: 0, duration: 0.35, ease: "power3.out",
          stagger: 0.02, overwrite: "auto",
          clearProps: "transform,opacity,visibility"
        });
    }
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  }

  pills.forEach(function (pill) {
    pill.addEventListener("click", function () {
      applyFilter(pill.getAttribute("data-concern"));
    });
  });

  if (chipClear) {
    chipClear.addEventListener("click", function () {
      applyFilter("all");
    });
  }

  /* header "Shop by Concern" links target this same page:
     filter in place instead of reloading */
  document.querySelectorAll('a[href*="apothecary.html?concern="]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var m = (a.getAttribute("href") || "").match(/[?&]concern=([\w-]+)/);
      if (!m) return;
      e.preventDefault();
      applyFilter(m[1], { scroll: true });
    });
  });

  /* deep link: apothecary.html?concern=<slug>
     (no re-entrance tween on load: the scroll reveals own that moment) */
  (function () {
    var m = window.location.search.match(/[?&]concern=([\w-]+)/);
    if (!m) return;
    var slug = decodeURIComponent(m[1]);
    applyFilter(slug, { updateUrl: false, animate: false });
    window.setTimeout(function () {
      if (herbsSection) window.scrollTo({ top: herbsSection.getBoundingClientRect().top + window.scrollY - 110, behavior: scrollBehavior });
    }, 300);
  })();

  /* ═══════════ GSAP motion layer (page-specific) ═══════════
     Shared language: power3.out, text enters from the LEFT,
     images unmask from the left, cards rise. app.js owns the
     nav, magnetic buttons and the scroll progress bar; this
     page's reveal targets are handled here only (no .reveal
     classes on this page, so app.js generics never double-fire).
     Everything is fully visible with JS disabled. */
  var initApoMotion = function () {
    if (prefersReduced || typeof gsap === "undefined") return;
    if (typeof ScrollTrigger !== "undefined") gsap.registerPlugin(ScrollTrigger);

    /* 1 · hero entrance: text slides in from the left */
    gsap.timeline({ defaults: { ease: "power3.out" } })
      .from(".apo-hero-inner .kicker", { x: -24, autoAlpha: 0, duration: 0.7, immediateRender: false }, 0.15)
      .from(".apo-h1", { x: -56, autoAlpha: 0, duration: 0.9, immediateRender: false }, 0.25)
      .from(".apo-hero-lede", { x: -36, autoAlpha: 0, duration: 0.8, immediateRender: false }, 0.45)
      .from(".apo-hero-cta .btn", { y: 22, autoAlpha: 0, duration: 0.7, stagger: 0.08, immediateRender: false, clearProps: "transform" }, 0.62)
      .from(".apo-hero-badge", { y: -18, autoAlpha: 0, duration: 0.7, immediateRender: false }, 0.55);

    if (typeof ScrollTrigger === "undefined") return;

    /* 2 · text reveals: kickers x:-24, headings x:-56, ledes x:-36 (+0.08s) */
    var fromLeft = function (targets, dx, vars) {
      gsap.utils.toArray(targets).forEach(function (el) {
        gsap.from(el, Object.assign({
          x: dx, autoAlpha: 0, duration: 0.8, ease: "power3.out",
          immediateRender: false,
          scrollTrigger: { trigger: el, start: "top 82%", once: true }
        }, vars || {}));
      });
    };
    fromLeft(".apo-main section:not(.apo-hero) .kicker", -24, { duration: 0.7 });
    fromLeft(".apo-main .h2, .apo-main .filter-title", -56, { duration: 0.9 });
    fromLeft(".apo-main .section-lede, .apo-main .cta-lede", -36, { delay: 0.08 });

    /* 3 · plates + blend/kit cards rise y:24, 0.06 stagger per row */
    var rise = function (targets) {
      ScrollTrigger.batch(targets, {
        start: "top 82%", once: true,
        onEnter: function (batch) {
          gsap.from(batch, {
            y: 24, autoAlpha: 0, duration: 0.7, ease: "power3.out",
            stagger: 0.06, immediateRender: false,
            clearProps: "transform,opacity,visibility"
          });
        }
      });
    };
    rise("#herbGrid .plate");
    rise("#blendGrid .blend-card");
    rise("#kitGrid .kit-card");
    rise(".methods-grid .method-panel");

    /* single content blocks: subtle fade-up */
    gsap.utils.toArray([".filter-card", ".need-band", ".cta-actions", ".journal-form"]).forEach(function (el) {
      gsap.from(el, {
        y: 18, autoAlpha: 0, duration: 0.8, ease: "power3.out",
        immediateRender: false, clearProps: "transform,opacity,visibility",
        scrollTrigger: { trigger: el, start: "top 82%", once: true }
      });
    });

    /* concern pills cascade in once */
    gsap.from(".concern-pills .concern-pill", {
      y: 12, autoAlpha: 0, duration: 0.5, ease: "power3.out", stagger: 0.025,
      immediateRender: false, clearProps: "transform,opacity,visibility",
      scrollTrigger: { trigger: ".concern-pills", start: "top 88%", once: true }
    });

    /* heavy effects only at >=900px; gsap.matchMedia re-evaluates live
       (a load-time width check misses later resizes) */
    gsap.matchMedia().add("(min-width: 900px)", function () {

      /* 4 · images unmask from the left (transform/clip-path only) */
      gsap.utils.toArray(".plate-media img, .blend-media img").forEach(function (img) {
        gsap.fromTo(img,
          { clipPath: "inset(0 100% 0 0)" },
          {
            clipPath: "inset(0 0% 0 0)", duration: 0.9, ease: "power3.out",
            immediateRender: false, clearProps: "clipPath",
            scrollTrigger: { trigger: img.closest(".plate, .blend-card") || img, start: "top 82%", once: true }
          });
      });

      /* 5 · gentle parallax: hero backdrop + dark CTA underlay (8 total travel,
         backdrops oversized in CSS so no edge is ever exposed) */
      gsap.fromTo(".apo-hero-bg", { yPercent: -4 }, {
        yPercent: 4, ease: "none",
        scrollTrigger: { trigger: ".apo-hero-frame", start: "top top", end: "bottom top", scrub: 0.6 }
      });
      gsap.fromTo(".cta-bg", { yPercent: 4 }, {
        yPercent: -4, ease: "none",
        scrollTrigger: { trigger: ".cta-panel", start: "top bottom", end: "bottom top", scrub: 0.6 }
      });
    });
  };
  if (document.readyState === "complete") initApoMotion();
  else window.addEventListener("load", initApoMotion);
})();
