import { motion, useReducedMotion } from "framer-motion";
import type { ContributionCalendar, ContributionDay } from "@/lib/github";

interface Props {
  calendar: ContributionCalendar;
  totalLabel: string;
  lessLabel: string;
  moreLabel: string;
  locale: string;
}

const LEVEL_BG: Record<ContributionDay["level"], string> = {
  0: "bg-bg-tertiary border border-border/40",
  1: "bg-accent/15 border border-accent/20",
  2: "bg-accent/35 border border-accent/30",
  3: "bg-accent/65 border border-accent/40",
  4: "bg-accent border border-accent",
};

const formatDate = (iso: string, locale: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(d);
};

const formatTooltip = (day: ContributionDay, locale: string) => {
  const date = new Date(day.date);
  const formatted = new Intl.DateTimeFormat(locale, {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(date);
  const word =
    day.count === 0
      ? "no contributions"
      : day.count === 1
        ? "1 contribution"
        : `${day.count} contributions`;
  return `${word} on ${formatted}`;
};

const MONTH_LABELS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

export default function ContributionGraph({
  calendar,
  totalLabel,
  lessLabel,
  moreLabel,
  locale,
}: Props) {
  const reduce = useReducedMotion();

  // Compute month label positions: first week of each month
  const monthMarkers: Array<{ weekIndex: number; month: number }> = [];
  let lastMonth = -1;
  calendar.weeks.forEach((week, wIdx) => {
    const firstDay = week[0];
    if (!firstDay) return;
    const m = new Date(firstDay.date).getUTCMonth();
    if (m !== lastMonth) {
      monthMarkers.push({ weekIndex: wIdx, month: m });
      lastMonth = m;
    }
  });

  return (
    <section className="rounded-xl border border-border bg-bg-tertiary/30 p-5 md:p-6">
      <header className="flex flex-col gap-1 mb-5 md:flex-row md:items-end md:justify-between md:gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-accent">
            {totalLabel}
          </p>
          <p className="mt-1 text-2xl md:text-3xl font-semibold tracking-tight">
            {calendar.totalContributions.toLocaleString(locale)}
          </p>
        </div>
        <p className="font-mono text-xs text-text-tertiary">
          {formatDate(calendar.from, locale)} → {formatDate(calendar.to, locale)}
        </p>
      </header>

      <div className="overflow-x-auto -mx-5 px-5 md:mx-0 md:px-0">
        <div className="inline-flex flex-col gap-1.5 min-w-full">
          {/* Month labels */}
          <div
            className="grid gap-[3px]"
            style={{
              gridTemplateColumns: `repeat(${calendar.weeks.length}, minmax(10px, 1fr))`,
            }}
          >
            {calendar.weeks.map((_, wIdx) => {
              const marker = monthMarkers.find((m) => m.weekIndex === wIdx);
              return (
                <div
                  key={wIdx}
                  className="font-mono text-[9px] text-text-tertiary text-center h-3"
                >
                  {marker ? MONTH_LABELS[marker.month] : ""}
                </div>
              );
            })}
          </div>

          {/* Heatmap */}
          <div
            className="grid gap-[3px]"
            style={{
              gridTemplateColumns: `repeat(${calendar.weeks.length}, minmax(10px, 1fr))`,
            }}
          >
            {calendar.weeks.map((week, wIdx) => (
              <div key={wIdx} className="grid grid-rows-7 gap-[3px]">
                {Array.from({ length: 7 }, (_, dIdx) => {
                  const day = week[dIdx];
                  if (!day) {
                    return <div key={dIdx} className="aspect-square" />;
                  }
                  return (
                    <motion.div
                      key={dIdx}
                      initial={reduce ? { opacity: 1 } : { opacity: 0, scale: 0.5 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{
                        duration: 0.25,
                        delay: reduce
                          ? 0
                          : Math.min(0.5, (wIdx * 7 + dIdx) * 0.0008),
                        ease: "easeOut",
                      }}
                      className={
                        "aspect-square rounded-[2px] " + LEVEL_BG[day.level]
                      }
                      title={formatTooltip(day, locale)}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-end gap-2 font-mono text-[10px] text-text-tertiary">
        <span>{lessLabel}</span>
        {[0, 1, 2, 3, 4].map((lvl) => (
          <span
            key={lvl}
            className={
              "inline-block w-2.5 h-2.5 rounded-[2px] " +
              LEVEL_BG[lvl as ContributionDay["level"]]
            }
            aria-hidden="true"
          />
        ))}
        <span>{moreLabel}</span>
      </div>
    </section>
  );
}
