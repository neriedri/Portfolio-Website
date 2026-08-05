// Generates dark, blue-accented abstract background SVGs (one family per
// project) into public/SS/. Deterministic (seeded) so re-running is stable.
// Run: node scripts/gen-backgrounds.mjs
import { mkdirSync, writeFileSync } from "fs";
import { join } from "path";

const OUT = join(process.cwd(), "public", "SS");
const W = 1600;
const H = 1000;

// ── seeded RNG ───────────────────────────────────────────────────────────────
function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// ── building blocks ──────────────────────────────────────────────────────────
function constellation(rng, accent) {
  const n = 46;
  const pts = Array.from({ length: n }, () => ({
    x: rng() * W,
    y: rng() * H,
  }));
  let lines = "";
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const dx = pts[i].x - pts[j].x;
      const dy = pts[i].y - pts[j].y;
      const d = Math.hypot(dx, dy);
      if (d < 235) {
        const o = (0.22 * (1 - d / 235)).toFixed(3);
        lines += `<line x1="${pts[i].x.toFixed(1)}" y1="${pts[i].y.toFixed(1)}" x2="${pts[j].x.toFixed(1)}" y2="${pts[j].y.toFixed(1)}" stroke="${accent}" stroke-width="1" stroke-opacity="${o}"/>`;
      }
    }
  }
  const dots = pts
    .map(
      (p) =>
        `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${(1.4 + rng() * 1.8).toFixed(1)}" fill="${accent}" fill-opacity="0.55"/>`,
    )
    .join("");
  return `<g>${lines}${dots}</g>`;
}

function grid() {
  let g = "";
  for (let x = 80; x < W; x += 80)
    g += `<line x1="${x}" y1="0" x2="${x}" y2="${H}" stroke="#ffffff" stroke-opacity="0.025"/>`;
  for (let y = 80; y < H; y += 80)
    g += `<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="#ffffff" stroke-opacity="0.025"/>`;
  return `<g>${g}</g>`;
}

