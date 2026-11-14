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
  const INK = [0.95, 0.945, 0.925];

  /* Turn one image into N points: x, y in -1..1, z from a dome, plus a colour each. */
  const sample = (shape) => new Promise((resolve, reject) => {
    const im = new Image();
    im.onload = () => {
      const S = 150, k = S / Math.max(im.width, im.height);
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
        pos[n * 3 + 2] = 0.42 * Math.sqrt(Math.max(0, 1 - (x * x + y * y))) + (Math.random() - 0.5) * 0.05;
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
    uniform float uMix, uTime, uTurn, uTilt, uSize; varying vec3 vCol; varying float vFade;
    void main() {
      float e = smoothstep(aSeed * 0.45, aSeed * 0.45 + 0.55, uMix);       // each point leaves at its own moment
      vec3 p = mix(aFrom, aTo, e);
      float arc = sin(e * 3.14159);                                        // 0 at rest, 1 mid-flight
      vec3 swirl = vec3(sin(aSeed * 91.0 + uTime), cos(aSeed * 57.0 - uTime), sin(aSeed * 33.0)) * 0.55;
      p += swirl * arc;
      p.xy += 0.006 * vec2(sin(uTime * 1.3 + aSeed * 40.0), cos(uTime * 1.1 + aSeed * 70.0)); // a little life at rest
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
  const U = Object.fromEntries(["uMix", "uTime", "uTurn", "uTilt", "uSize"].map((n) => [n, gl.getUniformLocation(prog, n)]));

  const stage = canvas.parentElement, now = document.querySelector("[data-morph-now]");
  const announce = (s) => {
    stage.style.setProperty("--glow", s.color);
    if (now) { now.hidden = false; const a = now.querySelector("a"); a.textContent = s.name; a.href = `${s.id}.html`; }
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
    let at = 0, flyStart = 0, held = performance.now(), flying = false, visible = true, pointer = [0, 0], turn = [0, 0];
    announce(shapes[0]);
    new ResizeObserver(resize).observe(canvas);
    resize();

    const frame = (t) => {
      if (!visible) return;
      if (!still) {
        if (!flying && t - held > HOLD) {
          const next = (at + 1) % shapes.length;
          setTo(clouds[next].pos); setColTo(clouds[next].col);
          flying = true; flyStart = t; at = next; announce(shapes[at]);
        }
        let mix = 0;
        if (flying) {
          mix = Math.min(1, (t - flyStart) / FLY);
          if (mix === 1) { setFrom(clouds[at].pos); setColFrom(clouds[at].col); flying = false; held = t; mix = 0; }
        }
        turn[0] += (pointer[0] * 0.5 - turn[0]) * 0.05; turn[1] += (pointer[1] * 0.3 - turn[1]) * 0.05;
        gl.uniform1f(U.uMix, mix);
        gl.uniform1f(U.uTime, t / 1000);
        gl.uniform1f(U.uTurn, Math.sin(t / 2600) * 0.38 + turn[0]);
        gl.uniform1f(U.uTilt, Math.sin(t / 3400) * 0.1 + turn[1]);
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
