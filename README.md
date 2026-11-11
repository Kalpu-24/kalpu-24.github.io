# kalpshah.dev

Portfolio of Kalp Shah, game developer. Live at [kalpshah.dev](https://kalpshah.dev).

Plain HTML, CSS and JavaScript modules. No build step; GitHub Pages serves the repository as it is.

## Layout

| Path | What it is |
| --- | --- |
| `index.html` | Home page: the game shelf, high scores, about, contact |
| `game.html?g=<id>` | One page per game, rendered from the data file |
| `data/games.js` | All game content, colours and fonts. The only file to edit for content changes |
| `assets/games/<id>/` | Web-sized images (WebP) used by the site |
| `public/` | Original artwork, résumé, favicon |
| `pages/projectdetails.html` | Forwards old project links to `game.html` |

## Adding or updating a game

1. Put images in `assets/games/<id>/`: `key.webp` (key art), `prop.webp` (transparent cut-out),
   and screenshots as `1.webp`, `2.webp`, … each with a smaller `1-sm.webp` thumbnail (about 720px wide).
2. Add or edit the entry in `data/games.js`. Metrics, reviews and the home page scoreboard are all in that file.
   `cover`, `back` and `stickers` set what the shelf shows; `loop` draws the "How it plays" graph on the game page.

## Running locally

```
python3 -m http.server
```

Then open http://localhost:8000. The site uses JavaScript modules, so it needs a server rather than opening the file directly.
