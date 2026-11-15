/* Home hero: a cloud of points that takes the shape of each game's character in turn.
   Plain WebGL, no library. The shapes come from the canvas's data-morph attribute
   (written by build.mjs): each image is sampled into coloured points, domed a little
   so the cloud has depth when it turns, and the points fly from one shape to the next. */
(() => {
  const canvas = document.querySelector("[data-morph]");
  if (!canvas) return;
  const gl = canvas.getContext("webgl", { alpha: true, antialias: true, premultipliedAlpha: false });
  if (!gl) return;

  const shapes = JSON.parse(canvas.dataset.morph);
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const N = innerWidth < 760 ? 11000 : 22000; // points
  const HOLD = 3600, FLY = 1900; // ms a shape is held, ms the change takes
  const TRAIL_MS = 300;   // how long a spot the pointer passed takes to let go (points vary around this)
  const TRAIL_MAX = 48;   // spots remembered (the first slot is the pointer itself)
  const SPACING = 0.06;   // a spot every this far along the path, so a fast sweep leaves no gaps
  const INK = [0.95, 0.945, 0.925];

  /* Turn one image into N points: x, y in -1..1, z from a dome, plus a colour each. */
  const sample = (shape) => new Promise((resolve, reject) => {
    const im = new Image();
    im.onload = () => {
      const S = 240, k = S / Math.max(im.width, im.height);
      const w = Math.max(1, Math.round(im.width * k)), h = Math.max(1, Math.round(im.height * k));
      const c = document.createElement("canvas"); c.width = w; c.height = h;
      const ctx = c.getContext("2d", { willReadFrequently: true });
      ctx.drawImage(im, 0, 0, w, h);
      const px = ctx.getImageData(0, 0, w, h).data, keep = [];
      for (let i = 0; i < w * h; i++) {
        const r = px[i * 4] / 255, g = px[i * 4 + 1] / 255, b = px[i * 4 + 2] / 255, a = px[i * 4 + 3];
        if (a < 140) continue;
        if (shape.mode === "dark" && r + g + b > 2.2) continue; // art on white: drop the white
        keep.push(i);
      }
      const pos = new Float32Array(N * 3), col = new Float32Array(N * 3), half = Math.max(w, h) / 2;
      for (let n = 0; n < N; n++) {
        const i = keep[Math.floor(Math.random() * keep.length)];
        const x = ((i % w) + Math.random() - w / 2) / half, y = -(Math.floor(i / w) + Math.random() - h / 2) / half;
        pos[n * 3] = x; pos[n * 3 + 1] = y;
        // A thin slab with a slight swell: enough depth to catch the light of a turn, not enough to bend the drawing.
        pos[n * 3 + 2] = 0.07 * Math.sqrt(Math.max(0, 1 - (x * x + y * y))) + (Math.random() - 0.5) * 0.07;
        let r = px[i * 4] / 255, g = px[i * 4 + 1] / 255, b = px[i * 4 + 2] / 255;
        if (shape.mode === "dark" && r + g + b < 0.9) [r, g, b] = INK; // black art would vanish on a dark page
        // Lift the shadows a little so dark art still reads against a dark page.
        col[n * 3] = 0.1 + 0.9 * r ** 0.8; col[n * 3 + 1] = 0.1 + 0.9 * g ** 0.8; col[n * 3 + 2] = 0.1 + 0.9 * b ** 0.8;
      }
      resolve({ pos, col });
    };
    im.onerror = reject;
    im.src = shape.src;
  });

  const VERT = `
    attribute vec3 aFrom, aTo, aColFrom, aColTo; attribute float aSeed;
    uniform float uMix, uTime, uTurn, uTilt, uSize; uniform vec4 uTrail[${TRAIL_MAX}]; varying vec3 vCol; varying float vFade;
    void main() {
      float e = smoothstep(aSeed * 0.45, aSeed * 0.45 + 0.55, uMix);       // each point leaves at its own moment
      vec3 p = mix(aFrom, aTo, e);
      float arc = sin(e * 3.14159);                                        // 0 at rest, 1 mid-flight
      vec3 swirl = vec3(sin(aSeed * 91.0 + uTime), cos(aSeed * 57.0 - uTime), sin(aSeed * 33.0)) * 0.55;
      p += swirl * arc;
      p.xy += 0.003 * vec2(sin(uTime * 1.3 + aSeed * 40.0), cos(uTime * 1.1 + aSeed * 70.0)); // a little life at rest
      // The pointer drags points along with it, and they fall back behind it. uTrail holds the
      // pointer's recent path: x, y, how much life the spot has left (1 to 0) and the direction
      // the pointer was moving there. Points are carried that way, a little sideways as well, so
      // the disturbance reads as a quick wake and not as a hole.
      vec2 push = vec2(0.0);
      for (int k = 0; k < ${TRAIL_MAX}; k++) {
        vec4 t = uTrail[k];
        if (t.z <= 0.0) continue;
        float l = clamp(t.z * (1.0 + 0.5 * (aSeed - 0.5)), 0.0, 1.0);      // each point lets go at its own moment
        vec2 d = p.xy - t.xy;
        float near = smoothstep(0.21 * (0.5 + 0.5 * l), 0.0, length(d)) * l * l; // small, and gone quickly
        vec2 dir = vec2(cos(t.w), sin(t.w));
        push += (dir + normalize(d + 0.0001) * 0.3) * near * (0.1 + 0.16 * aSeed);
      }
      p.xy += push * min(1.0, 0.22 / max(length(push), 0.0001));           // never far: a nudge, not a shove
      float cy = cos(uTurn), sy = sin(uTurn), cx = cos(uTilt), sx = sin(uTilt);
      p = vec3(p.x * cy + p.z * sy, p.y, -p.x * sy + p.z * cy);
      p = vec3(p.x, p.y * cx - p.z * sx, p.y * sx + p.z * cx);
      float w = 3.0 - p.z;
      gl_Position = vec4(p.xy * 2.25, 0.0, w);
      gl_PointSize = uSize * (3.0 / w) * (1.0 + arc * 0.6);
      vCol = mix(aColFrom, aColTo, e); vFade = 1.0 - arc * 0.35;
    }`;
  const FRAG = `
    precision mediump float; varying vec3 vCol; varying float vFade;
    void main() {
      float d = length(gl_PointCoord - 0.5);
      if (d > 0.5) discard;
      gl_FragColor = vec4(vCol, smoothstep(0.5, 0.28, d) * vFade);
    }`;
  const compile = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
  const prog = gl.createProgram();
  gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
  gl.useProgram(prog);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  const buffer = (name, size, data) => {
    const b = gl.createBuffer(), at = gl.getAttribLocation(prog, name);
    gl.bindBuffer(gl.ARRAY_BUFFER, b);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(at);
    gl.vertexAttribPointer(at, size, gl.FLOAT, false, 0, 0);
    return (next) => { gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferSubData(gl.ARRAY_BUFFER, 0, next); };
  };
  const U = Object.fromEntries(["uMix", "uTime", "uTurn", "uTilt", "uSize", "uTrail"].map((n) => [n, gl.getUniformLocation(prog, n)]));

  const stage = canvas.parentElement, now = document.querySelector("[data-morph-now]");
  const picks = [...document.querySelectorAll("[data-morph-pick]")];
  const announce = (s) => {
    stage.style.setProperty("--glow", s.color);
    if (now) { now.hidden = false; const a = now.querySelector("a"); a.textContent = s.name; a.href = `${s.id}.html`; }
    picks.forEach((b) => b.setAttribute("aria-pressed", b.dataset.morphPick === s.id));
  };

  let dpr = 1;
  const resize = () => {
    dpr = Math.min(devicePixelRatio || 1, 2);
    const w = Math.round(canvas.clientWidth * dpr), h = Math.round(canvas.clientHeight * dpr);
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h); }
    gl.uniform1f(U.uSize, Math.max(1.8, canvas.width / 250));
  };

  Promise.all(shapes.map(sample)).then((clouds) => {
    const seeds = Float32Array.from({ length: N }, Math.random);
    buffer("aSeed", 1, seeds);
    const setFrom = buffer("aFrom", 3, clouds[0].pos), setTo = buffer("aTo", 3, clouds[0].pos);
    const setColFrom = buffer("aColFrom", 3, clouds[0].col), setColTo = buffer("aColTo", 3, clouds[0].col);
    let at = 0, flyStart = 0, held = performance.now(), hold = HOLD, flying = false, visible = true, pointer = [0, 0], turn = [0, 0];
    let wanted = -1, over = false, push = 0, hit = [9, 9];
    // The path the pointer has just taken: a ring of spots, each with the time it was made.
    const spots = Array.from({ length: TRAIL_MAX - 1 }, () => ({ x: 0, y: 0, a: 0, t: -1e9 }));
    const trailData = new Float32Array(TRAIL_MAX * 4);
    let next = 0, last = null, ang = 0; // ang: the direction the pointer last moved in
    const leave = (x, y, t) => { const s = spots[next]; s.x = x; s.y = y; s.a = ang; s.t = t; next = (next + 1) % spots.length; };
    const trace = (x, y, t) => {
      if (last) { // fill in the stretch since the last event so a quick sweep leaves a solid channel
        const dx = x - last[0], dy = y - last[1], dist = Math.hypot(dx, dy);
        if (dist < SPACING * 0.5) return; // barely moved: no new spot
        ang = Math.atan2(dy, dx);
        const n = Math.min(spots.length >> 1, Math.floor(dist / SPACING));
        for (let k = 1; k <= n; k++) leave(last[0] + dx * k / (n + 1), last[1] + dy * k / (n + 1), t);
      }
      leave(x, y, t); last = [x, y];
    };
    announce(shapes[0]);
    new ResizeObserver(resize).observe(canvas);
    resize();

    /* Interaction: move over the cloud to part it, click it for the next game, or pick one below. */
    const toCloud = (e) => { const r = canvas.getBoundingClientRect(); return [((e.clientX - r.left) / r.width * 2 - 1) * 1.333, -((e.clientY - r.top) / r.height * 2 - 1) * 1.333]; };
    canvas.addEventListener("pointermove", (e) => { over = true; hit = toCloud(e); trace(hit[0], hit[1], performance.now()); });
    canvas.addEventListener("pointerdown", (e) => { over = true; hit = toCloud(e); last = null; trace(hit[0], hit[1], performance.now()); });
    canvas.addEventListener("pointerleave", () => { over = false; last = null; });
    canvas.addEventListener("pointercancel", () => { over = false; last = null; });
    ["selectstart", "dragstart", "contextmenu"].forEach((type) => canvas.addEventListener(type, (e) => e.preventDefault())); // a long press must not select the canvas
    canvas.addEventListener("click", () => { wanted = (at + 1) % shapes.length; });
    picks.forEach((b) => b.addEventListener("click", () => { wanted = shapes.findIndex((s) => s.id === b.dataset.morphPick); }));

    const frame = (t) => {
      if (!visible) return;
      if (!still) {
        if (!flying && (wanted >= 0 || t - held > hold)) {
          const next = wanted >= 0 ? wanted : (at + 1) % shapes.length;
          hold = wanted >= 0 ? HOLD * 2.5 : HOLD; // a game someone chose stays up longer
          wanted = -1;
          if (next === at) { held = t; }
          else {
            setTo(clouds[next].pos); setColTo(clouds[next].col);
            flying = true; flyStart = t; at = next; announce(shapes[at]);
          }
        }
        // Slot 0 is the pointer itself (quick to arrive and leave); the rest are the spots it has left
        // behind, each letting go over TRAIL_MS. The shader shapes how that looks per point.
        push += ((over ? 1 : 0) - push) * 0.3;
        trailData[0] = hit[0]; trailData[1] = hit[1]; trailData[2] = push > 0.01 ? push : 0; trailData[3] = ang;
        for (let k = 0; k < spots.length; k++) {
          const s = spots[k], life = 1 - (t - s.t) / TRAIL_MS, o = (k + 1) * 4;
          trailData[o] = s.x; trailData[o + 1] = s.y; trailData[o + 2] = life > 0 ? life : 0; trailData[o + 3] = s.a;
        }
        gl.uniform4fv(U.uTrail, trailData);
        let mix = 0;
        if (flying) {
          mix = Math.min(1, (t - flyStart) / FLY);
          if (mix === 1) { setFrom(clouds[at].pos); setColFrom(clouds[at].col); flying = false; held = t; mix = 0; }
        }
        turn[0] += (pointer[0] * 0.3 - turn[0]) * 0.05; turn[1] += (pointer[1] * 0.18 - turn[1]) * 0.05;
        gl.uniform1f(U.uMix, mix);
        gl.uniform1f(U.uTime, t / 1000);
        gl.uniform1f(U.uTurn, Math.sin(t / 2600) * 0.2 + turn[0]);
        gl.uniform1f(U.uTilt, Math.sin(t / 3400) * 0.05 + turn[1]);
      }
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.POINTS, 0, N);
      if (!still) requestAnimationFrame(frame);
    };
    // Only draw while the hero is on screen and the tab is in front.
    new IntersectionObserver(([e]) => {
      const was = visible; visible = e.isIntersecting && !document.hidden;
      if (visible && !was) { held = performance.now(); requestAnimationFrame(frame); }
    }).observe(canvas);
    document.addEventListener("visibilitychange", () => { if (!document.hidden && !visible) { visible = true; held = performance.now(); requestAnimationFrame(frame); } else if (document.hidden) visible = false; });
    addEventListener("pointermove", (e) => { pointer = [e.clientX / innerWidth - 0.5, e.clientY / innerHeight - 0.5]; }, { passive: true });
    requestAnimationFrame(frame);
  }).catch(() => { canvas.remove(); });
})();
