/* kalpshah.dev/next — sideways work reel, scene entries, screenshot viewer, two small games. */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  root.classList.add("js");

  /* ---- The work reel: scroll down, the panels move sideways -------------- */
  const reel = $(".reel");
  if (reel) {
    const track = $("#reel-track");
    const panels = $$(".panel", track);
    const now = $("#reel-now");
    const bar = $("#reel-bar");
    let travel = 0;
    let on = false;

    const measure = () => {
      const want = innerWidth > 900 && innerHeight > 600 && !calm;
      if (want !== on) {
        on = want;
        root.classList.toggle("is-reel", on);
        if (!on) { reel.style.height = ""; track.style.transform = ""; }
      }
      if (!on) return;
      const last = panels.at(-1);
      // Travel far enough to centre the last panel.
      travel = Math.max(0, last.offsetLeft);
      reel.style.height = `${innerHeight + travel}px`;
      move();
    };
    const move = () => {
      if (!on) return;
      const p = Math.min(1, Math.max(0, -reel.getBoundingClientRect().top / (travel || 1)));
      const x = p * travel;
      track.style.transform = `translate3d(${-x}px,0,0)`;
      const mid = x + innerWidth / 2;
      let best = 0;
      panels.forEach((el, i) => { if (Math.abs(el.offsetLeft + el.offsetWidth / 2 - mid) < Math.abs(panels[best].offsetLeft + panels[best].offsetWidth / 2 - mid)) best = i; });
      now.textContent = String(best + 1).padStart(2, "0");
      bar.style.transform = `translateX(${p * 400}%)`;
    };
    // Tabbing to a panel that is off to the side brings it to the middle.
    const goTo = (el) => {
      if (!on) return el.scrollIntoView({ block: "start" });
      const x = Math.min(travel, Math.max(0, el.offsetLeft));
      scrollTo({ top: reel.getBoundingClientRect().top + scrollY + x, behavior: calm ? "auto" : "smooth" });
    };
    track.addEventListener("focusin", (e) => {
      const p = e.target.closest(".panel");
      $(".reel__sticky").scrollLeft = 0;
      if (p && on) goTo(p);
    });
    const fromHash = () => {
      const el = location.hash.startsWith("#work-") && document.getElementById(location.hash.slice(1));
      if (el) { measure(); goTo(el); }
    };
    addEventListener("scroll", move, { passive: true });
    addEventListener("resize", measure);
    addEventListener("hashchange", fromHash);
    addEventListener("load", () => { measure(); fromHash(); });
    document.fonts?.ready.then(measure);
    measure();
  }

  /* ---- Scenes build themselves once, when they come into view ---------- */
  const scenes = $$(".scene");
  if (calm || !("IntersectionObserver" in window)) scenes.forEach((el) => el.classList.add("is-in"));
  else {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } }),
      { threshold: 0.3 }
    );
    scenes.forEach((el) => {
      // A tall section would never be 30% on screen, so those start as soon as they show.
      if (el.offsetHeight > innerHeight * 1.2) new IntersectionObserver(([e], o) => { if (e.isIntersecting) { el.classList.add("is-in"); o.disconnect(); } }, { rootMargin: "0px 0px -15% 0px" }).observe(el);
      else io.observe(el);
    });
  }

  /* ---- No hover on touch screens: colour the picture that is mid-screen ---- */
  if (matchMedia("(hover: none)").matches && "IntersectionObserver" in window) {
    const live = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.target.classList.toggle("is-live", e.isIntersecting)),
      { rootMargin: "-25% 0px -25% 0px" }
    );
    // Watch the whole panel where there is one, so its cut-out character colours with it.
    $$(".frame").forEach((el) => live.observe(el.closest(".panel__art") || el));
  }

  /* ---- "See it running": plays like a live wallpaper while on screen --------- */
  const demo = $(".demo__screen");
  if (demo) {
    const video = $("video", demo);
    let wanted = !calm; // with reduced motion it waits for a tap
    const show = () => {
      const paused = !wanted;
      demo.classList.toggle("is-paused", paused);
      demo.setAttribute("aria-label", paused ? "Play the recording" : "Pause the recording");
    };
    const sync = (visible) => {
      if (wanted && visible) video.play().catch(() => { wanted = false; show(); });
      else video.pause();
    };
    let onScreen = false;
    new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; sync(onScreen); }, { threshold: 0.4 }).observe(demo);
    demo.addEventListener("click", () => { wanted = !wanted; show(); sync(onScreen); });
    document.addEventListener("visibilitychange", () => sync(onScreen && !document.hidden));
    show();
  }

  /* ---- Screenshot viewer ------------------------------------------------- */
  const box = $("#lightbox");
  const shots = $$("[data-shot]");
  if (box && shots.length) {
    const pic = $("#lightbox-img");
    const count = $("#lightbox-count");
    let at = 0;
    const open = (i) => {
      at = (i + shots.length) % shots.length;
      const b = shots[at];
      pic.src = b.dataset.full;
      pic.width = b.dataset.w;
      pic.height = b.dataset.h;
      pic.alt = $("img", b).alt;
      count.textContent = `${String(at + 1).padStart(2, "0")} / ${String(shots.length).padStart(2, "0")}`;
      if (!box.open) box.showModal();
    };
    shots.forEach((b, i) => b.addEventListener("click", () => open(i)));
    $("#lightbox-prev").addEventListener("click", () => open(at - 1));
    $("#lightbox-next").addEventListener("click", () => open(at + 1));
    $("#lightbox-close").addEventListener("click", () => box.close());
    box.addEventListener("click", (e) => { if (e.target === box) box.close(); });
    box.addEventListener("keydown", (e) => { if (e.key === "ArrowRight") open(at + 1); if (e.key === "ArrowLeft") open(at - 1); });
  }

  /* ---- Playable versions ------------------------------------------------- */
  const toy = $("#toy");
  if (!toy) return;
  const board = $("#toy-board"), stats = $("#toy-stats"), msg = $("#toy-msg"), actions = $("#toy-actions");
  const stat = (v, l) => `<div><dd>${v}</dd><dt>${l}</dt></div>`;
  const clock = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  const flagIcon = '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 21V4M6 5h11l-2.5 3.5L17 12H6"/></svg>';

  /* Boom Corp.: an 8 × 8 room with 8 explosives. */
  function mines() {
    const N = 8, COUNT = 8;
    let cells, state, marking = false, seconds, timer, focus = 0;
    const around = (i) => {
      const o = [], x = i % N, y = Math.floor(i / N);
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        const nx = x + dx, ny = y + dy;
        if ((dx || dy) && nx >= 0 && ny >= 0 && nx < N && ny < N) o.push(ny * N + nx);
      }
      return o;
    };
    const reset = () => {
      cells = Array.from({ length: N * N }, () => ({ mine: false, open: false, flag: false, n: 0 }));
      state = "ready"; seconds = 0; clearInterval(timer);
      msg.textContent = "Clear a tile to begin.";
      draw();
    };
    const plant = (safe) => {
      const banned = new Set([safe, ...around(safe)]);
      for (let left = COUNT; left; ) {
        const i = Math.floor(Math.random() * N * N);
        if (cells[i].mine || banned.has(i)) continue;
        cells[i].mine = true; left--;
      }
      cells.forEach((c, i) => (c.n = around(i).filter((j) => cells[j].mine).length));
      state = "playing";
      msg.textContent = "Each number is how many explosives touch that tile.";
      timer = setInterval(() => { seconds++; drawStats(); }, 1000);
    };
    const end = (result, hit) => {
      state = result; clearInterval(timer);
      cells.forEach((c) => { if (c.mine) c.open = true; });
      if (hit !== undefined) cells[hit].hit = true;
      msg.textContent = result === "won" ? `Room cleared in ${clock(seconds)}. All 56 safe tiles gone, 8 explosives untouched.` : "Boom. That one was live.";
      draw();
    };
    const clear = (i) => {
      const c = cells[i];
      if (state === "won" || state === "lost" || c.open || c.flag) return;
      if (state === "ready") plant(i);
      if (c.mine) return end("lost", i);
      const q = [i];
      while (q.length) { const k = q.pop(), cell = cells[k]; if (cell.open || cell.flag) continue; cell.open = true; if (!cell.n) q.push(...around(k)); }
      if (cells.every((x) => x.open || x.mine)) return end("won");
      draw();
    };
    const mark = (i) => { const c = cells[i]; if (state === "won" || state === "lost" || c.open) return; c.flag = !c.flag; draw(); };
    const drawStats = () => {
      stats.innerHTML = stat(cells.filter((c) => !c.open && !c.mine).length, "Safe tiles left") + stat(`${cells.filter((c) => c.flag).length} / ${COUNT}`, "Marked") + stat(clock(seconds), "Time");
    };
    const draw = () => {
      board.className = `toy__board mines is-${state}`;
      board.innerHTML = cells.map((c, i) => {
        const label = c.open ? (c.mine ? "explosive" : c.n ? `${c.n} nearby` : "clear") : c.flag ? "marked" : "covered";
        const cls = c.open ? (c.mine ? "is-mine" : `is-open n${c.n}`) : c.flag ? "is-flag" : "";
        const inner = c.open ? (c.mine ? "✕" : c.n || "") : c.flag ? flagIcon : "";
        return `<button class="tile ${cls}${c.hit ? " is-hit" : ""}" data-i="${i}" tabindex="${i === focus ? 0 : -1}" aria-label="Row ${Math.floor(i / N) + 1}, column ${(i % N) + 1}: ${label}">${inner}</button>`;
      }).join("");
      actions.innerHTML = `<button class="btn" id="toy-mark" aria-pressed="${marking}">${flagIcon} Mark mode</button><button class="btn btn--solid" id="toy-reset">New room</button>`;
      drawStats();
    };
    const refocus = () => $(`[data-i="${focus}"]`, board)?.focus();
    board.addEventListener("click", (e) => { const t = e.target.closest(".tile"); if (!t) return; focus = +t.dataset.i; marking ? mark(focus) : clear(focus); refocus(); });
    board.addEventListener("contextmenu", (e) => { const t = e.target.closest(".tile"); if (!t) return; e.preventDefault(); focus = +t.dataset.i; mark(focus); });
    board.addEventListener("keydown", (e) => {
      const t = e.target.closest(".tile"); if (!t) return;
      const i = +t.dataset.i;
      const step = { ArrowLeft: i % N ? -1 : 0, ArrowRight: i % N < N - 1 ? 1 : 0, ArrowUp: i >= N ? -N : 0, ArrowDown: i < N * (N - 1) ? N : 0 }[e.key];
      if (step !== undefined) { e.preventDefault(); focus = i + step; $$(".tile", board).forEach((el, k) => (el.tabIndex = k === focus ? 0 : -1)); refocus(); }
      else if (e.key.toLowerCase() === "f") { focus = i; mark(i); refocus(); }
    });
    actions.addEventListener("click", (e) => { if (e.target.closest("#toy-mark")) { marking = !marking; draw(); } if (e.target.closest("#toy-reset")) reset(); });
    reset();
  }

  /* SnakeWall: 19 × 19, wrapping walls, a step that shortens every third piece of food. */
  function snake() {
    const N = 19, START = 200, FLOOR = 70;
    board.className = "toy__board snake";
    board.innerHTML = `<canvas class="snake__screen" width="${N * 22}" height="${N * 22}" role="img" aria-label="Snake playing field"></canvas>
      <div class="snake__pad" aria-label="Steer"><button data-dir="0,-1" aria-label="Up">↑</button><button data-dir="-1,0" aria-label="Left">←</button><button data-dir="0,1" aria-label="Down">↓</button><button data-dir="1,0" aria-label="Right">→</button></div>`;
    const canvas = $("canvas", board), ctx = canvas.getContext("2d");
    const css = (n) => getComputedStyle(toy).getPropertyValue(n).trim();
    let body, dir, next, food, score, eaten, step, best = 0, state = "ready", loop;
    const free = () => { let p; do p = [Math.floor(Math.random() * N), Math.floor(Math.random() * N)]; while (body.some(([x, y]) => x === p[0] && y === p[1])); return p; };
    const reset = () => { const m = (N - 1) / 2; body = [[m, m], [m - 1, m], [m - 2, m]]; dir = next = [1, 0]; score = eaten = 0; step = START; food = free(); draw(); };
    const draw = () => {
      const cell = canvas.width / N;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const dot = (x, y, r, c) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x * cell + cell / 2, y * cell + cell / 2, r, 0, Math.PI * 2); ctx.fill(); };
      for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) dot(x, y, 1.5, css("--mist"));
      dot(food[0], food[1], cell * 0.4, css("--fill"));
      body.forEach(([x, y]) => dot(x, y, cell * 0.4, css("--ink")));
      stats.innerHTML = stat(score, "Score") + stat(best, "Best this visit") + stat(`${step} ms`, "Step");
      actions.innerHTML = `<button class="btn btn--solid" id="toy-go">${state === "playing" ? "Pause" : state === "paused" ? "Resume" : state === "over" ? "Play again" : "Start"}</button>`;
    };
    const run = () => { clearInterval(loop); loop = setInterval(tick, step); };
    const tick = () => {
      dir = next;
      const head = [(body[0][0] + dir[0] + N) % N, (body[0][1] + dir[1] + N) % N];
      if (body.some(([x, y]) => x === head[0] && y === head[1])) return stop("over", `Game over at ${score}.`);
      body.unshift(head);
      if (head[0] === food[0] && head[1] === food[1]) {
        score++; eaten++; best = Math.max(best, score); food = free();
        if (eaten % 3 === 0 && step > FLOOR) { step = Math.max(FLOOR, step - Math.max(4, Math.round((step - 60) * 0.12))); run(); }
      } else body.pop();
      draw();
    };
    const start = () => { if (state === "over" || state === "ready") reset(); state = "playing"; msg.textContent = "Arrow keys or the buttons steer. Esc pauses."; run(); draw(); };
    const stop = (to, text) => { state = to; clearInterval(loop); msg.textContent = text; draw(); };
    const pause = () => state === "playing" && stop("paused", "Paused. The wallpaper pauses itself too, to save battery.");
    const steer = ([x, y]) => { if (state !== "playing") start(); if (x !== -dir[0] || y !== -dir[1]) next = [x, y]; };
    actions.addEventListener("click", (e) => { if (e.target.closest("#toy-go")) state === "playing" ? pause() : start(); });
    $(".snake__pad", board).addEventListener("click", (e) => { const b = e.target.closest("[data-dir]"); if (b) steer(b.dataset.dir.split(",").map(Number)); });
    // Keys steer only while a game is running, so the page scrolls normally otherwise.
    addEventListener("keydown", (e) => {
      if (state !== "playing") return;
      const d = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0], w: [0, -1], s: [0, 1], a: [-1, 0], d: [1, 0] }[e.key];
      if (d) { e.preventDefault(); steer(d); } else if (e.key === "Escape") pause();
    });
    document.addEventListener("visibilitychange", () => document.hidden && pause());
    new IntersectionObserver(([en]) => !en.isIntersecting && pause()).observe(board);
    reset();
    msg.textContent = "Press Start, then steer.";
  }

  ({ mines, snake })[toy.dataset.kind]?.();
})();
