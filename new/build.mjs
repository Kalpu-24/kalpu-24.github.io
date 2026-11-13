#!/usr/bin/env node
/* Generates the static pages from src/content.mjs.  Run:  node build.mjs  */
import { writeFileSync } from "node:fs";
import { site, profile, headlineStats, timeline, skills, projects } from "./src/content.mjs";

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const fmt = (s) => esc(s).replace(/`([^`]+)`/g, "<code>$1</code>");
const byId = Object.fromEntries(projects.map((p) => [p.id, p]));
const img = (p, n) => `assets/games/${p.id}/${n}.webp`;
const arrow = `<svg class="i" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const out = `<svg class="i" viewBox="0 0 16 16" aria-hidden="true"><path d="M5 11 11 5M6 5h5v5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const ext = (url) => (/^https?:/.test(url) ? ` target="_blank" rel="noopener"` : "");
const theme = (p) => `--bg:${p.theme.bg};--surface:${p.theme.surface};--ink:${p.theme.ink};--muted:${p.theme.muted};--accent:${p.theme.accent};--on-accent:${p.theme.onAccent};--game-font:'${p.font}';--game-scale:${p.fontScale}`;
const FONTS = "https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..900&family=Inter:wght@400..700&family=JetBrains+Mono:wght@400;500&family=Jaro:opsz@6..72&family=Orbitron:wght@600..800&family=Pirata+One&family=Sour+Gummy:wght@500..700&display=swap";

function page({ file, title, description, image, body, bodyClass = "", style = "", themeColor = "#07080a" }) {
  const url = site.url + (file === "index.html" ? "" : file);
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
${site.noindex ? `<meta name="robots" content="noindex">\n` : ""}<meta name="theme-color" content="${themeColor}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="website">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:image" content="${site.url}${image}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" type="image/x-icon" href="public/favicon.ico">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="css/site.css">
<script src="js/site.js" defer></script>
</head>
<body class="${bodyClass}"${style ? ` style="${style}"` : ""}>
<a class="skip" href="#main">Skip to content</a>
<header class="top">
  <div class="wrap top__in">
    <a class="top__name" href="./">Kalp Shah</a>
    <nav class="top__nav" aria-label="Main">
      <a href="./#work">Work</a>
      <a href="./#about">About</a>
      <a href="./#contact">Contact</a>
      <a class="btn btn--small" href="${profile.resume}" target="_blank" rel="noopener">Résumé</a>
    </nav>
  </div>
</header>
<main id="main">
${body}
</main>
<footer class="foot" id="contact">
  <div class="wrap">
    <p class="label">Contact</p>
    <h2 class="foot__h">I'm open to new opportunities, or just a friendly chat.</h2>
    <a class="foot__mail" href="mailto:${profile.email}">${profile.email}</a>
    <ul class="foot__links">
      ${profile.links.map((l) => `<li><a href="${l.url}" target="_blank" rel="noopener">${esc(l.label)} ${out}</a></li>`).join("\n      ")}
      <li><a href="${profile.resume}" target="_blank" rel="noopener">Résumé (PDF) ${out}</a></li>
    </ul>
    <p class="foot__copy">© <span data-year>2026</span> Kalp Shah · ${esc(profile.location)}</p>
  </div>
</footer>
<dialog class="lightbox" id="lightbox" aria-label="Screenshot viewer">
  <img id="lightbox-img" alt="">
  <p class="lightbox__cap" id="lightbox-cap"></p>
  <button class="lightbox__btn lightbox__prev" id="lightbox-prev" aria-label="Previous">${arrow}</button>
  <button class="lightbox__btn lightbox__next" id="lightbox-next" aria-label="Next">${arrow}</button>
  <button class="lightbox__btn lightbox__close" id="lightbox-close" aria-label="Close">✕</button>
</dialog>
</body>
</html>
`;
  writeFileSync(new URL(file, import.meta.url), html);
  console.log("wrote", file);
}

