# Veylan Aerospace

Fictional aerospace website concept for Triple Four Studio.

## Stack
Plain HTML, CSS and JavaScript. Five static pages. `build.py` generates the pages using Python and Pillow. Built files are committed in `dist`, so Vercel does not need Python or package installation.

## Deploy from GitHub to Vercel
Import this repository. Use Framework Preset Other, leave Root Directory at the repository root, set Build Command to empty and Output Directory to dist. The included vercel.json also declares the output directory.

The homepage uses a generated Sable still. NASA footage loads only through the research-film dialog. The flight viewer has separate playback and scrub controls. Aircraft details are interactive. Reduced motion is supported.

The enquiry form previews a brief locally and sends or saves nothing. Search indexing is disabled. Credits are on the Information page.

Before the final Vercel launch, update the origin in build.py to the assigned deployment URL, then regenerate the pages. This updates Open Graph URLs and image URLs.
