#!/usr/bin/env node
/* Generates the site's pages (index.html and one page per project) from src/content.mjs.
   Run:  node build.mjs   The previous design lives in old/v2/ and has its own old/v2/build.mjs. */
import { readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { profile, headlineStats, timeline, skills, projects } from "./src/content.mjs";

const here = (p) => new URL(p, import.meta.url);
const versioned = (path) => `${path}?v=${createHash("sha1").update(readFileSync(here(path))).digest("hex").slice(0, 8)}`;
const BASE = "https://kalpshah.dev/";
const FONTS = "https://fonts.googleapis.com/css2?family=Sofia+Sans+Extra+Condensed:wght@600;800;900&family=Sofia+Sans:wght@400;500;700&family=Zilla+Slab:ital,wght@0,400;0,500;0,600;1,400&display=swap";

/* On white, each game keeps one accent: `fill` for marks and blocks, `text` for type (dark enough to read). */
const ACCENT = {
  home: { fill: "#6f6eb5", text: "#6f6eb5", on: "#ffffff" },
  rollemout: { fill: "#ffb347", text: "#c25a00", on: "#1d1300" },
  boomcorp: { fill: "#cdff1b", text: "#4a7300", on: "#0b1300" },
  tgf: { fill: "#ff5db4", text: "#d2157c", on: "#2b0017" },
  aurarpg: { fill: "#b9a7ff", text: "#5a33d6", on: "#170a47" },
  snakewall: { fill: "#e0322c", text: "#c8201b", on: "#ffffff" },
};
const accent = (id) => { const a = ACCENT[id] || ACCENT.home; return `--fill:${a.fill};--accent:${a.text};--on-fill:${a.on}`; };

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const fmt = (s) => esc(s).replace(/`([^`]+)`/g, "<code>$1</code>");
const byId = Object.fromEntries(projects.map((p) => [p.id, p]));
const img = (p, n) => `assets/games/${p.id}/${n}.webp`;
const ext = (url) => (/^https?:/.test(url) ? ` target="_blank" rel="noopener"` : "");
const num = (i) => String(i + 1).padStart(2, "0");
const arrow = `<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6"/></svg>`;
const out = `<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg>`;
/* A short measuring rule that leads the eye along a line. */
const orn = `<span class="orn" aria-hidden="true"><b></b></span>`;
/* A stacked two-tone headline: first part in the accent, second in ink. */
const pair = (a, b, tag = "h2", cls = "") => `<${tag} class="pair ${cls}"><span><i>${esc(a)}</i></span> <u class="mark"></u> <span><i>${esc(b)}</i></span></${tag}>`;
/* A picture in a viewfinder frame: two guide lines cross at one corner, marks draw at
   the other three, then the picture wipes in. The frame is wide, so the subject is not cropped away. */
const corners = `<i class="frame__c frame__c--tl"></i><i class="frame__c frame__c--tr"></i><i class="frame__c frame__c--br"></i>`;
const frame = (src, cls = "", attrs = "") => `<span class="frame ${cls}"><span class="ln frame__h"></span><span class="lv frame__v"></span><span class="frame__pic"><img src="${src}" alt="" loading="lazy"${attrs}></span>${corners}<span class="frame__dot"></span></span>`;
/* A figure such as "4 months" or "307 MB": the number stays large and the unit sits beside it,
   smaller, so a long unit never pushes the number onto two lines. A figure with no number in
   it ("Overall winner") is set as words. */