/* ---------------------------------------------------------------- home */
function home() {
  const game = (p, i) => `
    <article class="slide${p.theme.bg > "#8" ? " slide--light" : ""}" style="${theme(p)}">
      <a class="slide__art" href="${p.id}.html" tabindex="-1" aria-hidden="true">
        <img src="${img(p, p.art.src)}" style="object-position:${p.art.pos}" alt="" loading="${i ? "lazy" : "eager"}">
      </a>
      ${p.prop ? `<img class="slide__prop slide__prop--${p.prop}" src="${img(p, "prop")}" alt="" data-drift loading="lazy">` : ""}
      <div class="slide__info">
        <div class="slide__main">
          <p class="label">${String(i + 1).padStart(2, "0")} / ${esc(p.kind)} · ${esc(p.year)}</p>
          <h3 class="slide__title"><a href="${p.id}.html">${esc(p.name)}</a></h3>
          <p class="slide__pitch">${esc(p.pitch)}</p>
        </div>
        <div class="slide__side">
          <p class="fact">${esc(p.fact)}</p>
          <p class="slide__role">${esc(p.role)}</p>
          <a class="btn btn--solid" href="${p.id}.html">View project ${arrow}</a>
        </div>
      </div>
    </article>`;

  const reel = [["rollemout", 3], ["aurarpg", 8], ["boomcorp", 4], ["tgf", 5]];

  const body = `
<section class="hero">
  <div class="hero__reel" aria-hidden="true">
    ${reel.map(([id, n]) => `<img src="assets/games/${id}/${n}.webp" alt="">`).join("\n    ")}
  </div>
  <div class="wrap hero__in">
    <p class="hero__who"><img src="assets/kalp.webp" width="56" height="56" alt=""> <span><b>${esc(profile.name)}</b>${esc(profile.role)} · ${esc(profile.location)}</span></p>
    <h1 class="hero__h">I build games in Unreal Engine 5 and C++.</h1>
    <p class="hero__p">${esc(profile.intro)}</p>
    <p class="hero__cta">
      <a class="btn btn--solid btn--big" href="#work">See the games ${arrow}</a>
      <a class="btn btn--big" href="mailto:${profile.email}">${profile.email}</a>
    </p>
  </div>
</section>

<section class="wrap">
  <dl class="numbers">
    ${headlineStats.map((s) => `<div><dt>${esc(s.l)}</dt><dd>${esc(s.v)}</dd></div>`).join("\n    ")}
  </dl>
</section>

<section class="wrap wrap--wide section" id="work">
  <header class="section__head">
    <p class="label">Selected work</p>
    <h2 class="big">The games</h2>
  </header>
  ${projects.map(game).join("\n")}
</section>

<section class="wrap section" id="skills">
  <header class="section__head">
    <p class="label">The dots show which games used it</p>
    <h2 class="big">Toolbox</h2>
  </header>
  <div class="skills">
    ${skills.map((g) => `<div class="skills__group">
      <h3>${esc(g.group)}</h3>
      <ul>
        ${g.items.map((s) => `<li><span>${esc(s.label)}</span><span class="skills__in">${s.in.map((id) => `<a href="${id}.html" style="--dot:${byId[id].theme.accent}" title="${esc(byId[id].name)}"><i></i><b>${esc(byId[id].name)}</b></a>`).join("")}</span></li>`).join("\n        ")}
      </ul>
    </div>`).join("\n    ")}
  </div>
  <p class="skills__key">${projects.map((p) => `<span style="--dot:${p.theme.accent}"><i></i>${esc(p.name)}</span>`).join("")}</p>
</section>

<section class="wrap section about" id="about">
  <div class="about__card">
    <p class="label">About</p>
    <h2>${esc(profile.about.punch)}</h2>
    ${profile.about.paragraphs.map((t) => `<p class="prose">${esc(t)}</p>`).join("\n    ")}
    <p><a class="btn" href="${profile.resume}" target="_blank" rel="noopener">Download résumé ${out}</a></p>
  </div>
  <ol class="path">
    ${timeline.map((t) => `<li>
      <p class="label">${esc(t.when)}</p>
      <h3>${t.to ? `<a href="${t.to}.html">${esc(t.what)}</a>` : esc(t.what)}</h3>
      <p>${esc(t.detail)}</p>
    </li>`).join("\n    ")}
  </ol>
</section>`;

  page({
    file: "index.html",
    title: "Kalp Shah — Game developer, Unreal Engine 5 and C++",
    description: "Kalp Shah builds games in Unreal Engine 5 and C++: Roll 'Em Out at Shortgun Games, the jam-winning Boom Corp., The Gravity Flip, AuraRPG and SnakeWall.",
    image: "assets/og.jpg",
    bodyClass: "home",
    body,
  });
}

