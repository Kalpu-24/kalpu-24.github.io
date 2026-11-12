// Helpers shared by the home page and the game page.

export const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const ICONS = {
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  out: '<path d="M7 17 17 7M8 7h9v9"/>',
  back: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
  down: '<path d="M12 4v12M6 11l6 6 6-6M5 20h14"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  trophy: '<path d="M8 21h8M12 16v5M7 4h10v5a5 5 0 0 1-10 0zM17 5.5h3V7a3 3 0 0 1-3 3M7 5.5H4V7a3 3 0 0 0 3 3"/>',
  star: '<path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.1 5.9-.8z"/>',
  heart: '<path d="M12 20s-7.5-4.6-7.5-10.2A4.1 4.1 0 0 1 12 7.4a4.1 4.1 0 0 1 7.5 2.4C19.5 15.4 12 20 12 20z"/>',
  code: '<path d="M8 8l-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  list: '<path d="M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01"/>',
  user: '<circle cx="12" cy="8" r="3.5"/><path d="M5 20a7 7 0 0 1 14 0"/>',
  branch: '<circle cx="6" cy="5" r="2"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="8" r="2"/><path d="M6 7v10M18 10c0 3.5-3 4.5-6 4.5H6"/>',
  mail: '<rect x="3.5" y="5.5" width="17" height="13" rx="2"/><path d="M4.5 7.5l7.5 5.5 7.5-5.5"/>',
  flag: '<path d="M6 21V4M6 5h11l-2.5 3.5L17 12H6"/>',
  play: '<path d="M8 5.5v13l10-6.5z"/>',
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
  // Outlines and hard shadows: dark ink on light themes, light outline + black shadow on dark ones.
  s.setProperty("--edge", t.ink);
  s.setProperty("--shadow", t.light ? t.ink : "#000");
  s.setProperty("--base", t.light ? t.ink : "#000");
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
    </ul>`;
}