const figure = (v) => {
  const m = String(v).match(/^([\d.,]+(?:\s*[×–-]\s*[\d.,]+)?[k+]*)\s+([A-Za-z].*)$/);
  if (m) return `<strong class="fig"><span class="fig__n">${esc(m[1])}</span><span class="fig__u">${esc(m[2])}</span></strong>`;
  return `<strong class="fig"><span class="${/^\d/.test(v) ? "fig__n" : "fig__w"}">${esc(v)}</span></strong>`;
};
/* A still app screen shown beside the recording at the top of a page (`video.beside`, by shot number). */
const beside = (p, k) => {
  const s = p.shots.find((x) => x.n === p.video?.beside?.[k]);
  return s ? `<span class="side-shot"><img src="${img(p, `${s.n}-sm`)}" width="${s.w}" height="${s.h}" alt="${esc(s.alt)}"></span>` : "";
};
/* Games whose work panel also shows the cut-out character beside the key art. */
const PANEL_PROP = new Set(["rollemout", "snakewall"]);
const btn = (label, url, kind = "") => `<a class="btn ${kind}" href="${esc(url)}"${ext(url)}>${esc(label)} ${/^https?:/.test(url) ? out : arrow}</a>`;

function page({ file, title, description, body, id = "home" }) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="theme-color" content="#ffffff">
<link rel="canonical" href="${BASE}${file === "index.html" ? "" : file}">
<meta property="og:type" content="website">
<meta property="og:url" content="${BASE}${file === "index.html" ? "" : file}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:image" content="${BASE}${id === "home" ? "assets/og.jpg" : `assets/games/${id}/key.webp`}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="public/favicon.ico" sizes="48x48">
<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><style>.u{fill:${(ACCENT[id] || ACCENT.home).text}}.d{fill:#141414}@media (prefers-color-scheme:dark){.u{fill:${(ACCENT[id] || ACCENT.home).fill}}.d{fill:#f2f1ec}}</style><path class="u" d="M8 19 20 2 32 19z"/><path class="d" d="M8 21h24L20 38z"/></svg>`)}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="${versioned("css/site.css")}">
<script src="${versioned("js/site.js")}" defer></script>
</head>
<body class="${id === "home" ? "home" : "project"}" style="${accent(id)}">
<a class="skip" href="#main">Skip to content</a>
<header class="top">
  <a class="top__mark" href="./" aria-label="Kalp Shah, home"><svg viewBox="0 0 40 40" aria-hidden="true"><path class="top__up" d="M8 19 20 2 32 19z"/><path class="top__down" d="M8 21h24L20 38z"/></svg><b>Kalp Shah</b></a>
  <nav class="top__nav" aria-label="Main">
    <a href="./#work">Work</a>
    <a href="./#about">About</a>
    <a href="./#toolbox">Toolbox</a>
    <a href="./#contact">Contact</a>
    <a class="top__cv" href="${esc(profile.resume)}" target="_blank" rel="noopener">Résumé</a>
  </nav>
</header>
<main id="main">
${body}
</main>
<footer class="foot scene" id="contact">
  <div class="wrap foot__in">
    <div>
      <p class="eyebrow">Open to new opportunities, or just a friendly chat</p>
      ${pair("Get in", "touch")}
      <a class="foot__mail" href="mailto:${esc(profile.email)}">${esc(profile.email)}</a>
    </div>
    <ul class="foot__links">
      ${profile.links.map((l) => `<li><a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)} ${out}</a></li>`).join("\n      ")}
      <li><a href="${esc(profile.resume)}" target="_blank" rel="noopener">Résumé (PDF) ${out}</a></li>
    </ul>
  </div>
  <p class="wrap foot__copy">© ${new Date().getFullYear()} ${esc(profile.name)} · ${esc(profile.location)}</p>
</footer>
<dialog class="lightbox" id="lightbox" aria-label="Screenshot viewer">
  <img id="lightbox-img" alt="">
  <p class="lightbox__count" id="lightbox-count"></p>
  <button class="lightbox__btn lightbox__prev" id="lightbox-prev" aria-label="Previous screenshot">${arrow}</button>
  <button class="lightbox__btn lightbox__next" id="lightbox-next" aria-label="Next screenshot">${arrow}</button>
  <button class="lightbox__btn lightbox__close" id="lightbox-close" aria-label="Close">✕</button>
</dialog>
</body>
</html>
`;
  writeFileSync(here(file), html);
  console.log("wrote", file);
}

/* ------------------------------------------------------------------ home */
const [headA, headB] = (() => {
  const h = profile.headline.replace(/\.$/, "");
  const i = h.indexOf(" in ");
  return i > 0 ? [h.slice(0, i), h.slice(i + 1)] : [h, ""];
})();

const roots = skills.filter((s) => !s.parent);
const kids = (id) => skills.filter((s) => s.parent === id);
const branch = (s) => `<li><span class="skill">${esc(s.label)}</span>${kids(s.id).length ? `<ul>${kids(s.id).map(branch).join("")}</ul>` : ""}</li>`;

page({
  file: "index.html",
  title: `${profile.name} — ${profile.role}`,
  description: `${profile.headline} ${projects.map((p) => p.name).join(", ")}.`,
  body: `
<section class="hero scene">
  <div class="hero__art" aria-hidden="true">
    ${frame("assets/kalp.webp", "frame--square", ` id="hero__pic"`)}
  </div>
  <div class="hero__text">
    <p class="eyebrow fade">${esc(profile.name)} · ${esc(profile.role)}</p>
    ${pair(headA, headB, "h1", "pair--xl")}
    <p class="lede fade">${esc(profile.about.punch)}</p>
    <div class="actions late">${btn("See the work", "#work")}</div>
  </div>
  <div class="hero__orn late" aria-hidden="true">${orn}</div>
</section>

<section class="lead wrap scene" aria-label="Highlights">
  <span class="ln"></span>
  ${headlineStats.map((n) => `<${n.to ? `a href="${n.to}.html"` : "div"} class="lead__item">${figure(n.v)}<span>${esc(n.l)}</span></${n.to ? "a" : "div"}>`).join("\n  ")}
</section>

<section class="reel" id="work" aria-label="Selected work">
  <div class="reel__sticky">
    <div class="reel__head wrap">
      <h2 class="eyebrow">Selected work</h2>
      <p class="reel__count" aria-hidden="true"><b id="reel-now">01</b> / ${num(projects.length - 1)}</p>
    </div>
    <div class="reel__track" id="reel-track">
      ${projects.map((p, i) => `
      <article class="panel scene" style="${accent(p.id)}" id="work-${p.id}">
        <a class="panel__art" href="${p.id}.html" tabindex="-1" aria-hidden="true">
          ${frame(img(p, "key"), p.art.fit === "contain" ? "is-contain" : "")}${PANEL_PROP.has(p.id) ? `
          <img class="panel__prop" src="${img(p, "prop")}" alt="" loading="lazy">` : ""}
        </a>
        <div class="panel__text">
          <p class="eyebrow fade">${esc(p.kind)} · ${esc(p.year)}</p>
          <h3 class="pair pair--lg"><a href="${p.id}.html"><span><i>${esc(p.name)}</i></span> <u class="mark"></u> <span><i>${esc(p.fact)}</i></span></a></h3>
          <p class="fade">${esc(p.pitch)}</p>
          <div class="actions late">${btn("View project", `${p.id}.html`)}</div>
        </div>
      </article>`).join("")}
    </div>
    <div class="reel__bar wrap" aria-hidden="true"><span id="reel-bar"></span></div>
  </div>
</section>

<section class="about wrap scene" id="about">
  <div class="about__head">
    <p class="eyebrow fade">${esc(profile.location)}</p>
    ${pair("About", profile.name.split(" ")[0])}
  </div>
  <div class="about__text">
    <p class="quote fade">${esc(profile.about.punch)}</p>
    ${profile.about.paragraphs.map((t) => `<p class="fade">${esc(t)}</p>`).join("\n    ")}
  </div>
</section>

<section class="path wrap scene" id="path">
  <div class="path__head">${pair("The path", "so far")}<span class="late">${orn}</span></div>
  <ol class="path__list">
    ${timeline.map((t) => `<li><span class="path__when">${esc(t.when)}</span><div><strong>${t.to ? `<a href="${t.to}.html">${esc(t.what)}</a>` : esc(t.what)}</strong><p>${esc(t.detail)}</p></div></li>`).join("\n    ")}
  </ol>
</section>

<section class="toolbox wrap scene" id="toolbox">
  <div class="toolbox__head">${pair("The", "toolbox")}</div>
  <div class="toolbox__grid">
    ${roots.map((r) => `<div class="tool"><h3>${esc(r.label)}</h3><ul>${kids(r.id).map(branch).join("")}</ul></div>`).join("\n    ")}
  </div>
</section>`,
});

/* --------------------------------------------------------------- projects */
projects.forEach((p, i) => {
  const next = projects[(i + 1) % projects.length];
  const steps3 = (rows) => `<ol class="steps">${rows.map(([k, v]) => `<li><h3>${esc(k)}</h3><p>${fmt(v)}</p></li>`).join("")}</ol>`;
  const paras = (list) => list.map((t) => `<p>${fmt(t)}</p>`).join("");
  const block = (a, b, inner, cls = "") => `<section class="block wrap scene ${cls}"><span class="ln"></span><div class="block__head">${pair(a, b)}</div><div class="block__body fade">${inner}</div></section>`;
  const tall = p.shots[0].w < p.shots[0].h;

  page({
    file: `${p.id}.html`,
    id: p.id,
    title: `${p.name} — ${profile.name}`,
    description: p.pitch,
    body: `
<section class="phero wrap scene">
  <div class="phero__text">
    <a class="back fade" href="./#work-${p.id}">${arrow} All work</a>
    <p class="eyebrow fade">${esc(p.kind)} · ${esc(p.year)}</p>
    ${pair(p.name, p.fact, "h1", "pair--xl")}
    <p class="lede fade">${esc(p.pitch)}</p>
    <div class="actions late">${p.links.map((l, k) => btn(l.label, l.url, k ? "btn--quiet" : "")).join("")}</div>
    ${p.video ? `<p class="phero__note late">${esc(p.video.caption)} Tap the phone to pause.</p>` : ""}
  </div>
  ${p.video
    ? `<div class="phero__art phero__art--phone">
    <span class="frame frame--phone is-colour"><span class="ln frame__h"></span><span class="lv frame__v"></span><span class="frame__pic">${beside(p, 0)}<button class="demo__screen" type="button" aria-label="Pause the recording"><video muted loop playsinline disablepictureinpicture disableremoteplayback controlslist="nodownload nofullscreen noremoteplayback" preload="none" poster="assets/games/${p.id}/demo-poster.jpg" width="${p.video.w}" height="${p.video.h}"><source src="${esc(p.video.src)}" type="video/mp4"></video><span class="demo__state" aria-hidden="true"></span></button>${beside(p, 1)}</span>${corners}<span class="frame__dot"></span></span>
  </div>`
    : `<div class="phero__art" aria-hidden="true">
    ${frame(img(p, "key"), `is-colour${p.art.fit === "contain" ? " is-contain" : ""}`, ` style="object-position:${p.art.pos}"`)}
    <img class="phero__prop" src="${img(p, "prop")}" alt="">
  </div>`}
</section>

<section class="facts wrap scene" aria-label="Project facts">
  <span class="ln"></span>
  <dl>
    ${[["Role", p.role], ["When", p.period], ["Status", p.status], ["Built with", p.engine], ["Platform", p.platform]].map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join("\n    ")}
  </dl>
</section>

<section class="numbers wrap scene" aria-label="In numbers">
  <span class="ln"></span>
  ${p.stats.map((s) => `<div class="number">${figure(s.v)}<span>${esc(s.l)}</span></div>`).join("\n  ")}
</section>

${block("The", "short version", `<ul class="highlights">${p.highlights.map((h, k) => `<li><b>${num(k)}</b>${esc(h)}</li>`).join("")}</ul><div class="prose prose--lead">${paras(p.overview)}</div>`)}

${p.toy ? `<section class="block wrap scene toy" id="toy" data-kind="${p.toy.kind}">
  <span class="ln"></span>
  <div class="block__head">${pair(p.toy.title.split(" ").slice(0, -1).join(" ") || p.toy.title, p.toy.title.split(" ").slice(-1)[0])}<p>${esc(p.toy.text)}</p><dl class="toy__stats" id="toy-stats"></dl><p class="toy__msg" id="toy-msg" role="status"></p><div class="actions" id="toy-actions"></div></div>
  <div class="block__body"><div class="toy__board" id="toy-board"></div></div>
</section>` : ""}

<section class="block wrap scene">
  <span class="ln"></span>
  <div class="block__head">${pair("In", "pictures")}</div>
  <ul class="shots fade${tall ? " shots--tall" : ""}">
    ${p.shots.map((s, k) => `<li><button data-shot="${k}" data-full="${img(p, s.n)}" data-w="${s.w}" data-h="${s.h}" aria-label="Open screenshot ${k + 1} of ${p.shots.length}"><img src="${img(p, `${s.n}-sm`)}" width="${s.w}" height="${s.h}" loading="lazy" alt="${esc(s.alt)}"></button></li>`).join("\n    ")}
  </ul>
</section>

${block(...(() => { const w = p.systemsTitle.split(" "); return [w.slice(0, -1).join(" "), w.slice(-1)[0]]; })(), `<div class="systems">${p.systems.map((s) => `<article><h3>${esc(s.title)}</h3><p>${fmt(s.text)}</p></article>`).join("")}</div>`)}

${p.flow ? `<section class="block wrap scene flow">
  <span class="ln"></span>
  <div class="block__head">${pair(...(() => { const w = p.flow.title.split(" "); const k = Math.ceil(w.length / 2); return [w.slice(0, k).join(" "), w.slice(k).join(" ")]; })())}${p.flow.intro ? `<p>${fmt(p.flow.intro)}</p>` : ""}</div>
  <ol class="flow__steps fade">${p.flow.steps.map((s, k) => `<li><b>${num(k)}</b><h3>${esc(s.t)}</h3><p>${fmt(s.d)}</p></li>`).join("")}</ol>
</section>` : ""}

${p.devlog ? block("The", "build log", `<p class="eyebrow">${esc(p.devlog.title)}</p><ol class="path__list">${p.devlog.items.map((d) => `<li><span class="path__when">${esc(d.d)}</span><div><p>${fmt(d.t)}</p></div></li>`).join("")}</ol>`) : ""}

${block("The", "hard part", `<p class="quote">${esc(p.challenge.title)}</p>${p.challenge.steps ? steps3(p.challenge.steps) : `<div class="prose">${paras(p.challenge.paragraphs)}</div>`}`)}

${p.reviews.length ? block("What", "players said", `<div class="reviews">${p.reviews.map((r) => `<figure><blockquote>${esc(r.text)}</blockquote><figcaption><b>${esc(r.author)}</b> ${esc(r.role)}</figcaption></figure>`).join("")}</div>`) : ""}

${p.notes?.length ? block("Notes", "and credits", `<div class="notes">${p.notes.map((n) => `<article><h3>${esc(n.title)}</h3>${paras(n.paragraphs)}</article>`).join("")}</div>`) : ""}

<nav class="nextup wrap scene" aria-label="Next project" style="${accent(next.id)}">
  <span class="ln"></span>
  <article class="panel">
    <a class="panel__art" href="${next.id}.html" tabindex="-1" aria-hidden="true">${frame(img(next, "key"), next.art.fit === "contain" ? "is-contain" : "")}</a>
    <div class="panel__text">
      <p class="eyebrow fade">Next project · ${esc(next.kind)}</p>
      <h2 class="pair pair--lg"><a href="${next.id}.html"><span><i>${esc(next.name)}</i></span> <u class="mark"></u> <span><i>${esc(next.fact)}</i></span></a></h2>
      <p class="fade">${esc(next.pitch)}</p>
      <div class="actions late">${btn("View project", `${next.id}.html`)}</div>
    </div>
  </article>
</nav>`,
  });
});
