/* ═══════════════════════════════════════════════════════════
   KAWSAYPAC · V3 "THE DESCENT" · motion layer
   GSAP + ScrollTrigger only. Native scroll. Everything readable
   with this file absent: JS adds motion, never content.
   ═══════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  var curtain = document.getElementById("curtain");

  function killCurtain() {
    if (curtain) curtain.classList.add("is-done");
  }

  /* If GSAP failed to load, drop the curtain and leave the page static. */
  if (!window.gsap || !window.ScrollTrigger) {
    killCurtain();
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var SUMMIT_ALT = 5897;
  var BASIN_ALT = 250;

  /* ── word splitting (aria-safe) ─────────────── */
  function splitWords(el) {
    if (!el) return [];
    var text = el.textContent.replace(/\s+/g, " ").trim();
    el.setAttribute("aria-label", text);
    el.textContent = "";
    var words = text.split(" ");
    var spans = [];
    for (var i = 0; i < words.length; i++) {
      var s = document.createElement("span");
      s.className = "w";
      s.setAttribute("aria-hidden", "true");
      s.textContent = words[i] + (i < words.length - 1 ? " " : "");
      el.appendChild(s);
      spans.push(s);
    }
    return spans;
  }

  var heroWords = splitWords(document.getElementById("heroH1"));
  var manifestoWords = splitWords(document.getElementById("manifestoLine"));
  var basecampWords = splitWords(document.querySelector(".basecamp .display-h"));

  /* ── altimeter ──────────────────────────────── */
  var altiVal = document.getElementById("altiVal");
  var altiZone = document.getElementById("altiZone");
  var altiDot = document.getElementById("altiDot");
  var RAIL_TRAVEL = 110; /* rail 120px minus dot 10px */

  function setAltitude(alt) {
    if (altiVal) altiVal.textContent = Math.round(alt).toLocaleString("en-US");
  }

  /* Zone label swaps fire in every mode (cheap text sets). */
  var zoneSections = document.querySelectorAll("[data-zone]");
  zoneSections.forEach(function (sec) {
    ScrollTrigger.create({
      trigger: sec,
      start: "top 55%",
      end: "bottom 55%",
      onToggle: function (self) {
        if (!self.isActive) return;
        if (altiZone) altiZone.textContent = sec.getAttribute("data-zone");
        if (reduceMotion) {
          setAltitude(parseInt(sec.getAttribute("data-altitude"), 10) || BASIN_ALT);
        }
      }
    });
  });

  /* ── hero intro (after curtain) ─────────────── */
  function heroIntro(light) {
    var summitBits = [
      document.querySelector(".summit .label"),
      document.querySelector(".summit .lede"),
      document.querySelector(".summit .hero-ctas")
    ];
    if (reduceMotion) return;
    var tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    if (light) {
      tl.from(heroWords, { y: 14, autoAlpha: 0, duration: 0.6, stagger: 0.05, immediateRender: false }, 0)
        .from(summitBits, { y: 14, autoAlpha: 0, duration: 0.6, stagger: 0.08, immediateRender: false }, 0.15);
    } else {
      tl.from(summitBits[0], { x: -24, autoAlpha: 0, duration: 0.7, immediateRender: false }, 0)
        .from(heroWords, { x: -56, autoAlpha: 0, duration: 0.9, stagger: 0.08, immediateRender: false }, 0.1)
        .from(summitBits[1], { x: -36, autoAlpha: 0, duration: 0.8, immediateRender: false }, 0.5)
        .from(summitBits[2], { y: 24, autoAlpha: 0, duration: 0.7, immediateRender: false }, 0.7)
        .from(".scroll-cue", { autoAlpha: 0, duration: 0.6, immediateRender: false }, 0.9);
    }
  }

  /* ── entry curtain (900ms, skippable) ───────── */
  var curtainDone = false;
  function finishCurtain(light) {
    if (curtainDone) return;
    curtainDone = true;
    killCurtain();
    ScrollTrigger.refresh();
    heroIntro(light);
  }

  function runCurtain(light) {
    if (!curtain || reduceMotion) {
      finishCurtain(light);
      return;
    }
    var tl = gsap.timeline({ onComplete: function () { finishCurtain(light); } });
    tl.to(".curtain-flower", { rotation: 360, duration: 0.55, ease: "power2.inOut" }, 0)
      .to(".curtain-core", { yPercent: -40, autoAlpha: 0, duration: 0.3, ease: "power2.in" }, 0.45)
      .to(".curtain-a", { yPercent: -101, duration: 0.42, ease: "power3.inOut" }, 0.52)
      .to(".curtain-b", { yPercent: -101, duration: 0.42, ease: "power3.inOut" }, 0.58);
    function skip() { tl.progress(1); }
    curtain.addEventListener("click", skip, { once: true });
    document.addEventListener("keydown", skip, { once: true });
  }

  /* ── reveal primitive ───────────────────────── */
  var REVEAL_VECTORS = {
    label: { x: -24 },
    head: { x: -56 },
    lede: { x: -36 },
    body: { y: 24 },
    block: { y: 24 }
  };

  function buildReveals(light) {
    var els = Array.prototype.filter.call(
      document.querySelectorAll("[data-reveal]"),
      function (el) { return !el.closest(".summit"); }
    );
    els.forEach(function (el) {
      var kind = el.getAttribute("data-reveal") || "body";
      var vec = light ? { y: 14 } : (REVEAL_VECTORS[kind] || { y: 24 });
      gsap.from(el, {
        x: vec.x || 0,
        y: vec.y || 0,
        autoAlpha: 0,
        duration: light ? 0.6 : 0.8,
        ease: "power3.out",
        immediateRender: false,
        scrollTrigger: { trigger: el, start: "top 82%", once: true }
      });
    });
  }

  /* ── pillars active state (all widths) ──────── */
  var pillars = document.querySelectorAll(".pillar");
  document.querySelectorAll(".pillar-fig").forEach(function (fig) {
    ScrollTrigger.create({
      trigger: fig,
      start: "top 60%",
      end: "bottom 40%",
      onToggle: function (self) {
        if (!self.isActive) return;
        var idx = fig.getAttribute("data-fig");
        pillars.forEach(function (p) {
          p.classList.toggle("is-active", p.getAttribute("data-pillar") === idx);
        });
      }
    });
  });

  /* ── responsive motion contexts ─────────────── */
  var mm = gsap.matchMedia();

  /* Desktop, motion allowed: the full descent. */
  mm.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", function () {

    /* 1 · hero scene parallax (created first, top of page) */
    gsap.to([".summit-img", ".summit-video"], {
      yPercent: 8,
      ease: "none",
      scrollTrigger: { trigger: ".summit", start: "top top", end: "bottom top", scrub: 0.6 }
    });

    /* whole-page altimeter scrub */
    ScrollTrigger.create({
      trigger: "#main",
      start: "top top",
      end: "bottom bottom",
      onUpdate: function (self) {
        setAltitude(SUMMIT_ALT - (SUMMIT_ALT - BASIN_ALT) * self.progress);
        if (altiDot) gsap.set(altiDot, { y: RAIL_TRAVEL * self.progress });
      }
    });

    /* 2 · manifesto ink fill, pinned band */
    gsap.set(manifestoWords, { opacity: 0.12 });
    gsap.to(manifestoWords, {
      opacity: 1,
      stagger: 0.06,
      ease: "none",
      scrollTrigger: {
        trigger: ".manifesto-band",
        start: "top top",
        end: "+=140%",
        pin: true,
        scrub: 0.6,
        invalidateOnRefresh: true
      }
    });
    gsap.to(".manifesto-bg img", {
      yPercent: 6,
      ease: "none",
      scrollTrigger: { trigger: ".manifesto-band", start: "top bottom", end: "bottom top", scrub: 0.8 }
    });

    /* 4 · blend traverse: pinned wrapper, inner tween ease none */
    var track = document.getElementById("traverseTrack");
    var tpFill = document.getElementById("tpFill");
    document.body.classList.add("js-traverse");
    var getDist = function () { return Math.max(0, track.scrollWidth - window.innerWidth); };
    gsap.to(track, {
      x: function () { return -getDist(); },
      ease: "none",
      scrollTrigger: {
        trigger: ".traverse",
        start: "top top",
        end: function () { return "+=" + getDist(); },
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: function (self) {
          if (tpFill) gsap.set(tpFill, { scaleX: self.progress });
        }
      }
    });

    /* 5 · canopy zoom (zoom-parallax translation) */
    gsap.timeline({
      scrollTrigger: {
        trigger: ".canopy",
        start: "top top",
        end: "+=180%",
        pin: true,
        scrub: 0.8,
        invalidateOnRefresh: true
      }
    })
      .to(".cz-waterfall", { scale: 3.6, ease: "none" }, 0)
      .to(".cz-cloudforest", { scale: 5, xPercent: -70, yPercent: -46, ease: "none" }, 0)
      .to(".cz-basin", { scale: 5.6, xPercent: 72, yPercent: 52, ease: "none" }, 0)
      .from(".canopy-caption", { autoAlpha: 0, y: 24, duration: 0.16, immediateRender: false }, 0.72);

    /* 7 · basecamp scene + headline */
    gsap.to(".basecamp-img", {
      yPercent: -6,
      ease: "none",
      scrollTrigger: { trigger: ".basecamp", start: "top bottom", end: "bottom top", scrub: 0.8 }
    });
    gsap.from(basecampWords, {
      x: -56,
      autoAlpha: 0,
      duration: 0.9,
      stagger: 0.08,
      ease: "power3.out",
      immediateRender: false,
      scrollTrigger: { trigger: ".basecamp", start: "top 70%", once: true }
    });

    /* generic left-hand reveals */
    buildReveals(false);

    /* magnetic CTAs */
    var magnets = document.querySelectorAll(".btn-magnetic");
    var magHandlers = [];
    magnets.forEach(function (btn) {
      var move = function (e) {
        var r = btn.getBoundingClientRect();
        gsap.to(btn, {
          x: (e.clientX - r.left - r.width / 2) * 0.18,
          y: (e.clientY - r.top - r.height / 2) * 0.18,
          duration: 0.3,
          ease: "power2.out"
        });
      };
      var leave = function () { gsap.to(btn, { x: 0, y: 0, duration: 0.45, ease: "power3.out" }); };
      btn.addEventListener("mousemove", move);
      btn.addEventListener("mouseleave", leave);
      magHandlers.push([btn, move, leave]);
    });

    return function () {
      document.body.classList.remove("js-traverse");
      gsap.set(manifestoWords, { clearProps: "opacity" });
      magHandlers.forEach(function (h) {
        h[0].removeEventListener("mousemove", h[1]);
        h[0].removeEventListener("mouseleave", h[2]);
        gsap.set(h[0], { clearProps: "transform" });
      });
    };
  });

  /* Small screens, motion allowed: light y-fades only, no pins. */
  mm.add("(max-width: 899px) and (prefers-reduced-motion: no-preference)", function () {
    buildReveals(true);
  });

  /* Reduced motion (any width): nothing animates; content is already
     fully visible in CSS. Zone/number handled by the toggles above. */

  runCurtain(window.matchMedia("(max-width: 899px)").matches);

  /* Recalculate every measurement once all imagery has loaded. */
  window.addEventListener("load", function () {
    ScrollTrigger.refresh();
  });
})();
