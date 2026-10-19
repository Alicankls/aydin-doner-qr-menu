import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

/**
 * Small, optional polish layered on top of the frame engine. Loaded as its own
 * chunk after the engine has booted, and never in static-poster mode
 * (Save-Data, slow network, reduced motion), so it can never slow the first paint.
 *
 *  - reading progress bar (top, red)
 *  - SplitText: letter-by-letter entrance for scene headings, scroll-triggered
 *  - SplitText + stagger reveal for the menu/contact headings and the category cards
 *  - magnetic hover on buttons (fine pointers only)
 */
export function startEffects(root: HTMLElement): () => void {
  gsap.registerPlugin(ScrollTrigger, SplitText);

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (reduce) return () => {};

  const cleanups: Array<() => void> = [];

  /* ---- progress bar ---- */
  const bar = root.querySelector<HTMLElement>("[data-cine-progress]");
  if (bar) {
    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        bar.style.transform = `scaleX(${self.progress.toFixed(4)})`;
      },
    });
    cleanups.push(() => st.kill());
  }

  /* ---- scene headings: letters rise in each time their text slot becomes active ---- */
  root.querySelectorAll<HTMLElement>("[data-scene] .cine-item").forEach((item) => {
    const heading = item.querySelector<HTMLElement>("h2");
    const scene = item.closest<HTMLElement>("[data-scene]");
    if (!heading || !scene) return;
    const a = Number(item.dataset.in ?? 0);
    const b = Number(item.dataset.out ?? 1);

    const split = SplitText.create(heading, { type: "words,chars", charsClass: "cine-split-char", wordsClass: "cine-split-word" });
    const tl = gsap
      .timeline({ paused: true })
      .from(split.chars, {
        yPercent: 80,
        opacity: 0,
        duration: 0.5,
        ease: "power3.out",
        stagger: 0.025,
      });
    tl.progress(0);

    const range = () => scene.offsetHeight - scene.querySelector<HTMLElement>(".cine-stage")!.offsetHeight;
    const top = () => scene.getBoundingClientRect().top + window.scrollY;
    const st = ScrollTrigger.create({
      start: () => top() + a * range(),
      end: () => top() + b * range(),
      onToggle: (self) => {
        if (self.isActive) tl.restart();
        else tl.pause(0);
      },
    });
    cleanups.push(() => {
      st.kill();
      tl.kill();
      split.revert();
    });
  });

  /* ---- menu + contact: headings and cards ---- */
  root.querySelectorAll<HTMLElement>(".cine-solid .cine-h2, .cine-solid .cine-h3").forEach((el) => {
    const split = SplitText.create(el, { type: "words,chars", charsClass: "cine-split-char", wordsClass: "cine-split-word" });
    const tween = gsap.from(split.chars, {
      yPercent: 70,
      opacity: 0,
      duration: 0.5,
      ease: "power3.out",
      stagger: 0.02,
      paused: true,
    });
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top 88%",
      once: true,
      onEnter: () => void tween.play(),
    });
    cleanups.push(() => {
      st.kill();
      tween.kill();
      split.revert();
    });
  });

  const cards = gsap.utils.toArray<HTMLElement>(root.querySelectorAll(".cine-card"));
  if (cards.length) {
    gsap.set(cards, { opacity: 0, y: 36 });
    ScrollTrigger.batch(cards, {
      start: "top 92%",
      once: true,
      onEnter: (batch) =>
        gsap.to(batch, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", stagger: 0.09, overwrite: true }),
    });
    cleanups.push(() => gsap.set(cards, { clearProps: "opacity,transform" }));
  }

  /* ---- Hakkımızda: text lifts in one line at a time, the photo settles from 1.06 to 1 ---- */
  const aboutItems = gsap.utils.toArray<HTMLElement>(root.querySelectorAll("[data-about-item]"));
  if (aboutItems.length) {
    gsap.set(aboutItems, { opacity: 0, y: 28 });
    const st = ScrollTrigger.create({
      trigger: aboutItems[0],
      start: "top 85%",
      once: true,
      onEnter: () =>
        void gsap.to(aboutItems, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out", stagger: 0.12 }),
    });
    cleanups.push(() => {
      st.kill();
      gsap.set(aboutItems, { clearProps: "opacity,transform" });
    });
  }
  const aboutMedia = root.querySelector<HTMLElement>("[data-about-media]");
  const aboutImg = aboutMedia?.querySelector<HTMLElement>(".cine-about-img");
  if (aboutMedia && aboutImg) {
    gsap.set(aboutMedia, { opacity: 0, y: 36 });
    gsap.set(aboutImg, { scale: 1.06 });
    const st = ScrollTrigger.create({
      trigger: aboutMedia,
      start: "top 88%",
      once: true,
      onEnter: () => {
        gsap.to(aboutMedia, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" });
        gsap.to(aboutImg, { scale: 1, duration: 1.8, ease: "power2.out" });
      },
    });
    cleanups.push(() => {
      st.kill();
      gsap.set([aboutMedia, aboutImg], { clearProps: "opacity,transform" });
    });
  }

  /* ---- magnetic buttons ---- */
  if (finePointer) {
    root.querySelectorAll<HTMLElement>(".cine-btn").forEach((btn) => {
      btn.dataset.magnetic = "";
      const qx = gsap.quickTo(btn, "x", { duration: 0.4, ease: "power3.out" });
      const qy = gsap.quickTo(btn, "y", { duration: 0.4, ease: "power3.out" });
      const move = (e: PointerEvent) => {
        const r = btn.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        qx(Math.max(-8, Math.min(8, dx * 0.25)));
        qy(Math.max(-6, Math.min(6, dy * 0.25)));
      };
      const leave = () => {
        qx(0);
        qy(0);
      };
      btn.addEventListener("pointermove", move);
      btn.addEventListener("pointerleave", leave);
      cleanups.push(() => {
        btn.removeEventListener("pointermove", move);
        btn.removeEventListener("pointerleave", leave);
        delete btn.dataset.magnetic;
        gsap.set(btn, { clearProps: "transform" });
      });
    });
  }

  ScrollTrigger.refresh();
  return () => cleanups.forEach((fn) => fn());
}
