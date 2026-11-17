# kalpshah.dev

Kalp Shah's game-developer portfolio. Static pages, no dependencies.

- `src/content.mjs` holds every word and number on the site. Each figure has a `// source:` comment.
- `build.mjs` turns it into `index.html` and one page per project. After editing content, run `node build.mjs` and `node v2/build.mjs` in this folder and commit the result.
- `css/site.css` and `js/site.js` are the only stylesheet and script.
- Images live in `assets/games/<project id>/` (`1.webp`, `1-sm.webp`, …); the résumé, icons and fonts in `public/`.

To add a project: add its images, add an entry to `projects` in `src/content.mjs`, run the builds.

## Earlier versions

- `v2/` (kalpshah.dev/v2/): the previous design. It has its own `v2/build.mjs`, `v2/css/` and `v2/js/`, reads the same `src/content.mjs`, and shares `assets/` and `public/`. Its pages are marked `noindex`.
- `old/` (kalpshah.dev/old/): the first site, kept as it was.
