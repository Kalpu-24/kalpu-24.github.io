// Helpers shared by the home page and the game page.

export const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const ICONS = {
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  out: '<path d="M7 17 17 7M8 7h9v9"/>',
  back: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
  down: '<path d="M12 4v12M6 11l6 6 6-6M5 20h14"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
};
export const icon = (name) =>
  `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name]}</svg>`;

export const gameUrl = (game) => `game.html?g=${game.id}`;
export const img = (game, file) => `assets/games/${game.id}/${file}.webp`;

// The whole page takes on the colours and typeface of one game.
export function applyTheme(game) {
  const t = game.theme;
  const s = document.documentElement.style;
  s.setProperty("--bg", t.bg);
  s.setProperty("--surface", t.surface);
  s.setProperty("--ink", t.ink);
  s.setProperty("--muted", t.muted);
  s.setProperty("--accent", t.accent);
  s.setProperty("--on-accent", t.onAccent);
  s.setProperty("--font-game", `"${t.font}"`);
  s.setProperty("--game-scale", t.scale);
  s.colorScheme = t.light ? "light" : "dark";
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", t.bg);
}

export function remember(id) {
  try { sessionStorage.setItem("game", id); } catch {}
}
export function recall() {
  try { return sessionStorage.getItem("game"); } catch { return null; }
}

export function contactBlock(profile) {
  return `
    <h2 class="contact__lead">I'm open to new opportunities, or just a friendly chat.</h2>
    <a class="contact__mail" href="mailto:${esc(profile.email)}">${esc(profile.email)}</a>
    <ul class="contact__links">
      ${profile.links.map((l) => `<li><a class="btn" href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)} ${icon("out")}</a></li>`).join("")}
      <li><a class="btn" href="${esc(profile.resume)}" target="_blank" rel="noopener">Résumé ${icon("down")}</a></li>
    </ul>
    <p class="contact__copy">© ${new Date().getFullYear()} ${esc(profile.name)}</p>`;
}