/* ------------------------------------------------------------- project */
function project(p, i) {
  const next = projects[(i + 1) % projects.length];
  const facts = [["Role", p.role], ["When", p.period], ["Built with", p.engine], ["Platform", p.platform], ["Status", p.status]];
  const media = p.video
    ? `<div class="phone"><video src="${p.video.src}" poster="assets/games/${p.id}/demo-poster.jpg" width="${p.video.w}" height="${p.video.h}" controls muted loop playsinline preload="none" aria-label="${esc(p.video.caption)}"></video></div>`
    : `<img class="phead__img" src="${img(p, "key")}" style="object-position:${p.art.pos}" alt="" fetchpriority="high">`;

  const challenge = p.challenge.steps
    ? `<ol class="psr">${p.challenge.steps.map(([k, t]) => `<li><p class="label">${esc(k)}</p><p>${fmt(t)}</p></li>`).join("")}</ol>`
    : p.challenge.paragraphs.map((t) => `<p class="prose">${fmt(t)}</p>`).join("\n");

  const body = `
<article>
<header class="phead wrap${p.video ? " phead--phone" : ""}">
  <div class="phead__text">
    <p class="label"><a href="./#work">Work</a> / ${esc(p.kind)} · ${esc(p.year)}</p>
    <h1 class="phead__title">${esc(p.name)}</h1>
    <p class="phead__pitch">${esc(p.pitch)}</p>
    <p class="phead__cta">
      ${p.links.map((l, k) => `<a class="btn${k ? "" : " btn--solid"}" href="${l.url}"${ext(l.url)}>${esc(l.label)} <small>${esc(l.note)}</small> ${out}</a>`).join("\n      ")}
    </p>
  </div>
  ${media}
</header>

<section class="wrap">
  <dl class="facts">
    ${facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join("\n    ")}
  </dl>
  <dl class="stats">
    ${p.stats.map((s) => `<div><dt>${esc(s.l)}</dt><dd>${esc(s.v)}</dd></div>`).join("\n    ")}
  </dl>
</section>

<section class="wrap section section--split">
  <header class="section__head"><p class="label">Overview</p><h2>The game</h2></header>
  <div>
    ${p.overview.map((t) => `<p class="prose prose--lead">${fmt(t)}</p>`).join("\n    ")}
    <ul class="tags">${p.tags.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
  </div>
</section>
${p.toy ? `
<section class="wrap section">
  <div class="toy" data-toy="${p.toy.kind}">
    <div class="toy__side">
      <p class="label">Playable</p>
      <h2>${esc(p.toy.title)}</h2>
      <p>${esc(p.toy.text)}</p>
      <dl class="toy__stats" data-toy-stats></dl>
      <p class="toy__msg" data-toy-msg aria-live="polite"></p>
      <div class="toy__actions" data-toy-actions></div>
    </div>
    <div class="toy__board" data-toy-board></div>
  </div>
</section>` : ""}

<section class="wrap section">
  <header class="section__head"><p class="label">${p.role.startsWith("Solo") || p.role.startsWith("Creator") ? "Systems" : "My part"}</p><h2>${esc(p.systemsTitle)}</h2></header>
  <div class="systems${p.systems.length % 3 ? " systems--2" : ""}">
    ${p.systems.map((s, k) => `<div class="system"><p class="system__n">${String(k + 1).padStart(2, "0")}</p><h3>${esc(s.title)}</h3><p>${fmt(s.text)}</p></div>`).join("\n    ")}
  </div>
  ${p.codebase ? `<p class="codebase">${esc(p.codebase.lines)} lines of ${p.id === "snakewall" ? "Java" : "C++"} in ${p.codebase.files} source files.</p>` : ""}
</section>
${p.flow ? `
<section class="wrap section">
  <header class="section__head"><p class="label">Step by step</p><h2>${esc(p.flow.title)}</h2>${p.flow.intro ? `<p class="prose">${fmt(p.flow.intro)}</p>` : ""}</header>
  <ol class="flow">
    ${p.flow.steps.map((s) => `<li><h3>${esc(s.t)}</h3><p>${fmt(s.d)}</p></li>`).join("\n    ")}
  </ol>
</section>` : ""}
${p.devlog ? `
<section class="wrap section section--split">
  <header class="section__head"><p class="label">Timeline</p><h2>${esc(p.devlog.title)}</h2></header>
  <ol class="devlog">
    ${p.devlog.items.map((d) => `<li><time>${esc(d.d)}</time><p>${fmt(d.t)}</p></li>`).join("\n    ")}
  </ol>
</section>` : ""}

<section class="wrap section${p.challenge.steps ? "" : " section--split"}">
  <header class="section__head"><p class="label">The hard part</p><h2>${esc(p.challenge.title)}</h2></header>
  ${p.challenge.steps ? challenge : `<div>${challenge}</div>`}
</section>

<section class="wrap section">
  <header class="section__head"><p class="label">Gallery</p><h2>Screenshots</h2></header>
  <div class="shots${p.shots[0].h > p.shots[0].w ? " shots--tall" : ""}">
    ${p.shots.map((s) => `<button class="shot" data-full="${img(p, s.n)}" data-alt="${esc(s.alt)}"><img src="${img(p, s.n + "-sm")}" width="${s.w}" height="${s.h}" loading="lazy" alt="${esc(s.alt)}"></button>`).join("\n    ")}
  </div>
</section>
${p.reviews.length ? `
<section class="wrap section">
  <header class="section__head"><p class="label">Reception</p><h2>What players said</h2></header>
  <div class="quotes">
    ${p.reviews.map((r) => `<figure class="quote"><blockquote>${esc(r.text)}</blockquote><figcaption><b>${esc(r.author)}</b> ${esc(r.role)}</figcaption></figure>`).join("\n    ")}
  </div>
</section>` : ""}
${(p.notes || []).map((n) => `
<section class="wrap section section--split section--note">
  <header class="section__head"><p class="label">Note</p><h2>${esc(n.title)}</h2></header>
  <div>${n.paragraphs.map((t) => `<p class="prose">${fmt(t)}</p>`).join("")}</div>
</section>`).join("")}
</article>

<nav class="wrap next" aria-label="Next project">
  <a href="${next.id}.html" style="${theme(next)}">
    <span class="label">Next project</span>
    <span class="next__title">${esc(next.name)}</span>
    <span class="next__kind">${esc(next.kind)} · ${esc(next.year)} ${arrow}</span>
  </a>
</nav>`;

  page({
    file: `${p.id}.html`,
    title: `${p.name} — ${p.kind} · Kalp Shah`,
    description: p.pitch,
    image: img(p, "key"),
    bodyClass: p.theme.bg > "#8" ? "proj proj--light" : "proj",
    themeColor: p.theme.bg,
    style: theme(p),
    body,
  });
}

home();
projects.forEach(project);
