/* Scroll and entrance motion, with GSAP and ScrollTrigger.
   Everything here only adds movement: if GSAP fails to load, or the visitor asks for
   reduced motion, the page is simply shown as it is. */
(() => {
  if (!window.gsap || !window.ScrollTrigger || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: "power3.out", duration: 0.8 });
  const all = (sel, root = document) => [...root.querySelectorAll(sel)];

  /* Hero and project header: the text arrives line by line. */
  const intro = all(".hero__text > *, .phead__text > *");
  if (intro.length) gsap.from(intro, { y: 28, opacity: 0, stagger: 0.09, delay: 0.1, clearProps: "all" });
  const stage = document.querySelector(".hero__stage, .phead__img, .phone");
  if (stage) gsap.from(stage, { opacity: 0, scale: 0.96, duration: 1.2, delay: 0.25, clearProps: "transform,opacity" });

  /* Home: each game slide. The art settles from a slight zoom; the text follows. */
  all(".slide").forEach((slide) => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: slide, start: "top 82%", once: true } });
    tl.from(slide, { y: 60, opacity: 0, duration: 0.9, clearProps: "transform,opacity" })
      .from(slide.querySelector(".slide__art img"), { scale: 1.14, duration: 1.6, ease: "power2.out", clearProps: "transform" }, 0)
      .from(all(".slide__main > *, .slide__side > *", slide), { y: 22, opacity: 0, stagger: 0.07, duration: 0.6, clearProps: "all" }, 0.25);
  });

  /* Toolbox: nodes appear level by level and the wires draw themselves outward. */
  const tree = document.querySelector("[data-tree]");
  if (tree) {
    const depth = (n) => { let d = 0; for (let ul = n.closest("ul"); ul && !ul.classList.contains("tree__roots"); ul = ul.parentElement.closest("ul")) d++; return d; };
    const nodes = all(".node", tree);
    ScrollTrigger.create({
      trigger: tree, start: "top 78%", once: true,
      onEnter: () => {
        gsap.from(nodes, { opacity: 0, x: -14, duration: 0.5, delay: (i) => depth(nodes[i]) * 0.28 + i * 0.012, clearProps: "transform,opacity" });
        const wires = all(".tree__wires path", tree);
        wires.forEach((p) => { const len = p.getTotalLength(); p.style.strokeDasharray = len; p.style.strokeDashoffset = len; });
        gsap.to(wires, { strokeDashoffset: 0, duration: 0.7, ease: "power2.inOut", delay: (i) => depth(document.getElementById(wires[i].dataset.to)) * 0.28 - 0.2, onComplete: () => wires.forEach((p) => { p.style.strokeDasharray = ""; p.style.strokeDashoffset = ""; }) });
      },
    });
  }

  /* Everything else: rise into place the first time it scrolls into view, a group at a time. */
  const rise = ".section__head, .numbers > div, .tree__key, .about__card > *, .path li, .facts > div, .stats > div, .prose--lead, .tags, .toy, .system, .flow li, .devlog li, .psr li, .shot, .quote, .section--note > div, .next a, .foot .wrap > *";
  gsap.set(rise, { opacity: 0, y: 26 });
  ScrollTrigger.batch(rise, {
    start: "top 90%", once: true,
    onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, stagger: 0.06, duration: 0.7, overwrite: true, clearProps: "transform,opacity" }),
  });

  /* Project banner: drifts a little slower than the page. */
  const banner = document.querySelector(".phead__img");
  if (banner) gsap.to(banner, { yPercent: 7, ease: "none", scrollTrigger: { trigger: banner, start: "top 20%", end: "bottom top", scrub: true } });

  addEventListener("load", () => ScrollTrigger.refresh());
})();
