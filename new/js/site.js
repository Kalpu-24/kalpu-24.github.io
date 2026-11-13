/* Lightbox, footer year, and the two playable demos. No dependencies. */
(() => {
  document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

  /* Home: characters that drift as their slide crosses the screen ------ */
  const drifters = [...document.querySelectorAll("[data-drift]")];
  if (drifters.length && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    let queued = false;
    const place = () => {
      queued = false;
      for (const el of drifters) {
        const r = el.parentElement.getBoundingClientRect();
        const p = (r.top + r.height / 2 - innerHeight / 2) / (innerHeight / 2 + r.height / 2);
        el.style.setProperty("--p", Math.max(-1, Math.min(1, p)).toFixed(3));
      }
    };
    addEventListener("scroll", () => { if (!queued) { queued = true; requestAnimationFrame(place); } }, { passive: true });
    addEventListener("resize", place);
    place();
  }

  /* Home: toolbox graph ------------------------------------------------ */
  const tree = document.querySelector("[data-tree]");
  if (tree) {
    const svg = tree.querySelector("svg");
    const nodes = [...tree.querySelectorAll(".node")];
    const wire = () => {
      const box = tree.getBoundingClientRect();
      svg.innerHTML = nodes.filter((n) => n.dataset.parent).map((n) => {
        const a = document.getElementById(`skill-${n.dataset.parent}`).getBoundingClientRect();
        const b = n.getBoundingClientRect();
        const y2 = b.top + b.height / 2 - box.top;
        let d;
        if (b.left >= a.right) {
          // Sideways: a curve from the parent's right edge to the child's left edge.
          const x1 = a.right - box.left, y1 = a.top + a.height / 2 - box.top, x2 = b.left - box.left, mid = (x1 + x2) / 2;
          d = `M${x1},${y1} C${mid},${y1} ${mid},${y2} ${x2},${y2}`;
        } else {
          // Stacked: an elbow down from under the parent, then across to the child.
          const x1 = a.left - box.left + 16, y1 = a.bottom - box.top, x2 = b.left - box.left;
          d = `M${x1},${y1} V${y2 - 8} Q${x1},${y2} ${x1 + 8},${y2} H${x2}`;
        }
        return `<path d="${d}" data-to="${n.id}"/>`;
      }).join("");
      light(tree.dataset.game);
    };
    const light = (game) => {
      const key = document.querySelector("[data-tree-key]");
      key.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", b.dataset.game === game));
      if (game) { tree.dataset.game = game; tree.style.setProperty("--hl", getComputedStyle(key.querySelector(`[data-game="${game}"]`)).getPropertyValue("--dot")); }
      else delete tree.dataset.game;
      nodes.forEach((n) => n.classList.toggle("is-on", !!game && n.dataset.in.split(" ").includes(game)));
      svg.querySelectorAll("path").forEach((p) => p.classList.toggle("is-on", document.getElementById(p.dataset.to).classList.contains("is-on")));
    };
    document.querySelector("[data-tree-key]").addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (b) light(tree.dataset.game === b.dataset.game ? undefined : b.dataset.game);
    });
    new ResizeObserver(wire).observe(tree);
    document.fonts?.ready.then(wire);
    wire();
  }

  /* Screenshot lightbox ------------------------------------------------ */
  const box = document.getElementById("lightbox");
  const shots = [...document.querySelectorAll(".shot")];
  if (box && shots.length && box.showModal) {
    const pic = document.getElementById("lightbox-img");
    const cap = document.getElementById("lightbox-cap");
    let at = 0;
    const show = (i) => {
      at = (i + shots.length) % shots.length;
      pic.src = shots[at].dataset.full;
      pic.alt = shots[at].dataset.alt;
      cap.textContent = `${at + 1} / ${shots.length} · ${shots[at].dataset.alt}`;
    };
    shots.forEach((s, i) => s.addEventListener("click", () => { show(i); box.showModal(); }));
    document.getElementById("lightbox-prev").addEventListener("click", () => show(at - 1));
    document.getElementById("lightbox-next").addEventListener("click", () => show(at + 1));
    document.getElementById("lightbox-close").addEventListener("click", () => box.close());
    box.addEventListener("click", (e) => { if (e.target === box) box.close(); });
    box.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") show(at - 1);
      if (e.key === "ArrowRight") show(at + 1);
    });
    box.addEventListener("close", () => shots[at].focus());
  }

  /* Playable demos ----------------------------------------------------- */
  const toy = document.querySelector("[data-toy]");
  if (!toy) return;
  const ui = {
    board: toy.querySelector("[data-toy-board]"),
    stats: toy.querySelector("[data-toy-stats]"),
    msg: toy.querySelector("[data-toy-msg]"),
    actions: toy.querySelector("[data-toy-actions]"),
  };
  const stat = (pairs) => (ui.stats.innerHTML = pairs.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join(""));

  /* Boom Corp.: 8 x 8 room, 8 explosives ------------------------------- */
  function mines() {
    const N = 8, M = 8;
    let cells, state, markMode = false, left;
    const around = (i) => {
      const r = Math.floor(i / N), c = i % N, list = [];
      for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
        const rr = r + dr, cc = c + dc;
        if ((dr || dc) && rr >= 0 && rr < N && cc >= 0 && cc < N) list.push(rr * N + cc);
      }
      return list;
    };
    const reset = () => {
      cells = Array.from({ length: N * N }, () => ({ mine: false, open: false, mark: false, n: 0 }));
      state = "ready"; left = N * N - M;
      ui.msg.textContent = "Clear a tile to begin.";
      draw();
    };
    const plant = (safe) => {
      const free = cells.map((_, i) => i).filter((i) => i !== safe);
      for (let k = 0; k < M; k++) cells[free.splice(Math.floor(Math.random() * free.length), 1)[0]].mine = true;
      cells.forEach((c, i) => (c.n = around(i).filter((j) => cells[j].mine).length));
    };
    const open = (i) => {
      const c = cells[i];
      if (c.open || c.mark) return;
      c.open = true;
      if (c.mine) { state = "lost"; return; }
      left--;
      if (!c.n) around(i).forEach(open);
    };
    const act = (i, mark) => {
      if (state === "won" || state === "lost") return;
      const c = cells[i];
      if (mark) { if (!c.open && state !== "ready") c.mark = !c.mark; }
      else {
        if (state === "ready") { plant(i); state = "playing"; }
        open(i);
        if (state !== "lost" && left === 0) state = "won";
      }
      ui.msg.textContent = state === "won" ? "Room cleared. Every explosive located." : state === "lost" ? "Boom. That one was live." : "Numbers count the explosives touching a tile.";
      draw(i);
    };
    const draw = (focus) => {
      const over = state === "won" || state === "lost";
      ui.board.className = "toy__board mines";
      ui.board.innerHTML = cells.map((c, i) => {
        const showMine = over && c.mine;
        const cls = showMine ? "is-mine" : c.open ? "is-open" : c.mark ? "is-mark" : "";
        const label = `Row ${Math.floor(i / N) + 1}, column ${(i % N) + 1}: ${showMine ? "explosive" : c.open ? `${c.n} adjacent` : c.mark ? "marked" : "covered"}`;
        return `<button class="tile ${cls}" data-i="${i}" aria-label="${label}">${c.open && !c.mine && c.n ? c.n : ""}</button>`;
      }).join("");
      stat([["Safe tiles left", left], ["Marked", `${cells.filter((c) => c.mark).length} / ${M}`]]);
      ui.actions.innerHTML = `<button class="btn${markMode ? " btn--solid" : ""}" data-mark aria-pressed="${markMode}">Mark mode</button><button class="btn" data-reset>New room</button>`;
      if (focus !== undefined) ui.board.querySelector(`[data-i="${focus}"]`).focus();
    };
    ui.board.addEventListener("click", (e) => { const t = e.target.closest(".tile"); if (t) act(+t.dataset.i, markMode); });
    ui.board.addEventListener("contextmenu", (e) => { const t = e.target.closest(".tile"); if (t) { e.preventDefault(); act(+t.dataset.i, true); } });
    ui.actions.addEventListener("click", (e) => {
      if (e.target.closest("[data-reset]")) reset();
      if (e.target.closest("[data-mark]")) { markMode = !markMode; draw(); }
    });
    reset();
  }

  /* SnakeWall: 19 x 19, wrapping walls, the wallpaper's own speed ramp -- */
  function snake() {
    const N = 19, CELL = 17, START = 5;
    ui.board.className = "toy__board snake";
    ui.board.innerHTML = `<canvas width="${N * CELL}" height="${N * CELL}" role="img" aria-label="Snake playing field"></canvas>
      <div class="snake__pad"><button class="btn" data-dir="0,-1" aria-label="Up">↑</button><button class="btn" data-dir="-1,0" aria-label="Left">←</button><button class="btn" data-dir="0,1" aria-label="Down">↓</button><button class="btn" data-dir="1,0" aria-label="Right">→</button></div>`;
    const ctx = ui.board.querySelector("canvas").getContext("2d");
    let body, dir, queued, food, speed, state = "start", timer, best = 0;
    const dot = (x, y, color) => { ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x * CELL + CELL / 2, y * CELL + CELL / 2, CELL / 2 - 1.5, 0, 7); ctx.fill(); };
    const place = () => { do food = [Math.floor(Math.random() * N), Math.floor(Math.random() * N)]; while (body.some(([x, y]) => x === food[0] && y === food[1])); };
    const reset = () => {
      const mid = Math.floor(N / 2);
      body = Array.from({ length: START }, (_, k) => [mid + 2 - k, mid]);
      dir = queued = [1, 0]; speed = 200; place();
    };
    const draw = () => {
      ctx.clearRect(0, 0, N * CELL, N * CELL);
      ctx.fillStyle = "#e3e0e8";
      for (let x = 0; x < N; x++) for (let y = 0; y < N; y++) ctx.fillRect(x * CELL + CELL / 2 - 1, y * CELL + CELL / 2 - 1, 2, 2);
      dot(food[0], food[1], "#e0261f");
      body.forEach(([x, y]) => dot(x, y, "#141218"));
      const score = body.length - START;
      stat([["Score", score], ["Best", best], ["Step", `${speed} ms`]]);
      ui.msg.textContent = { start: "Press start.", playing: "", paused: "Paused.", over: `Game over. Score ${score}.` }[state];
      ui.actions.innerHTML = `<button class="btn btn--solid" data-go>${{ start: "Start", playing: "Pause", paused: "Resume", over: "Play again" }[state]}</button>`;
    };
    const step = () => {
      dir = queued;
      const head = [(body[0][0] + dir[0] + N) % N, (body[0][1] + dir[1] + N) % N];
      if (body.some(([x, y]) => x === head[0] && y === head[1])) { state = "over"; draw(); return; }
      body.unshift(head);
      if (head[0] === food[0] && head[1] === food[1]) {
        const score = body.length - START;
        best = Math.max(best, score);
        if (score % 3 === 0) speed -= speed > 100 ? 15 : speed > 50 ? 5 : speed > 20 ? 2 : speed > 10 ? 1 : 0;
        place();
      } else body.pop();
      draw();
      timer = setTimeout(step, speed);
    };
    const go = () => {
      clearTimeout(timer);
      if (state === "playing") state = "paused";
      else { if (state !== "paused") reset(); state = "playing"; timer = setTimeout(step, speed); }
      draw();
    };
    const pause = () => { if (state === "playing") go(); };
    const turn = (d) => { if (state === "playing" && (d[0] !== -dir[0] || d[1] !== -dir[1])) queued = d; };
    ui.actions.addEventListener("click", (e) => { if (e.target.closest("[data-go]")) go(); });
    ui.board.addEventListener("click", (e) => { const b = e.target.closest("[data-dir]"); if (b) turn(b.dataset.dir.split(",").map(Number)); });
    const keys = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0], w: [0, -1], s: [0, 1], a: [-1, 0], d: [1, 0] };
    document.addEventListener("keydown", (e) => {
      if (state !== "playing") return;
      if (e.key === "Escape") return pause();
      if (keys[e.key]) { e.preventDefault(); turn(keys[e.key]); }
    });
    document.addEventListener("visibilitychange", () => { if (document.hidden) pause(); });
    new IntersectionObserver(([en]) => { if (!en.isIntersecting) pause(); }).observe(toy);
    reset(); draw();
  }

  ({ mines, snake })[toy.dataset.toy]?.();
})();
