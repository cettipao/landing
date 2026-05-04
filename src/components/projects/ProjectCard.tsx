import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ExternalLink, ArrowUpRight } from "lucide-react";
import { GithubIcon } from "@/components/ui/BrandIcons";
import type { ProjectEntry } from "@/data/portfolio";
import type { Locale } from "@i18n/ui";

interface Props {
  project: ProjectEntry;
  locale: Locale;
  labels: {
    repo: string;
    demo: string;
  };
}

/**
 * Project card with subtle 3D tilt on cursor hover. Tilt strength is muted
 * (max ~6°) so the card stays readable at all angles.
 */
export default function ProjectCard({ project, locale, labels }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 150, damping: 18 });
  const sry = useSpring(ry, { stiffness: 150, damping: 18 });
  const tilt = {
    rotateX: useTransform(srx, [-1, 1], [6, -6]),
    rotateY: useTransform(sry, [-1, 1], [-6, 6]),
  };

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    ry.set(px * 2);
    rx.set(py * 2);
  };
  const reset = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.article
      ref={cardRef}
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={{
        transformStyle: "preserve-3d",
        rotateX: tilt.rotateX,
        rotateY: tilt.rotateY,
      }}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="group relative rounded-xl border border-border bg-bg-tertiary/40 p-6 md:p-8 transition-colors hover:border-accent/40 hover:shadow-[0_0_50px_-10px_var(--color-accent-glow)]"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs text-text-tertiary">
            {project.period}
            {project.associated && (
              <>
                {" · "}
                {project.associated[locale]}
              </>
            )}
          </p>
          <h3 className="mt-2 text-xl md:text-2xl font-semibold tracking-tight">
            {project.title}
          </h3>
        </div>
        <ArrowUpRight
          size={20}
          aria-hidden="true"
          className="text-text-tertiary group-hover:text-accent transition-colors shrink-0"
        />
      </div>

      <p className="mt-3 text-text-secondary leading-relaxed">
        {project.summary[locale]}
      </p>
      <p className="mt-3 text-text-tertiary text-sm leading-relaxed">
        {project.description[locale]}
      </p>

      <ul className="mt-5 flex flex-wrap gap-1.5">
        {project.stack.map((tech) => (
          <li
            key={tech}
            className="font-mono text-[11px] px-2 py-1 rounded border border-border text-text-secondary"
          >
            {tech}
          </li>
        ))}
      </ul>

      <div className="mt-6 flex flex-wrap gap-3">
        {project.repoUrl && (
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-accent transition-colors"
          >
            <GithubIcon size={14} />
            {labels.repo}
          </a>
        )}
        {project.demoUrl && (
          <a
            href={project.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-accent transition-colors"
          >
            <ExternalLink size={14} aria-hidden="true" />
            {labels.demo}
          </a>
        )}
      </div>
    </motion.article>
  );
}
