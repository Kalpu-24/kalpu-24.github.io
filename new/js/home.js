import { games, profile, scoreboard } from "../data/games.js";
import { applyTheme, contactBlock, cover, esc, gameUrl, icon, recall, remember } from "./shared.js";

const pulled = document.getElementById("pulled");
const box = document.getElementById("box");
const shelf = document.getElementById("shelf");
const hint = document.getElementById("stage-hint");
const num = (i) => String(i + 1).padStart(2, "0");
const baseHint = `${games.length} games · ${games.at(-1).year} – ${games[0].year}`;

// The shelf: one boxed copy per game. The selected one leaves an empty slot.
shelf.innerHTML = games
  .map(
    (g, i) => `
    <button class="shelf__slot" role="tab" id="tab-${g.id}" aria-controls="pulled" aria-selected="false" tabindex="-1" data-i="${i}" aria-label="${esc(g.name)}, ${esc(g.kind)}" title="${esc(g.name)}">
      ${cover(g)}
    </button>`
  )
  .join("");
hint.textContent = `← → browse · ${baseHint}`;

const slots = [...shelf.querySelectorAll(".shelf__slot")];
let current = -1;

function show(i, { focus = false } = {}) {
  i = (i + games.length) % games.length;
  if (i === current) return;
  current = i;
  const g = games[i];
  applyTheme(g);
  remember(g.id);

  slots.forEach((s, k) => {
    s.setAttribute("aria-selected", k === i);
    s.tabIndex = k === i ? 0 : -1;
  });
  if (focus) slots[i].focus();
  pulled.setAttribute("aria-labelledby", `tab-${g.id}`);

  const store = g.links[0];
  const [value, label] = g.stickers[0];
  pulled.innerHTML = `
    <p class="mono">${num(i)} / ${num(games.length - 1)} · ${esc(g.kind)} · ${esc(g.year)}</p>
    <h2 class="hero__title"><a href="${gameUrl(g)}">${esc(g.name)}</a></h2>
    <p class="hero__pitch">${esc(g.pitch)}</p>
    <p class="mono">${esc(g.role)} · ${esc(g.stack)}</p>
    <div class="actions">
      <a class="btn btn--solid" href="${gameUrl(g)}">How it was made ${icon("arrow")}</a>
      <a class="link" href="${esc(store.url)}" target="_blank" rel="noopener">${esc(store.label)} ${icon("out")}</a>
    </div>`;
  box.innerHTML = `
    <a class="hero__cover" href="${gameUrl(g)}" aria-label="${esc(g.name)}: how it was made">${cover(g)}</a>
    <span class="sticker"><b>${esc(value)}</b><span>${esc(label)}</span></span>`;
  for (const el of [pulled, box]) {
    el.classList.remove("is-in");
    void el.offsetWidth;
    el.classList.add("is-in");
  }
}

slots.forEach((s) => s.addEventListener("click", () => show(+s.dataset.i)));

// Keyboard: arrows browse, Enter opens — when focus is on the page or inside the room.
addEventListener("keydown", (e) => {
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  const a = document.activeElement;
  const inRoom = a === document.body || a.closest?.(".room");
  if (!inRoom) return;
  if (e.key === "ArrowRight") { e.preventDefault(); show(current + 1, { focus: a !== document.body }); }
  else if (e.key === "ArrowLeft") { e.preventDefault(); show(current - 1, { focus: a !== document.body }); }
  else if (e.key === "Enter" && (a === document.body || a.classList.contains("shelf__slot"))) location.href = gameUrl(games[current]);
});

// Gamepad: d-pad or stick browses, A opens.
addEventListener("gamepadconnected", () => {
  hint.textContent = `D-pad browse · A opens · ${baseHint}`;
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
