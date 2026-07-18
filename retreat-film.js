/* Retreats film — ambient YouTube preview that autoplays (muted) when the section
   scrolls into view, and pauses when it leaves. The play button still opens the
   full, unmuted lightbox (handled in app.js). */
(function () {
  var el = document.getElementById("retreatFilm");
  if (!el) return;
  var id = el.getAttribute("data-yt");
  var embed = el.querySelector(".rf-embed");
  if (!id || id === "RETREAT_FILM_ID" || !embed) return;          // no real film yet -> poster fallback
  if (!("IntersectionObserver" in window)) return;

  function mount() {
    if (embed.querySelector("iframe")) return;
    var f = document.createElement("iframe");
    f.src = "https://www.youtube-nocookie.com/embed/" + id +
      "?autoplay=1&mute=1&loop=1&playlist=" + id +
      "&controls=0&rel=0&playsinline=1&modestbranding=1&disablekb=1";
    f.allow = "autoplay; encrypted-media; picture-in-picture";
    f.setAttribute("title", "Kawsaypac retreats film");
    f.setAttribute("tabindex", "-1");
    embed.appendChild(f);
    el.classList.add("rf-playing");
  }
  function unmount() { embed.innerHTML = ""; el.classList.remove("rf-playing"); }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) mount(); else unmount(); });
  }, { threshold: 0.45 });
  io.observe(el);
})();
