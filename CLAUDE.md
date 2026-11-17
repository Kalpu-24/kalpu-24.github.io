# Working rules for this repository

## Changing files

- Change files in this repository only with the Edit tool. Create a new file with the Write tool, and only when the owner has agreed to the new file.
- Never change repository files with Python, Node, `sed`, `awk`, `perl`, shell redirection (`>`, `>>`, heredocs) or any other script.
- Exception: generated pages may be written by running the site's own build scripts (`node build.mjs` and `node old/v2/build.mjs`). Make the change in the source with the Edit tool, then run the build.
- Moving or renaming files is done with `git mv`, which changes no contents; any content change that goes with a move is made with the Edit tool.
- Scripts are fine for throwaway work outside the repository, such as checks and screenshots in a scratch folder, as long as they do not write into the repository.

## How the site is built

- `src/content.mjs` holds every word and number. The main site (repo root) and the previous design in `old/v2/` are both generated from it. The rest of `old/` is the first site and is not generated.
- After editing content, run both `node build.mjs` and `node old/v2/build.mjs`, and commit the generated pages.
- The generated `.html` files are sometimes edited by hand. Before running a build, check that the generator produces those hand edits; if it doesn't, move them into `build.mjs` or `old/v2/build.mjs` first, so the build doesn't undo them.

## Git

- Work on a branch and open a pull request into `main`; don't push to `main` directly.
