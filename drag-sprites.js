/* Kawsaypac — playful draggable botanical sprites.
   Every decorative leaf/sprite becomes grab-and-fling: pick it up with the mouse
   (or finger), drag it anywhere, release and it settles with a soft spring wobble.
   Progressive enhancement: without JS the sprites are just decoration. */
(function () {
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var SEL = ".sec-leaf, .apo-fl, .phil-sprite, .foot-sprite, .foot-butterfly, .ds-orchid, .ds-fern, .st-floater, .floater";
  var sprites = Array.prototype.slice.call(document.querySelectorAll(SEL));
  if (!sprites.length) return;

  sprites.forEach(function (el) {
    // remember the sprite's authored rotation so drag-translate composes with it
    var cs = window.getComputedStyle(el);
    var baseRot = 0;
    var tf = el.style.transform || cs.transform;
    var m = /rotate\(([-0-9.]+)deg\)/.exec(el.style.transform || "");
    if (m) baseRot = parseFloat(m[1]);
    el.__rot = baseRot; el.__dx = 0; el.__dy = 0;
    el.style.pointerEvents = "auto";
    el.style.cursor = "grab";
    el.style.touchAction = "none";
    el.style.zIndex = el.style.zIndex || "5";
    el.setAttribute("draggable", "false");
    apply(el, false);
  });

  function apply(el, grabbing) {
    var wob = grabbing ? " rotate(" + (el.__rot + (el.__dx % 14) * 0.4) + "deg) scale(1.08)"
                       : " rotate(" + el.__rot + "deg)";
    el.style.transform = "translate(" + el.__dx + "px," + el.__dy + "px)" + wob;
  }

  var active = null, sx = 0, sy = 0, odx = 0, ody = 0, moved = false;

  function down(e) {
    var el = e.currentTarget;
    active = el; moved = false;
    var p = point(e); sx = p.x; sy = p.y; odx = el.__dx; ody = el.__dy;
    el.style.cursor = "grabbing";
    el.style.transition = "none";
    el.style.zIndex = "60";
    el.style.filter = (window.getComputedStyle(el).filter === "none" ? "" : window.getComputedStyle(el).filter) + " drop-shadow(0 18px 26px rgba(16,26,20,.28))";
    try { el.setPointerCapture(e.pointerId); } catch (x) {}
    e.preventDefault();
  }
  function move(e) {
    if (!active) return;
    var p = point(e);
    active.__dx = odx + (p.x - sx);
    active.__dy = ody + (p.y - sy);
    if (Math.abs(p.x - sx) + Math.abs(p.y - sy) > 3) moved = true;
    apply(active, true);
  }
  function up() {
    if (!active) return;
    var el = active; active = null;
    el.style.cursor = "grab";
    // soft spring settle (keeps it where dropped, just eases the scale/wobble out)
    el.style.transition = "transform .5s cubic-bezier(.34,1.56,.64,1)";
    apply(el, false);
    window.setTimeout(function () { if (el) el.style.transition = ""; }, 520);
  }
  function point(e) { return { x: e.clientX, y: e.clientY }; }

  sprites.forEach(function (el) {
    el.addEventListener("pointerdown", down);
  });
  window.addEventListener("pointermove", move, { passive: false });
  window.addEventListener("pointerup", up);
  window.addEventListener("pointercancel", up);
})();
