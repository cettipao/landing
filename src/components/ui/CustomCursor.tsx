import { useEffect, useRef } from "react";

/**
 * Dot + ring cursor follower (desktop only). Always renders the elements so
 * the refs are valid by the time the effect runs; bails out and stays hidden
 * on touch devices or when reduced motion is preferred.
 */
export default function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const isFine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!isFine || reduce) return;

    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return;

    document.documentElement.classList.add("has-custom-cursor");
    ring.style.opacity = "1";
    dot.style.opacity = "1";

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let raf = 0;
    let hasMoved = false;

    const move = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (!hasMoved) {
        hasMoved = true;
        rx = mx;
        ry = my;
      }
      dot.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
    };

    const tick = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      raf = window.requestAnimationFrame(tick);
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest("a, button, [data-cursor-grow]")) {
        ring.dataset["state"] = "grow";
      }
    };
    const onOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest("a, button, [data-cursor-grow]")) {
        ring.dataset["state"] = "default";
      }
    };

    raf = window.requestAnimationFrame(tick);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("mouseover", onOver);
    window.addEventListener("mouseout", onOut);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mouseout", onOut);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, []);

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden="true"
        data-state="default"
        className="pointer-events-none fixed left-0 top-0 z-[60] h-8 w-8 rounded-full border border-accent/70 opacity-0 transition-[width,height,background-color,border-color,opacity] duration-150 ease-out will-change-transform data-[state=grow]:h-12 data-[state=grow]:w-12 data-[state=grow]:bg-accent/10 data-[state=grow]:border-accent"
      />
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[60] h-1.5 w-1.5 rounded-full bg-accent opacity-0 will-change-transform"
      />
    </>
  );
}
