# New portfolio site (preview at /new/)

Static pages, no dependencies.

- `src/content.mjs` holds every word and number on the site. Each figure has a `// source:` comment.
- `build.mjs` turns it into `index.html` and one page per project. After editing content, run `node build.mjs` in this folder and commit the result.
- `css/site.css` and `js/site.js` are the only stylesheet and script.
- Images live in `assets/games/<project id>/` (`1.webp`, `1-sm.webp`, …).

To add a project: add its images, add an entry to `projects` in `src/content.mjs`, run the build.

To make this the main site: copy this folder's contents to the repository root, then set `site.url` to `https://kalpshah.dev/` and `site.noindex` to `false` in `src/content.mjs` and rebuild.
