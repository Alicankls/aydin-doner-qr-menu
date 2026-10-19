import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import config from "./scenes.json"; // frame counts per scene; also read by scripts/extract-frames.sh

/**
 * Scroll-driven canvas frame player. Only ever imported dynamically from the
 * home page (see cinematic-home.tsx) so menu/product pages never ship it.
 *
 * DOM contract (all queried inside `root`):
 *   [data-cine-canvas]                  single fixed canvas
 *   [data-scene="1".."5"]               tall scene sections (sticky stage inside)
 *   [data-cine-item][data-in][data-out] text items, visible while scene progress is in [in,out]
 *   [data-cine-temp] [data-cine-bar] [data-cine-hud]   temperature HUD
 *   [data-cine-loader-bar]              first-scene loading indicator
 */

const EASE = 0.14; // per 60fps frame
const FADE = 0.06; // text fade width in scene progress units

type Item = { el: HTMLElement; a: number; b: number; last: number };

type Scene = {
  el: HTMLElement;
  n: number;
  count: number;
  images: (HTMLImageElement | undefined)[];
  loaded: number;
  started: boolean;
  poster?: HTMLImageElement;
  cur: number;
  target: number;
  p: number; // pinned progress 0..1
  lastItemsP: number;
  enter: number; // crossfade-in progress 0..1 (scene 0: always 1)
  items: Item[];
};

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);

/** coarse-to-fine frame order so a partially loaded scene is still usable */
function loadOrder(count: number) {
  const seen = new Set<number>();
  const order: number[] = [];
  for (const step of [16, 8, 4, 2, 1]) {
    for (let i = 0; i < count; i += step) {
      if (!seen.has(i)) {
        seen.add(i);
        order.push(i);
      }
    }
  }
  if (!seen.has(count - 1)) order.push(count - 1);
  return order;
}

