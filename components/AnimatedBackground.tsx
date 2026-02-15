"use client";

export default function AnimatedBackground() {
  return (
    <div
      className="fixed inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-green-50/40 to-emerald-50/30 animate-gradient-shift" />

      {/* Large animated blob orbs */}
      <div className="absolute inset-0">
        <div className="absolute top-[10%] left-[5%] w-[min(80vmax,420px)] h-[min(80vmax,420px)] rounded-full bg-green-200/45 blur-3xl animate-blob-1" />
        <div className="absolute top-[60%] right-[10%] w-[min(70vmax,380px)] h-[min(70vmax,380px)] rounded-full bg-emerald-200/40 blur-3xl animate-blob-2" />
        <div className="absolute bottom-[15%] left-[25%] w-[min(60vmax,320px)] h-[min(60vmax,320px)] rounded-full bg-teal-200/35 blur-3xl animate-blob-3" />
        <div className="absolute top-[35%] right-[30%] w-[min(50vmax,280px)] h-[min(50vmax,280px)] rounded-full bg-green-300/30 blur-3xl animate-blob-4" />
      </div>

      {/* Floating graphic dots */}
      <div className="absolute inset-0 pointer-events-none">
        {[
          { left: "12%", top: "20%", w: 3, delay: 0 },
          { left: "88%", top: "25%", w: 4, delay: 2 },
          { left: "75%", top: "70%", w: 2, delay: 4 },
          { left: "20%", top: "75%", w: 3, delay: 1 },
          { left: "50%", top: "40%", w: 2, delay: 3 },
          { left: "35%", top: "15%", w: 4, delay: 5 },
          { left: "65%", top: "55%", w: 3, delay: 2 },
          { left: "8%", top: "50%", w: 2, delay: 6 },
          { left: "92%", top: "85%", w: 3, delay: 1 },
        ].map((dot, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-green-400/20 animate-float"
            style={{
              left: dot.left,
              top: dot.top,
              width: dot.w * 4,
              height: dot.w * 4,
              animationDelay: `${dot.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Subtle grid */}
      <div
        className="absolute inset-0 animate-grid-fade"
        style={{
          backgroundImage: `
            linear-gradient(rgba(34, 197, 94, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34, 197, 94, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: "56px 56px",
        }}
      />

      {/* Soft vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 85% 85% at 50% 50%, transparent 45%, rgba(248, 250, 252, 0.5) 100%)",
        }}
      />
    </div>
  );
}
