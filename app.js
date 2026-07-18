/* ═══════════════════════════════════════════════════════════
   KAWSAYPAC · interactions (progressive enhancement only)
   Content is fully visible without JS. Everything here adds motion.
   ═══════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ── broken-image guard: branded gradient placeholder ── */
  var PLACEHOLDER =
    "data:image/svg+xml," +
    encodeURIComponent(
      "<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600'>" +
        "<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>" +
        "<stop offset='0' stop-color='#F3F0E9'/><stop offset='1' stop-color='#E5D9A8'/>" +
        "</linearGradient></defs>" +
        "<rect width='800' height='600' fill='url(#g)'/>" +
        "<g fill='none' stroke='#C9A942' stroke-width='6' opacity='0.55' transform='translate(340,240)'>" +
        "<circle cx='60' cy='60' r='54'/><circle cx='60' cy='60' r='17'/><circle cx='60' cy='43' r='17'/>" +
        "<circle cx='60' cy='77' r='17'/><circle cx='75' cy='51' r='17'/><circle cx='75' cy='69' r='17'/>" +
        "<circle cx='45' cy='51' r='17'/><circle cx='45' cy='69' r='17'/></g></svg>"
    );
  document.querySelectorAll("img").forEach(function (img) {
    img.addEventListener("error", function () {
      if (img.src !== PLACEHOLDER) { img.src = PLACEHOLDER; img.style.objectFit = "cover"; }
    });
  });

  /* ── nav: compact on scroll ── */
  var header = document.getElementById("siteHeader");
  var onScrollHeader = function () {
    if (window.scrollY > 80) header.classList.add("compact");
    else header.classList.remove("compact");
  };
  window.addEventListener("scroll", onScrollHeader, { passive: true });
  onScrollHeader();

  /* ── nav: click-toggle dropdowns (senior rule: hover AND click) ── */
  document.querySelectorAll(".has-drop").forEach(function (li) {
    var btn = li.querySelector(".drop-trigger");
    if (!btn) return;
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = li.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      document.querySelectorAll(".has-drop.open").forEach(function (other) {
        if (other !== li) { other.classList.remove("open"); }
      });
    });
  });
  document.addEventListener("click", function () {
    document.querySelectorAll(".has-drop.open").forEach(function (li) {
      li.classList.remove("open");
      var b = li.querySelector(".drop-trigger");
      if (b) b.setAttribute("aria-expanded", "false");
    });
  });

  /* ── mobile menu ── */
  var toggle = document.querySelector(".nav-toggle");
  var sheet = document.getElementById("mobileSheet");
  if (toggle && sheet) {
    toggle.addEventListener("click", function () {
      var open = sheet.classList.toggle("open");
      toggle.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      sheet.setAttribute("aria-hidden", open ? "false" : "true");
      document.body.style.overflow = open ? "hidden" : "";
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && sheet.classList.contains("open")) {
        sheet.classList.remove("open");
        toggle.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        sheet.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
      }
    });
    sheet.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        sheet.classList.remove("open");
        toggle.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });
  }


  /* ── hero mini carousel ── */
  (function () {
    var imgs = document.querySelectorAll(".hero-card-imgs img");
    var dots = document.querySelectorAll(".hero-card-txt .dots i");
    if (!imgs.length) return;
    var i = 0;
    setInterval(function () {
      imgs[i].classList.remove("on");
      if (dots[i]) dots[i].classList.remove("on");
      i = (i + 1) % imgs.length;
      imgs[i].classList.add("on");
      if (dots[i]) dots[i].classList.add("on");
    }, 4000);
  })();

  /* ── altitude ledger ── */
  var altLabel = document.getElementById("altLabel");
  if (altLabel && "IntersectionObserver" in window) {
    var sections = document.querySelectorAll("[data-alt]");
    var altIO = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            var next = en.target.getAttribute("data-alt");
            if (altLabel.textContent !== next) {
              altLabel.classList.add("swap");
              setTimeout(function () {
                altLabel.textContent = next;
                altLabel.classList.remove("swap");
              }, 240);
            }
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    sections.forEach(function (s) { altIO.observe(s); });
  }

  /* ── trust bar count-up ── */
  (function () {
    var stats = document.querySelectorAll("[data-count]");
    if (!stats.length || !("IntersectionObserver" in window)) return;
    var done = false;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting || done) return;
        done = true;
        stats.forEach(function (el) {
          var target = parseFloat(el.getAttribute("data-count"));
          var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
          var suffix = el.getAttribute("data-suffix") || "";
          var t0 = null;
          el.textContent = "0" + suffix;
          var step = function (ts) {
            if (!t0) t0 = ts;
            var p = Math.min((ts - t0) / 1400, 1);
            var eased = 1 - Math.pow(1 - p, 3);
            var val = target * eased;
            el.textContent =
              (decimals ? val.toFixed(decimals) : Math.round(val).toLocaleString("en-US")) + suffix;
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        });
      });
    }, { threshold: 0.4 });
    io.observe(stats[0]);
  })();

  /* ── blends carousel arrows + keyboard ── */
  (function () {
    var car = document.getElementById("blendCar");
    if (!car) return;
    var step = 316;
    var prev = document.getElementById("carPrev");
    var next = document.getElementById("carNext");
    if (prev) prev.addEventListener("click", function () { car.scrollBy({ left: -step * 2, behavior: "smooth" }); });
    if (next) next.addEventListener("click", function () { car.scrollBy({ left: step * 2, behavior: "smooth" }); });
    car.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") { e.preventDefault(); car.scrollBy({ left: -step, behavior: "smooth" }); }
      if (e.key === "ArrowRight") { e.preventDefault(); car.scrollBy({ left: step, behavior: "smooth" }); }
    });
  })();

  /* ── testimonial rotator ── */
  (function () {
    var wrap = document.getElementById("quoteRotator");
    if (!wrap) return;
    var qs = wrap.querySelectorAll(".q");
    var i = 0, timer = null, paused = false;
    var show = function (n) {
      qs[i].classList.remove("on");
      i = (n + qs.length) % qs.length;
      qs[i].classList.add("on");
    };
    var start = function () {
      if (prefersReduced) return;
      timer = setInterval(function () { if (!paused) show(i + 1); }, 6000);
    };
    start();
    var prev = document.getElementById("qPrev");
    var next = document.getElementById("qNext");
    if (prev) prev.addEventListener("click", function () { show(i - 1); });
    if (next) next.addEventListener("click", function () { show(i + 1); });
    var panel = wrap.closest(".testi-panel");
    if (panel) {
      panel.addEventListener("mouseenter", function () { paused = true; });
      panel.addEventListener("mouseleave", function () { paused = false; });
      panel.addEventListener("focusin", function () { paused = true; });
      panel.addEventListener("focusout", function () { paused = false; });
    }
  })();

  /* ── retreats video lightbox (facade) ── */
  (function () {
    var btn = document.getElementById("playRetreat");
    var lb = document.getElementById("lightbox");
    var frame = document.getElementById("lbFrame");
    var close = document.getElementById("lbClose");
    if (!btn || !lb) return;
    var lastFocus = null;
    var open = function () {
      lastFocus = document.activeElement;
      frame.innerHTML =
        '<iframe src="https://www.youtube-nocookie.com/embed/MHHxiENWMho?autoplay=1&rel=0" title="Kawsaypac retreats video" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>';
      lb.classList.add("open");
      lb.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      close.focus();
    };
    var shut = function () {
      lb.classList.remove("open");
      lb.setAttribute("aria-hidden", "true");
      frame.innerHTML = "";
      document.body.style.overflow = "";
      if (lastFocus) lastFocus.focus();
    };
    btn.addEventListener("click", open);
    var watch = document.getElementById("watchRetreat");
    if (watch) watch.addEventListener("click", open);
    close.addEventListener("click", shut);
    lb.addEventListener("click", function (e) { if (e.target === lb) shut(); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && lb.classList.contains("open")) shut();
    });
  })();

  /* ── journal form ── */
  (function () {
    var form = document.getElementById("journalForm");
    var ok = document.getElementById("journalOk");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var email = form.querySelector("input");
      if (!email.value || email.value.indexOf("@") < 1) {
        email.focus();
        email.style.borderColor = "#B0563C";
        return;
      }
      form.hidden = true;
      ok.hidden = false;
    });
  })();

  /* ── scroll progress bar (shared: any page including app.js gets it) ── */
  var initProgress = function () {
    if (prefersReduced || document.querySelector(".scroll-progress")) return;
    var bar = document.createElement("div");
    bar.className = "scroll-progress";
    bar.setAttribute("aria-hidden", "true");
    document.body.appendChild(bar);
    var ticking = false;
    var update = function () {
      ticking = false;
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var p = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;
      bar.style.transform = "scaleX(" + p + ")";
    };
    var request = function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    };
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request, { passive: true });
    update();
  };

  /* ═══════════ GSAP motion layer ═══════════ */
  var motionReady = false;
  var initMotion = function () {
    if (motionReady || prefersReduced || typeof gsap === "undefined") return;
    motionReady = true;
    if (typeof ScrollTrigger !== "undefined") gsap.registerPlugin(ScrollTrigger);
    /* matchMedia reflects the REAL CSS viewport (robust when window.innerWidth reads 0 mid-boot) */
    var heavy = window.matchMedia && window.matchMedia("(min-width: 900px)").matches;

    /* ── hero cinematic scroll-descent (desktop + motion-on only; mobile = static hero) ── */
    (function () {
      var hero = document.querySelector(".j-hero");
      var media = document.getElementById("heroMedia");
      var overlay = document.getElementById("heroOverlay");
      var cue = document.getElementById("scrollCue");
      var platesWrap = document.getElementById("heroPlates");
      var plates = Array.prototype.slice.call(document.querySelectorAll(".h-plate"));
      var sprites = Array.prototype.slice.call(document.querySelectorAll(".descent-sprite"));
      var altLabelEl = document.getElementById("altLabel");
      if (!hero || !media || plates.length < 2 || typeof ScrollTrigger === "undefined" || !gsap.matchMedia) return;

      var n = plates.length;
      var seg = 1 / (n - 1);
      var video = null, videoReady = false;
      var clamp01 = function (v) { return v < 0 ? 0 : v > 1 ? 1 : v; };

      var setDescent = function (p) {
        for (var i = 0; i < n; i++) {
          plates[i].style.opacity = clamp01(1 - Math.abs(p - i * seg) / seg);
        }
        media.style.transform = "scale(" + (1 + 0.08 * p).toFixed(4) + ")";
        var ov = clamp01(1 - p / 0.18);
        if (overlay) {
          overlay.style.opacity = ov;
          overlay.style.transform = "translateY(" + (-40 * (1 - ov)).toFixed(1) + "px)";
          overlay.style.pointerEvents = ov < 0.05 ? "none" : "";
        }
        if (cue) cue.style.opacity = ov;
        var sp = clamp01((p - 0.5) / 0.3);
        sprites.forEach(function (s) { s.style.opacity = sp; });
        if (altLabelEl) {
          altLabelEl.textContent = Math.round(5897 + (250 - 5897) * p).toLocaleString("en-US") + " m";
        }
        if (videoReady && video && isFinite(video.duration)) {
          try { video.currentTime = p * video.duration; } catch (e) {}
        }
      };

      /* optional descent video: wired ONLY if the file is actually present (no console noise, no broken media) */
      if (window.fetch) {
        fetch("assets/video/descent.mp4", { method: "HEAD" }).then(function (r) {
          if (!r || !r.ok) return;
          video = document.createElement("video");
          video.className = "hero-video";
          video.muted = true; video.playsInline = true; video.setAttribute("playsinline", ""); video.preload = "auto";
          video.setAttribute("aria-hidden", "true");
          video.src = "assets/video/descent.mp4";
          video.addEventListener("loadedmetadata", function () { videoReady = true; media.classList.add("has-video"); });
          media.insertBefore(video, platesWrap ? platesWrap.nextSibling : null);
        }).catch(function () {});
      }

      /* gsap.matchMedia: creates the pin only at >=900px, tears down + resets on mobile (self-heals on resize) */
      var mm = gsap.matchMedia();
      mm.add("(min-width: 900px)", function () {
        var st = ScrollTrigger.create({
          trigger: hero,
          start: "top top",
          end: "+=180%",
          pin: true,
          scrub: 0.4,
          onUpdate: function (self) { setDescent(self.progress); },
          onRefresh: function (self) { setDescent(self.progress); }
        });
        setDescent(0);
        return function () {
          /* leaving desktop: reset every inline style so the static mobile hero is clean */
          plates.forEach(function (pl) { pl.style.opacity = ""; });
          media.style.transform = "";
          if (overlay) { overlay.style.opacity = ""; overlay.style.transform = ""; overlay.style.pointerEvents = ""; }
          if (cue) cue.style.opacity = "";
          sprites.forEach(function (s) { s.style.opacity = ""; });
        };
      });
    })();

    /* native scroll + anchor focus management (no scroll-hijack: must feel light) */
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      if (a.classList.contains("skip-link")) return;
      a.addEventListener("click", function () {
        var id = a.getAttribute("href");
        if (id.length > 1) {
          var el = document.querySelector(id);
          if (el) {
            el.tabIndex = -1;
            setTimeout(function () { el.focus({ preventScroll: true }); }, 350);
          }
        }
      });
    });

    /* Hero entrance + all body scroll-reveals DISABLED (18 Jul).
       Shreyas: the load-in "zap" / slide-in-from-the-side reading as broken
       loading is not wanted. Sections are just present. The pinned Sheldon
       hero (hero-parallax.js) owns the hero copy reveal itself. */

    /* parallax terrain (heavy: desktop only) */
    if (heavy) {
      gsap.utils.toArray(".parallax-bg").forEach(function (img) {
        gsap.to(img, {
          yPercent: -8, ease: "none",
          scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: 0.6 }
        });
      });

      /* extend the same gentle scrub to every scene backdrop (oversized so no edges show) */
      gsap.utils.toArray(".scene-plate img, .why-scene img, .blends-scene img, .basin-band img, .mist-edge img, .journal-scene img, .footer-bg").forEach(function (img) {
        if (img.classList.contains("parallax-bg") || !img.offsetParent) return;
        gsap.fromTo(img,
          { yPercent: 4, scale: 1.08 },
          {
            yPercent: -4, scale: 1.08, ease: "none",
            scrollTrigger: { trigger: img.closest("section, footer") || img.parentElement, start: "top bottom", end: "bottom top", scrub: 0.6 }
          });
      });

      /* corner floaters: subtle scroll drift, composes with their CSS sway (individual rotate) */
      gsap.utils.toArray(".floater").forEach(function (fl) {
        gsap.to(fl, {
          y: -14, ease: "none",
          scrollTrigger: { trigger: fl.parentElement, start: "top bottom", end: "bottom top", scrub: 0.8 }
        });
      });
    }

  };

  /* safety net: never leave anything invisible */
  var safetyNet = function () {
    setTimeout(function () {
      document.querySelectorAll('[style*="visibility: hidden"], [style*="opacity: 0"]').forEach(function (el) {
        if (el.closest(".quote-rotator")) return;
        /* the pinned Sheldon hero owns its own copy reveal (copy hidden at scroll-top,
           revealed at the end of the converge) — never force it visible here. */
        if (el.closest("#heroOverlay") || el.closest(".hero-intro") || el.closest(".scroll-cue")) return;
        el.style.opacity = "";
        el.style.visibility = "";
      });
    }, 4000);
  };

  /* ── micro-interactions: magnetic buttons + card tilt ── */
  var initMicro = function () {
    if (prefersReduced || window.innerWidth < 900) return;
    document.querySelectorAll(".btn").forEach(function (b) {
      b.addEventListener("mousemove", function (e) {
        var r = b.getBoundingClientRect();
        var dx = (e.clientX - r.left - r.width / 2) / r.width;
        var dy = (e.clientY - r.top - r.height / 2) / r.height;
        b.style.transform = "translate(" + dx * 6 + "px," + dy * 5 + "px)";
      });
      b.addEventListener("mouseleave", function () { b.style.transform = ""; });
    });
    document.querySelectorAll(".p-card").forEach(function (c) {
      c.addEventListener("mousemove", function (e) {
        var r = c.getBoundingClientRect();
        var rx = ((e.clientY - r.top) / r.height - 0.5) * -5;
        var ry = ((e.clientX - r.left) / r.width - 0.5) * 5;
        c.style.transform = "perspective(800px) rotateX(" + rx + "deg) rotateY(" + ry + "deg) translateY(-6px)";
      });
      c.addEventListener("mouseleave", function () { c.style.transform = ""; });
    });
  };

  /* motion + progress start at DOM ready (gsap is deferred, so it's parsed by now);
     load stays as a fallback for any readyState edge */
  var boot = function () { initProgress(); initMotion(); };
  if (document.readyState !== "loading") boot();
  else document.addEventListener("DOMContentLoaded", boot);
  if (document.readyState === "complete") { boot(); initMicro(); safetyNet(); }
  else window.addEventListener("load", function () { boot(); initMicro(); safetyNet(); });
})();