// ── domain motifs (large, faint, accent-stroked) ─────────────────────────────
function motifDatabase(cx, cy, s, c) {
  const rx = 120 * s;
  const ry = 38 * s;
  let g = "";
  for (let i = 0; i < 3; i++) {
    const y = cy - 90 * s + i * 90 * s;
    g += `<ellipse cx="${cx}" cy="${y}" rx="${rx}" ry="${ry}"/>`;
    g += `<path d="M ${cx - rx} ${y} V ${y + 90 * s} M ${cx + rx} ${y} V ${y + 90 * s}"/>`;
  }
  return g;
}
function motifChart(cx, cy, s, c) {
  const w = 260 * s;
  const h = 200 * s;
  const x0 = cx - w / 2;
  const y0 = cy + h / 2;
  return `<path d="M ${x0} ${cy - h / 2} V ${y0} H ${cx + w / 2}"/>
    <polyline points="${x0} ${y0 - 30 * s} ${x0 + w * 0.3} ${y0 - 95 * s} ${x0 + w * 0.55} ${y0 - 60 * s} ${x0 + w * 0.8} ${y0 - 150 * s} ${cx + w / 2} ${y0 - 175 * s}" fill="none"/>`;
}
function motifGear(cx, cy, s, c) {
  const r = 110 * s;
  const teeth = 9;
  let g = `<circle cx="${cx}" cy="${cy}" r="${r}"/><circle cx="${cx}" cy="${cy}" r="${r * 0.45}"/>`;
  for (let i = 0; i < teeth; i++) {
    const a = (i / teeth) * Math.PI * 2;
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * r;
    g += `<rect x="${(x - 14 * s).toFixed(1)}" y="${(y - 14 * s).toFixed(1)}" width="${28 * s}" height="${28 * s}" transform="rotate(${((a * 180) / Math.PI).toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)})"/>`;
  }
  return g;
}
function motifWindow(cx, cy, s, c) {
  const w = 280 * s;
  const h = 200 * s;
  const x = cx - w / 2;
  const y = cy - h / 2;
  const tri = `${cx - 22 * s},${cy - 4 * s} ${cx - 22 * s},${cy + 44 * s} ${cx + 26 * s},${cy + 20 * s}`;
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${18 * s}"/>
    <path d="M ${x} ${y + 46 * s} H ${x + w}"/>
    <circle cx="${x + 26 * s}" cy="${y + 23 * s}" r="${6 * s}"/>
    <circle cx="${x + 50 * s}" cy="${y + 23 * s}" r="${6 * s}"/>
    <polygon points="${tri}"/>`;
}
function motifReceipt(cx, cy, s, c) {
  const w = 200 * s;
  const h = 250 * s;
  const x = cx - w / 2;
  const y = cy - h / 2;
  let zig = `M ${x} ${y} V ${y + h} `;
  const step = w / 6;
  for (let i = 0; i <= 6; i++)
    zig += `${i === 0 ? "L" : "L"} ${x + i * step} ${y + h + (i % 2 ? 18 * s : 0)} `;
  zig += `L ${x + w} ${y} Z`;
  let lines = "";
  for (let i = 1; i <= 4; i++)
    lines += `<path d="M ${x + 24 * s} ${y + 40 * s * i} H ${x + w - 24 * s}"/>`;
  return `<path d="${zig}"/>${lines}`;
}

const MOTIFS = {
  database: motifDatabase,
  chart: motifChart,
  gear: motifGear,
  window: motifWindow,
  receipt: motifReceipt,
};

// ── projects ─────────────────────────────────────────────────────────────────
const PROJECTS = [
  { slug: "sqlconfig", title: "SQL Server Config Generator", tag: "Unattended install · .ini", accents: ["#3b82f6", "#06b6d4"], motif: "database" },
  { slug: "fincoreai", title: "FinCoreAI", tag: "Personal Finance Intelligence", accents: ["#10b981", "#6366f1"], motif: "chart" },
  { slug: "embytrial", title: "embyIL Trial Creator", tag: "Browser automation · Playwright", accents: ["#a855f7", "#ec4899"], motif: "window" },
  { slug: "ardani", title: "Ardani Setup System", tag: "SQL Server automation · Windows", accents: ["#0ea5e9", "#38bdf8"], motif: "gear" },
  { slug: "zfb", title: "ZFB Order Center", tag: "Orders & quotes · Full-stack", accents: ["#f59e0b", "#ef4444"], motif: "receipt" },
];

function svg(project, variant) {
  const rng = mulberry32(hash(project.slug + ":" + variant));
  const [a0, a1] = variant % 2 ? [project.accents[1], project.accents[0]] : project.accents;
  const angle = 100 + Math.floor(rng() * 80);
  const g1x = 10 + rng() * 30;
  const g1y = 10 + rng() * 30;
  const g2x = 60 + rng() * 30;
  const g2y = 55 + rng() * 35;
  const motifFn = MOTIFS[project.motif];
  const mx = variant % 2 ? W * 0.32 : W * 0.7;
  const my = H * 0.42;
  const motif = motifFn(mx, my, 1.25, a0);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${project.title} background">
  <defs>
    <linearGradient id="bg" gradientTransform="rotate(${angle})">
      <stop offset="0%" stop-color="#0a0e1a"/>
      <stop offset="55%" stop-color="#0b1222"/>
      <stop offset="100%" stop-color="#070a13"/>
    </linearGradient>
    <radialGradient id="glow1" cx="${g1x}%" cy="${g1y}%" r="60%">
      <stop offset="0%" stop-color="${a0}" stop-opacity="0.42"/>
      <stop offset="100%" stop-color="${a0}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow2" cx="${g2x}%" cy="${g2y}%" r="55%">
      <stop offset="0%" stop-color="${a1}" stop-opacity="0.34"/>
      <stop offset="100%" stop-color="${a1}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="title" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="${a0}"/>
    </linearGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  ${grid()}
  <rect width="${W}" height="${H}" fill="url(#glow1)"/>
  <rect width="${W}" height="${H}" fill="url(#glow2)"/>
  ${constellation(rng, a0)}
  <g fill="none" stroke="${a0}" stroke-opacity="0.13" stroke-width="6" stroke-linejoin="round" stroke-linecap="round">${motif}</g>

  <g font-family="ui-sans-serif, system-ui, Segoe UI, Roboto, Arial, sans-serif">
    <text x="90" y="${H - 150}" font-size="34" fill="${a0}" fill-opacity="0.85" letter-spacing="3" font-weight="600">${project.tag.toUpperCase()}</text>
    <text x="86" y="${H - 80}" font-size="76" font-weight="800" fill="url(#title)">${project.title}</text>
  </g>
</svg>
`;
}

mkdirSync(OUT, { recursive: true });
let count = 0;
for (const p of PROJECTS) {
  for (let v = 1; v <= 3; v++) {
    const file = join(OUT, `${p.slug}-${v}.svg`);
    writeFileSync(file, svg(p, v), "utf8");
    count++;
    console.log("wrote", `public/SS/${p.slug}-${v}.svg`);
  }
}
console.log(`\nDone — ${count} SVGs in public/SS/`);
