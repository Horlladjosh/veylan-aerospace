# Veylan Aerospace

Fictional aerospace website concept for Triple Four Studio.

## Stack
Plain HTML, CSS and JavaScript. Five static pages. `build.py` generates the pages using Python and Pillow. Built files are committed in `dist`, so Vercel does not need Python or package installation.

## Deploy from GitHub to Vercel
Import this repository. Use Framework Preset Other, leave Root Directory at the repository root, set Build Command to empty and Output Directory to dist. The included vercel.json also declares the output directory.

The homepage uses a generated Sable still. NASA footage loads only through the research-film dialog. The flight viewer has separate playback and scrub controls. Aircraft details are interactive. Reduced motion is supported.

The enquiry form previews a brief locally and sends or saves nothing. Search indexing is enabled, with canonical URLs and a sitemap at /sitemap.xml. Vercel Web Analytics is included on every page. Credits are on the Information page.

The production origin is https://veylan-aerospace.vercel.app. If the domain changes, update origin in build.py and regenerate the pages to update canonical, sitemap and sharing URLs. CSS is inlined by the page generator to avoid a render-blocking stylesheet request. Fonts use WOFF2; the hero uses responsive AVIF with WebP fallback.
