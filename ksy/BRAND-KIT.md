# KAWSAYPAC REBRAND KIT — for Shroomsy template transformation

## THE PRIME DIRECTIVE
You are rebranding ONE page of a Webflow ecommerce template (Shroomsy, a mushroom brand) into
KAWSAYPAC, a premium Ecuadorian herbal tea brand. The Webflow interaction engine binds animations
to the DOM via `data-w-id` attributes, element order, and class names. Therefore:

- NEVER remove or rename classes, ids, or any `data-w-id` / `data-wf-*` attributes.
- NEVER restructure, reorder, add or delete elements that have `data-w-id` (text/img swaps only).
- You MAY delete these standalone junk blocks entirely: the wCopilot promo popup, any
  "Buy this Template" / "Made in Webflow" badge links, template-author credits.
- Keep every `<script>` tag exactly as is.
- ALL Shroomsy/mushroom references must be gone from user-visible text, alt text, titles, metas.

## BRAND
- Name: KAWSAYPAC (sub-brand line: "Ancestral Herbs"). Parent company: The Electric Eats.
- What it sells: small-batch wildcrafted Ecuadorian herbal teas and blends from the Andes and
  Amazon, sourced directly with Indigenous communities. Plus in-person Ecuador retreats.
- Founders: Raisa and Brian.
- Voice: quietly confident, reverent, editorial. NO em dashes anywhere. No "Tutorial"-style hype.
- Money in USD.
- Palette (use for any inline color overrides ONLY if the template color is overtly mushroom-red):
  Forest #1F3A2A, Olive #958E59, Gold #C9A942, Cream #FAF9F6, Charcoal #2A2A26. NO purple.
- Logo: use `assets/kp/kawsaypac-primary.svg` (round flower-of-life mark) for square logo slots and
  `assets/kp/kawsaypac-wordmark.svg` for wide slots. Favicon: keep template favicon path but point
  both favicon links to `assets/kp/kawsaypac-mark.svg`.

