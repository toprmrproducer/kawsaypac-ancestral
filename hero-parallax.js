/* Kawsaypac hero — SHELDON CHALET pinned converge.
   Desktop: the hero PINS; at scroll-top you see mostly sky + the peak tips;
   as you scroll the layers RISE and converge into the full Cotopaxi scene;
   the headline + copy appear ONLY at the end of the pin. Then the page releases.
   Mobile / reduced-motion / no-GSAP: static composed scene with copy visible. */
(function () {
  var hero = document.getElementById("top");
  if (!hero) return;
  var layers = Array.prototype.slice.call(hero.querySelectorAll(".px-layer"));
  if (!layers.length) return;
  var copy = [".hero-stars", ".hero-h1", ".hero-lede", ".hero-cta", ".trust-bar"]
    .map(function (s) { return hero.querySelector(s); }).filter(Boolean);
  var cue = document.getElementById("scrollCue");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  layers.forEach(function (el) { el.__d = parseFloat(el.getAttribute("data-depth")) || 0.2; });
  // start offset (% of own height, pushed DOWN). sky never moves.
  function startY(el) { return el.classList.contains("px-sky") ? 0 : (56 + el.__d * 74); }

  function staticShow() {
    layers.forEach(function (el) { el.style.transform = el.classList.contains("px-sky") ? "" : "translateX(-50%)"; });
    copy.forEach(function (el) { el.style.opacity = "1"; el.style.visibility = "visible"; });
  }

  function build() {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined" || !gsap.matchMedia || reduce) {
      return staticShow();
    }
    gsap.registerPlugin(ScrollTrigger);
    var mm = gsap.matchMedia();

    /* DESKTOP: pinned Sheldon converge */
    mm.add("(min-width: 900px)", function () {
      gsap.set(layers, { xPercent: function (i, el) { return el.classList.contains("px-sky") ? 0 : -50; } });
      layers.forEach(function (el) { gsap.set(el, { yPercent: startY(el) }); });
      gsap.set(copy, { autoAlpha: 0, y: 28 });
      gsap.set(cue, { autoAlpha: 1 });

      var tl = gsap.timeline({
        scrollTrigger: {
          trigger: hero, start: "top top", end: "+=190%",
          scrub: 0.7, pin: true, anticipatePin: 1,
          // copy + cue driven directly off progress => text ONLY at the very end
          onUpdate: function (self) {
            var p = self.progress;
            gsap.set(cue, { autoAlpha: p < 0.06 ? 1 : 0 });
            var t = Math.min(1, Math.max(0, (p - 0.78) / 0.18)); // reveal 0.78 -> 0.96
            var e = t * t * (3 - 2 * t); // smoothstep
            gsap.set(copy, { autoAlpha: e, y: (1 - e) * 26 });
          }
        }
      });
      layers.forEach(function (el) {
        tl.fromTo(el, { yPercent: startY(el) }, { yPercent: 0, ease: "none", duration: 1 }, 0);
      });

      return function () {
        gsap.set(layers, { clearProps: "transform" });
        gsap.set(copy, { clearProps: "opacity,visibility,transform" });
        gsap.set(cue, { clearProps: "opacity,visibility" });
      };
    });

    /* MOBILE: static composed hero, copy visible */
    mm.add("(max-width: 899px)", function () {
      layers.forEach(function (el) { el.style.transform = el.classList.contains("px-sky") ? "" : "translateX(-50%)"; });
      copy.forEach(function (el) { el.style.opacity = "1"; el.style.visibility = "visible"; });
    });
  }

  if (document.readyState !== "loading") build();
  else document.addEventListener("DOMContentLoaded", build);
})();
