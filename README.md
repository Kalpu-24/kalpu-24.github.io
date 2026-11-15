# kalpshah.dev

Kalp Shah's game-developer portfolio. The previous site is kept in `old/` (kalpshah.dev/old/).

Static pages, no dependencies.

- `src/content.mjs` holds every word and number on the site. Each figure has a `// source:` comment.
- `build.mjs` turns it into `index.html` and one page per project. After editing content, run `node build.mjs` in this folder and commit the result.
- `css/site.css` and `js/site.js` are the only stylesheet and script.
- Images live in `assets/games/<project id>/` (`1.webp`, `1-sm.webp`, …).

To add a project: add its images, add an entry to `projects` in `src/content.mjs`, run the build.
