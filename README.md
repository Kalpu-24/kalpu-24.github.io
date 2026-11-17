# kalpshah.dev

Kalp Shah's game-developer portfolio. Static pages, no dependencies.

- `src/content.mjs` holds every word and number on the site. Each figure has a `// source:` comment.
- `build.mjs` turns it into `index.html` and one page per project. After editing content, run `node build.mjs` and `node old/v2/build.mjs` in this folder and commit the result.
- `css/site.css` and `js/site.js` are the only stylesheet and script.
- Images live in `assets/games/<project id>/` (`1.webp`, `1-sm.webp`, …); the résumé, icons and fonts in `public/`.

To add a project: add its images, add an entry to `projects` in `src/content.mjs`, run the builds.

## Earlier versions

- `old/` (kalpshah.dev/old/): the first site, kept as it was.
- `old/v2/` (kalpshah.dev/old/v2/): the previous design. It has its own `old/v2/build.mjs`, `old/v2/css/` and `old/v2/js/`, reads the same `src/content.mjs`, and shares `assets/` and `public/`. Its pages are marked `noindex`.
