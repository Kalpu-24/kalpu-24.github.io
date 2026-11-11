import { games, profile, scoreboard } from "../data/games.js";
import { applyTheme, contactBlock, esc, gameUrl, icon, img, recall, remember } from "./shared.js";

const copy = document.getElementById("stage-copy");
const art = document.getElementById("stage-art");
const select = document.getElementById("stage-select");
const num = (i) => String(i + 1).padStart(2, "0");
const stageShot = (g) => (g.stage.shot === "key" ? "key" : g.stage.shot);

// Art: every game gets a stacked slide (screenshot + cut-out prop) that cross-fades.
art.innerHTML =
  `<div class="art__frame">${games
    .map((g, i) => `<img class="art__shot${g.stage.fit === "contain" ? " is-contain" : ""}" data-i="${i}" data-src="${img(g, stageShot(g))}" alt="" />`)
    .join("")}</div>` +
  games
    .map((g, i) => {
      const pos = Object.entries(g.stage.prop).map(([k, v]) => `${k}:${v}`).join(";");
      return `<img class="art__prop" data-i="${i}" data-src="${img(g, "prop")}" style="${pos}" alt="" />`;
    })
    .join("");

select.innerHTML = games
  .map(
    (g, i) => `
    <button class="tile" role="tab" id="tab-${g.id}" aria-controls="stage-panel" aria-selected="false" tabindex="-1" data-i="${i}">
      <img class="tile__thumb${g.stage.fit === "contain" ? " is-contain" : ""}" src="${img(g, stageShot(g) === "key" ? "key" : stageShot(g) + "-sm")}" alt="" loading="lazy" />
      <span class="tile__num mono">${num(i)}</span>
      <span class="tile__name" style="font-family:'${g.theme.font}',var(--font-display)">${esc(g.name)}</span>
      <span class="tile__kind">${esc(g.kind)}</span>
    </button>`
  )
  .join("");

const tiles = [...select.querySelectorAll(".tile")];
let current = -1;

function load(i) {
  art.querySelectorAll(`[data-i="${i}"][data-src]`).forEach((el) => {
    el.src = el.dataset.src;
    el.removeAttribute("data-src");
  });
}

function show(i, { focus = false } = {}) {
  i = (i + games.length) % games.length;
  if (i === current) return;
  current = i;
  const g = games[i];
  applyTheme(g);
  remember(g.id);
  load(i);

  art.querySelectorAll("[data-i]").forEach((el) => el.classList.toggle("is-on", +el.dataset.i === i));
  tiles.forEach((t, k) => {
    t.setAttribute("aria-selected", k === i);
    t.tabIndex = k === i ? 0 : -1;
  });
  if (focus) tiles[i].focus();
  // Keep the selected tile in view on narrow screens without moving the page.
  select.scrollTo({ left: tiles[i].offsetLeft - (select.clientWidth - tiles[i].offsetWidth) / 2, behavior: "smooth" });
  document.getElementById("stage-panel").setAttribute("aria-labelledby", `tab-${g.id}`);

  const store = g.links[0];
  copy.innerHTML = `
    <p class="stage__count mono">${num(i)} / ${num(games.length - 1)} · ${esc(g.kind)} · ${esc(g.year)}</p>
    <h2 class="stage__title"><a href="${gameUrl(g)}">${esc(g.name)}</a></h2>
    <p class="stage__pitch">${esc(g.pitch)}</p>
    <dl class="stage__facts">
      <div><dt>Role</dt><dd>${esc(g.role)}</dd></div>
      <div><dt>Built with</dt><dd>${esc(g.stack)}</dd></div>
      <div><dt>Notable</dt><dd>${esc(g.highlight)}</dd></div>
    </dl>
    <div class="actions">
      <a class="btn btn--solid" href="${gameUrl(g)}">How it was made ${icon("arrow")}</a>
      <a class="btn" href="${esc(store.url)}" target="_blank" rel="noopener">${esc(store.label)} ${icon("out")}</a>
    </div>`;
  copy.classList.remove("is-in");
  void copy.offsetWidth;
  copy.classList.add("is-in");
}

tiles.forEach((t) => t.addEventListener("click", () => show(+t.dataset.i)));

// Keyboard: arrows browse, Enter opens — when focus is on the page or inside the stage.
addEventListener("keydown", (e) => {
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  const a = document.activeElement;
  const inStage = a === document.body || a.closest?.(".stage");
  if (!inStage || document.querySelector("dialog[open]")) return;
  if (e.key === "ArrowRight") { e.preventDefault(); show(current + 1, { focus: a !== document.body }); }
  else if (e.key === "ArrowLeft") { e.preventDefault(); show(current - 1, { focus: a !== document.body }); }
  else if (e.key === "Enter" && (a === document.body || a.classList.contains("tile"))) location.href = gameUrl(games[current]);
});

// Gamepad: d-pad or stick browses, A opens.
addEventListener("gamepadconnected", () => {
  document.getElementById("stage-hint").textContent = "Gamepad connected · D-pad browse · A opens";
  let held = false;
  (function poll() {
    const pad = [...navigator.getGamepads()].find(Boolean);
    if (!pad) return;
    const x = pad.buttons[15]?.pressed || pad.axes[0] > 0.6 ? 1 : pad.buttons[14]?.pressed || pad.axes[0] < -0.6 ? -1 : 0;
    const open = pad.buttons[0]?.pressed;
    if (!held && x) show(current + x);
    if (!held && open) location.href = gameUrl(games[current]);
    held = Boolean(x || open);
    requestAnimationFrame(poll);
  })();
});

const start = games.findIndex((g) => g.id === recall());
show(start < 0 ? 0 : start);
// Warm the other slides once the first one is in.
(window.requestIdleCallback || setTimeout)(() => games.forEach((_, i) => load(i)));

// Scoreboard
document.getElementById("scores").innerHTML = scoreboard
  .map((s) => {
    const g = games.find((x) => x.id === s.game);
    return `<li><a href="${gameUrl(g)}"><strong>${esc(s.value)}</strong><span>${esc(s.label)}</span><em>${esc(g.name)}</em></a></li>`;
  })
  .join("");

// Featured quotes
document.getElementById("quotes").innerHTML = games
  .flatMap((g) => g.reviews.filter((r) => r.featured).map((r) => ({ ...r, g })))
  .map(
    (r) => `
    <figure class="quote">
      <blockquote>${esc(r.text)}</blockquote>
      <figcaption><strong>${esc(r.author)}</strong> · ${esc(r.role)} · <a href="${gameUrl(r.g)}">${esc(r.g.name)}</a></figcaption>
    </figure>`
  )
  .join("");

document.getElementById("contact").innerHTML = contactBlock(profile);
