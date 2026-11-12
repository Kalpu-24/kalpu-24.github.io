// Small playable versions of two games, shown at the top of their pages.
import { icon } from "./shared.js";

const parts = (root) => ({
  board: root.querySelector("#toy-board"),
  stats: root.querySelector("#toy-stats"),
  msg: root.querySelector("#toy-msg"),
  actions: root.querySelector("#toy-actions"),
});
const stat = (value, label) => `<div><dd>${value}</dd><dt>${label}</dt></div>`;
const clock = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

// ---- Boom Corp.: 8×8 grid, 8 planted tiles ---------------------------------
export function mines(root) {
  const { board, stats, msg, actions } = parts(root);
  const N = 8, MINES = 8;
  let cells, state, flagMode = false, seconds, timer, focus = 0;

  const around = (i) => {
    const out = [], x = i % N, y = Math.floor(i / N);
    for (let dy = -1; dy <= 1; dy++)
      for (let dx = -1; dx <= 1; dx++) {
        const nx = x + dx, ny = y + dy;
        if ((dx || dy) && nx >= 0 && ny >= 0 && nx < N && ny < N) out.push(ny * N + nx);
      }
    return out;
  };

  function reset() {
    cells = Array.from({ length: N * N }, () => ({ mine: false, open: false, flag: false, n: 0 }));
    state = "ready";
    seconds = 0;
    clearInterval(timer);
    msg.textContent = "Scan a tile to begin. The first one is always safe.";
    draw();
  }

  function plant(safe) {
    const banned = new Set([safe, ...around(safe)]);
    let left = MINES;
    while (left) {
      const i = Math.floor(Math.random() * N * N);
      if (cells[i].mine || banned.has(i)) continue;
      cells[i].mine = true;
      left--;
    }
    cells.forEach((c, i) => (c.n = around(i).filter((j) => cells[j].mine).length));
    state = "playing";
    msg.textContent = "Each number is how many planted tiles touch that tile. Right-click, F or Mark mode marks one.";
    timer = setInterval(() => { seconds++; drawStats(); }, 1000);
  }

  function scan(i) {
    const c = cells[i];
    if (state === "won" || state === "lost" || c.open || c.flag) return;
    if (state === "ready") plant(i);
    if (c.mine) return end("lost", i);
    const queue = [i];
    while (queue.length) {
      const k = queue.pop(), cell = cells[k];
      if (cell.open || cell.flag) continue;
      cell.open = true;
      if (!cell.n) queue.push(...around(k));
    }
    if (cells.every((x) => x.open || x.mine)) return end("won");
    draw();
  }

  function mark(i) {
    const c = cells[i];
    if (state === "won" || state === "lost" || c.open) return;
    c.flag = !c.flag;
    draw();
  }

  function end(result, hit) {
    state = result;
    clearInterval(timer);
    cells.forEach((c) => { if (c.mine) c.open = true; });
    if (hit !== undefined) cells[hit].hit = true;
    msg.textContent = result === "won" ? `Room cleared in ${clock(seconds)}. Every planted tile located.` : "Boom. One wrong move, immediate consequences.";
    draw();
  }

  function drawStats() {
    const safeLeft = cells.filter((c) => !c.open && !c.mine).length;
    const flags = cells.filter((c) => c.flag).length;
    stats.innerHTML = stat(safeLeft, "Safe tiles left") + stat(`${flags} / ${MINES}`, "Marked") + stat(clock(seconds), "Time");
  }

  function draw() {
    board.className = `toy__board mines is-${state}`;
    board.innerHTML = cells
      .map((c, i) => {
        const label = c.open ? (c.mine ? "planted tile" : c.n ? `${c.n} nearby` : "clear") : c.flag ? "marked" : "unscanned";
        const cls = c.open ? (c.mine ? "is-mine" : `is-open n${c.n}`) : c.flag ? "is-flag" : "";
        const inner = c.open ? (c.mine ? "✕" : c.n || "") : c.flag ? icon("flag") : "";
        return `<button class="tile ${cls}${c.hit ? " is-hit" : ""}" data-i="${i}" tabindex="${i === focus ? 0 : -1}" aria-label="Row ${Math.floor(i / N) + 1}, column ${(i % N) + 1}: ${label}">${inner}</button>`;
      })
      .join("");
    actions.innerHTML = `
      <button class="btn${flagMode ? " btn--solid" : ""}" id="toy-flag" aria-pressed="${flagMode}">${icon("flag")} Mark mode</button>
      <button class="btn" id="toy-reset">New room</button>`;
    drawStats();
  }

  board.addEventListener("click", (e) => {
    const t = e.target.closest(".tile");
    if (!t) return;
    focus = +t.dataset.i;
    flagMode ? mark(focus) : scan(focus);
    board.querySelector(`[data-i="${focus}"]`)?.focus();
  });
  board.addEventListener("contextmenu", (e) => {
    const t = e.target.closest(".tile");
    if (!t) return;
    e.preventDefault();
    focus = +t.dataset.i;
    mark(focus);
  });
  board.addEventListener("keydown", (e) => {
    const t = e.target.closest(".tile");
    if (!t) return;
    const i = +t.dataset.i;
    const move = { ArrowLeft: i % N ? -1 : 0, ArrowRight: i % N < N - 1 ? 1 : 0, ArrowUp: i >= N ? -N : 0, ArrowDown: i < N * (N - 1) ? N : 0 }[e.key];
    if (move !== undefined) {
      e.preventDefault();
      focus = i + move;
      board.querySelectorAll(".tile").forEach((el, k) => (el.tabIndex = k === focus ? 0 : -1));
      board.querySelector(`[data-i="${focus}"]`).focus();
    } else if (e.key.toLowerCase() === "f") {
      focus = i;
      mark(i);
      board.querySelector(`[data-i="${i}"]`).focus();
    }
  });
  actions.addEventListener("click", (e) => {
    if (e.target.closest("#toy-flag")) { flagMode = !flagMode; draw(); }
    if (e.target.closest("#toy-reset")) reset();
  });

  reset();
}

