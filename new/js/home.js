import { games, skills, trophies } from "../data/games.js";
import { applyTheme, esc, gameUrl, icon, img, recall, remember } from "./shared.js";

const byId = (id) => games.find((g) => g.id === id);
const font = (g) => `font-family:'${g.theme.font}',var(--font-display);--s:${g.theme.scale}`;
const thumb = (g) => img(g, g.stage.shot === "key" ? "key" : `${g.stage.shot}-sm`);

// ---- Screens -----------------------------------------------------------

document.getElementById("hud").innerHTML = `
  <div><dd>${games.length} / ${games.length}</dd><dt>Quests</dt></div>
  <div><dd>${trophies.length}</dd><dt>Trophies</dt></div>`;
document.getElementById("year").textContent = new Date().getFullYear();

const questList = document.getElementById("quest-list");
questList.innerHTML = games
  .map(
    (g) => `
    <li>
      <a class="quest" href="${gameUrl(g)}" data-id="${g.id}">
        <img class="quest__thumb${g.stage.fit === "contain" ? " is-contain" : ""}" src="${thumb(g)}" alt="" loading="lazy" />
        <span class="quest__text">
          <strong style="${font(g)}">${esc(g.name)}</strong>
          <span>${esc(g.pitch)}</span>
          <span class="mono">${esc(g.role)} · ${esc(g.year)}</span>
        </span>
        <span class="quest__reward">
          <span class="pill">${esc(g.reward)}</span>
          <span class="mono quest__done">${icon("check")} Complete</span>
        </span>
      </a>
    </li>`
  )
  .join("");

document.getElementById("trophy-list").innerHTML = trophies
  .map((t) => {
    const g = byId(t.game);
    return `
    <li>
      <a class="trophy" href="${gameUrl(g)}">
        <span class="trophy__icon">${icon(t.icon)}</span>
        <strong style="${font(g)}">${esc(t.value)}</strong>
        <span>${esc(t.label)}</span>
        <small>${esc(g.name)}</small>
      </a>
    </li>`;
  })
  .join("");

// Skill tree: nested lists, wired with SVG on wide screens.
const kids = (id) => skills.filter((s) => s.parent === id);
const names = (ids) => (ids.length >= 4 ? "All four Unreal games" : ids.map((i) => byId(i).name).join(" · "));
const branch = (s) => `
  <li>
    <div class="skill${s.parent ? "" : " skill--root"}" id="skill-${s.id}" data-parent="${s.parent || ""}">
      <b>${esc(s.label)}</b><small>${esc(names(s.games))}</small>
    </div>
    ${kids(s.id).length ? `<ul>${kids(s.id).map(branch).join("")}</ul>` : ""}
  </li>`;
const tree = document.getElementById("tree");
tree.innerHTML = `<ul class="tree__roots">${skills.filter((s) => !s.parent).map(branch).join("")}</ul><svg class="tree__wires" aria-hidden="true"></svg>`;

function wireTree() {
  const svg = tree.querySelector("svg");
  const box = tree.getBoundingClientRect();
  if (!box.width) return;
  svg.innerHTML = [...tree.querySelectorAll(".skill[data-parent]:not([data-parent=''])")]
    .map((el) => {
      const a = document.getElementById(`skill-${el.dataset.parent}`).getBoundingClientRect();
      const b = el.getBoundingClientRect();
      const side = b.left >= a.right - 1;
      // Sideways curve on wide screens; an elbow down the left edge when the tree is stacked.
      if (side) {
        const [x1, y1, x2, y2] = [a.right - box.left, a.top + a.height / 2 - box.top, b.left - box.left, b.top + b.height / 2 - box.top];
        const d = (x2 - x1) / 2;
        return `<path d="M${x1} ${y1} C${x1 + d} ${y1} ${x2 - d} ${y2} ${x2} ${y2}"/>`;
      }
      const [x1, y1, x2, y2] = [a.left + 18 - box.left, a.bottom - box.top, b.left - box.left, b.top + b.height / 2 - box.top];
      return `<path d="M${x1} ${y1} V${y2 - 10} Q${x1} ${y2} ${x1 + 10} ${y2} H${x2}"/>`;
    })
    .join("");
}
new ResizeObserver(wireTree).observe(tree);
document.fonts.ready.then(wireTree);

// ---- Menu --------------------------------------------------------------

const items = [...document.querySelectorAll(".menu__item")];
const screens = [...document.querySelectorAll(".screen")];
items.forEach((a) => a.insertAdjacentHTML("afterbegin", icon(a.dataset.icon)));
document.documentElement.classList.add("has-menu");

function open(id, { focus = false } = {}) {
  if (!screens.some((s) => s.id === id)) id = "quests";
  items.forEach((a) => {
    const on = a.hash === `#${id}`;
    a.setAttribute("aria-selected", on);
    a.tabIndex = on ? 0 : -1;
    if (on && focus) a.focus();
  });
  screens.forEach((s) => {
    s.hidden = s.id !== id;
    if (!s.hidden) {
      s.classList.remove("is-in");
      void s.offsetWidth;
      s.classList.add("is-in");
    }
  });
  if (location.hash !== `#${id}`) history.replaceState(null, "", `#${id}`);
  if (id === "skills") wireTree();
}
const current = () => items.findIndex((a) => a.getAttribute("aria-selected") === "true");

items.forEach((a) =>
  a.addEventListener("click", (e) => {
    e.preventDefault();
    open(a.hash.slice(1));
  })
);
addEventListener("hashchange", () => open(location.hash.slice(1)));

// Arrow keys move through the menu, or through the quests once inside the log.
addEventListener("keydown", (e) => {
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  const a = document.activeElement;
  const inMenu = a === document.body || a.classList?.contains("menu__item");
  const quests = [...document.querySelectorAll(".quest")];
  const q = quests.indexOf(a);
  const step = e.key === "ArrowDown" ? 1 : e.key === "ArrowUp" ? -1 : 0;

  if (step && inMenu) {
    e.preventDefault();
    open(items[(current() + step + items.length) % items.length].hash.slice(1), { focus: true });
  } else if (step && q >= 0) {
    e.preventDefault();
    quests[(q + step + quests.length) % quests.length].focus();
  } else if ((e.key === "Enter" || e.key === "ArrowRight") && inMenu) {
    const first = document.querySelector(".screen:not([hidden])").querySelector("a, button");
    if (first) { e.preventDefault(); first.focus(); }
  } else if ((e.key === "Escape" || e.key === "ArrowLeft") && a.closest?.(".panel")) {
    e.preventDefault();
    items[current()].focus();
  }
});

// Pointing at a quest re-themes the whole menu in that game's colours.
function select(id) {
  const g = byId(id) || games[0];
  applyTheme(g);
  remember(g.id);
  document.querySelectorAll(".quest").forEach((el) => el.classList.toggle("is-on", el.dataset.id === g.id));
}
questList.querySelectorAll(".quest").forEach((el) => {
  el.addEventListener("pointerenter", () => select(el.dataset.id));
  el.addEventListener("focus", () => select(el.dataset.id));
});

select(recall());
open(location.hash.slice(1));
