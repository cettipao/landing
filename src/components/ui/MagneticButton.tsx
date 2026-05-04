import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import clsx from "clsx";

interface Props {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  external?: boolean;
  ariaLabel?: string;
}

/**
 * Anchor that "attracts" the cursor when nearby. Spring-driven so the motion
 * feels organic; magnitude is scaled down on mobile (no pointer:fine).
 */
export default function MagneticButton({
  href,
  children,
  variant = "primary",
  external = false,
  ariaLabel,
}: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 200, damping: 18, mass: 0.4 });

  const handleMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const rect = el.getBoundingClientRect();
    const mx = e.clientX - (rect.left + rect.width / 2);
    const my = e.clientY - (rect.top + rect.height / 2);
    x.set(mx * 0.25);
    y.set(my * 0.35);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const base =
    "relative inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-colors will-change-transform";
  const styles =
    variant === "primary"
      ? "bg-accent text-bg-primary hover:bg-accent-hover shadow-[0_0_30px_-5px_var(--color-accent-glow)]"
      : "border border-border text-text-primary hover:border-accent hover:text-accent";

  return (
    <motion.a
      ref={ref}
      href={href}
      aria-label={ariaLabel}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      style={{ x: sx, y: sy }}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      className={clsx(base, styles)}
    >
      {children}
    </motion.a>
  );
}
