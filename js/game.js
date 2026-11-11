import { games, profile } from "../data/games.js";
import { applyTheme, contactBlock, esc, gameUrl, icon, img, remember } from "./shared.js";

const params = new URLSearchParams(location.search);
const id = params.get("g") || params.get("project");
const index = games.findIndex((g) => g.id === id);
if (index < 0) location.replace("./");

const g = games[Math.max(index, 0)];
const next = games[(index + 1) % games.length];
applyTheme(g);
remember(g.id);
document.title = `${g.name} — Kalp Shah`;

const paras = (list) => list.map((p) => `<p>${esc(p)}</p>`).join("");
const section = (title, body, cls = "") => `<section class="block wrap ${cls}"><h2 class="section-h">${esc(title)}</h2>${body}</section>`;

const challenge = g.challenge
  ? section(
      "The challenge",
      (g.challenge.title ? `<p class="block__lead">${esc(g.challenge.title)}</p>` : "") +
        (g.challenge.steps
          ? `<ol class="steps">${g.challenge.steps.map(([k, v]) => `<li><h3 class="label">${esc(k)}</h3><p>${esc(v)}</p></li>`).join("")}</ol>`
          : `<div class="prose">${paras(g.challenge.paragraphs)}</div>`)
    )
  : "";

document.getElementById("main").innerHTML = `
  <section class="ghero wrap">
    <a class="ghero__back mono" href="./#games">${icon("back")} All games</a>
    <p class="stage__count mono">${esc(g.kind)} · ${esc(g.year)}</p>
    <h1 class="ghero__title">${esc(g.name)}</h1>
    <p class="ghero__pitch">${esc(g.pitch)}</p>
    <div class="actions">
      ${g.links.map((l, i) => `<a class="btn${i ? "" : " btn--solid"}" href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)}<small>${esc(l.note)}</small>${icon("out")}</a>`).join("")}
    </div>
    <div class="ghero__art${g.keyFit === "contain" ? " is-contain" : ""}">
      <img src="${img(g, "key")}" alt="${esc(g.name)} key art" />
    </div>
    <dl class="facts">
      ${g.facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}
    </dl>
  </section>

  ${section("Overview", `<div class="prose prose--big">${paras(g.overview)}</div>`)}

  ${g.metrics.length
    ? `<section class="wrap block"><h2 class="section-h">By the numbers</h2><ul class="scores__list">${g.metrics
        .map((m) => `<li><div><strong>${esc(m.value)}</strong><span>${esc(m.label)}</span></div></li>`)
        .join("")}</ul></section>`
    : ""}

  ${section(
    "Screenshots",
    `<ul class="shots${g.shots[0][0] < g.shots[0][1] ? " shots--tall" : ""}">${g.shots
      .map(
        ([w, h], i) =>
          `<li><button data-shot="${i}" aria-label="Open screenshot ${i + 1} of ${g.shots.length}"><img src="${img(g, `${i + 1}-sm`)}" width="${w}" height="${h}" loading="lazy" alt="${esc(g.name)} screenshot ${i + 1}" /></button></li>`
      )
      .join("")}</ul>`
  )}

  ${section(
    "Technical breakdown",
    `<dl class="tech">${g.technical.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>`
  )}

  ${challenge}

  ${(g.notes || []).map((n) => section(n.title, `<div class="prose">${paras(n.paragraphs)}</div>`)).join("")}

  ${g.reviews.length
    ? section(
        "What players said",
        `<div class="quotes">${g.reviews
          .map((r) => `<figure class="quote"><blockquote>${esc(r.text)}</blockquote><figcaption><strong>${esc(r.author)}</strong> · ${esc(r.role)}</figcaption></figure>`)
          .join("")}</div>`
      )
    : ""}

  <a class="next wrap" href="${gameUrl(next)}">
    <span class="mono">Next game</span>
    <strong style="font-family:'${next.theme.font}',var(--font-display)">${esc(next.name)}</strong>
    ${icon("arrow")}
  </a>`;

document.getElementById("contact").innerHTML = contactBlock(profile);
document.body.style.visibility = "visible";

// Screenshot viewer
const box = document.getElementById("lightbox");
const boxImg = document.getElementById("lightbox-img");
const count = document.getElementById("lightbox-count");
let at = 0;
document.getElementById("lightbox-prev").innerHTML = icon("back");
document.getElementById("lightbox-next").innerHTML = icon("arrow");
document.getElementById("lightbox-close").innerHTML = icon("close");

function open(i) {
  at = (i + g.shots.length) % g.shots.length;
  const [w, h] = g.shots[at];
  boxImg.src = img(g, at + 1);
  boxImg.width = w;
  boxImg.height = h;
  boxImg.alt = `${g.name} screenshot ${at + 1}`;
  count.textContent = `${at + 1} / ${g.shots.length}`;
  if (!box.open) box.showModal();
}
document.querySelectorAll("[data-shot]").forEach((b) => b.addEventListener("click", () => open(+b.dataset.shot)));
document.getElementById("lightbox-prev").addEventListener("click", () => open(at - 1));
document.getElementById("lightbox-next").addEventListener("click", () => open(at + 1));
document.getElementById("lightbox-close").addEventListener("click", () => box.close());
box.addEventListener("click", (e) => { if (e.target === box) box.close(); });
box.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") open(at + 1);
  if (e.key === "ArrowLeft") open(at - 1);
});
