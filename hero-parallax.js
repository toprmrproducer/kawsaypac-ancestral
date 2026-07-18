/* Kawsaypac hero parallax — self-contained, no deps, no conflict with app.js.
   Layers start low and rise into a composed Cotopaxi scene on load, then drift
   at depth-scaled speeds as the hero scrolls out. Respects reduced-motion. */
(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var layers = Array.prototype.slice.call(document.querySelectorAll(".px-layer"));
  if (!layers.length) return;
  var hero = document.getElementById("top");

  function baseX(el) { return el.classList.contains("px-sky") ? "0" : "-50%"; }

  layers.forEach(function (el) {
    el.__depth = parseFloat(el.getAttribute("data-depth")) || 0.2;
    el.__rise = el.__depth * 72; // px it starts below rest
  });

  var scrollY = 0, ticking = false;

  function paint(introEase) {
    var h = hero ? hero.offsetHeight : window.innerHeight;
    var prog = Math.min(1, Math.max(0, scrollY / h));
    for (var i = 0; i < layers.length; i++) {
      var el = layers[i];
      var rise = introEase != null ? (1 - introEase) * el.__rise : 0;
      var par = reduce ? 0 : prog * el.__depth * 130;
      var y = rise - par;
      el.style.transform = "translate3d(" + baseX(el) + "," + y.toFixed(1) + "px,0)";
    }
  }

  function onScroll() {
    scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
    if (!ticking) { ticking = true; requestAnimationFrame(function () { paint(null); ticking = false; }); }
  }

  // entrance rise-in (converge), then hand off to scroll parallax
  if (reduce) {
    paint(1);
    window.addEventListener("scroll", onScroll, { passive: true });
  } else {
    var start = null, DUR = 1150;
    (function intro(now) {
      if (start === null) start = now;
      var t = Math.min(1, (now - start) / DUR);
      var e = 1 - Math.pow(1 - t, 3);
      paint(e);
      if (t < 1) requestAnimationFrame(intro);
      else { window.addEventListener("scroll", onScroll, { passive: true }); paint(null); }
    })(performance.now());
  }
  window.addEventListener("resize", function () { paint(null); }, { passive: true });
})();