## NAV (same on every page)
Logo → index.html. Links: Home (index.html), About (about.html), Events (events.html),
Shop (shop.html), Blog (blog.html), FAQ (faq.html). Keep the Contact Us button (link: mailto or #).
Remove/repurpose "Demos" and "All Pages" dropdown menus: if they carry data-w-id interactions,
keep the structure but relabel to real destinations above and delete extra dead links inside
(links may be edited freely; do not delete animated wrapper divs).
Cart icon/element: KEEP untouched (future headless Shopify).

## IMAGE SWAP MAP (local files, all in assets/kp/)
Use by ROLE. Any mushroom/forest/fungi image gets replaced by a Kawsaypac image of matching role:
- Hero video slot: source assets/kp/waterfall.mp4 (real Ecuador footage). Poster: assets/kp/hero-cloud-sea.jpg
- Big landscape/atmosphere: hero-cloud-sea.jpg, c_collections.jpg, c_whyus.jpg, c_blends.jpg,
  c_apothecary.jpg, c_journal.jpg, bg_waterfall.jpg, bg_footer_jungle.jpg, bg_cloudforest_edge.jpg,
  bg_amazon_basin.jpg, bg_paramo_band.jpg, banos.jpg, waterfall.jpg, jungle.jpg, amazon-river.jpg
- Product shots (pouches/herbs): blend-*.jpg, leaf-*.jpg, jungle-herbs-2/3.jpg, herbal-infusion.jpg
- People/founders: raisa-brian.jpg, raisa-masiposa.jpg, brian-rapeh.jpg, brian-shaman.jpg,
  raisa-cotopaxi.jpg, kichwa-kids.jpg, jungle-group.jpg, picking-herbs.jpg
- Ingredient bowls: bowl_sleep.jpg, bowl_digestive.jpg, bowl_womens.jpg, bowl_immune.jpg,
  bowl_energy.jpg, bowl_detox.jpg
- Botanical plates (editorial/blog art): apoth_cats_claw.jpg, apoth_passionflower.jpg,
  apoth_cinchona.jpg, apoth_guayusa.jpg
- Floating botanicals (transparent PNG): fg_leaf_monstera.png, fg_leaf_fern.png, fg_orchid.png
Keep template texture/decoration images (paper grain, blobs, arrows, icons) that are not
mushroom-specific. If an image slot is srcset-heavy, set src AND srcset to the same local file.

## PRODUCTS (real catalog, use on shop + any product cards)
River of Life $34.00 (Blood + circulatory daily foundation) → blend-river-of-life.jpg
Scales of Balance $28.50 (Calm for the nervous system) → blend-scales-of-balance-2.jpg
Sacred Sacral $28.50 (Womb health, cycle rhythm) → blend-sacred-sacral.jpg
Zapped In $34.00 (Clean energy, sharp focus) → blend-zapped-in-2.jpg
Bowel Balance $28.50 (Daily digestive comfort) → blend-bowel-balance.jpg
Bowel Banisher $34.00 (Deep digestive support) → blend-bowel-banisher.jpg
Final Flush $28.50 (A supported gentle reset) → blend-final-flush.jpg
One Way Out $28.50 (Lymphatic system) → blend-one-way-out.jpg
Restoring Order $28.50 (Nervous system calm) → blend-restoring-order.jpg
Her Fertile Waters KIT $83.00 → blend-her-fertile-waters-new.jpg
His Fertile Fires KIT $85.00 → blend-his-fertile-fires.jpg
Eliminate & Regenerate KIT $113.00 (Best value) → blend-eliminate-regenerate.jpg
Single herbs $22.50: Cat's Claw (leaf-cats-claw.jpg), Guayusa (leaf-guayusa-2.jpg),
Soursop (leaf-soursop.jpg), Valerian Root (leaf-valerian.jpg), Matico (leaf-matico.jpg),
Chuchuhuasi $33.00 (leaf-chuchuhuasi.jpg)

## COPY BANK (use verbatim or adapt lightly; never invent medical claims)
- Hero H1: "Wildcrafted herbal remedies"  ·  alt: "Medicine that grew wild"
- Hero sub: "Small-batch teas and blends from the Andes and Amazon, for sleep, digestion,
  hormones, immunity and energy."
- Stars line: "★★★★★ Loved by 1,000+ customers across the Americas"
- Manifesto: "Kawsaypac means 'for life.' Every pouch begins in the wild, with the healers who
  know these plants best, and ends in your daily ritual."
- Pull quote: "The land teaches. The plants heal. We are only here to listen."
- Why us (6): Ecuador Sourced / Small Batch / Wild-Crafted / Research Informed /
  Educational Approach / Ethical Stewardship (one-liners may be short)
- About: "We are Raisa and Brian. What started as a move to Ecuador became a calling: the plants
  that have kept families here well for generations deserve to be honored, not forgotten. We work
  directly with Indigenous harvesters in the Andes and the Amazon, pay fairly, and take only what
  the land can give."
- Retreats/Events: "Step away. Reconnect. Return renewed." + "Immersive plant-wisdom retreats and
  tea ceremonies in the Andes and the Amazon, guided by the people who live it."
- Testimonials (placeholders, keep names): Maria S. Quito / David L. Austin / Ana P. Vancouver
- Footer parent line: "THE ELECTRIC EATS · Rooted in Ecuador. Guided by Nature. Created for
  Transformation." + FDA disclaimer: "These statements have not been evaluated by the FDA. This
  product is not intended to diagnose, treat, cure or prevent any disease."
- Events page event ideas: "Cacao & Tea Ceremony", "Amazon Plant Walk", "Andes Highland Retreat",
  "Herbal Preparation Workshop" (dates: keep template date structures, set 2026 dates)
- Blog post titles: "How to Prepare Guayusa the Kichwa Way", "Cat's Claw: The Amazon's Immune
  Guardian", "Why Wildcrafted Beats Farmed", "A Morning Ritual from the Cloud Forest",
  "What Your Digestion Is Telling You", "Inside Our Partnership with Kichwa Harvesters"
- FAQ themes: shipping (free US over $75), 30-day happiness guarantee, how to brew (decoction vs
  infusion), sourcing ethics, subscriptions (Subscribe & Save 15%), retreat booking.

## SEO PER PAGE
Title pattern: "<Page> | Kawsaypac Ancestral Herbs". Meta description mentions wildcrafted
Ecuadorian herbal teas. OG title/desc same. No "Webflow", no "template", no "Shroomsy" anywhere.
