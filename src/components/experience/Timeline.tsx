import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { Briefcase, MapPin, ExternalLink } from "lucide-react";
import type { ExperienceEntry } from "@/data/portfolio";
import type { Locale } from "@i18n/ui";

interface Props {
  entries: ExperienceEntry[];
  locale: Locale;
  currentLabel: string;
}

/**
 * Vertical timeline with a progress line that "draws" itself as the user
 * scrolls through the section. Each item fades up when it enters view.
 */
export default function Timeline({ entries, locale, currentLabel }: Props) {
  const containerRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 60%"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 20,
    mass: 0.4,
  });
  const lineHeight = useTransform(progress, [0, 1], ["0%", "100%"]);

  return (
    <ol ref={containerRef} className="relative">
      {/* Track */}
      <div
        aria-hidden="true"
        className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-border"
      />
      {/* Progress fill */}
      <motion.div
        aria-hidden="true"
        style={{ height: lineHeight }}
        className="absolute left-4 md:left-1/2 top-0 w-px -translate-x-1/2 bg-gradient-to-b from-accent via-accent to-accent/0 origin-top"
      />

      {entries.map((entry, idx) => {
        const isLeft = idx % 2 === 0;
        return (
          <motion.li
            key={entry.slug}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className={
              "relative pl-12 md:pl-0 md:grid md:grid-cols-2 md:gap-12 mb-12 md:mb-16 last:mb-0"
            }
          >
            {/* Node dot */}
            <span
              aria-hidden="true"
              className="absolute left-4 md:left-1/2 top-2 w-3 h-3 -translate-x-1/2 rounded-full border-2 border-accent bg-bg-primary shadow-[0_0_15px_-2px_var(--color-accent-glow)]"
            />

            {/* Card */}
            <div
              className={
                isLeft
                  ? "md:col-start-1 md:pr-10 md:text-right"
                  : "md:col-start-2 md:pl-10"
              }
            >
              <div className="rounded-lg border border-border bg-bg-tertiary/40 p-5 md:p-6 hover:border-accent/40 transition-colors">
                <div
                  className={
                    "flex flex-wrap items-center gap-2 mb-3 " +
                    (isLeft ? "md:justify-end" : "md:justify-start")
                  }
                >
                  <span className="font-mono text-xs text-text-tertiary">
                    {entry.period[locale]}
                  </span>
                  {entry.current && (
                    <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/30">
                      {currentLabel}
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-semibold flex items-center gap-2 flex-wrap">
                  <Briefcase
                    size={16}
                    aria-hidden="true"
                    className="text-accent shrink-0"
                  />
                  <span>{entry.role[locale]}</span>
                </h3>
                <p
                  className={
                    "mt-1 text-sm flex items-center gap-2 flex-wrap " +
                    (isLeft ? "md:justify-end" : "md:justify-start")
                  }
                >
                  {entry.url ? (
                    <a
                      href={entry.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-text-primary hover:text-accent transition-colors inline-flex items-center gap-1"
                    >
                      {entry.company}
                      <ExternalLink size={12} aria-hidden="true" />
                    </a>
                  ) : (
                    <span className="text-text-primary">{entry.company}</span>
                  )}
                  <span className="text-text-tertiary">·</span>
                  <span className="text-text-secondary inline-flex items-center gap-1">
                    <MapPin size={12} aria-hidden="true" />
                    {entry.location[locale]}
                  </span>
                </p>

                <p className="mt-4 text-text-secondary text-sm leading-relaxed">
                  {entry.summary[locale]}
                </p>

                <ul
                  className={
                    "mt-4 space-y-1.5 text-sm text-text-secondary " +
                    (isLeft ? "md:text-right" : "")
                  }
                >
                  {entry.highlights[locale].map((h, i) => (
                    <li key={i} className="leading-relaxed">
                      <span
                        aria-hidden="true"
                        className={
                          "inline-block text-accent " +
                          (isLeft ? "md:hidden mr-2" : "mr-2")
                        }
                      >
                        ▸
                      </span>
                      {h}
                      <span
                        aria-hidden="true"
                        className={
                          "inline-block text-accent ml-2 " +
                          (isLeft ? "hidden md:inline" : "hidden")
                        }
                      >
                        ◂
                      </span>
                    </li>
                  ))}
                </ul>

                <ul
                  className={
                    "mt-5 flex flex-wrap gap-1.5 " +
                    (isLeft ? "md:justify-end" : "md:justify-start")
                  }
                >
                  {entry.stack.map((tech) => (
                    <li
                      key={tech}
                      className="font-mono text-[11px] px-2 py-1 rounded border border-border text-text-secondary bg-bg-primary/40"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.li>
        );
      })}
    </ol>
  );
}