// ---- SnakeWall: dot-grid Snake with on-screen buttons -----------------------
export function snake(root) {
  const { board, stats, msg, actions } = parts(root);
  const N = 15; // odd-number square grid, as in the wallpaper
  const STEP = 150;
  board.className = "toy__board snake";
  board.innerHTML = `
    <canvas class="snake__screen" width="${N * 24}" height="${N * 24}" role="img" aria-label="Snake playing field"></canvas>
    <div class="snake__pad" aria-label="Steer">
      <button class="btn" data-dir="0,-1" aria-label="Up">↑</button>
      <button class="btn" data-dir="-1,0" aria-label="Left">←</button>
      <button class="btn" data-dir="0,1" aria-label="Down">↓</button>
      <button class="btn" data-dir="1,0" aria-label="Right">→</button>
    </div>`;
  const canvas = board.querySelector("canvas");
  const ctx = canvas.getContext("2d");
  let body, dir, next, food, score, best = 0, state = "ready", loop;

  const css = (name) => getComputedStyle(root).getPropertyValue(name).trim();
  const free = () => {
    let p;
    do p = [Math.floor(Math.random() * N), Math.floor(Math.random() * N)];
    while (body.some(([x, y]) => x === p[0] && y === p[1]));
    return p;
  };

  function reset() {
    const mid = (N - 1) / 2;
    body = [[mid, mid], [mid - 1, mid], [mid - 2, mid]];
    dir = next = [1, 0];
    score = 0;
    food = free();
    draw();
  }

  function draw() {
    const cell = canvas.width / N;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const dot = (x, y, r, colour) => {
      ctx.fillStyle = colour;
      ctx.beginPath();
      ctx.arc(x * cell + cell / 2, y * cell + cell / 2, r, 0, Math.PI * 2);
      ctx.fill();
    };
    const ink = css("--ink"), faint = css("--line") || "rgba(128,128,128,.25)";
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) dot(x, y, 1.6, faint);
    dot(food[0], food[1], cell * 0.4, css("--accent"));
    body.forEach(([x, y]) => dot(x, y, cell * 0.4, ink));
    stats.innerHTML = stat(score, "Score") + stat(best, "Best this visit");
    actions.innerHTML = `<button class="btn btn--solid" id="toy-go">${state === "playing" ? "Pause" : state === "paused" ? "Resume" : state === "over" ? "Play again" : "Start"}</button>`;
  }

  function tick() {
    dir = next;
    const head = [body[0][0] + dir[0], body[0][1] + dir[1]];
    const hitWall = head[0] < 0 || head[1] < 0 || head[0] >= N || head[1] >= N;
    if (hitWall || body.some(([x, y]) => x === head[0] && y === head[1])) return stop("over", `Game over at ${score}. The wallpaper version saves your game when you leave the home screen.`);
    body.unshift(head);
    if (head[0] === food[0] && head[1] === food[1]) {
      score++;
      best = Math.max(best, score);
      food = free();
    } else body.pop();
    draw();
  }

  function start() {
    if (state === "over" || state === "ready") reset();
    state = "playing";
    msg.textContent = "Arrow keys or the buttons steer. Esc pauses.";
    clearInterval(loop);
    loop = setInterval(tick, STEP);
    draw();
  }
  function stop(to, text) {
    state = to;
    clearInterval(loop);
    msg.textContent = text;
    draw();
  }
  const pause = () => state === "playing" && stop("paused", "Paused. Your game is kept, like the wallpaper does on pause.");
  const steer = ([x, y]) => {
    if (state !== "playing") start();
    if (x !== -dir[0] || y !== -dir[1]) next = [x, y];
  };

  actions.addEventListener("click", (e) => {
    if (e.target.closest("#toy-go")) state === "playing" ? pause() : start();
  });
  board.querySelector(".snake__pad").addEventListener("click", (e) => {
    const b = e.target.closest("[data-dir]");
    if (b) steer(b.dataset.dir.split(",").map(Number));
  });
  // Keys steer only while a game is running, so the page still scrolls normally otherwise.
  addEventListener("keydown", (e) => {
    if (state !== "playing") return;
    const d = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0], w: [0, -1], s: [0, 1], a: [-1, 0], d: [1, 0] }[e.key];
    if (d) { e.preventDefault(); steer(d); }
    else if (e.key === "Escape") pause();
  });
  document.addEventListener("visibilitychange", () => document.hidden && pause());
  new IntersectionObserver(([entry]) => !entry.isIntersecting && pause()).observe(board);

  reset();
  msg.textContent = "Press Start, then steer.";
}
