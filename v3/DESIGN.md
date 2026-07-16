# KAWSAYPAC V3 · "THE DESCENT" — DESIGN.md (committed before code)

## 1. Named aesthetic
**Cinematic editorial expedition.** One continuous scroll = one descent from the Cotopaxi summit (5,897 m) down to the Amazon basin (250 m). Every section is an altitude zone. The narrative device IS the layout. Reference register: Aesop editorial restraint x National Geographic expedition x Awwwards SOTD scroll storytelling. Light, ivory-dominant, cinematic pacing with profound negative space. NOT the v1 journey-card language: v3 is full-bleed, typographic, scene-driven.

## 2. Tokens (brand-locked, inherited from the Kawsaypac system)
- Ivory base: #FAF8F3 (page), porcelain #FDFCF8 (cards), mist #F1EEE6 (alt bands)
- Forest ink: #1F3A2A (all display type), soft olive #958E59 (labels)
- Single accent: brand gold #C9A942 (rules, ticks, italics moments). NO purple. NO cyan.
- Deep scene scrim only inside full-bleed imagery, never a dark section background.
- Type: Fraunces (display, weights 400-600, italic accents) + Satoshi (body/labels). NEVER Inter/Roboto/Space Grotesk.
- Type scale: display clamp(3.4rem, 10.5vw, 11rem) / section clamp(2.2rem, 5vw, 4.4rem) / body 17-19px / labels 0.72rem caps 0.18em tracking.
- Radius: frames 28px, cards 20px, pills 999px. Shadows: 0 30px 80px rgba(31,58,42,0.16) max.
- Grid: 12-col fluid, max 1380px, gutters clamp(20px, 4vw, 64px). Asymmetry over centering: text blocks sit left-of-center or right-of-center, never everything centered.

## 3. Signature structure (in order, one page)
0. ENTRY: 900ms ivory curtain preloader, brand flower spins once, splits upward. Skippable, reduced-motion = instant.
1. SUMMIT HERO (5,897 m): full-bleed hero-cloud-sea scene + andes-hero.mp4 video layer, display headline "From the summit to your cup" split by word, words rise from the LEFT. Persistent ALTIMETER HUD (right rail): live altitude number scrubs 5897 -> 250 with scroll, gold tick, zone name swaps.
2. DESCENT MANIFESTO (4,100 m · Páramo): text-scroll-animation recipe: manifesto line fills word-by-word from 12% to 100% ink as you scroll through a pinned band over bg_paramo_band.
3. WHAT THE MOUNTAIN GROWS (3,400 m): sticky-scroll-reveal recipe: left column pins with 3 rotating pillars (Wildcrafted / Small batch / Direct partners), right column scrolls tall imagery (picking-herbs, jungle-herbs-2, brian-shaman).
4. THE BLEND TRAVERSE (2,600 m · Bosque Nublado): pinned horizontal gallery (containerAnimation, ease none): 7 blend cards slide as one traverse; each card = product photo, concern tag, price, "Explore" -> ../apothecary.html?concern=<slug>. Progress line under the traverse.
5. ZOOM THROUGH THE CANOPY (1,400 m): zoom-parallax recipe adapted: layered scenes (waterfall, cloudforest, basin) scale through the viewport on scrub.
6. THE PEOPLE (900 m · Selva Alta): editorial split: founders story pull-quote + Raisa/Brian imagery + 2 portrait testimonials (testimonial-02/03 webp) with names as placeholders; honest caption. Link -> ../our-story.html.
7. BASECAMP CTA (250 m · Amazonía): arrival moment: bg_amazon_basin full-bleed, altimeter lands on 250 m, "You have arrived" + two CTAs (Shop the apothecary -> ../apothecary.html, Visit Ecuador -> ../index.html#retreats). Footer: minimal single-band ivory footer, links to the main site pages.

## 4. Motion language
- Library: GSAP + ScrollTrigger (CDN, defer). NATIVE scroll only, no Lenis/smoothing (hard house rule).
- Reveals: gsap.from, immediateRender:false, once:true, start "top 82%", power3.out, 0.7-0.9s, stagger 0.08. Text enters from the LEFT (x:-56 headings, x:-24 labels, x:-36 ledes). Word-split via spans, aria-safe (aria-label on parent, spans aria-hidden).
- Scrubs: altimeter counter (whole-page scrub), manifesto ink fill, horizontal traverse, canopy zoom, scene parallax (yPercent max ±8, scale 1.08 headroom).
- Pins: manifesto band (+=140%), sticky pillars (until right column ends), traverse (+= traverse width), canopy zoom (+=180%). pinSpacing on. Create top-to-bottom; refreshPriority in page order.
- Micro: magnetic CTAs, gold underline grows from left on nav links, card hover lift + img scale 1.05, cursor is DEFAULT (no custom cursor, senior-friendly).
- Gates: everything visible with JS off (no opacity:0 in CSS). prefers-reduced-motion = no pins, no scrubs, simple fades. <900px = no pins/horizontal (traverse degrades to swipeable native-scroll row), light y-fades only.

## 5. Primitives
btn (primary forest pill / outline forest / glass on imagery, arrow nudge +4px on hover), label (caps olive w/ gold dot), display-h (split-word), scene-frame (28px radius full-bleed w/ scrim + parallax img), blend-card (portrait 3:4, tag pill, price row), altimeter (fixed right, number + zone + tick), progress-rule (1px gold scaleX), quote-block (Fraunces italic 2.6rem + 46px avatar). States: default/hover/focus-visible(2px gold outline offset 3)/active for all interactive; 44px+ targets.

## 6. Assets (all local, ../assets from v3/)
Scenes: gen/hero-cloud-sea.jpg + video/andes-hero.mp4, gen/bg_paramo_band.jpg, gen/bg_highlands.jpg, gen/bg_cloudforest_edge.jpg, gen/bg_waterfall.jpg, gen/bg_amazon_basin.jpg, gen/bg_footer_jungle.jpg. People: picking-herbs, jungle-herbs-2, brian-shaman, raisa-brian-2, raisa-masiposa, jungle-group. Products: blend-*.jpg (7). Portraits: testimonials/testimonial-02/03/04/07.webp. Sprites: sparingly, max 2 total on the whole page, corner-anchored, <=200px, behind content.

## 7. Anti-slop bans (auto-fail)
Inter/Roboto/Space Grotesk, purple/cyan anything, mesh gradients, floating glassy 3D blobs, stat-card grid as a section, centered-everything, dark-by-default, em dashes in copy, emoji icons (inline SVG only), broken/placeholder image slots, scroll-hijack smoothing, more than one marquee, fabricated review claims (testimonial names carry the placeholder caption).
