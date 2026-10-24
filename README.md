# Mauro Bernasconi — Portfolio

Static portfolio built with plain HTML, CSS, and JavaScript. No build step or package installation is required.

## Run locally

For a local preview, open PowerShell in this folder and run `py -m http.server 8000`, then visit `http://localhost:8000`. This serves the site over HTTP, which YouTube needs for embedded videos. Opening `index.html` directly as a `file://` page can cause YouTube player error 153.

## Publish on GitHub Pages

In the repository settings, enable GitHub Pages for the branch and folder containing `index.html` (usually `main` and `/ (root)`). All local asset links are relative, so the site also works when published from a project subpath.

## Pages and content

- `index.html` is the main portfolio, including the professional experience, skills, and selected gameplay project placeholders.
- `unicorn-games.html` is the Unicorn Toys & Games case study. It embeds a video showing the company app and explains the level flow, Google Sheets/CSV workflow, and Unity integration work.
- `turi-ascends.html`, `animal-goons.html`, `holy-havoc.html`, `skelly-whack.html`, and `tele-fighter.html` are the linked project detail pages. Replace their clearly marked sample text and media area with verified project information when ready.
- The project templates include a media gallery at the bottom. Keep one `<figure class="gallery-slide">` per image or YouTube embed; the carousel arrows appear automatically when the gallery contains more than one item. Use an `<img src="./assets/your-image.webp" alt="Describe the image">` for a still image, or a YouTube `<iframe>` for a video.
- The case study avoids original project screenshots because the work is under NDA. Keep the company showcase video and NDA wording within the permissions that apply to the project.
- Add screenshots or gameplay clips only to projects where you have permission to show them. For images, use compressed WebP or AVIF files with descriptive `alt` text.
- The supplied CV is included at `assets/Mauro_Bernasconi_AI_Readable_CV.pdf` and linked from the contact section.
- The `data-en` and `data-es` attributes provide the English and Spanish versions of page copy. The header button switches languages and includes a small flag for the destination language.

Fonts use local system fallbacks, so there are no third-party runtime requests.
