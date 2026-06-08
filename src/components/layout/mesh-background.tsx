import type { CSSProperties } from "react";

/**
 * Decorative mesh-gradient backdrop: a few large, blurred, slowly drifting
 * accent blobs behind all content. Purely cosmetic — `aria-hidden`, fixed,
 * `pointer-events-none`, at -z. Motion is disabled under `prefers-reduced-motion`
 * and the accessibility "stop animations" toggle (see globals.css). Hidden
 * entirely in high-contrast mode.
 */
const blobs: { style: CSSProperties }[] = [
  {
    style: {
      top: "-15%",
      insetInlineStart: "-8%",
      width: "55vmax",
      height: "55vmax",
      background: "#2563eb", // blue-600
      animation: "mesh-float-a 26s ease-in-out infinite alternate",
    },
  },
  {
    style: {
      top: "-10%",
      insetInlineEnd: "-10%",
      width: "48vmax",
      height: "48vmax",
      background: "#4f46e5", // indigo-600
      animation: "mesh-float-b 32s ease-in-out infinite alternate",
    },
  },
  {
    style: {
      top: "20%",
      insetInlineStart: "30%",
      width: "34vmax",
      height: "34vmax",
      background: "#1e3a8a", // blue-900 depth
      animation: "mesh-float-a 36s ease-in-out infinite alternate-reverse",
    },
  },
];

export function MeshBackground() {
  return (
    <div className="mesh-bg" aria-hidden>
      {blobs.map((blob, i) => (
        <div key={i} className="mesh-blob" style={blob.style} />
      ))}
    </div>
  );
}
