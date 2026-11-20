import { useEffect, useRef } from "react";
import "./PixelSky.css";

/* =====================================================================
   PIXEL SKY: low-res canvas scaled up. One shared palette, four scenes:
     home     night city       (default)
     data     mountain range + ringed planet   (about)
     trophies colonnade hall   (achievements)
     mail     quiet street     (contact)
   ===================================================================== */
const BANDS = ["#02060d", "#03101a", "#041a24", "#052a2e", "#073d3b", "#0a524a", "#0d6b5c", "#128474"];
const rng = (seed) => () => (seed = (seed * 16807) % 2147483647) / 2147483647;

const SCENES = {
  home: { seed: 7, focal: "moon", fx: 0.8, fy: 0.18, clouds: true },
  data: { seed: 19, focal: "planet", fx: 0.9, fy: 0.16, clouds: true },
  trophies: { seed: 31, focal: "crescent", fx: 0.62, fy: 0.2, clouds: false },
  mail: { seed: 53, focal: "moon", fx: 0.82, fy: 0.16, clouds: true },
};

export default function PixelSky({ variant = "home" }) {
  const ref = useRef(null);

  useEffect(() => {
    const scene = SCENES[variant] || SCENES.home;
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    const SCALE = 4;
    let width;
    let height;
    let groundY;
    let stars;
    let world;

    const rect = (x, y, w, h, color) => {
      ctx.fillStyle = color;
      ctx.fillRect(x | 0, y | 0, w | 0, h | 0);
    };
    const glow = (x, y, size, color, alpha) => {
      ctx.globalAlpha = alpha;
      rect(x - size / 2, y - size / 2, size, size, color);
      ctx.globalAlpha = 1;
    };
    const cloud = (x, y) => {
      rect(x, y + 2, 14, 3, "#0d4a4a");
      rect(x + 3, y, 8, 3, "#0d4a4a");
      rect(x + 6, y - 2, 4, 3, "#0d4a4a");
    };

    /* ---------- scene builders ---------- */
    function buildCity(random) {
      const buildings = [];
      let x = 0;
      while (x < width) {
        const w = 6 + ((random() * 9) | 0);
        const h = 14 + ((random() * 34) | 0);
        buildings.push({ x, w, h });
        x += w + ((random() * 3) | 0);
      }
      return { kind: "city", buildings };
    }

    // jagged silhouettes instead of a skyline
    function buildRidges(random) {
      const ridge = (start, spread, hi, lo) => {
        const arr = new Int16Array(width + 1);
        let y = groundY - start;
        for (let x = 0; x <= width; x++) {
          y += (random() - 0.5) * spread;
          if (y < groundY - hi) y = groundY - hi;
          if (y > groundY - lo) y = groundY - lo;
          arr[x] = Math.round(y);
        }
        return arr;
      };
      return {
        kind: "ridges",
        back: ridge(34, 4.4, 66, 16),
        front: ridge(16, 3.1, 38, 4),
      };
    }

    // a hall of columns and arches, with drapes behind the nav
    function buildHall() {
      const gap = Math.max(26, Math.round(width / 7));
      const columns = [];
      for (let x = Math.round(gap * 0.55); x < width + gap; x += gap) columns.push(x);
      const drapes = width > 70 ? [Math.round(width * 0.16), Math.round(width * 0.84)] : [];
      return { kind: "hall", columns, gap, top: groundY - 58, drapes };
    }

    // low rooftops, streetlamps and a postbox
    function buildStreet(random) {
      const houses = [];
      let x = -6;
      while (x < width + 10) {
        const w = 15 + ((random() * 12) | 0);
        const h = 15 + ((random() * 19) | 0);
        houses.push({ x, w, h, roof: Math.min(11, Math.max(4, Math.round(w / 2))), lit: random() });
        x += w + 3 + ((random() * 12) | 0);
      }
      const lamps = [0.18, 0.47, 0.79].map((f) => Math.round(width * f));
      const box = Math.round(width * 0.64);
      return { kind: "street", houses, lamps, box };
    }

    /* ---------- setup ---------- */
    function setup() {
      width = Math.ceil(window.innerWidth / SCALE);
      height = Math.ceil(window.innerHeight / SCALE);
      groundY = height - 12;
      canvas.width = width;
      canvas.height = height;

      const random = rng(scene.seed);
      stars = Array.from({ length: 90 }, () => ({
        x: (random() * width) | 0,
        y: (random() * height * 0.55) | 0,
        p: (random() * 8) | 0,
      }));

      if (variant === "data") world = buildRidges(random);
      else if (variant === "trophies") world = buildHall();
      else if (variant === "mail") world = buildStreet(random);
      else world = buildCity(random);
    }

    /* ---------- focal body ---------- */
    function drawFocal(cx, cy) {
      if (scene.focal === "crescent") {
        for (let y = -9; y <= 9; y++) {
          for (let x = -9; x <= 9; x++) {
            if (x * x + y * y > 81) continue;
            const ox = x - 6;
            const oy = y + 4;
            if (ox * ox + oy * oy <= 64) continue; // bite taken out of the disc
            rect(cx + x, cy + y, 1, 1, x * x + y * y > 64 ? "#c9d9a8" : "#fdf6c8");
          }
        }
        return;
      }

      if (scene.focal === "planet") {
        for (let y = -7; y <= 7; y++) {
          for (let x = -7; x <= 7; x++) {
            if (x * x + y * y <= 49) {
              rect(cx + x, cy + y, 1, 1, x * x + y * y > 33 ? "#c9d9a8" : "#e8e2a8");
            }
          }
        }
        // ring: a shallow arc passing behind, then in front of the disc
        for (let x = -14; x <= 14; x++) {
          const ry = Math.round(x * 0.22);
          if (Math.abs(x) > 8) rect(cx + x, cy + ry, 1, 1, "#8fa98a");
          else if (ry > 3) rect(cx + x, cy + ry, 1, 1, "#b9c99f");
        }
        return;
      }

      // full moon
      for (let y = -9; y <= 9; y++) {
        for (let x = -9; x <= 9; x++) {
          if (x * x + y * y <= 81) {
            rect(cx + x, cy + y, 1, 1, x * x + y * y > 64 ? "#c9d9a8" : "#fdf6c8");
          }
        }
      }
      rect(cx - 4, cy - 3, 3, 3, "#e2e0a0");
      rect(cx + 3, cy + 2, 2, 2, "#e2e0a0");
      rect(cx - 2, cy + 4, 2, 2, "#e2e0a0");
    }

    /* ---------- scenes ---------- */
    function drawCity(tick) {
      world.buildings.forEach((b) => {
        const top = groundY - 12 - b.h;
        rect(b.x, top, b.w, b.h + 12, "#04201f");
        for (let wy = top + 3; wy < groundY - 8; wy += 4) {
          for (let wx = b.x + 1; wx < b.x + b.w - 1; wx += 3) {
            const key = (wx * 7 + wy * 13) | 0;
            if (key % 5 < 2 && ((tick >> 4) + key) % 23 !== 0) {
              rect(wx, wy, 1, 2, key % 3 ? "#fde68a" : "#5eead4");
            }
          }
        }
      });
    }

    function drawRidges() {
      for (let x = 0; x <= width; x++) {
        const back = world.back[x];
        rect(x, back, 1, groundY - back, "#032622");
        rect(x, back, 1, 1, "#053a35");
      }
      for (let x = 0; x <= width; x++) {
        const front = world.front[x];
        rect(x, front, 1, groundY - front, "#06403b");
        rect(x, front, 1, 1, "#0a5a4f");
      }
    }

    function drawHall() {
      const { columns, gap, top, drapes } = world;

      drapes.forEach((dx) => {
        rect(dx, 0, 7, 30, "#0b2f2c");
        rect(dx + 3, 0, 1, 30, "#2a5b4f");
        rect(dx, 28, 7, 2, "#6b6236");
      });

      // arches first, so the columns sit on top of them
      for (let i = 0; i < columns.length - 1; i++) {
        const cx = (columns[i] + columns[i + 1]) / 2;
        const r = gap / 2;
        for (let a = Math.PI; a >= 0; a -= 0.03) {
          const px = cx + Math.cos(a) * r;
          const py = top - Math.sin(a) * r;
          rect(px, py, 1, 1, "#04201f");
          rect(px, py + 1, 1, 1, "#04201f");
        }
      }

      columns.forEach((x) => {
        rect(x - 2, top, 5, groundY - top, "#04201f");
        rect(x - 3, top, 7, 2, "#04201f");
        rect(x - 3, groundY - 3, 7, 3, "#04201f");
        rect(x - 2, top + 4, 1, groundY - top - 8, "#062e2b");
      });
    }

    function drawStreet() {
      const { houses, lamps, box } = world;

      houses.forEach((h) => {
        const base = groundY - h.h;
        rect(h.x, base, h.w, h.h, "#04201f");
        for (let i = 0; i < h.roof; i++) {
          const w = h.w - i * 2;
          if (w > 0) rect(h.x + i, base - 1 - i, w, 1, "#04201f");
        }
        for (let wy = base + 4; wy < groundY - 5; wy += 6) {
          for (let wx = h.x + 3; wx < h.x + h.w - 3; wx += 5) {
            const key = (wx * 5 + wy * 11) | 0;
            if (key % 7 < 2) rect(wx, wy, 2, 3, key % 3 ? "#fde68a" : "#5eead4");
          }
        }
      });

      lamps.forEach((lx) => {
        glow(lx, groundY - 30, 11, "#fde68a", 0.05);
        glow(lx, groundY - 30, 7, "#fde68a", 0.07);
        rect(lx, groundY - 27, 1, 27, "#0b3a35");
        rect(lx - 1, groundY - 31, 3, 3, "#fde68a");
        rect(lx, groundY - 31, 1, 1, "#fffbe0");
      });

      // postbox on its own post, drawn last so nothing covers it
      rect(box, groundY - 13, 6, 9, "#0b3a35");
      rect(box + 1, groundY - 14, 4, 1, "#0b3a35");
      rect(box + 1, groundY - 10, 4, 1, "#5eead4");
      rect(box + 2, groundY - 4, 2, 4, "#08302c");
    }

    /* ---------- frame ---------- */
    function draw() {
      const tick = Math.floor(performance.now() / 90);
      const bandHeight = Math.ceil(height / BANDS.length);
      BANDS.forEach((color, i) => rect(0, i * bandHeight, width, bandHeight + 1, color));

      stars.forEach((star) => {
        if ((tick / 6 + star.p) % 8 < 6.5) rect(star.x, star.y, 1, 1, star.p % 3 ? "#cfeee9" : "#fde68a");
      });

      drawFocal((width * scene.fx) | 0, (height * scene.fy) | 0);

      if (scene.clouds) {
        [
          [0.1, 0.12, 0.04],
          [0.45, 0.22, 0.025],
          [0.7, 0.33, 0.035],
        ].forEach(([ax, by, speed]) => cloud(((ax * width + tick * speed) % (width + 30)) - 15, by * height));
      }

      if (world.kind === "city") drawCity(tick);
      else if (world.kind === "ridges") drawRidges();
      else if (world.kind === "hall") drawHall();
      else drawStreet();

      if (world.kind === "city") {
        [
          ["#06403b", 0.012, 7, groundY - 8],
          ["#0a5a4f", 0.02, 5, groundY - 3],
        ].forEach(([color, freq, amp, base]) => {
          for (let x = 0; x < width; x++) {
            const y = (base - Math.abs(Math.sin(x * freq + 1)) * amp) | 0;
            rect(x, y, 1, height - y, color);
          }
        });
      }

      rect(0, groundY, width, height - groundY, "#0a3a35");
      rect(0, groundY, width, 1, "#14b8a6");
      for (let x = -((tick / 2) | 0) % 8; x < width; x += 8) rect(x, groundY + 4, 4, 1, "#0d5a52");
    }

    setup();
    draw();
    window.addEventListener("resize", setup);
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const interval = still ? null : setInterval(draw, 90);
    return () => {
      window.removeEventListener("resize", setup);
      if (interval) clearInterval(interval);
    };
  }, [variant]);

  return <canvas ref={ref} className="ph-sky" aria-hidden="true" />;
}