export function startEngine(root: HTMLElement): () => void {
  gsap.registerPlugin(ScrollTrigger);

  // Portrait phones/tablets get the 9:16 slice frames; landscape and desktop get the full 16:9 frames.
  const mobile = window.matchMedia("(max-width: 820px) and (orientation: portrait)").matches;
  const dir = mobile ? "mobile" : "desktop";
  const dprCap = mobile ? 1.5 : 2;

  const canvas = root.querySelector<HTMLCanvasElement>("[data-cine-canvas]")!;
  const ctx = canvas.getContext("2d")!;
  const tempEl = root.querySelector<HTMLElement>("[data-cine-temp]");
  const barEl = root.querySelector<HTMLElement>("[data-cine-bar]");
  const hudEl = root.querySelector<HTMLElement>("[data-cine-hud]");
  const loaderBar = root.querySelector<HTMLElement>("[data-cine-loader-bar]");

  const sceneEls = Array.from(root.querySelectorAll<HTMLElement>("[data-scene]"));
  const scenes: Scene[] = sceneEls.map((el, i) => {
  const n = Number(el.dataset.scene);
  const count = config.scenes[n - 1][mobile ? "mobile" : "desktop"];
  return {
    el,
    n,
    count,
    images: new Array(count),
    loaded: 0,
    started: false,
    cur: 0,
    target: 0,
    p: 0,
    lastItemsP: -1,
    enter: i === 0 ? 1 : 0,
    items: Array.from(el.querySelectorAll<HTMLElement>("[data-cine-item]")).map((it) => ({
      el: it,
      a: Number(it.dataset.in ?? 0),
      b: Number(it.dataset.out ?? 1),
      // matches the server-rendered CSS (only data-in="0" items start visible), so
      // booting the engine does not restyle, and re-paint, the hero headline (it is the LCP element)
      last: Number(it.dataset.in ?? 0) <= 0 ? 1 : 0,
    })),
  };
  });

  let dirty = true;
  let cw = 0;
  let ch = 0;
  let lastKey = "";
  let destroyed = false;
  let drawnOnce = false;
  let ready = false;
  let lastTemp = -1;

  /* ---------- loading ---------- */

  const markReady = () => {
    if (ready) return;
    ready = true;
    root.dataset.ready = "1";
  };

  function loadFrame(s: Scene, i: number): Promise<void> {
    return new Promise((resolve) => {
      const img = new Image();
      img.decoding = "async";
      const done = () => {
        if (destroyed) return resolve();
        s.images[i] = img;
        s.loaded++;
        dirty = true;
        if (s === scenes[0]) {
          const frac = s.loaded / s.count;
          if (loaderBar) loaderBar.style.transform = `scaleX(${frac})`;
          if (frac >= 0.5) markReady();
        }
        resolve();
      };
      // decode() finishes the bitmap work off the scroll path; drawing an
      // undecoded <img> would decode synchronously on the main thread.
      img.src = `/frames/${dir}/sahne-${s.n}/${String(i + 1).padStart(4, "0")}.webp`;
      img.decode().then(done, () => {
        if (img.complete && img.naturalWidth) done();
        else resolve();
      });
    });
  }

  async function loadScene(s: Scene) {
    if (s.started) return;
    s.started = true;
    const order = loadOrder(s.count);
    let cursor = 0;
    const worker = async () => {
      while (cursor < order.length && !destroyed) {
        const i = order[cursor++];
        await loadFrame(s, i);
      }
    };
    await Promise.all(Array.from({ length: 5 }, worker));
  }

  function loadPoster(s: Scene) {
    if (s.poster) return;
    const img = new Image();
    img.onload = () => {
      s.poster = img;
      dirty = true;
    };
    img.src = `/frames/poster/sahne-${s.n}.webp`;
  }

  // scene 1 immediately; the rest when the user gets close
  void loadScene(scenes[0]);
  loadPoster(scenes[0]);
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        const s = scenes.find((sc) => sc.el === e.target);
        if (s) {
          loadPoster(s);
          void loadScene(s);
          io.unobserve(e.target);
        }
      }
    },
    { rootMargin: "150% 0px 150% 0px" },
  );
  scenes.slice(1).forEach((s) => io.observe(s.el));

  const idle =
    (window as unknown as { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback ??
    ((cb: () => void) => window.setTimeout(cb, 1200));
  idle(() => scenes.slice(1).forEach(loadPoster));
  const readyTimer = window.setTimeout(markReady, 4000);

  /* ---------- canvas ---------- */

  function resizeCanvas(force = false) {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!force && w === cw && Math.abs(h - ch) < ch * 0.15) return;
    const dpr = Math.min(window.devicePixelRatio || 1, dprCap);
    cw = w;
    ch = h;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    // canvas matches the real device pixels (DPR capped); resizing resets context state
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    lastKey = "";
    dirty = true;
  }
  resizeCanvas(true);

  function drawCover(img: HTMLImageElement, alpha: number) {
    const W = canvas.width;
    const H = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    if (!iw || !ih) return;
    // object-fit: cover, expressed as a source crop so only visible pixels are sampled
    const sc = Math.max(W / iw, H / ih);
    const sw = W / sc;
    const sh = H / sc;
    ctx.globalAlpha = alpha;
    ctx.drawImage(img, (iw - sw) / 2, (ih - sh) / 2, sw, sh, 0, 0, W, H);
  }

  function frameFor(s: Scene, idx: number): HTMLImageElement | null {
    const exact = s.images[idx];
    if (exact) return exact;
    for (let d = 1; d < s.count; d++) {
      const a = s.images[idx - d];
      if (a) return a;
      const b = s.images[idx + d];
      if (b) return b;
    }
    return s.poster ?? null;
  }

  function drawScene(s: Scene, alpha: number) {
    const i0 = Math.min(s.count - 1, Math.round(s.cur));
    // one real frame per draw: blending two frames ghosts fast motion and softens the picture
    const a = frameFor(s, i0);
    if (a) drawCover(a, alpha);
  }

  /* ---------- scroll triggers ---------- */

  const triggers: ScrollTrigger[] = [];

  scenes.forEach((s, i) => {
    triggers.push(
      ScrollTrigger.create({
        trigger: s.el,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          s.p = self.progress;
          dirty = true;
        },
        onRefresh: (self) => {
          s.p = self.progress;
          dirty = true;
        },
      }),
    );
    if (i > 0) {
      triggers.push(
        ScrollTrigger.create({
          trigger: s.el,
          start: "top bottom",
          end: "top top",
          onUpdate: (self) => {
            s.enter = self.progress;
            dirty = true;
          },
          onRefresh: (self) => {
            s.enter = self.progress;
            dirty = true;
          },
        }),
      );
    }
  });

  let heat = 0;
  triggers.push(
    ScrollTrigger.create({
      trigger: scenes[0].el,
      endTrigger: scenes[scenes.length - 1].el,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        heat = self.progress;
        dirty = true;
      },
      onRefresh: (self) => {
        heat = self.progress;
        dirty = true;
      },
    }),
  );

  /* ---------- lenis ---------- */

  const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.lagSmoothing(0);

  /* ---------- frame loop ---------- */

  function updateItems(s: Scene) {
    if (s.p === s.lastItemsP) return;
    s.lastItemsP = s.p;
    for (const it of s.items) {
      const p = s.p;
      const rin = it.a <= 0 ? 1 : clamp01((p - it.a) / FADE);
      const rout = it.b >= 1 ? 1 : clamp01((it.b - p) / FADE);
      const o = rin * rout;
      if (Math.abs(o - it.last) < 0.004) continue;
      it.last = o;
      const ty = (1 - rin) * 28 - (1 - rout) * 28;
      const st = it.el.style;
      st.opacity = String(o);
      st.transform = `translate3d(0,${ty.toFixed(1)}px,0)`;
      st.visibility = o < 0.01 ? "hidden" : "visible";
      st.pointerEvents = o < 0.5 ? "none" : "auto";
    }
  }

  function tick(time: number, deltaTime: number) {
    lenis.raf(time * 1000);
    if (!dirty) return;

    // which scenes are on the canvas
    let k = 0;
    for (let i = scenes.length - 1; i >= 1; i--) {
      if (scenes[i].enter > 0) {
        k = i;
        break;
      }
    }
    let base = scenes[k];
    let over: Scene | null = null;
    let alpha = 1;
    if (k > 0 && scenes[k].enter < 0.999) {
      base = scenes[k - 1];
      over = scenes[k];
      alpha = over.enter;
    }

    // lerp frame index toward the scroll target
    const dt = Math.min(deltaTime, 100) / (1000 / 60);
    const k2 = 1 - Math.pow(1 - EASE, dt);
    let moving = false;
    for (const s of over ? [base, over] : [base]) {
      s.target = s.p * (s.count - 1);
      const diff = s.target - s.cur;
      if (Math.abs(diff) < 0.01) s.cur = s.target;
      else {
        s.cur += diff * k2;
        moving = true;
      }
    }

    // text staging
    for (const s of scenes) updateItems(s);

    // heat counter
    const temp = Math.round(20 + 100 * heat);
    if (temp !== lastTemp) {
      lastTemp = temp;
      if (tempEl) tempEl.textContent = String(temp).padStart(3, "0");
      if (barEl) barEl.style.transform = `scaleY(${(temp - 20) / 100})`;
    }
    if (hudEl) {
      const show = heat > 0.001 && heat < 0.999;
      if (hudEl.dataset.on !== (show ? "1" : "0")) hudEl.dataset.on = show ? "1" : "0";
    }

    // draw only when something changed
    const key = [
      base.n,
      Math.round(base.cur),
      base.loaded,
      over ? over.n : 0,
      over ? Math.round(over.cur) : 0,
      over ? over.loaded : 0,
      Math.round(alpha * 60),
      cw,
      ch,
    ].join("|");
    if (key !== lastKey) {
      lastKey = key;
      drawScene(base, 1);
      if (over) drawScene(over, alpha);
      ctx.globalAlpha = 1;
      if (!drawnOnce) {
        drawnOnce = true;
        root.dataset.drawn = "1";
      }
    }

    dirty = moving;
  }

  gsap.ticker.add(tick);

  let resizeTimer = 0;
  const onResize = () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      resizeCanvas();
      ScrollTrigger.refresh();
    }, 150);
  };
  window.addEventListener("resize", onResize);

  return () => {
    destroyed = true;
    window.clearTimeout(readyTimer);
    window.clearTimeout(resizeTimer);
    window.removeEventListener("resize", onResize);
    io.disconnect();
    gsap.ticker.remove(tick);
    triggers.forEach((t) => t.kill());
    lenis.destroy();
  };
}
