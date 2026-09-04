import { MeshWarpCard } from "@/components/mesh-warp/mesh-warp-card";

const BUILT_FROM = [
  "The core trick is one global warp mesh: a coarse 9x4 grid of control points over the word box, Catmull-Rom interpolated, in normalized word coordinates. Per-letter transforms can't represent the wild phase, and a global polynomial can't either — at peak zoom the visible window spans a sliver of the word box, where any low-order field is nearly affine. Local control points put the freedom where the window actually is.",
  "Letters are traced at runtime, not shipped as vector data: each one gets rasterised alone on an offscreen canvas with a synthetic oblique shear, marching-squares extracts its outline, and the contour points get warped and refilled into a Path2D every frame — never pixels. That's what makes any word ride the same fitted motion.",
  "Two inks: white, and the word's accent, which only shows as a registration slip while the word moves — the same warped path drawn a fraction of a tick earlier in the accent, then white on top, so the colour peeks out exactly where the mesh is moving and snaps under the white at rest.",
  "The un-type exit is the loop seam. The same measured typewriter tracks play backwards a little faster, so the last letter peels away first and the line drifts out the way it drifted in — no cut, no hold-then-jump.",
];

const CONSTRAINTS = [
  "The typewriter phases play in discrete ticks at 30fps — the pops read wrong smoothed — but the warp samples continuously between mesh rows, since a held 8x magnification would strobe on a crisp canvas.",
  "Once magnified, ring points connect as curves through Catmull-Rom-derived control handles, except at sharp corners, which stay straight — a spline through a corner overshoots into a bump outside the letter.",
  "During the wild phase only, the pointer bends the mesh with a spring-damped Gaussian nudge on the nearest control points, relaxing back to zero afterwards — the piece is a loop you can nudge, not a toy you steer.",
  "Reduced motion draws the first word at rest, not a frozen mid-loop frame — a paused mesh warp mid-inflation would say nothing about what the piece actually is.",
];

export default function Home() {
  const year = new Date().getFullYear();

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-8">
        <span className="text-sm font-bold tracking-tight">Mesh Warp</span>
        <a
          href="https://github.com/prashantkoirala465/mesh-warp"
          className="text-sm text-muted transition-colors hover:text-foreground"
        >
          GitHub
        </a>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-10 px-6 pb-16">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
            A word that types in, goes wild, and un-types itself.
          </h1>
          <p className="mt-4 leading-relaxed text-muted">
            A single word in heavy white oblique lowercase pop-typewrites
            onto black — each letter arriving oversized and easing left into
            its slot — then inflates roughly eightfold, churns through the
            frame as warped letterforms, and collapses exactly home before
            un-typing itself out the way it came in. The next loop brings the
            next word, in its own colour.
          </p>
        </div>

        <MeshWarpCard />

        <p className="text-sm text-muted">
          During the wild phase, rest your pointer on the piece — the
          letterforms bend gently toward it.
        </p>
      </main>

      <section className="border-t border-line">
        <div className="mx-auto grid max-w-5xl gap-10 px-6 py-16 sm:grid-cols-2">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wide text-muted">
              How it&apos;s built
            </h2>
            <ul className="mt-4 flex flex-col gap-4 text-sm leading-relaxed">
              {BUILT_FROM.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wide text-muted">
              Constraints
            </h2>
            <ul className="mt-4 flex flex-col gap-4 text-sm leading-relaxed">
              {CONSTRAINTS.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <footer className="border-t border-line px-6 py-8 text-sm text-muted">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <span>© {year} Prashant Koirala</span>
          <a
            href="https://github.com/prashantkoirala465/mesh-warp"
            className="transition-colors hover:text-foreground"
          >
            Source
          </a>
        </div>
      </footer>
    </div>
  );
}
