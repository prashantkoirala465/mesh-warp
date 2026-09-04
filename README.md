# Mesh Warp

A single design word in heavy white oblique lowercase pop-typewrites onto black — each letter arriving oversized to the right of its slot and easing left into place — then goes wild: it inflates roughly eightfold, churns full-bleed through the frame, drapes over an arch and collapses exactly home. It breathes, then un-types itself: the same measured typewriter tracks played backwards a little faster, so the last letter peels away first and the line drifts out the way it drifted in. That reversed exit *is* the loop seam. The next loop types the next word from a list, each carrying its own accent colour.

## Why

Per-letter transforms can't represent the wild phase — each letter needs to magnify more toward its outer edge, stems need to become wedges, baselines need to curve — and a global polynomial can't either, because at peak zoom the visible window spans a sliver of the word box, where any low-order field is nearly affine. The fix is one coarse warp mesh (9×4 control points, Catmull-Rom interpolated, in normalized word coordinates) that every letter's contour points get resampled against. Local control points put the freedom exactly where the visible window is, and because the mesh lives in normalized word space, any word rides the same fitted motion.

That word-agnostic property depends on tracing letters at runtime rather than shipping vector data: each glyph gets rasterised alone on an offscreen canvas with a synthetic oblique shear, marching-squares extracts its outline at the alpha midpoint, and the resulting contour points — never pixels — are what the mesh warps and refills into a `Path2D` every frame.

## How it works

- **Two inks, one registration trick.** The word's accent colour only shows as a registration slip while the word moves — the same warped path drawn a fraction of a tick earlier in the accent, then white on top, so colour peeks out exactly where the mesh is moving and snaps invisibly under the white at rest.
- **Discrete typewriter, continuous warp.** The pop-in and un-type phases play in hard 30fps ticks — smoothing them kills the print-like snap — but the mesh samples continuously between measured rows, since a held 8x magnification would strobe on a crisp canvas otherwise.
- **Curves everywhere except real corners.** Once magnified, ring points connect as Catmull-Rom-derived curves — except at points sharper than 48°, which stay straight, because a spline through a genuine corner overshoots into a bump outside the letter.
- **The reversed exit is the loop seam.** No cut, no hold-then-jump — the same measured typewriter tracks simply play backwards and a little faster, so the line drifts out exactly the way it drifted in.
- **The pointer only bends the mesh during the wild phase**, via a spring-damped Gaussian nudge on the nearest control points that relaxes back to zero on its own — a loop you can nudge, not a toy you steer.

## Stack

- **Framework:** Next.js (App Router), TypeScript, Tailwind CSS v4
- **Rendering:** a single `<canvas>` and the 2D context — no WebGL, no SVG, no animation library
- **Font:** [Archivo](https://fonts.google.com/specimen/Archivo) at 700, loaded through `next/font` and waited on before the first trace

The animation (`src/components/mesh-warp/`) doesn't import React or Next — `trace.ts` extracts glyph outlines from a rasterised, offscreen-rendered font at runtime, `motion.ts` holds the hand-measured typewriter poses and warp-mesh keyframes, `params.ts` holds the tuning constants, `engine.ts` is the plain class that ties tracing, mesh warping, and rendering together, and `mesh-warp-card.tsx` is the thin wrapper that mounts it and waits for the real font before ever calling it.

## Running it locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).
